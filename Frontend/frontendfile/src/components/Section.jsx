import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export const Section = () => {
  const container = useRef(null);

  useEffect(() => {
    if (container.current) {
      gsap.fromTo(
        container.current,
        { y: -100, opacity: 0 }, // Initial state
        { duration: 1, y: -10, opacity: 1 } // Final state
      );
    }
  }, []);

  return (
    <div
      ref={container}
      id="mainText"
      className="overflow-hidden opacity-0 max-w-full w-full h-screen flex justify-center text-center mx-auto flex-col"
    >
      <h1 className="grid grid-flow-row text-8xl text-blue-600">
        PulseVibe Your Emotion know how to vibe
      </h1>
    </div>
  );
};
