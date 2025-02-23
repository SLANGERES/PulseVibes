import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const container = useRef(null);
  const navigate = useNavigate();

  const handleContribution = () => {
    window.open('https://github.com/SLANGERES/PulseVibes', '_blank');
  };

  useEffect(() => {
    if (container.current) {
      gsap.fromTo(
        container.current,
        { y: -100, opacity: 0 }, // Initial state
        { duration: 1, y: 0, opacity: 1 } // Final state
      );
    }
  }, []);

  return (
    <div
      ref={container}
      className="flex h-16 w-full items-center mt-4 justify-between rounded-full border shadow-xl ml-2 mr-2"
    >
      <div className="pl-7 w-fit">
        <h1 className="text-3xl">PulseVibe</h1>
      </div>
      <div className="flex space-x-10 w-fit pr-8">
        <span className="cursor-pointer hover:text-sky-700">About</span>
        <span className="cursor-pointer hover:text-sky-700" onClick={() => navigate("/getsong")}>Find Song</span>
        <span className="cursor-pointer hover:text-sky-700">Guide</span>
        <span className="cursor-pointer hover:text-sky-700" onClick={handleContribution}>Contribute</span>
      </div>
    </div>
  );
};
