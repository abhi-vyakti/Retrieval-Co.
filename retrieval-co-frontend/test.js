require('dotenv/config');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const prompt = `You are an expert forensic image analyst. Analyze this image for a campus Lost & Found platform.
Your task is to determine if the image appears to be definitively AI-generated or if it is an authentic photograph.

CRITICAL INSTRUCTION: You must explicitly and carefully look for common AI generation artifacts before making your decision. Pay extremely close attention to:
1. Anatomical impossibilities: Check hands, fingers, and limbs. Look for extra fingers, missing or fused fingers, elongated joints, mismatched proportions, or fingers phasing through solid objects.
2. Physical impossibilities: Look for objects merging into each other, impossible geometry, handles that don't connect properly, or floating objects.
3. Garbled text: Check any text, logos, or branding. AI often struggles with spelling, creating nonsensical symbols or blending letters.
4. Background inconsistencies: Look for blurry, nonsensical background elements or repeating patterns that don't make physical sense.
5. Asymmetries: Look for mismatched earrings, uneven glasses, or structural anomalies in manufactured objects.

Even if the texture (like skin or metal) looks highly realistic, if there is a single physical/anatomical impossibility (like a finger going through solid plastic), you MUST classify it as AI-generated.

Return ONLY a raw JSON object (no markdown, no backticks, no formatting) with this exact structure:
{
    "isAIGenerated": boolean,
    "confidence": number from 0 to 100 representing how confident you are in your assessment,
    "reason": "Brief, explicit explanation citing the specific visual evidence (e.g., 'A finger passes through solid plastic', 'Text is garbled') that led to your conclusion."
}`;

async function test() {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                prompt,
                {
                    inlineData: {
                        data: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', // 1x1 transparent png
                        mimeType: 'image/png'
                    }
                }
            ],
            config: {
                temperature: 0.1,
            }
        });
        console.log("RESPONSE:", response.text);
    } catch (err) {
        console.error("ERROR THROWN:", err);
    }
}
test();
