const axios = require("axios");
const express = require("express");
require("dotenv").config();
const authSpotify = require("./spotify");

const app = express();
const PORT = 9000;

app.use(express.json());

/**
 * Fetches music recommendations based on the given genre.
 * @param {string} genre - Genre received from FastAPI.
 * @returns {Promise<Array>} - List of recommended songs.
 */
async function getMusicRecommendations(genre) {
    try {
        const accessToken = await authSpotify();
        if (!accessToken) throw new Error("Failed to obtain Spotify token");

        console.log(`🎵 Fetching ${genre} songs...`);

        // Fetch songs based on genre
        const response = await axios.get("https://api.spotify.com/v1/search", {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                q: `genre:${genre}`,
                type: "track",
                limit: 10,
                market: "IN",
            },
        });

        // Extract relevant song details
        return response.data.tracks.items.map((track) => ({
            name: track.name,
            artist: track.artists.map((artist) => artist.name).join(", "),
            album_cover: track.album.images[0]?.url || "",
            spotify_url: track.external_urls.spotify,
        }));
    } catch (error) {
        console.error("❌ Error fetching songs:", error.response?.data || error.message);
        return [];
    }
}

// 🎵 API Endpoint for Music Recommendations
app.post("/recommend", async (req, res) => {
    try {
        const { genre } = req.body;

        if (!genre) {
            return res.status(400).json({ error: "Genre is required" });
        }

        const songs = await getMusicRecommendations(genre);

        if (songs.length === 0) {
            return res.status(404).json({ error: "No songs found for the given genre" });
        }
        
        res.json({ genre, recommendations: songs });
        console.log("correct data send");

    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🚀 Start the Express server
app.listen(PORT, () => {
    console.log(`🚀 Spotify Music API running on port ${PORT}`);
});
