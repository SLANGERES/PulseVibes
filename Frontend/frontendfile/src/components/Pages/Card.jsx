import React from "react";
import { Heart, Shuffle, SkipBack, Play, SkipForward, MoreHorizontal } from "lucide-react";

export const Card = ({ song }) => {
  console.log("Song Data:", song); // Debugging log

  if (!song || !song.name || !song.album_cover) {
    return (
      <div className="text-red-500 text-center p-4 border border-red-400 bg-red-100 rounded-md">
        Invalid song data
      </div>
    );
  }

  return (
    <div
      className="bg-pink-200 p-4 rounded-lg w-[280px] h-[480px] mx-auto shadow-lg hover:shadow-2xl hover:translate-y-2 hover:duration-300 cursor-pointer flex flex-col items-center justify-between text-center"
      onClick={() => song.spotify_url && window.open(song.spotify_url, "_blank")}
    >
      {/* Image and Song Info */}
      <div className="flex flex-col items-center">
        <img src={song.album_cover} alt={song.name} className="w-full h-[220px] object-cover rounded-md mb-3" />
        <h2 className="text-lg font-semibold text-gray-800">{song.name}</h2>
        <p className="text-sm text-gray-600">{song.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="w-full px-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>0:00</span>
          <span>3:00</span>
        </div>
        <div className="w-full h-1 bg-gray-300 rounded-full mb-3">
          <div className="w-1/4 h-full bg-gray-700 rounded-full"></div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3">
        <button className="text-gray-600 hover:text-gray-800">
          <Shuffle size={16} />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <SkipBack size={18} />
        </button>
        <button className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700">
          <Play size={20} fill="white" />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <SkipForward size={18} />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <Heart size={16} />
        </button>
        <button className="text-gray-600 hover:text-gray-800">
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
};
