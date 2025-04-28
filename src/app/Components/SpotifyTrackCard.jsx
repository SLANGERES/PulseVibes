import { useState } from 'react';

/**
 * SpotifyTrackCard component for displaying track information
 * 
 * @param {Object} props
 * @param {Object} props.track - The Spotify track object
 * @param {Array} props.savedTracks - Array of saved track IDs
 * @param {string|null} props.currentlyPlaying - ID of currently playing track (or null)
 * @param {Function} props.onPlay - Function to handle play/pause
 * @param {Function} props.onSave - Function to handle saving track
 */
const SpotifyTrackCard = ({ 
  track, 
  savedTracks = [], 
  currentlyPlaying = null, 
  onPlay = () => {}, 
  onSave = () => {} 
}) => {
  if (!track) return null;

  const { id, name, artists, album, popularity, external_urls, preview_url } = track;
  const isPlaying = currentlyPlaying === id;
  const isSaved = savedTracks.includes(id);
  const artistNames = artists?.map(artist => artist.name).join(', ') || '';
  const albumName = album?.name || '';
  const albumImage = album?.images?.[0]?.url;
  const spotifyUrl = external_urls?.spotify;

  return (
    <div className="bg-black bg-opacity-40 rounded-xl overflow-hidden backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="relative">
        {albumImage && (
          <div className="aspect-square w-full overflow-hidden">
            <img 
              src={albumImage} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={() => onSave(id)}
            className={`rounded-full p-3 shadow-lg transition-colors ${
              isSaved 
                ? 'bg-pink-600 hover:bg-pink-700' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
          </button>
          <button 
            onClick={() => onPlay(id)}
            className="rounded-full bg-green-500 p-3 shadow-lg hover:bg-green-600 transition-colors"
          >
            {isPlaying ? (
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
        <h3 className="font-bold text-lg truncate">{name}</h3>
        <p className="text-gray-300 truncate">{artistNames}</p>
        
        {/* Spotify Player */}
        {isPlaying && (
          <div className="mt-4">
            {preview_url ? (
              <audio 
                src={preview_url} 
                autoPlay 
                controls 
                className="w-full h-8"
                onEnded={() => onPlay(null)}
              />
            ) : (
              <iframe
                src={`https://open.spotify.com/embed/track/${id}`}
                width="100%"
                height="80"
                frameBorder="0"
                allowTransparency="true"
                allow="encrypted-media"
                title={`${name} by ${artists?.[0]?.name}`}
                className="rounded"
              />
            )}
          </div>
        )}
        
        {/* Track Details */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-400 truncate max-w-[60%]">
            {albumName}
          </span>
          <div className="flex items-center gap-2">
            {popularity !== undefined && (
              <span className="text-xs px-2 py-1 bg-gray-800 rounded-full">
                {popularity}% popularity
              </span>
            )}
            {spotifyUrl && (
              <a 
                href={spotifyUrl}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyTrackCard;