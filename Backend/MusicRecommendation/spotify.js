const axios = require("axios");
require("dotenv").config();

async function authSpotify() {
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "client_credentials",
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                    ).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error("❌ Error fetching Spotify token:", error.response?.data || error.message);
        return null;
    }
}

module.exports =  authSpotify ;
