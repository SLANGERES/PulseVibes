const axios = require("axios");
require("dotenv").config();

const SPOTIFY_CLIENT_ID="f191e8cc399d49c6b87eb3ef2f351066"
const SPOTIFY_CLIENT_SECRET="a6bc4c8fc2ba4b8aa203d7ad2fab194b"
async function authSpotify() {
    console.log("hello")
    try {
        const response = await axios.post(
            "https://accounts.spotify.com/api/token",
            new URLSearchParams({
                grant_type: "client_credentials",
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(
                        `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
                    ).toString("base64")}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );
        console.log(response.data.access_token)
        return response.data.access_token;

    } catch (error) {
        console.error("❌ Error fetching Spotify token:", error.response?.data || error.message);
        return null;
    }
}



module.exports=authSpotify