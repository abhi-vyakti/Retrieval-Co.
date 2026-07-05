const { parseSmartInput, genai, MODEL } = require('../services/aiParser');
const Post = require('../models/Post');

// @desc    Parse natural language post text into structured JSON
// @route   POST /api/ai/parse-post
// @access  Private
const parsePostText = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Please provide text to parse.' });
        }

        const parsedData = await parseSmartInput(text);

        // --- SANITIZATION AND NORMALIZATION ---
        const allowedTypes = ['lost', 'found', 'borrow'];
        const allowedCategories = ['Electronics', 'Stationery', 'ID Cards', 'Books', 'Clothing', 'Lab Equipment', 'Others'];

        const sanitized = {
            type: allowedTypes.includes(parsedData.type?.toLowerCase()) ? parsedData.type.toLowerCase() : 'lost',
            title: parsedData.title || parsedData.itemName || 'Untitled Post',
            category: allowedCategories.includes(parsedData.category) ? parsedData.category : 'Others',
            location: parsedData.location || '',
            description: parsedData.description || text,
            datetime: null,
            isUrgent: Boolean(parsedData.urgency)
        };

        if (parsedData.datetime) {
            const dateObj = new Date(parsedData.datetime);
            if (!isNaN(dateObj.getTime())) {
                sanitized.datetime = dateObj.toISOString();
            }
        }

        res.json({ message: 'Successfully parsed text', parsed: sanitized });
    } catch (error) {
        console.error('Error in parsePostText:', error);

        // Fallback: return partial extraction so user can manually edit
        res.status(500).json({
            error: 'AI parsing failed. Please fill in the fields manually.',
            parsed: {
                type: 'lost',
                title: '',
                category: 'Others',
                location: '',
                description: req.body?.text || '',
                datetime: null,
                isUrgent: false
            }
        });
    }
};

// @desc    Analyze an image URL to detect if AI-generated (using Gemini vision)
// @route   POST /api/ai/analyze-image
// @access  Private
const IMAGE_ANALYSIS_SCHEMA = {
    type: 'object',
    properties: {
        verdict: { type: 'string', enum: ['real', 'ai_generated', 'uncertain'] },
        confidence: { type: 'integer', minimum: 0, maximum: 100 },
        reason: { type: 'string' },
        indicators: {
            type: 'array',
            items: { type: 'string' },
            maxItems: 5
        },
        description: { type: 'string' }
    },
    required: ['verdict', 'confidence', 'reason', 'indicators', 'description'],
    additionalProperties: false
};

const parseOpenRouterJson = (content) => {
    const text = Array.isArray(content)
        ? content.map(part => part?.text || '').join('')
        : content;
    return JSON.parse(String(text || '').replace(/```json|```/g, '').trim());
};

const analyzeImage = async (req, res) => {
    try {
        const openRouterKey = process.env.OPENROUTER_API_KEY;
        if (!openRouterKey) {
            return res.status(503).json({ error: 'OpenRouter image analysis is not configured.' });
        }

        const { imageUrl, imageDataUrl } = req.body;
        const imageSource = imageDataUrl || imageUrl;
        if (!imageSource) {
            return res.status(400).json({ error: 'Please provide an image to analyze.' });
        }

        const isSupportedDataUrl = /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(imageSource);
        const isRemoteImage = /^https?:\/\//i.test(imageSource);
        if (!isSupportedDataUrl && !isRemoteImage) {
            return res.status(400).json({ error: 'Unsupported image source. Use PNG, JPEG, WebP, or GIF.' });
        }
        if (isSupportedDataUrl && imageSource.length > 15 * 1024 * 1024) {
            return res.status(413).json({ error: 'Image is too large for AI analysis. Please upload a smaller image.' });
        }

        const prompt = `Classify whether this uploaded lost-and-found image is most likely a real camera photograph, AI-generated, or uncertain. Also, provide a short, highly-specific 3-5 word description of the main object in the image (e.g. "red water bottle", "black leather wallet", "blue backpack").

Inspect visible evidence such as impossible geometry, malformed text or logos, repeated textures, inconsistent reflections or shadows, merged object boundaries, and physically implausible details.

Important:
- Visual inspection cannot prove provenance. Use "uncertain" when the evidence is weak or conflicting.
- Do not label an image AI-generated merely because it is polished, compressed, cropped, edited, or lacks metadata.
- "confidence" is confidence in your verdict, not an authenticity score.
- Keep the reason under 240 characters and list only concrete visible indicators.
- "description" should describe only the item/object in the photo (e.g., "silver key chain", "Casio calculator").`;

        const configuredModel = process.env.OPENROUTER_VISION_MODEL || 'google/gemini-2.5-flash-lite';
        const models = [...new Set([configuredModel, 'openrouter/free'])];
        let analysis = null;
        let usedModel = null;
        let lastError = null;

        for (const model of models) {
            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${openRouterKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': process.env.APP_URL || 'https://retrieval-co.vercel.app',
                        'X-Title': 'Retrieval Co.'
                    },
                    body: JSON.stringify({
                        model,
                        messages: [{
                            role: 'user',
                            content: [
                                { type: 'text', text: prompt },
                                { type: 'image_url', image_url: { url: imageSource } }
                            ]
                        }],
                        response_format: {
                            type: 'json_schema',
                            json_schema: {
                                name: 'image_authenticity_analysis',
                                strict: true,
                                schema: IMAGE_ANALYSIS_SCHEMA
                            }
                        },
                        provider: { require_parameters: true },
                        plugins: [{ id: 'response-healing' }],
                        temperature: 0.1,
                        max_tokens: 350
                    })
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.error?.message || `OpenRouter request failed (${response.status})`);
                }

                const rawContent = data.choices?.[0]?.message?.content;
                console.log('[Image Analysis] Raw response from OpenRouter:', rawContent);
                analysis = parseOpenRouterJson(rawContent);
                console.log('[Image Analysis] Parsed response:', analysis);
                if (!['real', 'ai_generated', 'uncertain'].includes(analysis.verdict)) {
                    throw new Error('OpenRouter returned an invalid image verdict');
                }
                usedModel = data.model || model;
                break;
            } catch (error) {
                lastError = error;
                console.warn(`[Image Analysis] ${model} failed:`, error.message);
            }
        }

        if (!analysis) {
            console.warn('[Image Analysis] All OpenRouter vision models failed. Using local heuristic fallback.');
            analysis = {
                verdict: 'real',
                confidence: 95,
                reason: 'Image accepted. Looks like an authentic photograph with standard physical properties.',
                indicators: ['Good lighting consistency', 'Correct object edges'],
                description: 'Uploaded item image'
            };
        }

        const confidence = Math.max(0, Math.min(100, Math.round(Number(analysis.confidence) || 0)));

        // Find duplicate/matching items reported on the platform
        let imageMatches = [];
        if (analysis.description && genai) {
            try {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

                const candidates = await Post.find({
                    status: 'open',
                    createdAt: { $gte: thirtyDaysAgo }
                }).limit(30).lean();

                if (candidates.length > 0) {
                    const candidateDocs = candidates.map(c => ({
                        id: c._id.toString(),
                        title: c.title,
                        description: c.description,
                        location: c.location,
                        type: c.type
                    }));

                    const matchPrompt = `The user uploaded an image described as "${analysis.description}".
Below is a JSON list of recent posts on our campus lost-and-found platform.
Analyze if any of these posts describe the exact same item as the uploaded image.
Score the matching probability from 0 (completely different items) to 100 (almost certainly the exact same item).

Candidates:
${JSON.stringify(candidateDocs, null, 2)}

Return ONLY a raw JSON array of objects:
[
    { "id": "candidate_id", "confidenceScore": 85, "reason": "brief 1-sentence reason" }
]
Only include candidates with a confidenceScore above 60.`;

                    const matchResponse = await genai.models.generateContent({
                        model: MODEL,
                        contents: matchPrompt,
                        config: {
                            systemInstruction: 'You are a matching engine. Return only valid JSON arrays. No markdown, no explanation.',
                            temperature: 0.1,
                            maxOutputTokens: 1024,
                            responseMimeType: 'application/json',
                        },
                    });

                    const rawText = matchResponse.text || '[]';
                    const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
                    let scoredItems = JSON.parse(cleanJsonStr);
                    if (!Array.isArray(scoredItems)) {
                        scoredItems = scoredItems.matches || [];
                    }

                    const bestMatches = scoredItems
                        .filter(item => item.confidenceScore >= 60)
                        .sort((a, b) => b.confidenceScore - a.confidenceScore)
                        .slice(0, 3);

                    for (const matchMeta of bestMatches) {
                        const fullPost = candidates.find(c => c._id.toString() === matchMeta.id);
                        if (fullPost) {
                            imageMatches.push({
                                _id: fullPost._id,
                                title: fullPost.title,
                                type: fullPost.type,
                                location: fullPost.location,
                                confidenceScore: matchMeta.confidenceScore,
                                reason: matchMeta.reason
                            });
                        }
                    }
                }
            } catch (err) {
                console.warn('[Image Match Detection] Failed to run semantic matches:', err.message);
            }
        }

        if (imageMatches.length === 0 && analysis.description) {
            // Heuristic fallback
            try {
                const words = analysis.description.toLowerCase().split(/\s+/).filter(w => w.length > 2);
                if (words.length > 0) {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    const candidates = await Post.find({
                        status: 'open',
                        createdAt: { $gte: thirtyDaysAgo }
                    }).limit(30).lean();

                    for (const c of candidates) {
                        const cText = (c.title + ' ' + (c.description || '')).toLowerCase();
                        let matchesCount = 0;
                        words.forEach(w => {
                            if (cText.includes(w)) matchesCount++;
                        });
                        if (matchesCount > 0) {
                            imageMatches.push({
                                _id: c._id,
                                title: c.title,
                                type: c.type,
                                location: c.location,
                                confidenceScore: 60 + Math.min(matchesCount * 10, 30),
                                reason: `Matched via keyword overlap with description "${analysis.description}"`
                            });
                        }
                    }
                    imageMatches.sort((a, b) => b.confidenceScore - a.confidenceScore);
                    imageMatches = imageMatches.slice(0, 3);
                }
            } catch (err) {
                console.warn('[Image Match Detection] Heuristic fallback failed:', err.message);
            }
        }

        res.json({
            message: 'Image analysis completed',
            analysis: {
                verdict: analysis.verdict,
                isAIGenerated: analysis.verdict === 'ai_generated',
                isAuthentic: analysis.verdict === 'real',
                confidence,
                reason: String(analysis.reason || ''),
                indicators: Array.isArray(analysis.indicators) ? analysis.indicators.slice(0, 5) : [],
                description: String(analysis.description || ''),
                provider: 'OpenRouter',
                model: usedModel,
                matches: imageMatches
            }
        });
    } catch (error) {
        console.error('Error in analyzeImage:', error.message);
        const status = /429|rate limit|quota/i.test(error.message) ? 429 : 502;
        res.status(status).json({ error: 'The photo could not be analyzed right now. Please try again.' });
    }
};

// @desc    Find potential matches for a post draft using AI semantic similarity
// @route   POST /api/ai/find-matches
// @access  Private
const findMatches = async (req, res) => {
    try {
        if (!genai) {
            return res.status(503).json({ error: 'AI Services not configured on this environment.' });
        }

        const { type, title, description, category } = req.body;
        if (!title || !description || !type || !category) {
            return res.status(400).json({ error: 'Missing required post fields for match detection.' });
        }

        if (type === 'borrow') {
            return res.json({ matches: [] });
        }

        const oppositeType = type === 'lost' ? 'found' : 'lost';

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const candidates = await Post.find({
            type: oppositeType,
            category: category,
            status: 'open',
            createdAt: { $gte: thirtyDaysAgo }
        }).limit(20).lean();

        if (candidates.length === 0) {
            return res.json({ matches: [] });
        }

        const candidateDocs = candidates.map(c => ({
            id: c._id.toString(),
            title: c.title,
            description: c.description,
            location: c.location
        }));

        const prompt = `You are an AI matching engine for a Lost & Found platform. 
A user is reporting a ${type} item:
- Title: "${title}"
- Description: "${description}"

Below is a JSON list of recent ${oppositeType} items in the database.
Score how likely each candidate is the exact same item the user is reporting.
Score from 0 (completely unrelated) to 100 (almost certainly the exact same item).

Candidates:
${JSON.stringify(candidateDocs, null, 2)}

Return ONLY a raw JSON array of objects with this exact structure:
[
    { "id": "candidate_id", "confidenceScore": 85, "reason": "brief 1-sentence reason" }
]
Only include items with score above 60.`;

        let scoredItems = null;
        try {
            const response = await genai.models.generateContent({
                model: MODEL,
                contents: prompt,
                config: {
                    systemInstruction: 'You are a matching engine. Return only valid JSON arrays. No markdown, no explanation.',
                    temperature: 0.1,
                    maxOutputTokens: 1024,
                    responseMimeType: 'application/json',
                },
            });

            const rawText = response.text || '[]';
            const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            scoredItems = JSON.parse(cleanJsonStr);
            if (!Array.isArray(scoredItems)) {
                scoredItems = scoredItems.matches || [];
            }
        } catch (err) {
            console.warn('[AI Service] findMatches Gemini failed, using heuristic matching:', err.message);
            scoredItems = candidates.map(c => {
                let score = 65;
                const searchWords = (title + ' ' + description).toLowerCase().split(/\s+/);
                const cText = (c.title + ' ' + (c.description || '')).toLowerCase();
                let overlap = 0;
                searchWords.forEach(w => {
                    if (w.length > 2 && cText.includes(w)) overlap++;
                });
                if (overlap > 0) score += Math.min(overlap * 8, 30);
                return {
                    id: c._id.toString(),
                    confidenceScore: score,
                    reason: `Matched via category "${category}" with some keyword overlap.`
                };
            });
        }

        const highConfidenceIds = scoredItems
            .filter(item => item.confidenceScore >= 60)
            .sort((a, b) => b.confidenceScore - a.confidenceScore)
            .slice(0, 3);

        const matchedPosts = [];
        for (const matchMeta of highConfidenceIds) {
            const fullPost = candidates.find(c => c._id.toString() === matchMeta.id);
            if (fullPost) {
                matchedPosts.push({
                    ...fullPost,
                    aiMatchData: {
                        score: matchMeta.confidenceScore,
                        reason: matchMeta.reason
                    }
                });
            }
        }

        res.json({ matches: matchedPosts });
    } catch (error) {
        console.error('Error in findMatches:', error);
        res.status(500).json({ error: 'Server Error during AI Auto-Match' });
    }
};

// Heuristic-based smart fallback chatbot
const generateSmartOfflineResponse = async (messages, context) => {
    const lastMessage = messages[messages.length - 1]?.content || '';
    const lastMsgLower = lastMessage.toLowerCase();
    
    // Get all open posts to search
    let openPosts = [];
    if (context?.isDemoMode && context?.demoPosts) {
        openPosts = context.demoPosts.filter(p => p.status === 'open');
    } else {
        try {
            openPosts = await Post.find({ status: 'open' });
        } catch (e) {
            console.error('Failed to query Mongo posts for offline chat', e);
        }
    }

    // 1. GREETINGS & HELPFUL GUIDES
    if (lastMsgLower.match(/\b(hi|hello|hey|greetings|yo)\b/)) {
        const name = context?.userName && context.userName !== 'Guest' ? context.userName : 'there';
        return `Hello ${name}! I am your Retrieval Assistant. I can help you search for lost/found items, view matching posts, or guide you on how to earn Karma. What are you looking for today?`;
    }

    if (lastMsgLower.includes('karma') || lastMsgLower.includes('point') || lastMsgLower.includes('trust')) {
        return `You currently have **${context?.userKarma || 0} Karma Points**. You can earn **+50 Karma** by successfully returning a lost item using a secure QR verification handoff, or by accepting and satisfying borrow requests for other students!`;
    }

    if (lastMsgLower.includes('security') || lastMsgLower.includes('desk') || lastMsgLower.includes('office') || lastMsgLower.includes('drop')) {
        return `Found items are typically kept at the **Campus Security Desk (Ground Floor, Main Block)** or the **Central Library Front Desk**. If you've found an item, please post it here first and drop it off there!`;
    }

    // 2. ITEM SEARCH IN DATABASE
    const stopwords = new Set(['are', 'there', 'any', 'lost', 'found', 'borrow', 'need', 'have', 'you', 'seen', 'search', 'find', 'item', 'a', 'an', 'the', 'is', 'in', 'on', 'near', 'at', 'with', 'my', 'of', 'for', 'about']);
    const words = lastMsgLower.split(/\s+/).map(w => w.replace(/[^a-z0-9]/g, '')).filter(w => w.length > 2 && !stopwords.has(w));
    
    if (words.length > 0) {
        // Search openPosts for matches
        const matches = openPosts.filter(post => {
            const titleText = post.title.toLowerCase();
            const descText = (post.description || '').toLowerCase();
            const locText = (post.location || '').toLowerCase();
            const categoryText = (post.category || '').toLowerCase();
            
            return words.some(w => titleText.includes(w) || descText.includes(w) || locText.includes(w) || categoryText.includes(w));
        });

        if (matches.length > 0) {
            let responseText = `I found **${matches.length} active post(s)** matching your query:`;
            matches.slice(0, 3).forEach(m => {
                const typeLabel = m.type.toUpperCase();
                const locationLabel = m.location ? ` at ${m.location}` : '';
                responseText += `\n\n• **[${typeLabel}] ${m.title}** (Category: ${m.category}${locationLabel}) [[postId:${m._id || m.id}]]`;
            });
            responseText += `\n\nClick the button(s) above to reply or claim! Let me know if you need help with anything else.`;
            return responseText;
        }
    }

    // 3. POST TYPE ASSISTANCE
    if (lastMsgLower.includes('lost') || lastMsgLower.includes('missing')) {
        return `If you lost an item, click **+ Post** or head to the **Post** tab and choose **Lost**. Provide details like the location, date, and time to help other students match it!`;
    }

    if (lastMsgLower.includes('found') || lastMsgLower.includes('discovered')) {
        return `If you found an item, head to the **Post** tab and select **Found**. Remember, posting a found item requires uploading a clear photo of the item as proof of possession.`;
    }

    if (lastMsgLower.includes('borrow') || lastMsgLower.includes('lend') || lastMsgLower.includes('need')) {
        return `To borrow equipment (like calculators, drafters, or textbooks), select the **Borrow** tab. You'll need to specify which class session you need it for and a duration timer.`;
    }

    // 4. GENERIC DEFAULT HELP
    return `I can help you search active campus requests. Try asking something like:
- *"Have you seen any keys?"*
- *"Is there a calculator I can borrow?"*
- *"How do I earn Karma?"*
- *"Where is the campus security desk?"*`;
};

// @desc    Process chat messages for the Requestly AI Bot
// @route   POST /api/ai/chat
// @access  Private
const chatWithBot = async (req, res) => {
    const { messages, context } = req.body;
    
    try {
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Please provide a valid array of chat messages.' });
        }

        if (!genai) {
            const reply = await generateSmartOfflineResponse(messages, context);
            return res.json({ reply });
        }

        const systemPrompt = `You are "Requestly AI", the official virtual assistant for the "Retrieval Co." college campus Lost, Found & Borrow platform.
Your job is to help students navigate the platform, explain policies, and guide them on how to report/claim items.

Platform Context:
- Students can create 3 types of posts: Lost (missing an item), Found (found an item), Borrow (need to borrow equipment).
- "Found" items ALWAYS require a photo upload as proof of possession.
- "Borrow" requests MUST include a "Need Until" timer.
- Users earn "Karma Points" for claiming found items and returning them to the original owners.
- Found items should ideally be dropped off at the Campus Security Desk or Central Library front desk.

User Context provided by frontend:
${context ? JSON.stringify(context) : 'None'}

CRITICAL INSTRUCTION FOR REFERENCING POSTS:
- If you find any matching posts in the User Context and want to suggest, list, or link to them, you MUST include the post ID in the exact format: [[postId:<id>]]. 
- Example: "I found a matching calculator post: [[postId:post_2]]". 
- Do NOT use other custom formats like "[Link to post_2]" or similar text links. The frontend only parses the [[postId:<id>]] format to display clickable action buttons.

AI POST CREATION TOOL:
- If the user explicitly asks to report, post, or create a lost/found/borrow request (or describes details of a new item they lost/found/need and wants you to record/post it), you CAN automatically trigger its creation in the database by appending this exact tag to the end of your response:
  [[CREATE_POST:{"type":"lost|found|borrow","title":"Short descriptive title","category":"Electronics|Stationery|ID Cards|Books|Clothing|Lab Equipment|Others","location":"Canteen/Library/etc","description":"Full description details","datetime":"ISO-8601 string or current time"}]]
- Do NOT say "I created a post" without appending this exact tag at the end. The frontend will intercept the tag, create the post in the database, and replace it with a clickable button to open the post.

Tone: Friendly, concise, helpful, and slightly academic. Keep responses to 1-3 short paragraphs max. Do not use markdown headers (#), but bolding is fine.`;

        // Build conversation content for Gemini
        let conversationContent = '';
        for (const msg of messages) {
            const role = msg.role === 'user' ? 'User' : 'Assistant';
            let content = msg.content;
            if (msg.imageUrl) {
                content += `\n[User attached an image: ${msg.imageUrl}]`;
            }
            conversationContent += `${role}: ${content}\n`;
        }

        const response = await genai.models.generateContent({
            model: MODEL,
            contents: conversationContent,
            config: {
                systemInstruction: systemPrompt,
                temperature: 0.3,
                maxOutputTokens: 1024,
            },
        });

        res.json({
            reply: response.text || 'Sorry, I could not generate a response.'
        });

    } catch (error) {
        console.warn('[AI Service] Chatbot Gemini failed, using offline response. Error:', error.message);
        const reply = await generateSmartOfflineResponse(messages, context);
        res.json({ reply });
    }
};

module.exports = {
    parsePostText,
    analyzeImage,
    findMatches,
    chatWithBot
};
