// RecommendationsPage.jsx
import Link from 'next/link';
import { Play, Clock, Heart, Plus, Radio, ChevronRight, Star, Music, User, Calendar, Headphones } from 'lucide-react';



const randomGenere={}
export default function RecommendationsPage() {

  return (
    <div className="bg-gradient-to-b from-black via-purple-950 to-black text-white min-h-screen">
      {/* Hero Banner */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-black/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/600')] bg-cover bg-center opacity-40"></div>
        
        <div className="container mx-auto relative z-20">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            Your <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Recommendations</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Discover music tailored to your taste. Refreshed daily based on your listening habits.
          </p>
        </div>
      </section>

      {/* Daily Mix Section */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Radio className="w-6 h-6 text-pink-400" />
                Daily Mixes
              </h2>
              <p className="text-gray-400 text-sm mt-1">Fresh playlists updated daily</p>
            </div>
            <Link href="/daily-mixes" className="text-purple-400 hover:text-pink-400 transition-colors flex items-center gap-1 text-sm font-medium">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="bg-purple-900/30 rounded-lg overflow-hidden group hover:bg-purple-800/40 transition-all duration-300 backdrop-blur-sm">
                <div className="relative">
                  <img src={`/api/placeholder/320/320`} alt="Mix Cover" className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all">
                      <Play className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white mb-2">Daily Mix {item}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    Based on your recent listening to Rhythm Collective, Echo Harmony, and more
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For You Section with Horizontal Scroll */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Star className="w-6 h-6 text-pink-400" />
                For You
              </h2>
              <p className="text-gray-400 text-sm mt-1">Personalized recommendations</p>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-5 pb-6 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="flex-none w-64 bg-purple-900/30 rounded-lg overflow-hidden group hover:bg-purple-800/40 transition-all backdrop-blur-sm">
                <div className="relative">
                  <img src={`/api/placeholder/300/300`} alt="Album Cover" className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all">
                      <Play className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-white mb-1 truncate">Echoes of Tomorrow</h3>
                  <p className="text-gray-400 text-sm truncate">Pulse Rhythm</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 4:20
                    </span>
                    <button className="text-gray-400 hover:text-pink-400 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weekly Discovery */}
      <section className="py-12 px-6 bg-gradient-to-r from-purple-900/20 to-black/20 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Music className="w-6 h-6 text-pink-400" />
                Weekly Discovery
              </h2>
              <p className="text-gray-400 text-sm mt-1">Fresh tracks updated every Friday</p>
            </div>
            <Link href="/discover" className="text-purple-400 hover:text-pink-400 transition-colors flex items-center gap-1 text-sm font-medium">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-purple-900/30 backdrop-blur-sm rounded-xl p-6">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className={`flex items-center gap-4 py-3 ${item < 5 ? 'border-b border-purple-800/50' : ''} group hover:bg-purple-800/20 px-4 -mx-4 rounded-lg transition-colors`}>
                <div className="w-10 text-gray-400 font-medium text-center">{item}</div>
                <div className="relative w-12 h-12 flex-shrink-0">
                  <img src={`/api/placeholder/60/60`} alt="Track" className="w-full h-full object-cover rounded" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                    <Play className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-grow min-w-0">
                  <h3 className="font-medium text-white truncate">New Horizon (feat. Echo Waves)</h3>
                  <p className="text-gray-400 text-sm truncate">Pulse Collective</p>
                </div>
                <div className="text-gray-400 text-sm">3:45</div>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-pink-400 transition-colors p-1">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-pink-400 transition-colors p-1">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4 text-center">
              <button className="px-6 py-2 bg-purple-800/50 hover:bg-purple-700 rounded-full text-sm font-medium transition-colors">
                Load More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Based On Your Recent Listening */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Headphones className="w-6 h-6 text-pink-400" />
                Based On Your Recent Listening
              </h2>
              <p className="text-gray-400 text-sm mt-1">More of what you love</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-gradient-to-br from-purple-800/40 to-purple-900/20 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img src={`/api/placeholder/80/80`} alt="Album" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white mb-1">Because you listened to</h3>
                      <p className="text-pink-400 font-medium">Midnight Pulse</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {[1, 2, 3].map((track) => (
                      <div key={track} className="flex items-center gap-3 group hover:bg-purple-800/30 p-2 -mx-2 rounded-lg transition-colors">
                        <div className="relative w-10 h-10 flex-shrink-0">
                          <img src={`/api/placeholder/50/50`} alt="Track" className="w-full h-full object-cover rounded" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-medium text-white truncate">Cosmic Rhythm Part {track}</h4>
                          <p className="text-gray-400 text-xs truncate">Echo Harmony</p>
                        </div>
                        <button className="text-gray-400 hover:text-pink-400 transition-colors p-1 opacity-0 group-hover:opacity-100">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <button className="w-full py-2 border border-purple-500 text-purple-400 hover:bg-purple-900/30 rounded-lg text-sm font-medium transition-colors">
                      View More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Artists You Might Like */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <User className="w-6 h-6 text-pink-400" />
                Artists You Might Like
              </h2>
              <p className="text-gray-400 text-sm mt-1">Discover new artists to follow</p>
            </div>
            <Link href="/artists" className="text-purple-400 hover:text-pink-400 transition-colors flex items-center gap-1 text-sm font-medium">
              See All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="text-center group">
                <div className="relative mx-auto rounded-full overflow-hidden w-32 h-32 mb-4">
                  <img src={`/api/placeholder/150/150`} alt="Artist" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-all">
                      <Play className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
                <h3 className="font-medium text-white mb-1">Neon Pulse</h3>
                <p className="text-gray-400 text-sm">Electronic</p>
                <button className="mt-2 px-4 py-1 border border-gray-600 rounded-full text-xs text-gray-300 hover:border-pink-400 hover:text-pink-400 transition-colors">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Made For You */}
      <section className="py-12 px-6 bg-gradient-to-r from-purple-900/30 to-black/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                <Calendar className="w-6 h-6 text-pink-400" />
                Made For You
              </h2>
              <p className="text-gray-400 text-sm mt-1">Personalized playlists based on your mood</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Morning Beats', 'Workout Energy', 'Focus Flow', 'Evening Chill'].map((title, index) => (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-purple-800/60 to-black/60 rounded-xl overflow-hidden backdrop-blur-sm">
                  <div className="p-5">
                    <h3 className="font-bold text-xl text-white mb-2">{title}</h3>
                    <p className="text-gray-300 text-sm mb-4">
                      A custom playlist for your {title.toLowerCase()} moments
                    </p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="grid grid-cols-2 gap-1 w-20 h-20">
                        <img src="/api/placeholder/60/60" alt="Album" className="w-full h-full object-cover" />
                        <img src="/api/placeholder/60/60" alt="Album" className="w-full h-full object-cover" />
                        <img src="/api/placeholder/60/60" alt="Album" className="w-full h-full object-cover" />
                        <img src="/api/placeholder/60/60" alt="Album" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-gray-400 text-sm block mb-1">Updated Weekly</span>
                        <span className="text-gray-300 text-sm">32 tracks • 2hr 15min</span>
                      </div>
                    </div>
                    
                    <button className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg font-medium hover:shadow-lg transition-all text-sm">
                      Play Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mood Selection */}
      <section className="py-12 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Browse by Mood</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['Energetic', 'Calm', 'Focus', 'Workout', 'Party', 'Sleep'].map((mood, index) => (
              <div key={index} className="relative h-32 rounded-xl overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 z-10"></div>
                <img src={`/api/placeholder/300/300`} alt={mood} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <h3 className="text-white font-bold text-xl">{mood}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Load More */}
      <section className="py-12 px-6">
        <div className="container mx-auto text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full font-medium hover:shadow-lg transition-all">
            Load More Recommendations
          </button>
          <p className="mt-4 text-gray-400 text-sm">
            Recommendations are updated daily based on your listening habits
          </p>
        </div>
      </section>
    </div>
  );
}