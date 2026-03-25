"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Franky({ message }: { message?: string }) {
  const [mounted, setMounted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const displayMessage = message || "Woof! I'm Franky";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-hide click tooltip after a few seconds
  useEffect(() => {
    if (clicked) {
      const timer = setTimeout(() => setClicked(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [clicked]);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-32 pointer-events-none z-[100] overflow-hidden">
      {/* Container that moves across the screen */}
      <motion.div
        initial={{ x: "-10vw" }}
        animate={{ x: ["-10vw", "110vw", "110vw", "-10vw", "-10vw"] }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.48, 0.5, 0.98, 1],
        }}
        className="absolute top-2 flex flex-col items-center pointer-events-auto cursor-pointer group"
        onClick={() => setClicked(true)}
      >
        <div className="relative flex flex-col items-center">
          
          {/* Magical Glowing Aura */}
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/30 via-purple-500/30 to-indigo-500/30 blur-2xl rounded-full scale-150 animate-pulse" />
          
          {/* Wrapper for flipping the dog's direction */}
          <motion.div
            animate={{ scaleX: [1, 1, -1, -1, 1] }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.48, 0.5, 0.98, 1],
            }}
          >
            {/* Bobbing walking animation (waddle) */}
            <motion.div 
              animate={{ y: [0, -3, 0], rotate: [0, -3, 3, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 drop-shadow-2xl transition-transform group-hover:scale-110 duration-300 relative z-10"
            >
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
                {/* Back Legs / Body hint */}
                <rect x="22" y="32" width="20" height="16" rx="8" fill="#E8C396" />
                
                {/* Ears */}
                <path d="M 16 28 Q 10 10 28 14 Q 24 24 16 28 Z" fill="#2A2A2A" />
                <path d="M 48 28 Q 54 10 36 14 Q 40 24 48 28 Z" fill="#2A2A2A" />
                
                {/* Head Base */}
                <circle cx="32" cy="30" r="18" fill="#E8C396" />
                
                {/* Forehead Wrinkles (Pug signature) */}
                <path d="M 25 17 Q 32 20 39 17" stroke="#D1A775" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 28 21 Q 32 23 36 21" stroke="#D1A775" strokeWidth="2" strokeLinecap="round" fill="none" />
                
                {/* Dark Muzzle / Mask */}
                <path d="M 19 28 Q 32 30 45 28 Q 43 45 32 45 Q 21 45 19 28 Z" fill="#2A2A2A" />
                <ellipse cx="32" cy="37" rx="13" ry="8" fill="#1A1A1A" />
                
                {/* Nose */}
                <ellipse cx="32" cy="33" rx="4" ry="2.5" fill="#000" />
                <path d="M 32 33 Q 32 37 32 39" stroke="#000" strokeWidth="1.5" fill="none" />
                
                {/* Mouth Flaps (Jowls) */}
                <path d="M 26 38 Q 32 43 38 38" stroke="#000" strokeWidth="1.5" fill="none" />
                
                {/* Tongue showing (Panting animation) */}
                <motion.path 
                  animate={{ scaleY: [1, 1.3, 1] }}
                  transition={{ duration: 0.25, repeat: Infinity, ease: "easeInOut" }}
                  style={{ transformOrigin: "50% 39px" }}
                  d="M 30 39 Q 32 48 34 39 Z" 
                  fill="#FF8C9A" 
                />
                
                {/* Bug Eyes (Pug signature) */}
                <circle cx="21" cy="27" r="4.5" fill="#000" />
                <circle cx="22" cy="25.5" r="1.5" fill="#FFF" />
                
                <circle cx="43" cy="27" r="4.5" fill="#000" />
                <circle cx="42" cy="25.5" r="1.5" fill="#FFF" />
              </svg>
            </motion.div>
          </motion.div>
          
          {/* Glassmorphic Premium Tooltip */}
          <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none z-20 ${clicked ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'}`}>
            <div className="relative p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-2xl shadow-purple-500/20">
              <div className="bg-black/80 backdrop-blur-xl px-4 py-2 rounded-[15px] whitespace-nowrap flex items-center space-x-2">
                <span className="text-xl">✨</span>
                <span className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                  {displayMessage}
                </span>
                <span className="text-xl">🐾</span>
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
