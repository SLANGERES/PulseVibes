'use client';

import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';

export default function SignIn() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    loadProviders();
  }, []);

  if (!providers) return  <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
  <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">Discover Your Sound</h1>
  <p className="text-xl mb-8 text-center text-gray-300">Connect with Spotify to get started</p>
  <button 
    className="px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 transition-all text-white font-bold text-lg"
    onClick={() => signIn('spotify')}
  >
    Connect with Spotify
  </button>
</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">Discover Your Sound</h1>
      <p className="text-xl mb-8 text-center text-gray-300">Connect with Spotify to get started</p>
      <button 
        className="px-8 py-4 rounded-full bg-green-500 hover:bg-green-600 transition-all text-white font-bold text-lg"
        onClick={() => signIn('spotify')}
      >
        Connect with Spotify
      </button>
    </div>
  );
}
