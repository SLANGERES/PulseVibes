'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Search, Mic, Send, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import SpotifyTrackCard from '../Components/SpotifyTrackCard';
import { toast } from 'react-hot-toast';


let socket;

export default function AssistantPrompt() {
  const { data: session, status } = useSession();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('What can I help with?');
  const [loading, setLoading] = useState(false);
  const [music, setMusic] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [savedTracks, setSavedTracks] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const responseRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (!socket) {
      socket = io('http://localhost:9090', {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    }

    socket.on('connect', () => {
      console.log('Socket connected');
      setSocketConnected(true);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
      setSocketConnected(false);
      toast.error('Connection failed. Please try again later.');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setSocketConnected(false);
    });

    socket.on('response', (data) => {
      console.log('Response from backend:', data);
      setResponse(data);
      setLoading(false);
    });

    socket.on('spotify', (data) => {
      console.log('Response from spotify:', data);
      setMusic(data);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('disconnect');
      socket.off('response');
      socket.off('spotify');
    };
  }, []);

  // Scroll to bottom when new response arrives
  useEffect(() => {
    if (responseRef.current && response) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [response]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Handle voice input
  const handleVoiceInput = () => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast.error('Voice recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    setIsListening(true);
    
    recognition.start();
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      toast.error('Failed to recognize speech');
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const handleSend = () => {
    if (query.trim() !== '') {
      if (!socketConnected) {
        toast.error('Not connected to the server. Please try again.');
        return;
      }
      
      setLoading(true);
      setResponse('');
      setMusic([]);
      socket.emit('prompt', query);
      setQuery('');
    }
  };

  const handlePlay = (id) => {
    setCurrentlyPlaying((prev) => (prev === id ? null : id));
  };

  const handleSave = (id) => {
    setSavedTracks((prev) =>
      prev.includes(id) ? prev.filter((trackId) => trackId !== id) : [...prev, id]
    );
    toast.success(
      savedTracks.includes(id) ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  const formatResponse = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n').filter((line) => line.trim() !== '');
    return lines.map((line, idx) => (
      <p key={idx} className="text-left mb-2">
        {line}
      </p>
    ));
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-black text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-black text-white px-4 flex-col">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 backdrop-blur-md text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
          <p className="mb-4">Please login to access the music assistant.</p>
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            onClick={() => signIn('spotify')}
          >
            Login with Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col">
      {/* Main content wrapper - full width with padding */}
      <div className='h-[100px]'></div>
      <div className="w-full px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          {/* Connection Status */}
          <div className={`text-xs flex items-center justify-end mb-4 ${socketConnected ? 'text-green-400' : 'text-red-400'}`}>
            <span className={`w-2 h-2 rounded-full mr-1 ${socketConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
            {socketConnected ? 'Connected' : 'Disconnected'}
          </div>

          {/* Response Area */}
          <div 
            className="text-lg font-medium space-y-2 text-left min-h-[120px] max-h-[400px] overflow-y-auto p-4 bg-zinc-900/40 rounded-xl w-full mb-6"
          >
            {loading ? (
              <div className="flex items-center space-x-2 text-zinc-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Assistant is thinking...</span>
              </div>
            ) : (
              <div ref={responseRef}>{formatResponse(response)}</div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl flex items-center justify-center p-3 backdrop-blur-md w-full mb-8">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="bg-transparent text-white placeholder-zinc-400 outline-none flex-grow px-2 py-1"
              disabled={loading || !socketConnected}
            />
            <div className="flex gap-2 items-center">
              <button 
                onClick={handleVoiceInput} 
                disabled={isListening || loading}
                className={`p-2 hover:bg-zinc-800 rounded-full transition ${isListening ? 'text-green-400' : ''} ${loading || !socketConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button 
                onClick={handleSend} 
                disabled={!query.trim() || loading || !socketConnected}
                className={`p-2 hover:bg-zinc-800 rounded-full transition ${!query.trim() || loading || !socketConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Music Tracks - Full Width */}
          {music.length > 0 && (
            <div className="w-full mb-8">
              <h3 className="text-xl font-semibold mb-4 text-left">Suggested Tracks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-h-[600px] overflow-y-auto p-2">
                {music.map((track) => (
                  <SpotifyTrackCard
                    key={track.id}
                    track={track}
                    savedTracks={savedTracks}
                    currentlyPlaying={currentlyPlaying}
                    onPlay={handlePlay}
                    onSave={handleSave}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Saved Tracks - Full Width */}
          {savedTracks.length > 0 && (
            <div className="w-full">
              <h3 className="text-xl font-semibold mb-4 text-left">Your Favorites</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-h-[400px] overflow-y-auto p-2">
                {music
                  .filter(track => savedTracks.includes(track.id))
                  .map((track) => (
                    <SpotifyTrackCard
                      key={track.id}
                      track={track}
                      savedTracks={savedTracks}
                      currentlyPlaying={currentlyPlaying}
                      onPlay={handlePlay}
                      onSave={handleSave}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='h-[150px]'></div>
    </div>
  );
}