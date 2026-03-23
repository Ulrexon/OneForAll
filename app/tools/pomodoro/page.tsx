"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, Coffee, Brain, Timer } from "lucide-react";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroZen() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"work" | "break">("work");
  
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // --- Timer Logic ---
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Optional: Play a bell sound here natively
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const switchMode = (newMode: "work" | "break") => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === "work" ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // --- AudioContext Algorithmic Brown Noise Generator ---
  // Brown noise represents deep, rumbly static similar to an airplane cabin or heavy rain.
  const initEngine = useCallback(() => {
    if (!audioCtxRef.current) {
       const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
       audioCtxRef.current = new AudioContextClass();
    }
  }, []);

  const playBrownNoise = useCallback(() => {
    if (!audioCtxRef.current) initEngine();
    const ctx = audioCtxRef.current!;
    
    // Resume context if browser suspended it
    if (ctx.state === 'suspended') ctx.resume();

    // Create a buffer for the noise (2 seconds loop)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Math to generate Brown Noise (integrating white noise)
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // Compensate for gain loss
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to make it warmer
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;

    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noiseSource.start();

    noiseNodeRef.current = noiseSource;
    gainNodeRef.current = gainNode;
  }, [initEngine, volume]);

  const stopNoise = useCallback(() => {
    if (noiseNodeRef.current) {
        noiseNodeRef.current.stop();
        noiseNodeRef.current.disconnect();
        noiseNodeRef.current = null;
    }
  }, []);

  // Sync sound state with UI
  useEffect(() => {
    if (soundEnabled) {
       playBrownNoise();
    } else {
       stopNoise();
    }
    return () => stopNoise(); // Cleanup on unmount
  }, [soundEnabled, playBrownNoise, stopNoise]);

  // Sync volume natively
  useEffect(() => {
    if (gainNodeRef.current) {
       // Smooth volume transition to prevent popping
       gainNodeRef.current.gain.setTargetAtTime(volume, audioCtxRef.current!.currentTime, 0.1);
    }
  }, [volume]);


  return (
    <div className="flex flex-col min-h-[80vh] w-full max-w-4xl mx-auto mb-12">
      <div className="mb-8 flex items-start mt-4">
        <Link
          href="/"
          className="mr-4 mt-1 p-2 rounded-full hover:bg-white/10 transition-colors inline-flex flex-shrink-0"
        >
          <ArrowLeft className="w-6 h-6 text-slate-300" />
        </Link>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
            <Timer className="w-10 h-10 mr-4 text-rose-400" />
            Zen Pomodoro
          </h1>
          <p className="text-slate-400 text-lg">
            Immerse yourself in deep work with our algorithmic brown noise generator.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full min-h-[500px]">
        
        {/* Timer Box */}
        <div className={`relative rounded-3xl p-8 lg:p-12 border overflow-hidden flex flex-col items-center justify-center shadow-2xl transition-colors duration-1000 ${
           mode === "work" 
              ? "bg-[#1f1118]/80 border-rose-500/20 shadow-rose-500/10" 
              : "bg-[#111f1c]/80 border-teal-500/20 shadow-teal-500/10"
        } backdrop-blur-xl`}>
           
           {/* Ambient Breathing Glow */}
           <div className={`absolute inset-0 opacity-20 filter blur-[80px] pointer-events-none rounded-full transition-colors duration-1000 ${isRunning ? "animate-pulse" : ""} ${
              mode === "work" ? "bg-rose-500" : "bg-teal-500"
           }`}></div>

           <div className="relative z-10 flex bg-black/40 p-1 rounded-2xl mb-12 border border-white/5">
              <button 
                onClick={() => switchMode("work")}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center ${mode === "work" ? "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-lg" : "text-slate-500 hover:text-white"}`}
              >
                 <Brain className="w-4 h-4 mr-2" />
                 Deep Work
              </button>
              <button 
                 onClick={() => switchMode("break")}
                 className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center ${mode === "break" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-lg" : "text-slate-500 hover:text-white"}`}
              >
                 <Coffee className="w-4 h-4 mr-2" />
                 Short Break
              </button>
           </div>

           <div className={`text-8xl md:text-[140px] font-black font-mono tracking-tighter transition-all mb-12 relative z-10 ${
              mode === "work" ? "text-rose-100" : "text-teal-100"
           } drop-shadow-2xl`}>
              {formatTime(timeLeft)}
           </div>

           <div className="flex gap-6 relative z-10">
              <button 
                 onClick={toggleTimer}
                 className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${
                    mode === "work" 
                       ? "bg-gradient-to-br from-rose-500 to-orange-500 text-white shadow-rose-500/20 hover:shadow-rose-500/40" 
                       : "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-teal-500/20 hover:shadow-teal-500/40"
                 }`}
              >
                 {isRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
              </button>

              <button 
                 onClick={() => switchMode(mode)}
                 className="w-20 h-20 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-all hover:-rotate-90 active:scale-95 shadow-xl"
                 title="Reset Timer"
              >
                 <RotateCcw className="w-8 h-8" />
              </button>
           </div>
        </div>

        {/* Focus Audio Control Box */}
        <div className="flex flex-col gap-6">
           <div className="bg-black/40 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-2xl h-full flex flex-col justify-center">
              
              <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                 <div>
                    <h3 className="text-xl font-bold text-white flex items-center">
                       Ambient Focus Sound
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Deep rumbly brown noise for extreme concentration.</p>
                 </div>
                 
                 <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-95 ${
                       soundEnabled 
                          ? "bg-rose-500/20 border border-rose-500/40 text-rose-400" 
                          : "bg-white/5 border border-white/10 text-slate-500 hover:text-white"
                    }`}
                 >
                    {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                 </button>
              </div>

              <div className={`transition-opacity duration-500 ${soundEnabled ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
                 <div className="flex justify-between items-center text-sm font-medium mb-4">
                    <span className="text-slate-400 uppercase tracking-widest text-xs font-bold">Volume</span>
                    <span className="text-rose-400 font-mono">{Math.round(volume * 100)}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume} 
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer"
                    style={{
                       backgroundImage: `linear-gradient(to right, #f43f5e ${volume * 100}%, transparent ${volume * 100}%)`
                    }}
                 />

                 <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-slate-400 text-sm leading-relaxed">
                       <strong className="text-white">Why Brown Noise?</strong><br/>
                       Unlike harsh upper-frequency white noise, brown noise algorithms lower the higher frequencies, producing a deep, warm rumble. It's scientifically proven to mask background chatter and improve focal retention.
                    </p>
                 </div>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}
