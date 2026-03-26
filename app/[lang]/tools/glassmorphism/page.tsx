"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sliders, Copy, Check, Code2, MousePointer2 } from "lucide-react";
import { useDictionary } from "../../DictionaryProvider";

export default function GlassmorphismGenerator() {
  const dict = useDictionary();
  const [blur, setBlur] = useState(10);
  const [opacity, setOpacity] = useState(0.2);
  const [outline, setOutline] = useState(0.3);
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");
  
  const [copied, setCopied] = useState(false);

  // Computed CSS Strings based on light/dark theme preference
  const rgbBase = colorMode === "light" ? "255, 255, 255" : "0, 0, 0";
  const shadowBase = colorMode === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(0, 0, 0, 0.5)";

  const cssObject = {
    background: `rgba(${rgbBase}, ${opacity})`,
    borderRadius: `16px`,
    boxShadow: `0 4px 30px ${shadowBase}`,
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    border: `1px solid rgba(${rgbBase}, ${outline})`
  };

  const cssCode = `/* CSS Glassmorphism */
background: rgba(${rgbBase}, ${opacity});
border-radius: 16px;
box-shadow: 0 4px 30px ${shadowBase};
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(${rgbBase}, ${outline});`;

  const tailwindCode = `/* Tailwind CSS (Approximate) */
<div className="${colorMode === 'light' ? 'bg-white' : 'bg-black'}/${Math.round(opacity * 100)} backdrop-blur-[${blur}px] border border-${colorMode === 'light' ? 'white' : 'black'}/${Math.round(outline * 100)} shadow-lg rounded-2xl">
  Content
</div>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-[80vh] w-full max-w-6xl mx-auto mb-12">
      <div className="mb-8 flex items-start mt-4">
        <Link
          href="/"
          className="mr-4 mt-1 p-2 rounded-full hover:bg-white/10 transition-colors inline-flex flex-shrink-0"
        >
          <ArrowLeft className="w-6 h-6 text-slate-300" />
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center flex-wrap gap-2 sm:gap-4 text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400">
            <Sliders className="w-8 h-8 sm:w-10 sm:h-10 text-sky-400 shrink-0" />
            <span className="leading-tight">{dict.dashboard.tools.glassmorphism.title}</span>
          </h1>
          <p className="text-slate-400 text-lg">
            {dict.dashboard.tools.glassmorphism.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-grow h-full">
        
        {/* Interactive Preview Canvas */}
        <div className="relative rounded-3xl overflow-hidden min-h-[400px] lg:min-h-[600px] border border-white/10 shadow-2xl flex items-center justify-center p-8 group w-full bg-[#0f172a]">
          
          {/* Ambient Background Blobs for Visual Context */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
             {/* Giant Magenta Blob */}
             <div className="absolute w-[400px] h-[400px] bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[100px] opacity-70 top-0 left-0 animate-blob"></div>
             {/* Giant Cyan Blob */}
             <div className="absolute w-[400px] h-[400px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] opacity-70 top-20 right-0 animate-blob animation-delay-2000"></div>
             {/* Giant Indigo Blob */}
             <div className="absolute w-[400px] h-[400px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-70 -bottom-20 left-20 animate-blob animation-delay-4000"></div>
          </div>

          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
          ></div>

          {/* The Glass Component Subject */}
          <div 
            className="relative z-10 w-full max-w-sm h-80 lg:w-96 lg:h-96 flex flex-col items-center justify-center p-8 transition-all duration-300 hover:scale-105 cursor-pointer"
            style={cssObject}
            onClick={handleCopy}
            title="Click to copy CSS!"
          >
             <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-6 shadow-inner border border-white/10">
                <MousePointer2 className={`w-8 h-8 ${colorMode === 'light' ? 'text-white' : 'text-slate-900'} opacity-80`} />
             </div>
             <h3 className={`text-2xl font-bold mb-2 ${colorMode === 'light' ? 'text-white' : 'text-slate-900'} drop-shadow-md`}>Glassmorphism</h3>
             <p className={`text-sm text-center font-medium ${colorMode === 'light' ? 'text-white/80' : 'text-slate-900/80'}`}>
                Extremely smooth frosted glass CSS component ready for your UI.
             </p>
          </div>
        </div>

        {/* Controls & Export Panel */}
        <div className="flex flex-col gap-6">
          <div className="p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl h-full flex flex-col">
            <h2 className="text-xl font-semibold text-white mb-8 flex items-center border-b border-white/10 pb-4">
              <Sliders className="w-5 h-5 mr-3 text-sky-400" /> Control Panel
            </h2>

            {/* Sliders */}
            <div className="space-y-8 flex-grow">
               
               <div>
                  <div className="flex justify-between text-sm mb-3">
                     <label className="text-slate-300 font-medium">{dict.tools.glass.blur}</label>
                     <span className="text-white font-mono">{blur}</span>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max="40" 
                     step="1" 
                     value={blur} 
                     onChange={(e) => setBlur(parseInt(e.target.value))}
                     className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                     style={{
                        backgroundImage: `linear-gradient(to right, #38bdf8 ${(blur / 40) * 100}%, transparent ${(blur / 40) * 100}%)`
                     }}
                  />
               </div>

               <div>
                  <div className="flex justify-between text-sm mb-3">
                     <label className="text-slate-300 font-medium">{dict.tools.glass.opacity}</label>
                     <span className="text-white font-mono">{opacity}</span>
                  </div>
                  <input 
                     type="range" 
                     min="0.01" 
                     max="1" 
                     step="0.01" 
                     value={opacity} 
                     onChange={(e) => setOpacity(parseFloat(e.target.value))}
                     className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                     style={{
                        backgroundImage: `linear-gradient(to right, #38bdf8 ${opacity * 100}%, transparent ${opacity * 100}%)`
                     }}
                  />
               </div>

               <div>
                  <div className="flex justify-between text-sm mb-3">
                     <label className="text-slate-300 font-medium">{dict.tools.glass.outline}</label>
                     <span className="text-white font-mono">{outline}</span>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max="1" 
                     step="0.01" 
                     value={outline} 
                     onChange={(e) => setOutline(parseFloat(e.target.value))}
                     className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                     style={{
                        backgroundImage: `linear-gradient(to right, #38bdf8 ${outline * 100}%, transparent ${outline * 100}%)`
                     }}
                  />
               </div>

               <div>
                  <label className="text-slate-300 font-medium block mb-3 text-sm">{dict.tools.glass.color}</label>
                  <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 w-full relative z-10 overflow-hidden">
                     <div 
                       className="absolute inset-y-1 bg-white/10 rounded-lg transition-all duration-300 pointer-events-none" 
                       style={{ 
                         width: 'calc(50% - 4px)', 
                         left: colorMode === 'light' ? '4px' : 'calc(50%)' 
                       }}
                     />
                     <button
                        onClick={() => setColorMode("light")}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors relative z-10 ${
                           colorMode === "light" ? "text-white" : "text-slate-500 hover:text-white/80"
                        }`}
                     >
                        Light / White
                     </button>
                     <button
                        onClick={() => setColorMode("dark")}
                        className={`flex-1 py-3 text-sm font-semibold transition-colors relative z-10 ${
                           colorMode === "dark" ? "text-white" : "text-slate-500 hover:text-white/80"
                        }`}
                     >
                        Dark / Black
                     </button>
                  </div>
               </div>
            </div>

            {/* Live Code Output */}
            <div className="mt-8 border-t border-white/10 pt-6">
               <div className="flex justify-between items-end mb-3">
                 <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center">
                   <Code2 className="w-4 h-4 mr-2" /> Output CSS
                 </h3>
                 <button
                   onClick={handleCopy}
                   className="flex items-center text-xs font-bold bg-sky-500/20 hover:bg-sky-500/30 text-sky-400 px-4 py-2 rounded-lg transition-colors"
                 >
                   {copied ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                   {copied ? dict.tools.glass.copied : dict.tools.glass.copy}
                 </button>
               </div>
               <pre className="p-4 rounded-xl bg-black/60 border border-white/5 text-[13px] leading-relaxed font-mono text-emerald-300 overflow-x-auto shadow-inner">
                 <code>{cssCode}</code>
               </pre>
               <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 text-[12px] leading-relaxed font-mono text-slate-400 overflow-x-auto">
                 <span className="text-sky-400 opacity-60">/* Tailwind Equivalent Approximation */</span><br/>
                 <code>{tailwindCode.replace('/* Tailwind CSS (Approximate) */\n', '')}</code>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
