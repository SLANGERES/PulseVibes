'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Music, User, Heart, Settings } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    
    <div className={`fixed w-full z-50 transition-all duration-300 rounded-b-full ${
      isScrolled ? 'bg-purple-900 bg-opacity-90 shadow-lg backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and App Name */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <span className="absolute w-full h-full bg-gradient-to-br from-pink-500 to-purple-700 rounded-full animate-pulse"></span>
                <Music className="w-5 h-5 text-white relative z-10" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Pulse Vibe
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-gray-200 hover:text-white transition-colors">Home</Link>
            <Link href="/Recommendations" className="text-gray-200 hover:text-white transition-colors">Discover</Link>
            
            <Link href="/Ai-Bot" className="text-gray-200 hover:text-white transition-colors">AI Bot</Link>
            <Link href="/Playlist" className="text-gray-200 hover:text-white transition-colors">Playlists</Link>
          </nav>

          {/* User Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                {/* Profile Section */}
                <div className="mt-2 flex items-center justify-center">
                  <div className="p-0.5 rounded-full bg-amber-200 bg-opacity-30 mr-3">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-fill"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {session.user?.name?.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-white text-sm leading-tight">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-400">Connected with Spotify</p>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={() => signIn()}
                className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 rounded-full text-white font-medium hover:shadow-lg transition-all"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-purple-800 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-purple-900 bg-opacity-95 backdrop-blur-sm shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/discover" className="block px-3 py-2 rounded-md text-white hover:bg-purple-800">Discover</Link>
            <Link href="/library" className="block px-3 py-2 rounded-md text-white hover:bg-purple-800">Library</Link>
            <Link href="/trending" className="block px-3 py-2 rounded-md text-white hover:bg-purple-800">Trending</Link>
            <Link href="/playlists" className="block px-3 py-2 rounded-md text-white hover:bg-purple-800">Playlists</Link>
            <div className="pt-4 pb-3 border-t border-purple-700">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-purple-700 flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">User Profile</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link href="/profile" className="block px-3 py-2 rounded-md text-white hover:bg-purple-800">Your Profile</Link>
                <Link href="/settings" className="block px-3 py-2 rounded-md text-white hover:bg-purple-800">Settings</Link>
                <Link href="/favorites" className="block px-3 py-2 rounded-md text-white hover:bg-purple-800">Favorites</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
