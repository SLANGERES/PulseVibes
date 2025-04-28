# Pulse Vibe - Music Discovery App

## Overview
Pulse Vibe is a dynamic web application designed to enhance your music discovery experience. Featuring an intelligent recommendation bot, curated recommendation sections, and seamless playlist integration, Pulse Vibe helps you find and enjoy music tailored to your unique taste.

## Features

### 🤖 Music Recommendation Bot
Our intelligent bot analyzes your listening habits and preferences to suggest tracks you'll love:
- Chat-based interface for natural interaction
- Tailored recommendations based on your mood, activities, and listening history
- Genre exploration tool to discover new musical territories
- Similar artist recommendations to expand your horizons

### 🎵 Recommendation Sections
Discover new music through our curated recommendation sections:
- **Daily Mix**: Fresh recommendations updated daily based on your listening patterns
- **Genre Deep Dive**: Explore the depths of your favorite genres
- **Trending Now**: Stay updated with what's popular in the music world
- **Throwback Hits**: Rediscover classics and nostalgic tracks
- **Artist Spotlight**: Focus on specific artists and their catalog

### 📋 Playlist Management
Create, manage, and enjoy your personalized playlists:
- Drag-and-drop interface for easy playlist creation and organization
- Smart playlist generation based on moods, activities, or themes

## Getting Started

### Prerequisites
- Next.js 
- Node.js (v16.0.0 or later)
- npm (v8.0.0 or later)
- Postgress (v5.0 or later)

### Installation

1. Clone the repository:
```
git clone https://github.com/SLANGERES/pulsevibe.git
cd pulsevibe
```

2. Install dependencies:
```
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
API_KEY=your_music_api_key
```

4. Start the development server:
```
npm run dev
```

5. Access the application at `http://localhost:3000`

## Technology Stack

### Frontend
- Next.js
- Tailwind CSS for styling


### Backend
- Node.js with Express
- MongoDB for database
- JWT for authentication
- WebSockets for real-time communication

### APIs
- Spotify/Apple Music API for music metadata
- OpenAI API for recommendation bot intelligence

## Usage

### Creating an Account
1. Navigate to the signup page
2. Enter your details and preferences
3. Connect your existing music accounts (optional)

### Using the Recommendation Bot
1. Click on the chat icon in the bottom right corner
2. Start a conversation with prompts like:
   - "I need upbeat music for my workout"
   - "Recommend something similar to [artist/song]"
   - "I'm feeling relaxed, what should I listen to?"

### Building Playlists
1. Navigate to the "My Playlists" section
2. Click "Create New Playlist"
3. Add songs manually or use the "Smart Generate" feature
4. Arrange tracks using drag-and-drop
5. Share your playlist or keep it private

