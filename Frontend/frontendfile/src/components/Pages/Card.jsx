import React from "react";
import { Heart, Shuffle, SkipBack, Play, SkipForward, MoreHorizontal } from "lucide-react";

export const Card = ({ song }) => {
  console.log("Song Data:", song); // Debugging log

  // Handle invalid or missing song data
  if (!song || !song.name || !song.album_cover) {
    return (
      <div className="text-red-500 text-center p-4 border border-red-400 bg-red-100 rounded-md">
        Invalid song data
      </div>
    );
  }

  return (
    <div 
      className="bg-pink-100 p-3 rounded-lg max-w-[180px] w-full mx-auto hover:translate-y-2 hover:shadow-black hover:shadow-2xl hover:inset-shadow-lg hover:translate-x-2 hover:duration-300 hover:ease-in-out"
      onClick={() => song.spotify_url && window.open(song.spotify_url, "_blank")}
    >
      {/* Image and Song Info */}
      <div className="relative mb-2">
        <img src={song.album_cover} alt={song.name} className="w-full rounded-md" />
        <div className="mt-1 text-center">
          <h2 className="text-sm font-semibold text-gray-800">{song.name}</h2>
          <p className="text-xs text-gray-500">{song.artist}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between text-[10px] text-gray-500 mb-1 px-1">
        <span>0:00</span>
        <span>3:00</span>
      </div>
      <div className="w-full h-0.5 bg-gray-300 rounded-full mb-2">
        <div className="w-1/4 h-full bg-gray-700 rounded-full"></div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between px-1">
        <button className="text-gray-600 hover:text-gray-800">
          <Shuffle size={12} />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <SkipBack size={14} />
        </button>
        <button className="w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700">
          <Play size={14} fill="white" />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <SkipForward size={14} />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <Heart size={12} />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <MoreHorizontal size={12} />
        </button>
      </div>
    </div>
  );
};
