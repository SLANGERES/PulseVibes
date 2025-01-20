import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Service } from './Service';

export const Section = () => {
  const container = useRef(null);
  const targetSection = useRef(null);  // Correctly define the ref

  const handleScroll = () => {
    // Scroll to the target section smoothly
    if (targetSection.current) {
      targetSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
    <>
      <div
        ref={container}
        id="mainText"
        className="overflow-hidden opacity-0 max-w-full w-full h-screen flex justify-center text-center mx-auto flex-col"
      >
        <div className="text-9xl">PulseVibe</div>
        <div className="grid grid-flow-row text-8xl text-blue-600 mb-24">
          Your Emotion know how to vibe
        </div>
        <button 
          onClick={handleScroll} 
          className="text-xl justify-center w-48 border ml-[740px] p-4 rounded-full hover:shadow-2xl"
        >
          Get Started
        </button>
      </div>

      {/* Correctly attach the ref to the Service component */}
      <Service ref={targetSection} />
    </>
  );
};
