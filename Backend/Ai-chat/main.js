require('dotenv').config();
const { Server } = require('socket.io');
const { OpenAI } = require('openai');
const http = require('http');
const https = require('https'); // Added
const express = require('express');
const axios = require('axios');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// OpenAI setup
const client = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});

// System prompt
const System_Prompt = `
You are an AI music assistant. Remember you are a chat bot so try to get as much info like user's favorite artist, mood, genre, and language.

Once you have enough information, output JSON in this format ONLY:

{
  "type": "search" | "recommendation" | "recall",
  "query": "optional - specific song or artist",
  "genre": "optional - genre like pop, jazz, lo-fi",
  "mood": "optional - mood like happy, sad",
  "language": "optional - like Hindi, Spanish, etc."
}

Strictly follow these examples
EXAMPLES:
User: hi  
You: Hi! I'm your music buddy 🎶 Tell me how you're feeling or what you wanna hear!

User: I'm in a chill mood  
You: Got it! Any favorite artist or genre?

User: divine  
You: Great choice! Anything specific you're in the mood for? Hindi, lo-fi, sad?

Once all required details are collected, respond with JSON ONLY. DO NOT add any explanation or text outside the JSON.
`;

const messages = [{ role: 'system', content: System_Prompt }];

// Spotify token logic
let spotifyToken = null;
let tokenExpiry = null;

// Axios instance with https.Agent
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ keepAlive: true }),
});

async function getSpotifyAccessToken() {
  const now = Date.now();
  if (spotifyToken && tokenExpiry && now < tokenExpiry - 60000) {
    return spotifyToken;
  }

  try {
    const response = await axiosInstance.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({ grant_type: 'client_credentials' }),
      {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from(
              `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
            ).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiry = now + response.data.expires_in * 1000;

    return spotifyToken;
  } catch (err) {
    console.error('Error fetching Spotify token:', err.message);
    throw new Error('Failed to get Spotify access token');
  }
}

async function getSpotifyTracks(query) {
  try {
    const token = await getSpotifyAccessToken();

    const response = await axiosInstance.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=6`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.tracks.items;
  } catch (err) {
    console.error('Spotify fetch error:', err.message);
    if (err.response && err.response.status === 401) {
      spotifyToken = null;
      tokenExpiry = null;
    }
    return [];
  }
}

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('✅ Client connected');

  socket.on('clear_history', () => {
    messages.length = 1;
    socket.emit('history_cleared', 'Conversation history has been cleared');
    console.log('🧹 Conversation history cleared');
  });

  socket.on('prompt', async (msg) => {
    console.log('📩 Received prompt:', msg);

    try {
      messages.push({ role: 'user', content: msg });

      const gptRes = await client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
      });

      const replyContent = gptRes.choices[0].message.content;
      console.log('🧠 GPT Reply:', replyContent);
      messages.push({ role: 'assistant', content: replyContent });

      let userIntent = null;

      if (replyContent.trim().startsWith('{') && replyContent.trim().endsWith('}')) {
        try {
          userIntent = JSON.parse(replyContent);
        } catch (e) {
          console.log('GPT response is not valid JSON');
        }
      }

      if (userIntent && userIntent.type) {
        let queryParts = [];
        if (userIntent.query) queryParts.push(userIntent.query);
        if (userIntent.genre) queryParts.push(userIntent.genre);
        if (userIntent.mood) queryParts.push(userIntent.mood);
        if (userIntent.language) queryParts.push(userIntent.language);

        const query = queryParts.join(' ');

        if (!query) {
          return socket.emit('response', "Got some info, but still need a bit more to recommend songs.");
        }

        console.log(`🔍 Searching Spotify for: "${query}"`);
        const tracks = await getSpotifyTracks(query);

        if (!tracks || tracks.length === 0) {
          return socket.emit('response', `Sorry, I couldn't find songs for "${query}". Try something else?`);
        }

        let responseMsg = `Here are some songs I found for "${query}":`;

        tracks.forEach((track, i) => {
          const artistNames = track.artists.map(a => a.name).join(', ');
          responseMsg += `\n${i + 1}. "${track.name}" by ${artistNames}`;
        });

        socket.emit('response', responseMsg);
        socket.emit('spotify', tracks);
        return;
      }

      return socket.emit('response', replyContent);
    } catch (err) {
      console.error('🔥 Error:', err.message);
      socket.emit('response', 'Oops! Something went wrong. Try again?');
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

server.listen(9090, () => {
  console.log('🚀 Socket server listening on port 9090');
});
