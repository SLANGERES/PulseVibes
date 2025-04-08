import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "./Card"; 
import { ArrowLeft, ArrowRight } from "lucide-react";

export const GetSongs = () => {
  const location = useLocation();
  const { emotion, recommendations } = location.state || { emotion: "", recommendations: [] };
  const scrollRef = useRef(null);

  useEffect(() => {
    console.log("📩 Received state:", location.state);
  }, [location.state]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center p-10 bg-gray-100">
      <h1 className="text-4xl font-bold mb-5 text-center">Suggested Songs </h1>

      {Array.isArray(recommendations) && recommendations.length > 0 ? (
        <div className="relative w-full h-[600px] flex items-center">
          <button 
            className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 z-20"
            onClick={scrollLeft}
          >
            <ArrowLeft size={32} />
          </button>

          <div 
            ref={scrollRef} 
            className="w-full h-full overflow-x-auto flex space-x-8 px-16 scrollbar-hide snap-x snap-mandatory"
          >
            {recommendations.map((song, index) => (
              <div key={index} className="snap-center">
                <Card song={song} />
              </div>
            ))}
          </div>

          <button 
            className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700 z-20"
            onClick={scrollRight}
          >
            <ArrowRight size={32} />
          </button>
        </div>
      ) : (
        <p className="text-lg text-gray-600">No recommendations available.</p>
      )}
    </div>
  );
};
