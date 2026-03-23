"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Gamepad2, RotateCcw, Timer, Percent, Zap } from "lucide-react";

// Expandable Tech/Dev Word Bank
const WORD_BANK = [
  "react", "nextjs", "typescript", "javascript", "developer", "function", 
  "variable", "component", "interface", "promise", "async", "await", "return", 
  "import", "export", "class", "object", "array", "string", "number", "boolean",
  "null", "undefined", "console", "window", "document", "html", "css", "style",
  "margin", "padding", "border", "flex", "grid", "position", "relative", 
  "absolute", "fixed", "sticky", "width", "height", "color", "background",
  "font", "text", "align", "justify", "center", "left", "right", "top", "bottom",
  "hover", "focus", "active", "visited", "link", "button", "input", "form",
  "database", "server", "client", "node", "express", "api", "rest", "graphql",
  "query", "mutation", "state", "props", "hook", "effect", "context", "reducer",
  "action", "payload", "store", "dispatch", "subscribe", "provider", "consumer",
  "layout", "page", "route", "link", "image", "script", "meta", "head", "body",
  "div", "span", "paragraph", "heading", "list", "item", "table", "row", "cell"
];

const generateWords = (count: number) => {
  return Array.from({ length: count }, () => WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]).join(" ");
};

const TEST_DURATION = 30; // Seconds

export default function TypingTest() {
  const [text, setText] = useState("");
  const [typed, setTyped] = useState("");
  const [status, setStatus] = useState<"idle" | "playing" | "finished">("idle");
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize test
  const resetTest = useCallback(() => {
    setText(generateWords(80)); // Generate plenty of words
    setTyped("");
    setStatus("idle");
    setTimeLeft(TEST_DURATION);
    setWpm(0);
    setAccuracy(0);
    if (inputRef.current) inputRef.current.focus();
  }, []);

  useEffect(() => {
    resetTest();
  }, [resetTest]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "playing" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && status === "playing") {
      setStatus("finished");
      calculateResults();
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  const calculateResults = useCallback(() => {
    // Basic calculation: Words Per Minute = (total correct chars / 5) / time in minutes
    let correctStrokes = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === text[i]) correctStrokes++;
    }
    
    // Each "word" is standardized as 5 characters in WPM tests
    const grossWpm = (typed.length / 5) / (TEST_DURATION / 60);
    const netWpm = Math.max(0, (correctStrokes / 5) / (TEST_DURATION / 60));
    
    const acc = typed.length > 0 ? (correctStrokes / typed.length) * 100 : 0;
    
    setWpm(Math.round(netWpm));
    setAccuracy(Math.round(acc));
  }, [typed, text]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === "finished") return;
    
    const value = e.target.value;
    setTyped(value);
    
    if (status === "idle" && value.length > 0) {
      setStatus("playing");
    }
    
    // Automatically extend text if getting close to end
    if (value.length > text.length - 20) {
      setText(prev => prev + " " + generateWords(20));
    }
  };

  // Keep input focused when clicking on the test area
  const handleContainerClick = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="flex flex-col min-h-[80vh] w-full max-w-5xl mx-auto mb-12">
      <div className="mb-8 flex items-start mt-4">
        <Link
          href="/"
          className="mr-4 mt-1 p-2 rounded-full hover:bg-white/10 transition-colors inline-flex flex-shrink-0"
        >
          <ArrowLeft className="w-6 h-6 text-slate-300" />
        </Link>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            <Gamepad2 className="w-10 h-10 mr-4 text-emerald-400" />
            Speed Typing Test
          </h1>
          <p className="text-slate-400 text-lg">
            Warm up your fingers, test your Word Per Minute (WPM) speed, and challenge your accuracy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Real-time Stats Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-4">
           {/* Time Box */}
           <div className={`p-6 rounded-3xl backdrop-blur-md shadow-2xl transition-all duration-300 border ${status === 'playing' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/40 border-white/10'}`}>
              <div className="flex items-center text-slate-400 mb-2 font-medium uppercase tracking-wider text-sm">
                 <Timer className="w-4 h-4 mr-2" /> Time Left
              </div>
              <div className={`text-5xl font-mono font-bold ${timeLeft <= 10 && status === 'playing' ? 'text-red-400 animate-pulse' : 'text-white'}`}>
                 {timeLeft}s
              </div>
           </div>

           {/* WPM Box */}
           <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl">
              <div className="flex items-center text-slate-400 mb-2 font-medium uppercase tracking-wider text-sm">
                 <Zap className="w-4 h-4 mr-2 text-yellow-400" /> WPM
              </div>
              <div className="text-5xl font-mono font-bold text-white">
                 {status === "finished" ? wpm : (typed.length > 5 && status === "playing" ? Math.round(((typed.length / 5) / ((TEST_DURATION - timeLeft) / 60))) : "--")}
              </div>
           </div>

           {/* Accuracy Box */}
           <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl">
              <div className="flex items-center text-slate-400 mb-2 font-medium uppercase tracking-wider text-sm">
                 <Percent className="w-4 h-4 mr-2 text-blue-400" /> Accuracy
              </div>
              <div className="text-5xl font-mono font-bold text-white">
                 {status === "finished" ? accuracy : (typed.length > 0 ? Math.round(
                     (Array.from(typed).filter((char, i) => char === text[i]).length / typed.length) * 100
                 ) : "--")}
                 <span className="text-2xl text-slate-500 ml-1">%</span>
              </div>
           </div>

           {/* Restart Button */}
           <button 
             onClick={resetTest}
             tabIndex={-1}
             className="mt-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-medium transition-colors flex items-center justify-center group"
           >
             <RotateCcw className="w-5 h-5 mr-2 group-hover:-rotate-90 transition-transform duration-500" />
             Restart Test (Tab + Enter)
           </button>
        </div>

        {/* Typing Area Main Workspace */}
        <div className="lg:col-span-3 flex flex-col h-full">
           <div 
             ref={containerRef}
             onClick={handleContainerClick}
             className={`relative flex flex-col rounded-3xl bg-black/50 border backdrop-blur-xl overflow-hidden shadow-2xl min-h-[400px] p-8 lg:p-12 cursor-text transition-all duration-300 ${
                isFocused 
                  ? (status === "finished" ? 'border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.1)]' : 'border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)]') 
                  : 'border-white/10'
             }`}
           >
              {/* Blur overlay when not focused or finished */}
              {(!isFocused && status !== "finished") && (
                 <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-20 flex items-center justify-center rounded-3xl">
                    <div className="bg-white/10 border border-white/20 px-8 py-4 rounded-2xl text-white font-medium flex items-center animate-pulse shadow-2xl">
                       <Gamepad2 className="w-6 h-6 mr-3" />
                       Click here or press any key to focus
                    </div>
                 </div>
              )}

              {/* Hidden Input field for mobile/native event handling */}
              <input 
                ref={inputRef}
                type="text"
                value={typed}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={status === "finished"}
                className="absolute opacity-0 -left-[9999px] top-0 pointer-events-none w-[10px] h-[10px]" 
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />

              {/* Text Render */}
              <div className="text-3xl lg:text-4xl font-mono leading-relaxed tracking-wider break-words select-none relative z-10 w-full h-full text-left max-h-[300px] overflow-hidden">
                {status === "finished" ? (
                   <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                      <h2 className="text-5xl font-black text-amber-400 drop-shadow-[0_0_20px_rgba(245,158,11,0.4)]">Test Finished!</h2>
                      <div className="flex gap-12">
                         <div className="flex flex-col items-center">
                            <span className="text-slate-400 text-sm uppercase tracking-[0.2em] font-bold mb-3">WPM Speed</span>
                            <span className="text-7xl font-mono font-black text-white">{wpm}</span>
                         </div>
                         <div className="flex flex-col items-center">
                            <span className="text-slate-400 text-sm uppercase tracking-[0.2em] font-bold mb-3">Accuracy</span>
                            <span className="text-7xl font-mono font-black text-white">{accuracy}<span className="text-4xl opacity-50">%</span></span>
                         </div>
                      </div>
                      <button 
                        onClick={resetTest}
                        className="mt-6 px-10 py-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 rounded-2xl text-white font-bold text-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all flex items-center group transform hover:-translate-y-1"
                      >
                         <RotateCcw className="w-6 h-6 mr-3 group-hover:-rotate-180 transition-transform duration-700" />
                         Play Again
                      </button>
                   </div>
                ) : (
                  <div className="relative inline-block w-full">
                     {/* 
                       Logic for rendering words efficiently to keep smooth 60fps.
                       Instead of mapping every character in the 1000 char string, 
                       we only care about the visible window (typed length +/- visible characters).
                       But modern React handles a few hundred spans easily.
                     */}
                     {Array.from(text).map((char, index) => {
                        let classNames = "transition-all duration-75 ";
                        
                        // Default future character
                        if (index >= typed.length) {
                           classNames += "text-slate-600";
                        } 
                        // Correctly typed past character
                        else if (typed[index] === char) {
                           classNames += "text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]";
                        } 
                        // Incorrectly typed past character
                        else {
                           classNames += "text-red-500 bg-red-500/20";
                        }

                        // Cursor logic (blinking caret acting like Monkeytype)
                        const isCaretPosition = index === typed.length && isFocused;
                        
                        return (
                          <span key={index} className="relative">
                             {isCaretPosition && (
                               <span className="absolute -left-[3px] -top-1 w-[3px] h-[1.2em] bg-emerald-400 animate-pulse drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] z-10 rounded-full"></span>
                             )}
                             <span className={classNames}>{char}</span>
                          </span>
                        );
                     })}
                  </div>
                )}
              </div>
           </div>
           
           <div className="mt-8 text-center text-slate-500 text-sm font-medium">
              Start typing to automatically begin the 30-second countdown.
           </div>
        </div>
      </div>
    </div>
  );
}
