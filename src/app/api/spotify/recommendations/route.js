// lib/spotify-recommendations.js
import spotifyApi from "/Users/slangeres/CollageProject/pulse-vibe/src/app/lib/spotify";

/**
 * Get personalized recommendations from Spotify based on user preferences
 * @param {Object} preferences User preferences (genres, artists, mood, tempo, etc.)
 * @param {string} accessToken Spotify access token
 * @returns {Promise<Array>} Array of recommended tracks
 */
export async function getRecommendations(preferences, accessToken) {
  spotifyApi.setAccessToken(accessToken);
  
  const { 
    genres = [], 
    artists = [], 
    tracks = [], 
    mood = 'neutral', 
    tempo = 'medium',
    acousticness,
    danceability,
    popularity
  } = preferences;
  
  // Convert app parameters to Spotify audio features
  const audioFeatures = mapPreferencesToAudioFeatures(mood, tempo);
  
  // First, search for artist IDs (Spotify needs IDs, not names)
  let seedArtists = [];
  if (artists.length > 0) {
    // We can only use up to 5 seed items total across artists, tracks, and genres
    const maxArtists = Math.min(artists.length, 2);
    
    for (let i = 0; i < maxArtists; i++) {
      try {
        const results = await spotifyApi.searchArtists(artists[i], { limit: 1 });
        if (results.body.artists.items.length > 0) {
          seedArtists.push(results.body.artists.items[0].id);
        }
      } catch (error) {
        console.error(`Error searching for artist ${artists[i]}:`, error);
      }
    }
  }
  
  // Search for track IDs if provided
  let seedTracks = [];
  if (tracks.length > 0) {
    const maxTracks = Math.min(tracks.length, 1);
    
    for (let i = 0; i < maxTracks; i++) {
      try {
        const results = await spotifyApi.searchTracks(tracks[i], { limit: 1 });
        if (results.body.tracks.items.length > 0) {
          seedTracks.push(results.body.tracks.items[0].id);
        }
      } catch (error) {
        console.error(`Error searching for track ${tracks[i]}:`, error);
      }
    }
  }
  
  // Format genres to match Spotify's available genre seeds
  let formattedGenres = [];
  try {
    const availableGenres = await spotifyApi.getAvailableGenreSeeds();
    formattedGenres = genres
      .map(g => g.toLowerCase().replace(/\s+/g, '-'))
      .filter(g => availableGenres.body.genres.includes(g));
  } catch (error) {
    console.error('Error getting available genre seeds:', error);
  }
  
  // Calculate how many genres we can use based on other seeds
  const remainingSeeds = 5 - seedArtists.length - seedTracks.length;
  const seedGenres = formattedGenres.slice(0, remainingSeeds);
  
  // If we have no seeds, use some popular defaults
  if (seedGenres.length === 0 && seedArtists.length === 0 && seedTracks.length === 0) {
    seedGenres.push('pop', 'rock');
  }
  
  // Create recommendation options
  const recommendationOptions = {
    limit: 20,
    seed_artists: seedArtists,
    seed_tracks: seedTracks,
    seed_genres: seedGenres,
    ...audioFeatures
  };
  
  // Add optional parameters if provided
  if (acousticness !== undefined) {
    recommendationOptions.target_acousticness = acousticness;
  }
  
  if (danceability !== undefined) {
    recommendationOptions.target_danceability = danceability;
  }
  
  if (popularity !== undefined) {
    recommendationOptions.target_popularity = popularity;
  }
  
  try {
    // Get recommendations from Spotify
    const recommendations = await spotifyApi.getRecommendations(recommendationOptions);
    
    // Get audio features for all recommended tracks to provide more details
    const trackIds = recommendations.body.tracks.map(track => track.id);
    let audioFeaturesData = {};
    
    if (trackIds.length > 0) {
      const featuresResponse = await spotifyApi.getAudioFeaturesForTracks(trackIds);
      audioFeaturesData = featuresResponse.body.audio_features.reduce((acc, item) => {
        if (item) {
          acc[item.id] = item;
        }
        return acc;
      }, {});
    }
    
    // Format tracks with additional data
    return recommendations.body.tracks.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artists.map(artist => artist.name).join(', '),
      album: track.album.name,
      releaseDate: track.album.release_date,
      albumArt: track.album.images[0]?.url || null,
      previewUrl: track.preview_url,
      externalUrl: track.external_urls.spotify,
      popularity: track.popularity,
      audioFeatures: audioFeaturesData[track.id] || {},
      explicit: track.explicit,
      durationMs: track.duration_ms
    }));
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
}

/**
 * Map user-friendly mood and tempo settings to Spotify audio features
 * @param {string} mood User's selected mood
 * @param {string} tempo User's selected tempo
 * @returns {Object} Spotify audio feature parameters
 */
function mapPreferencesToAudioFeatures(mood, tempo) {
  // Default features
  const features = {
    // How suitable for dancing (0.0 to 1.0)
    target_danceability: 0.5,
    
    // Energy level (0.0 to 1.0)
    target_energy: 0.5,
    
    // Positivity of track (0.0 to 1.0)
    target_valence: 0.5,
    
    // Actual beats per minute
    target_tempo: 120,
    
    // Acoustic vs. electronic (0.0 to 1.0)
    target_acousticness: 0.5,
    
    // Vocal vs. instrumental (0.0 to 1.0)
    target_instrumentalness: 0.1,
    
    // Live performance vs. studio recording feeling (0.0 to 1.0)
    target_liveness: 0.2
  };
  
  // Adjust based on mood
  switch (mood) {
    case 'Energetic':
      features.target_energy = 0.8;
      features.target_valence = 0.7;
      features.target_danceability = 0.7;
      features.target_acousticness = 0.2;
      features.target_tempo = 135;
      break;
    case 'Chill':
      features.target_energy = 0.3;
      features.target_valence = 0.5;
      features.target_danceability = 0.4;
      features.target_acousticness = 0.7;
      features.target_tempo = 95;
      break;
    case 'Happy':
      features.target_energy = 0.6;
      features.target_valence = 0.8;
      features.target_danceability = 0.6;
      features.target_acousticness = 0.4;
      features.target_tempo = 120;
      break;
    case 'Melancholic':
      features.target_energy = 0.4;
      features.target_valence = 0.3;
      features.target_danceability = 0.3;
      features.target_acousticness = 0.6;
      features.target_tempo = 90;
      break;
    case 'Focused':
      features.target_energy = 0.5;
      features.target_valence = 0.5;
      features.target_danceability = 0.3;
      features.target_instrumentalness = 0.6;
      features.target_acousticness = 0.6;
      features.target_tempo = 110;
      break;
    case 'Workout':
      features.target_energy = 0.9;
      features.target_valence = 0.7;
      features.target_danceability = 0.8;
      features.target_acousticness = 0.1;
      features.target_tempo = 150;
      break;
  }
  
  // Further adjust based on tempo preference
  switch (tempo) {
    case 'slow':
      features.target_tempo = Math.max(75, features.target_tempo - 25);
      features.target_energy = Math.max(0.1, features.target_energy - 0.2);
      break;
    case 'medium':
      // Keep defaults from mood
      break;
    case 'fast':
      features.target_tempo = Math.min(180, features.target_tempo + 25);
      features.target_energy = Math.min(1.0, features.target_energy + 0.2);
      break;
  }
  
  return features;
}

/**
 * Get top artists, tracks, and genres for the current user
 * @param {string} accessToken Spotify access token
 * @returns {Promise<Object>} User's top content
 */
export async function getUserTopContent(accessToken) {
  spotifyApi.setAccessToken(accessToken);
  
  try {
    // Get user's top artists
    const topArtistsShortTerm = await spotifyApi.getMyTopArtists({ limit: 5, time_range: 'short_term' });
    const topArtistsMediumTerm = await spotifyApi.getMyTopArtists({ limit: 10, time_range: 'medium_term' });
    
    // Get user's top tracks
    const topTracksShortTerm = await spotifyApi.getMyTopTracks({ limit: 5, time_range: 'short_term' });
    const topTracksMediumTerm = await spotifyApi.getMyTopTracks({ limit: 10, time_range: 'medium_term' });
    
    // Extract genres from top artists
    const allGenres = {};
    
    [...topArtistsShortTerm.body.items, ...topArtistsMediumTerm.body.items].forEach(artist => {
      artist.genres.forEach(genre => {
        if (allGenres[genre]) {
          allGenres[genre] += 1;
        } else {
          allGenres[genre] = 1;
        }
      });
    });
    
    // Sort genres by frequency
    const sortedGenres = Object.entries(allGenres)
      .sort((a, b) => b[1] - a[1])
      .map(([genre]) => genre);
    
    return {
      recentArtists: topArtistsShortTerm.body.items.map(artist => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0]?.url || null,
        genres: artist.genres,
        popularity: artist.popularity
      })),
      topArtists: topArtistsMediumTerm.body.items.map(artist => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0]?.url || null,
        genres: artist.genres,
        popularity: artist.popularity
      })),
      recentTracks: topTracksShortTerm.body.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        image: track.album.images[0]?.url || null
      })),
      topTracks: topTracksMediumTerm.body.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album.name,
        image: track.album.images[0]?.url || null
      })),
      topGenres: sortedGenres.slice(0, 10)
    };
  } catch (error) {
    console.error('Error getting user top content:', error);
    throw error;
  }
}

/**
 * Save a playlist to the user's Spotify account
 * @param {string} name Playlist name
 * @param {string} description Playlist description
 * @param {Array} trackUris Array of Spotify track URIs
 * @param {string} accessToken Spotify access token
 * @returns {Promise<Object>} Created playlist details
 */
export async function createPlaylist(name, description, trackUris, accessToken) {
  spotifyApi.setAccessToken(accessToken);
  
  try {
    // Get current user's ID
    const me = await spotifyApi.getMe();
    const userId = me.body.id;
    
    // Create empty playlist
    const playlist = await spotifyApi.createPlaylist(userId, {
      name,
      description,
      public: false
    });
    
    // Add tracks to playlist
    if (trackUris.length > 0) {
      await spotifyApi.addTracksToPlaylist(playlist.body.id, trackUris);
    }
    
    return {
      id: playlist.body.id,
      name: playlist.body.name,
      description: playlist.body.description,
      external_url: playlist.body.external_urls.spotify,
      image: playlist.body.images[0]?.url || null
    };
  } catch (error) {
    console.error('Error creating playlist:', error);
    throw error;
  }
}