import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Service } from './Service';
import { Header } from './Header';

export const Section = () => {
  const targetSection = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const handleScroll = () => {
    if (targetSection.current) {
      targetSection.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  return (
    <div className='bg-black'>
      <Header />
      <div
        id="mainText"
        className="relative w-full min-h-screen bg-black text-white overflow-hidden flex items-center justify-center py-20"
      >
        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-10 animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-5 animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-40 h-40 bg-pink-400 rounded-full filter blur-3xl opacity-5 animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
        </div>
        
        {/* Content with enhanced animations */}
        <div className="relative z-10 px-6">
          <motion.div
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-purple-600 relative">
              PulseVibe
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-r from-blue-400 to-purple-600 blur-3xl opacity-20 -z-10"></div>
            </span>
          </motion.div>
          
          <motion.div
            className="text-2xl md:text-4xl lg:text-5xl text-blue-400 mb-16 font-light"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            Your emotions know how to vibe
          </motion.div>
          
          <motion.button
            onClick={handleScroll}
            className="group flex items-center justify-center gap-2 mx-auto text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full hover:shadow-lg hover:shadow-blue-900/30 transition-all duration-300 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            <span className="relative z-10">Get Started</span>
            <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform relative z-10" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </div>
        
        {/* Enhanced animated scroll indicator */}
        {isLoaded && (
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
            <div className="w-1 h-12 bg-gradient-to-b from-blue-400 to-transparent rounded-full"></div>
            <span className="text-blue-400 text-sm mt-2 font-light tracking-wider">Scroll down</span>
          </div>
        )}
      </div>
      
      <Service ref={targetSection} />
    </div>
  );
};

export default Section;