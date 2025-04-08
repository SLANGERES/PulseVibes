const express = require("express");
const axios = require("axios");
const cors = require("cors");

const PORT = 3000;
const EMOTION_API_URL = "http://127.0.0.1:8000/detect";  // FastAPI service
const MUSIC_API_URL = "http://127.0.0.1:9000/recommend"; // Music API

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// 🎵 API Route for Song Recommendations
app.post("/getsongs", async (req, res) => {
    console.log("📩 Incoming Request...");

    const { responses } = req.body;
    console.log("📝 Received Responses:", responses);

    // Validate input
    if (!Array.isArray(responses) || responses.length === 0) {
        return res.status(400).json({ error: "Invalid input, expected a non-empty array of responses" });
    }

    try {
        // 🌟 Step 1: Detect Genre (Instead of Emotion)
        console.log("🔍 Sending text to FastAPI for genre detection...");
        const emotionResponse = await axios.post(EMOTION_API_URL, { responses });

        const detectedGenre = emotionResponse.data.genre;  // 🔥 FastAPI now returns a genre!
        console.log("🎭 Detected Genre:", detectedGenre);

        if (!detectedGenre) {
            throw new Error("No genre detected from FastAPI response");
        }

        // 🎶 Step 2: Fetch Songs Based on Genre
        console.log("🎵 Fetching song recommendations for genre:", detectedGenre);
        const musicResponse = await axios.post(MUSIC_API_URL, { genre: detectedGenre });

        res.json({
            genre: detectedGenre,
            recommendations: musicResponse.data.recommendations || [],
        });

        console.log("✅ Request completed successfully!");

    } catch (error) {
        console.error("❌ Error processing request:", error.response?.data || error.message);
        res.status(500).json({ error: "Failed to process request", details: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 API Gateway running on port ${PORT}`));
