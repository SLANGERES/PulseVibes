'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import authSpotify from '/Users/slangeres/CollageProject/pulse-vibe/Backend/Music/spotify';
import Image from 'next/image';

export default function Recommendations() {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [timeRange, setTimeRange] = useState('medium_term');
  const [limit, setLimit] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [savedTracks, setSavedTracks] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [activeTab, setActiveTab] = useState('discover'); // discover, mood, features, personalized, timebased
  const { data: session, status } = useSession();

  // Static genre list (used for search queries)
  const genres = [
    'pop', 'rock', 'hip-hop', 'edm', 'jazz', 'classical', 'country',
    'reggae', 'indie', 'metal', 'rnb', 'blues', 'funk', 'house', 'techno',
    'punk', 'soul', 'alternative', 'folk', 'dance'
  ];

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setIsLoading(true);
        const accessToken = await authSpotify();
        if (accessToken) setToken(accessToken);
        else console.warn('⚠️ Failed to get token');
      } catch (err) {
        console.error('Token fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, []);

  // Fetch recommendations based on genre
  const fetchRecommendations = async () => {
    if (!selectedGenre || !token) return;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(selectedGenre)}${searchQuery ? '+' + encodeURIComponent(searchQuery) : ''}&type=track&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let tracks = response.data.tracks?.items || [];
      
      // Filter by artist if specified
      if (artistFilter) {
        tracks = tracks.filter(track => 
          track.artists.some(artist => 
            artist.name.toLowerCase().includes(artistFilter.toLowerCase())
          )
        );
      }
      
      // Sort tracks based on the selected sorting option
      if (sortBy === 'popularity') {
        tracks.sort((a, b) => b.popularity - a.popularity);
      } else if (sortBy === 'recent') {
        // This is a rough approximation, as we don't have release date easily available
        tracks.sort((a, b) => new Date(b.album.release_date) - new Date(a.album.release_date));
      } else if (sortBy === 'name') {
        tracks.sort((a, b) => a.name.localeCompare(b.name));
      }

      setRecommendations(tracks);
    } catch (error) {
      console.error('Error searching tracks:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get recommended tracks based on user's top tracks
  const fetchPersonalRecommendations = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      
      // First get user's top tracks
      const topTracksResponse = await axios.get(
        `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const topTrackIds = topTracksResponse.data.items.map(track => track.id).join(',');
      
      // Then get recommendations based on those tracks
      const recommendationsResponse = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${topTrackIds}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendations(recommendationsResponse.data.tracks || []);
    } catch (error) {
      console.error('Error fetching personal recommendations:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recommendations based on saved tracks
  const fetchSavedTracksRecommendations = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      
      // First get user's saved tracks
      const savedTracksResponse = await axios.get(
        `https://api.spotify.com/v1/me/tracks?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const savedTrackIds = savedTracksResponse.data.items.map(item => item.track.id).join(',');
      
      // Then get recommendations based on those tracks
      const recommendationsResponse = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${savedTrackIds}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendations(recommendationsResponse.data.tracks || []);
    } catch (error) {
      console.error('Error fetching saved tracks recommendations:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch recommendations based on recently played tracks
  const fetchRecentlyPlayedRecommendations = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      
      // First get user's recently played tracks
      const recentTracksResponse = await axios.get(
        `https://api.spotify.com/v1/me/player/recently-played?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const recentTrackIds = recentTracksResponse.data.items.map(item => item.track.id).join(',');
      
      // Then get recommendations based on those tracks
      const recommendationsResponse = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${recentTrackIds}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRecommendations(recommendationsResponse.data.tracks || []);
    } catch (error) {
      console.error('Error fetching recently played recommendations:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Search for an artist
  const searchArtist = async (query) => {
    if (!token || !query) return;
  
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.data.artists?.items?.[0]) {
        const artist = response.data.artists.items[0];
        setSelectedArtist(artist);
        await getArtistRecommendations(artist.id);
      }      
    } catch (error) {
      console.error('Error searching artist:', error?.response?.data || error.message);
    }
  };
  

  // Get recommendations based on a specific artist
  const getArtistRecommendations = async (artistId) => {
    const idToUse = artistId || selectedArtist?.id;
    if (!token || !idToUse) return;
  
    try {
      setIsLoading(true);
  
      const response = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_artists=${idToUse}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setRecommendations(response.data.tracks || []);
    } catch (error) {
      console.error('Error fetching artist recommendations:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get new releases
  const fetchNewReleases = async () => {
    if (!token) return;

    try {
      setIsLoading(true);
      
      const response = await axios.get(
        `https://api.spotify.com/v1/browse/new-releases?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Get the first track from each album
      const albumIds = response.data.albums.items.map(album => album.id);
      
      const tracksPromises = albumIds.map(albumId => 
        axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=1`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      
      const tracksResponses = await Promise.all(tracksPromises);
      
      // Combine album info with track info
      const tracks = tracksResponses.map((trackResponse, index) => {
        const album = response.data.albums.items[index];
        const track = trackResponse.data.items[0];
        return {
          ...track,
          album: album,
          popularity: album.popularity || 0
        };
      });

      setRecommendations(tracks);
    } catch (error) {
      console.error('Error fetching new releases:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get recommendations based on mood/energy
  const fetchMoodBasedRecommendations = async (mood) => {
    if (!token) return;

    try {
      setIsLoading(true);
      
      let targetEnergy, targetValence, targetInstrumentalness, targetTempo;
      
      switch(mood) {
        case 'energetic':
          targetEnergy = 0.8;
          targetValence = 0.7;
          targetTempo = 140;
          break;
        case 'relaxed':
          targetEnergy = 0.3;
          targetValence = 0.5;
          targetTempo = 90;
          break;
        case 'happy':
          targetEnergy = 0.6;
          targetValence = 0.8;
          targetTempo = 120;
          break;
        case 'melancholic':
          targetEnergy = 0.4;
          targetValence = 0.3;
          targetTempo = 100;
          break;
        case 'focused':
          targetEnergy = 0.5;
          targetValence = 0.5;
          targetInstrumentalness = 0.7;
          targetTempo = 110;
          break;
        case 'workout':
          targetEnergy = 0.9;
          targetValence = 0.6;
          targetTempo = 150;
          break;
        case 'chill':
          targetEnergy = 0.4;
          targetValence = 0.6;
          targetTempo = 95;
          break;
        case 'party':
          targetEnergy = 0.8;
          targetValence = 0.9;
          targetTempo = 130;
          break;
        case 'nostalgic':
          targetEnergy = 0.5;
          targetValence = 0.4;
          targetTempo = 100;
          break;
        case 'cinematic':
          targetEnergy = 0.7;
          targetValence = 0.5;
          targetInstrumentalness = 0.8;
          targetTempo = 110;
          break;
        default:
          targetEnergy = 0.5;
          targetValence = 0.5;
          targetTempo = 120;
      }
      
      // Get a seed track first (using the selected genre)
      const seedResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(selectedGenre || 'pop')}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const seedTrack = seedResponse.data.tracks?.items[0]?.id;
      
      if (seedTrack) {
        let url = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrack}&target_energy=${targetEnergy}&target_valence=${targetValence}&target_tempo=${targetTempo}&limit=${limit}`;
        
        if (targetInstrumentalness) {
          url += `&target_instrumentalness=${targetInstrumentalness}`;
        }
        
        const response = await axios.get(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setRecommendations(response.data.tracks || []);
      }
    } catch (error) {
      console.error('Error fetching mood-based recommendations:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get recommendations based on audio features
  const fetchAudioFeatureRecommendations = async (feature) => {
    if (!token) return;

    try {
      setIsLoading(true);
      
      let targetFeatures = {};
      
      switch(feature) {
        case 'danceable':
          targetFeatures = { target_danceability: 0.8 };
          break;
        case 'acoustic':
          targetFeatures = { target_acousticness: 0.8 };
          break;
        case 'instrumental':
          targetFeatures = { target_instrumentalness: 0.8 };
          break;
        case 'high-energy':
          targetFeatures = { target_energy: 0.9 };
          break;
        case 'low-bpm':
          targetFeatures = { target_tempo: 80 };
          break;
        case 'high-bpm':
          targetFeatures = { target_tempo: 160 };
          break;
        case 'live':
          targetFeatures = { target_liveness: 0.8 };
          break;
        case 'loud':
          targetFeatures = { target_loudness: -3 };
          break;
        case 'quiet':
          targetFeatures = { target_loudness: -12 };
          break;
      }
      
      // Get a seed track or artist first
      const seedResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(selectedGenre || 'pop')}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const seedTrack = seedResponse.data.tracks?.items[0]?.id;
      
      if (seedTrack) {
        let url = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrack}&limit=${limit}`;
        
        // Add target features to URL
        Object.entries(targetFeatures).forEach(([key, value]) => {
          url += `&${key}=${value}`;
        });
        
        const response = await axios.get(
          url,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setRecommendations(response.data.tracks || []);
      }
    } catch (error) {
      console.error('Error fetching audio feature recommendations:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get time-based recommendations
  const fetchTimeBasedRecommendations = async (timeOfDay) => {
    if (!token) return;
  
    try {
      setIsLoading(true);
  
      let targetEnergy, targetValence, targetTempo;
      
      switch(timeOfDay) {
        case 'morning':
          targetEnergy = 0.6;
          targetValence = 0.7;
          targetTempo = 110;
          break;
        case 'afternoon':
          targetEnergy = 0.7;
          targetValence = 0.6;
          targetTempo = 120;
          break;
        case 'evening':
          targetEnergy = 0.5;
          targetValence = 0.5;
          targetTempo = 100;
          break;
        case 'night':
          targetEnergy = 0.4;
          targetValence = 0.4;
          targetTempo = 90;
          break;
        case 'late-night':
          targetEnergy = 0.3;
          targetValence = 0.3;
          targetTempo = 80;
          break;
      }
  
      const seedResponse = await axios.get(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(selectedGenre || 'pop')}&type=track&limit=1`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const seedTrack = seedResponse.data.tracks?.items[0]?.id;
  
      if (!seedTrack) {
        console.warn('⚠️ No seed track found for the selected genre.');
        setIsLoading(false);
        return;
      }
  
      const response = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTrack}&target_energy=${targetEnergy}&target_valence=${targetValence}&target_tempo=${targetTempo}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setRecommendations(response.data.tracks || []);
    } catch (error) {
      console.error('Error fetching time-based recommendations:', error?.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle audio playback
  const playAudio = (trackId) => {
    if (currentlyPlaying === trackId) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(trackId);
    }
  };

  // Save track to user's library
  const saveTrack = async (trackId) => {
    if (!token) return;
    
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/tracks?ids=${trackId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setSavedTracks([...savedTracks, trackId]);
    } catch (error) {
      console.error('Error saving track:', error?.response?.data || error.message);
    }
  };

  // Generate gradient background based on genre
  const getGenreGradient = () => {
    const gradients = {
      'pop': 'from-pink-500 to-purple-600',
      'rock': 'from-red-600 to-gray-800',
      'hip-hop': 'from-yellow-500 to-blue-600',
      'edm': 'from-blue-400 to-purple-700',
      'jazz': 'from-amber-500 to-red-800',
      'classical': 'from-gray-300 to-blue-300',
      'country': 'from-amber-600 to-green-800',
      'reggae': 'from-green-500 to-yellow-600',
      'indie': 'from-indigo-400 to-purple-500',
      'metal': 'from-gray-900 to-red-900',
      'rnb': 'from-purple-600 to-pink-400',
      'blues': 'from-blue-800 to-indigo-900',
      'funk': 'from-orange-400 to-pink-500',
      'house': 'from-cyan-500 to-blue-500',
      'techno': 'from-purple-800 to-blue-800',
      'punk': 'from-red-600 to-black',
      'soul': 'from-amber-400 to-red-700',
      'alternative': 'from-teal-500 to-purple-700',
      'folk': 'from-amber-300 to-green-700',
      'dance': 'from-blue-500 to-cyan-400'
    };
    
    return selectedGenre ? gradients[selectedGenre] || 'from-gray-800 to-black' : 'from-gray-800 to-black';
  };

  return (
    <div className={`bg-gradient-to-br ${getGenreGradient()} text-white min-h-screen`}>
      <div className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className='h-[100px]'> 

        </div>

        {status !== 'authenticated' ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to explore?</h2>
              <p className="text-gray-300">Sign in with your Spotify account to get started</p>
            </div>
            <button
              onClick={() => signIn('spotify')}
              className="bg-green-500 hover:bg-green-600 transition-colors text-white px-8 py-3 rounded-full flex items-center font-bold text-lg"
            >
              <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
              Connect with Spotify
            </button>
          </div>
        ) : (
          <>
            {/* Recommendation Tabs */}
            <div className="mb-6 bg-black bg-opacity-30 p-4 rounded-xl backdrop-blur-sm">
              <nav className="flex flex-wrap">
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`mr-2 mb-2 px-4 py-2 rounded-lg ${activeTab === 'discover' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  Discover
                </button>
                <button
                  onClick={() => setActiveTab('mood')}
                  className={`mr-2 mb-2 px-4 py-2 rounded-lg ${activeTab === 'mood' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  Mood
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`mr-2 mb-2 px-4 py-2 rounded-lg ${activeTab === 'features' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  Audio Features
                </button>
                <button
                  onClick={() => setActiveTab('personalized')}
                  className={`mr-2 mb-2 px-4 py-2 rounded-lg ${activeTab === 'personalized' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  Personalized
                </button>
                <button
                  onClick={() => setActiveTab('timebased')}
                  className={`mr-2 mb-2 px-4 py-2 rounded-lg ${activeTab === 'timebased' ? 'bg-green-500 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  Time-Based
                </button>
              </nav>
            </div>

            {/* Advanced Discovery Options */}
            <div className="mb-10 bg-black bg-opacity-30 p-6 rounded-xl backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">Music Discovery</h2>
              
              {/* Different tabs content */}
              {activeTab === 'discover' && (
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => fetchPersonalRecommendations()}
                    className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                  >
                    Based on My Taste
                  </button>
                  <button
                    onClick={() => fetchNewReleases()}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    New Releases
                  </button>
                  <button
                    onClick={() => fetchRecommendations()}
                    className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-colors"
                  >
                    Explore by Genre
                  </button>
                  <button
                    onClick={() => {
                      const currentDate = new Date();
                      const currentHour = currentDate.getHours();
                      
                      if (currentHour >= 5 && currentHour < 12) {
                        fetchTimeBasedRecommendations('morning');
                      } else if (currentHour >= 12 && currentHour < 17) {
                        fetchTimeBasedRecommendations('afternoon');
                      } else if (currentHour >= 17 && currentHour < 21) {
                        fetchTimeBasedRecommendations('evening');
                      } else {
                        fetchTimeBasedRecommendations('night');
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    For Right Now
                  </button>
                </div>
              )}
              
              {activeTab === 'mood' && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  <button
                    onClick={() => fetchMoodBasedRecommendations('energetic')}
                    className="px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    Energetic
                  </button>
                  <button
                    onClick={() => fetchMoodBasedRecommendations('relaxed')}
                    className="px-4 py-3 rounded-lg bg-blue-400 hover:bg-blue-500 text-white transition-colors"
                  >
                    Relaxing
                  </button>
                  <button
                    onClick={() => fetchMoodBasedRecommendations('happy')}
                    className="px-4 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white transition-colors"
                  >
                    Happy
                  </button>
                  <button
                    onClick={() => fetchMoodBasedRecommendations('melancholic')}
                    className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    Melancholic
                  </button>
                  <button
                    onClick={() => fetchMoodBasedRecommendations('focused')}
                    className="px-4 py-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-colors"
                  >
                    Focused/Study
                  </button>
                  <button
                    onClick={() => fetchMoodBasedRecommendations('workout')}
                    className="px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                  >
                    Workout
                  </button>
                  <button
                    onClick={() => fetchMoodBasedRecommendations('chill')}
                    className="px-4 py-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                  >
                    Chill
                  </button>
                  <button
                    onClick={() => fetchMoodBasedRecommendations('party')}
                    className="px-4 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition-colors"
                  >
                    Party
                  </button>
                  <button
                    onClick={() => fetchMoodBasedRecommendations('nostalgic')}
                    className="px-4 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                  >
                    Nostalgic
                  </button>
                  <button
                    onClick={() => fetchMoodBasedRecommendations('cinematic')}
                    className="px-4 py-3 rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                  >
                    Cinematic
                  </button>
                </div>
              )}
              
              {activeTab === 'features' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  <button
                    onClick={() => fetchAudioFeatureRecommendations('danceable')}
                    className="px-4 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition-colors"
                  >
                    Danceable Tracks
                  </button>
                  <button
                    onClick={() => fetchAudioFeatureRecommendations('acoustic')}
                    className="px-4 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                  >
                    Acoustic Tracks
                  </button>
                  <button
                    onClick={() => fetchAudioFeatureRecommendations('instrumental')}
                    className="px-4 py-3 rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors"
                  >
                    Instrumental Tracks
                  </button>
                  <button
                    onClick={() => fetchAudioFeatureRecommendations('high-energy')}
                    className="px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                  >
                    High Energy Tracks
                  </button>
                  <button
                    onClick={() => fetchAudioFeatureRecommendations('low-bpm')}
                    className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    Low BPM Tracks
                  </button>
                  <button
                    onClick={() => fetchAudioFeatureRecommendations('high-bpm')}
                    className="px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                  >
                    High BPM Tracks
                  </button>
                  <button
                    onClick={() => fetchAudioFeatureRecommendations('live')}
                    className="px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    Live Recordings
                  </button>
                  <button
                    onClick={() => fetchAudioFeatureRecommendations('loud')}
                    className="px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                  >
                    Loud Tracks
                  </button>
                  <button
                    onClick={() => fetchAudioFeatureRecommendations('quiet')}
                    className="px-4 py-3 rounded-lg bg-blue-400 hover:bg-blue-500 text-white transition-colors"
                  >
                    Quiet Tracks
                  </button>
                </div>
              )}
              
              {activeTab === 'personalized' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <button
                      onClick={() => fetchPersonalRecommendations()}
                      className="px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
                    >
                      Based on Top Tracks
                    </button>
                    <button
                      onClick={() => fetchSavedTracksRecommendations()}
                      className="px-4 py-3 rounded-lg bg-pink-600 hover:bg-pink-700 text-white transition-colors"
                    >
                      Based on Saved Tracks
                    </button>
                    <button
                      onClick={() => fetchRecentlyPlayedRecommendations()}
                      className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    >
                      Based on Recently Played
                    </button>
                    <div className="flex flex-col">
                      <button
                        onClick={() => getArtistRecommendations()}
                        className={`px-4 py-3 rounded-lg ${selectedArtist ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 cursor-not-allowed'} text-white transition-colors`}
                        disabled={!selectedArtist}
                      >
                        Similar to Artist
                      </button>
                      {selectedArtist && (
                        <span className="mt-1 text-sm text-green-400">
                          {selectedArtist.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Artist search */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Find Similar Artists</h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Search for an artist..."
                        className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-white"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            searchArtist(e.target.value);
                          }
                        }}
                      />
                      <button
                        onClick={(e) => searchArtist(e.target.previousSibling.value)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {/* Time range selector */}
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Time Range (for Top Tracks)</h3>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setTimeRange('short_term')}
                        className={`px-4 py-2 rounded-lg ${timeRange === 'short_term' ? 'bg-green-600' : 'bg-gray-800'}`}
                      >
                        Last 4 Weeks
                      </button>
                      <button
                        onClick={() => setTimeRange('medium_term')}
                        className={`px-4 py-2 rounded-lg ${timeRange === 'medium_term' ? 'bg-green-600' : 'bg-gray-800'}`}
                      >
                        Last 6 Months
                      </button>
                      <button
                        onClick={() => setTimeRange('long_term')}
                        className={`px-4 py-2 rounded-lg ${timeRange === 'long_term' ? 'bg-green-600' : 'bg-gray-800'}`}
                      >
                        All Time
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'timebased' && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  <button
                    onClick={() => fetchTimeBasedRecommendations('morning')}
                    className="px-4 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                  >
                    Morning Music
                  </button>
                  <button
                    onClick={() => fetchTimeBasedRecommendations('afternoon')}
                    className="px-4 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-colors"
                  >
                    Afternoon Vibes
                  </button>
                  <button
                    onClick={() => fetchTimeBasedRecommendations('evening')}
                    className="px-4 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                  >
                    Evening Relaxation
                  </button>
                  <button
                    onClick={() => fetchTimeBasedRecommendations('night')}
                    className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                  >
                    Night Music
                  </button>
                  <button
                    onClick={() => fetchTimeBasedRecommendations('late-night')}
                    className="px-4 py-3 rounded-lg bg-purple-800 hover:bg-purple-900 text-white transition-colors"
                  >
                    Late Night
                  </button>
                </div>
              )}
              
              {/* Genre Selection */}
              <h3 className="text-xl font-bold mb-2 mt-6">Select Genre</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-3 rounded-lg capitalize text-center transition-all ${
                      selectedGenre === genre 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
              
              {/* Advanced Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Additional Keywords</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="E.g. summer, dance, acoustic..."
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Artist</label>
                  <input
                    type="text"
                    value={artistFilter}
                    onChange={(e) => setArtistFilter(e.target.value)}
                    placeholder="Artist name..."
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Results</label>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="px-3 py-2 bg-gray-800 rounded-lg text-white"
                  >
                    <option value="6">6 tracks</option>
                    <option value="12">12 tracks</option>
                    <option value="24">24 tracks</option>
                    <option value="50">50 tracks</option>
                  </select>
                </div>
                
                <button
                  onClick={fetchRecommendations}
                  className={`px-6 py-3 rounded-lg font-bold flex items-center ${
                    selectedGenre && !isLoading
                      ? 'bg-green-500 hover:bg-green-600 transition-colors'
                      : 'bg-gray-700 cursor-not-allowed'
                  }`}
                  disabled={!selectedGenre || isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Finding Tracks...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                      Find Tracks
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {recommendations.length > 0 && (
  <div className="mt-8">
    <h2 className="text-3xl font-bold mb-6">
      {selectedGenre ? (
        <span className="capitalize">{selectedGenre} Tracks for You</span>
      ) : (
        "Recommended Tracks for You"
      )}
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((track) => (
        <div 
          key={track.id} 
          className="bg-black bg-opacity-40 rounded-xl overflow-hidden backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:transform hover:scale-102"
        >
          <div className="relative">
            {track.album?.images?.[0] && (
              <div className="aspect-square w-full overflow-hidden">
                <img 
                  src={track.album.images[0].url} 
                  alt={track.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={() => saveTrack(track.id)}
                className={`rounded-full p-3 shadow-lg transition-colors ${
                  savedTracks.includes(track.id) 
                    ? 'bg-pink-600 hover:bg-pink-700' 
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                </svg>
              </button>
              <button 
                onClick={() => playAudio(track.id)}
                className="rounded-full bg-green-500 p-3 shadow-lg hover:bg-green-600 transition-colors"
              >
                {currentlyPlaying === track.id ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg truncate">{track.name}</h3>
            <p className="text-gray-300 truncate">
              {track.artists?.map(artist => artist.name).join(', ')}
            </p>
            
            {/* Spotify Player */}
            {currentlyPlaying === track.id && (
              <div className="mt-4">
                {/* Fallback to preview_url if available */}
                {track.preview_url ? (
                  <audio 
                    src={track.preview_url} 
                    autoPlay 
                    controls 
                    className="w-full h-8"
                    onEnded={() => setCurrentlyPlaying(null)}
                  />
                ) : (
                  <iframe
                    src={`https://open.spotify.com/embed/track/${track.id}`}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allowTransparency="true"
                    allow="encrypted-media"
                    title={`${track.name} by ${track.artists?.[0]?.name}`}
                    className="rounded"
                  />
                )}
              </div>
            )}
            
            {/* Track Details */}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-400 truncate max-w-[60%]">
                {track.album?.name}
              </span>
              <div className="flex items-center gap-2">
                {track.popularity !== undefined && (
                  <span className="text-xs px-2 py-1 bg-gray-800 rounded-full">
                    {track.popularity}% popularity
                  </span>
                )}
                <a 
                  href={track.external_urls?.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 flex items-center"
                >
                  <span className="mr-1">Open</span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                  </svg>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                
                {/* Load More Button */}
                {recommendations.length >= limit && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => setLimit(prev => prev + 12)}
                      className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            
          </>
        )}
      </div>
    </div>
  );
}