const express = require("express");
const axios = require("axios");
const cors = require("cors"); // ✅ Import CORS

const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // ✅ Enable CORS for frontend

app.post("/getsongs", async (req, res) => {
    console.log("Incoming Request");
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ error: "Invalid input, expected an array of questions" });
    }

    try {
        let emotions = [];
        for (const question of questions) {
            const response = await axios.post("http://127.0.0.1:8000/detect", { text: question });
            emotions.push(response.data.emotion);
        }

        console.log("Detected emotions:", emotions);
        const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
        console.log("Selected emotion:", randomEmotion);

        // Fetch a song recommendation from the music API
        const musicResponse = await axios.post("http://127.0.0.1:9000/recommend", {
            emotion: randomEmotion,
        });

        res.json({ emotion: randomEmotion, recommendations: musicResponse.data.recommendations });
        console.log("Request completed");

    } catch (error) {
        console.error("Error processing request:", error.message);
        res.status(500).json({ error: "Failed to fetch songs" });
    }
});

app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
