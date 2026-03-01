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
    if (!genai) {
        throw new Error('AI Services not configured (GEMINI_API_KEY missing).');
    }

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
    return JSON.parse(cleanJsonStr);
}

module.exports = { parseSmartInput, genai, MODEL };
