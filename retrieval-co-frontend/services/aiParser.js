const { GoogleGenAI } = require('@google/genai');

const genai = process.env.GEMINI_API_KEY
    ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    : null;

const MODEL = 'gemini-2.0-flash';

/**
 * Parse natural language text into structured post fields using Gemini.
 * @param {string} text - The user's natural English input.
 * @returns {object} Parsed JSON with type, itemName, category, description, location, urgency.
 */
async function parseSmartInput(text) {
    let parsedData = null;

    if (genai) {
        try {
            const systemPrompt = `You are an intelligent assistant for a college campus lost, found, and borrow platform.
Extract structured data from user input and return ONLY a raw JSON object (no markdown, no backticks).

Fields to extract:
- "type": Classify as exactly one of: "lost", "found", "borrow". Default to "lost" if unsure.
- "title": A short, clear title for the post (max 6 words).
- "itemName": The name of the item mentioned.
- "category": Classify as exactly one of: "Electronics", "Stationery", "ID Cards", "Books", "Clothing", "Lab Equipment", "Others". Default to "Others" if unsure. If the item resembles lab tools (drafter, lab coat, calculator), set category to "Lab Equipment".
- "location": The location mentioned (or null if not mentioned).
- "description": The full original text provided.
- "datetime": Try to infer the exact UTC ISO-8601 datetime based on relative time references like "yesterday", "at 2pm today", etc. If a time is mentioned, construct a sensible recent past date in ISO string format. If no time is implied, return null.
- "urgency": Set to true if the user text contains urgency words like: urgent, immediately, asap, emergency, tomorrow exam, need today, critical. Otherwise false.

Return ONLY valid JSON. No explanation, no commentary.`;

            const response = await genai.models.generateContent({
                model: MODEL,
                contents: text,
                config: {
                    systemInstruction: systemPrompt,
                    temperature: 0.1,
                    maxOutputTokens: 512,
                    responseMimeType: 'application/json',
                },
            });

            const rawText = response.text || '{}';
            const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            parsedData = JSON.parse(cleanJsonStr);
        } catch (err) {
            console.warn('[AI Service] Gemini API call failed or quota exceeded. Falling back to local parser. Error:', err.message);
        }
    }

    if (!parsedData) {
        // Local regex / keyword heuristic fallback
        const lower = text.toLowerCase();
        let type = 'lost';
        if (lower.includes('found') || lower.includes('picked up') || lower.includes('discovered')) {
            type = 'found';
        } else if (lower.includes('borrow') || lower.includes('lend') || lower.includes('need') || lower.includes('have to have')) {
            type = 'borrow';
        }

        let category = 'Others';
        if (lower.includes('id') || lower.includes('card') || lower.includes('lanyard')) {
            category = 'ID Cards';
        } else if (lower.includes('phone') || lower.includes('laptop') || lower.includes('earphone') || lower.includes('bud') || lower.includes('charger')) {
            category = 'Electronics';
        } else if (lower.includes('calculator') || lower.includes('drafter') || lower.includes('coat') || lower.includes('lab')) {
            category = 'Lab Equipment';
        } else if (lower.includes('book') || lower.includes('notebook') || lower.includes('spiral')) {
            category = 'Books';
        } else if (lower.includes('pen') || lower.includes('pencil') || lower.includes('stationery')) {
            category = 'Stationery';
        } else if (lower.includes('jacket') || lower.includes('clothing') || lower.includes('shirt')) {
            category = 'Clothing';
        }

        let location = null;
        const locMatch = text.match(/(?:near|at|in|by|inside|outside)\s+the\s+([a-zA-Z0-9\s]+?)(?:\.|\,|$|yesterday|today|afternoon|morning)/i) 
            || text.match(/(?:near|at|in|by|inside|outside)\s+([a-zA-Z0-9\s]+?)(?:\.|\,|$|yesterday|today|afternoon|morning)/i);
        if (locMatch) {
            location = locMatch[1].trim();
        }

        let title = 'Smart Parsed Item';
        const titleMatch = text.match(/(?:lost|found|borrow|need)\s+(?:my|a|an)?\s*([a-zA-Z0-9\s]+?)(?:\s+(?:near|at|in|by|yesterday|today|afternoon|morning|\.))/i)
            || text.match(/(?:my|a|an)?\s*([a-zA-Z0-9\s]+?)(?:\s+(?:near|at|in|by|yesterday|today|afternoon|morning|\.))/i);
        if (titleMatch && titleMatch[1]) {
            title = titleMatch[1].trim();
            // Capitalize
            title = title.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }

        let datetime = new Date().toISOString();
        if (lower.includes('yesterday')) {
            datetime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        }

        const isUrgent = lower.includes('urgent') || lower.includes('asap') || lower.includes('emergency') || lower.includes('tomorrow') || lower.includes('immediately') || lower.includes('critical');

        parsedData = {
            type,
            title,
            itemName: title,
            category,
            location: location || 'Campus',
            description: text,
            datetime,
            urgency: isUrgent
        };
    }

    return parsedData;
}

module.exports = { parseSmartInput, genai, MODEL };
