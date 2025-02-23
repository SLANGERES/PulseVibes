import React from "react";
import { useLocation } from "react-router-dom";
import { Card } from "./Card"; // Import the Card component

export const GetSongs = () => {
  const location = useLocation();
  const { emotion, recommendations } = location.state || { emotion: "", recommendations: [] };

  return (
    <div className="w-full h-screen flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-5">Detected Emotion: {emotion}</h1>
      
      <h2 className="text-2xl mb-4">Recommended Songs</h2>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((song, index) => (
            <Card key={index} song={song} />
          ))}
        </div>
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
};
