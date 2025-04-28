'use client'
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import SpotifyTrackCard from '../Components/SpotifyTrackCard'; // Adjust path as needed

export default function Home() {
  const { data: session } = useSession();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedTracks, setSavedTracks] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTracks = async () => {
    if (!session || !session.accessToken) {
      setError('Please log in to fetch tracks');
      return;
    }

    const token = session.accessToken;

    if (!token) {
      setError('Missing token');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.spotify.com/v1/me/tracks?limit=50', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setTracks(data.items);
      
      // Initialize saved tracks from fetched data
      setSavedTracks(data.items.map(item => item.track.id));
    } catch (err) {
      setError(`Failed to fetch tracks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = (trackId) => {
    setCurrentlyPlaying(currentlyPlaying === trackId ? null : trackId);
  };

  const handleSave = async (trackId) => {
    if (!session?.accessToken) return;
    
    const isSaved = savedTracks.includes(trackId);
    const method = isSaved ? 'DELETE' : 'PUT';
    const token = session.accessToken;

    try {
      const response = await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      // Update local saved tracks state
      if (isSaved) {
        setSavedTracks(savedTracks.filter(id => id !== trackId));
      } else {
        setSavedTracks([...savedTracks, trackId]);
      }
    } catch (err) {
      setError(`Failed to ${isSaved ? 'unsave' : 'save'} track: ${err.message}`);
    }
  };

  // Filter tracks based on search term
  const filteredTracks = tracks.filter(item => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const trackName = item.track.name.toLowerCase();
    const artistNames = item.track.artists.map(artist => artist.name.toLowerCase()).join(' ');
    const albumName = item.track.album.name.toLowerCase();
    
    return trackName.includes(searchLower) || 
           artistNames.includes(searchLower) || 
           albumName.includes(searchLower);
  });

  useEffect(() => {
    if (session) fetchTracks();
  }, [session]);

  return (
    <div className="min-h-screen bg-black text-gray-100">


      <main className="container mx-auto px-4 py-12">
        <div className="h-[100px]">

        </div>

        {!session ? (
          <div className="flex flex-col items-center justify-center py-16 bg-gray-800 bg-opacity-30 rounded-2xl backdrop-blur-sm">
            <svg className="w-16 h-16 text-green-400 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 1012 0c0-.35-.028-.696-.081-1.038A5.5 5.5 0 0010 11z" clipRule="evenodd"></path>
            </svg>
            <p className="text-center text-gray-300 text-xl mb-6">Please sign in to view your saved tracks</p>
            <button className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-full font-medium transition-colors duration-300 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
              </svg>
              Connect Spotify
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-900 bg-opacity-50 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-8 backdrop-blur-sm">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                  </svg>
                  {error}
                </div>
                <button 
                  onClick={fetchTracks} 
                  className="mt-3 bg-red-800 hover:bg-red-700 text-white py-1 px-4 rounded-md text-sm"
                >
                  Try Again
                </button>
              </div>
            )}

            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search your tracks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-800 bg-opacity-50 backdrop-blur-sm border border-gray-700 rounded-full py-3 px-6 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <svg className="w-6 h-6 text-gray-400 absolute left-4 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mb-4"></div>
                <p className="text-green-400 text-lg">Loading your tracks...</p>
              </div>
            ) : filteredTracks.length > 0 ? (
              <>
                <div className="text-gray-400 mb-4">
                  {filteredTracks.length} {filteredTracks.length === 1 ? 'track' : 'tracks'} {searchTerm && `matching "${searchTerm}"`}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTracks.map((item) => (
                    <SpotifyTrackCard
                      key={item.track.id}
                      track={item.track}
                      savedTracks={savedTracks}
                      currentlyPlaying={currentlyPlaying}
                      onPlay={handlePlay}
                      onSave={handleSave}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-gray-800 bg-opacity-20 rounded-2xl backdrop-blur-sm">
                <svg className="w-16 h-16 text-gray-500 mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                <p className="text-center text-gray-400 text-xl">
                  {searchTerm ? `No tracks matching "${searchTerm}"` : "No saved tracks found for your account"}
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

     
    </div>
  );
}