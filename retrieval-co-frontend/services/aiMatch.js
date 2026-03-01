const { genai, MODEL } = require('./aiParser');

async function matchLostToFound(lostPost, foundPosts) {
    if (!genai) {
        return { matches: [] };
    }

    const prompt = `
You are a lost & found matching assistant for a college campus.

LOST ITEM:
Title: ${lostPost.title}
Category: ${lostPost.category}
Description: ${lostPost.description}
Location: ${lostPost.location}

FOUND ITEMS (list):
${foundPosts.map((p, i) => `${i + 1}. Title: ${p.title} | Category: ${p.category} | Description: ${p.description} | Location: ${p.location}`).join("\n")}

For each found item, give a match score from 0–100 based on how likely it matches the lost item.
Consider: same category, similar description keywords, same/nearby location.

Respond ONLY with valid JSON in this exact format:
{"matches": [{"index": 1, "score": 85, "reason": "Same category, similar description"}, ...]}
Only include items with score above 60.
`;

    try {
        const response = await genai.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: {
                systemInstruction: 'You are a matching engine. Return only valid JSON. No markdown.',
                temperature: 0.1,
                maxOutputTokens: 1024,
                responseMimeType: 'application/json',
            },
        });

        const text = (response.text || '{"matches":[]}').replace(/```json|```/g, "").trim();
        return JSON.parse(text);
    } catch {
        return { matches: [] };
    }
}

module.exports = { matchLostToFound };
