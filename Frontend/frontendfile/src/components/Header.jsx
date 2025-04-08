import React, { useRef, useEffect, useState } from 'react'; 
import { useNavigate } from "react-router-dom"; 
import { Github, Music, BookOpen, Info } from "lucide-react";  

export const Header = () => {
  const container = useRef(null);
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  
  const handleContribution = () => {
    window.open('https://github.com/SLANGERES/PulseVibes', '_blank');
  };
  
  useEffect(() => {
    if (container.current) {
      container.current.style.opacity = "0";
      container.current.style.transform = "translateY(-20px)";
      
      setTimeout(() => {
        container.current.style.opacity = "1";
        container.current.style.transform = "translateY(0)";
      }, 100);
    }
  }, []);
  
  const navItems = [
    { name: "About", icon: <Info size={18} />, action: () => {} },
    { name: "Find Song", icon: <Music size={18} />, action: () => navigate("/getsong") },
    { name: "Guide", icon: <BookOpen size={18} />, action: () => {} },
    { name: "Contribute", icon: <Github size={18} />, action: handleContribution }
  ];
  
  return (
    <div className="px-4 py-6 w-full bg-black">
      <div
        ref={container}
        className="flex h-16 w-full items-center justify-between px-6 rounded-full backdrop-blur-sm bg-black/80 border border-gray-800 shadow-lg transition-all duration-500 hover:shadow-blue-900/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center relative group">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-md opacity-40 group-hover:opacity-60 transition-opacity"></div>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 tracking-tight">
            PulseVibe
          </h1>
        </div>
        
        <div className="flex items-center">
          <nav className="flex gap-1 md:gap-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                onMouseEnter={() => setActiveItem(index)}
                onMouseLeave={() => setActiveItem(null)}
                className="relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 hover:bg-gray-900"
              >
                <span className={`${activeItem === index ? 'text-blue-400 scale-110' : 'text-gray-400'} transition-all duration-200`}>
                  {item.icon}
                </span>
                <span className={`hidden md:block font-medium ${activeItem === index ? 'text-blue-400' : 'text-gray-300'}`}>
                  {item.name}
                </span>
                {activeItem === index && (
                  <span className="absolute bottom-0 left-0 right-0 mx-auto w-1/2 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  ); 
};