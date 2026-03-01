const { HfInference } = require("@huggingface/inference");
const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

async function checkIfAIGenerated(imageBuffer) {
    try {
        // Uses a classifier trained to detect AI-generated images
        const result = await hf.imageClassification({
            model: "umm-maybe/AI-image-detector",
            data: imageBuffer,
        });

        // result is array like: [{ label: "artificial", score: 0.87 }, { label: "human", score: 0.13 }]
        const artificialScore = result.find(r => r.label === "artificial")?.score || 0;
        return {
            isAIGenerated: artificialScore > 0.75,
            confidence: Math.round(artificialScore * 100),
        };
    } catch (err) {
        // Fail gracefully — don't block the upload
        console.error("Image detection error:", err.message);
        return { isAIGenerated: false, confidence: 0 };
    }
}

module.exports = { checkIfAIGenerated };
