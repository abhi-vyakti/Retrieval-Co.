const { genai, MODEL } = require('./aiParser');

async function chatbotResponse(userMessage, context) {
    if (!genai) {
        throw new Error('AI Services not configured (GEMINI_API_KEY missing).');
    }

    const prompt = `
You are the Campus AI Assistant for Retrieval Co., a college lost & found and borrowing platform.
Be helpful, friendly, and concise (max 3 sentences).

Platform context:
- Open Found posts: ${JSON.stringify(context.foundPosts?.slice(0, 5))}
- Current timetable suggestions: ${JSON.stringify(context.timetableSuggestions)}
- User karma: ${context.userKarma}

User message: "${userMessage}"

If the user describes a lost item, search the found posts and suggest matches.
If they need to borrow something, suggest which class sections may have it based on the timetable.
If they ask about karma, explain the points system.
Keep responses short and actionable.
`;

    const response = await genai.models.generateContent({
        model: MODEL,
        contents: prompt,
        config: {
            temperature: 0.3,
            maxOutputTokens: 512,
        },
    });

    return response.text;
}

module.exports = { chatbotResponse };
