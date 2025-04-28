// HomePage.jsx
import Link from 'next/link';
import { Play, Heart, Clock, Music, TrendingUp, Calendar, BarChart2 } from 'lucide-react';
import '@fontsource/roboto';

export default function HomePage() {
  return (
    <div className="bg-gradient-to-b from-black via-purple-950 to-black text-white ">
      {/* Hero Section */}
      <section className="relative h-screen max-h-96 md:max-h-screen flex items-center">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-black/80 z-10"></div>
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center"></div>
        </div>
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                Feel the Pulse
              </span>
              <br />of Music
            </h1>
            <p className="text-xl text-gray-300 mb-8">Discover new rhythms, artists, and vibes that resonate with your soul.</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2">
                <Play className="w-5 h-5" />
                Start Listening
              </button>
              <button className="px-8 py-3 bg-transparent border border-purple-400 text-purple-400 rounded-full font-medium hover:bg-purple-900/30 transition-all">
                Browse Library
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Trending Now Section with Glowing Card */}




      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-purple-900/40 to-purple-900/20 rounded-xl backdrop-blur-sm p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <BarChart2 className="w-8 h-8 mx-auto mb-4 text-pink-400" />
                <h4 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  10M+
                </h4>
                <p className="text-gray-300 mt-2">Active Users</p>
              </div>
              <div className="p-4">
                <Music className="w-8 h-8 mx-auto mb-4 text-pink-400" />
                <h4 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  50M+
                </h4>
                <p className="text-gray-300 mt-2">Tracks</p>
              </div>
              <div className="p-4">
                <Calendar className="w-8 h-8 mx-auto mb-4 text-pink-400" />
                <h4 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  1.2K+
                </h4>
                <p className="text-gray-300 mt-2">Events</p>
              </div>
              <div className="p-4">
                <Heart className="w-8 h-8 mx-auto mb-4 text-pink-400" />
                <h4 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  500M+
                </h4>
                <p className="text-gray-300 mt-2">Favorites</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}


      {/* App Download Section */}
    
    </div>
  );
}

