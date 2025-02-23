const axios = require("axios");
const express = require("express");
require("dotenv").config();
const authSpotify = require("./spotify"); // Import Spotify authentication function

const app = express();
const PORT =9000;

app.use(express.json());

async function getMusicRecommendations(emotion) {
    try {
        const accessToken = await authSpotify();
        if (!accessToken) throw new Error("Failed to obtain Spotify token");

        // Enhanced Emotion-to-Genre Mapping
        const moodMapping = {
            joy: "pop",
            sadness: "acoustic",
            anger: "rock",
            calm: "chill",
            energetic: "edm",
            love: "romance",
            fear: "ambient",
            surprise: "indie",
            neutral: "classical"
        };

        const genre = moodMapping[emotion.toLowerCase()] || "pop"; // Default to pop

        console.log(`🎵 Fetching ${genre} songs for emotion: ${emotion}`);

        const response = await axios.get("https://api.spotify.com/v1/search", {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                q: `genre:${genre}`, // No language support in Spotify API
                type: "track",
                limit: 10, // Fetch 5 top songs
                market: "US", // Change as needed
            },
        });

        // Extract relevant song details
        const songs = response.data.tracks.items.map(track => ({
            name: track.name,
            artist: track.artists.map(artist => artist.name).join(", "),
            album_cover: track.album.images[0]?.url || "",
            spotify_url: track.external_urls.spotify,
        }));

        return songs;
    } catch (error) {
        console.error("❌ Error fetching songs:", error.response?.data || error.message);
        return [];
    }
}

// API Endpoint to Fetch Music Recommendations
app.post("/recommend", async (req, res) => {
    try {
        const { emotion } = req.body;

        if (!emotion) {
            return res.status(400).json({ error: "Emotion is required" });
        }

        const songs = await getMusicRecommendations(emotion);

        if (songs.length === 0) {
            return res.status(404).json({ error: "No songs found for the given emotion" });
        }

        res.json({ emotion, recommendations: songs });
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Spotify Music API running on port ${PORT}`);
});
