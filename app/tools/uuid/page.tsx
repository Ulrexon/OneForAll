"use client";

import { useState } from "react";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, Copy, Check, RefreshCw, Hash } from "lucide-react";

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(5);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generateUuids = () => {
    const newUuids = Array.from({ length: Math.min(Math.max(1, count), 100) }, () => uuidv4());
    setUuids(newUuids);
  };

  const copySingle = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyAll = async () => {
    if (uuids.length === 0) return;
    await navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-[80vh] w-full max-w-4xl mx-auto">
      <div className="mb-8 flex items-center">
        <Link
          href="/"
          className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors inline-block"
        >
          <ArrowLeft className="w-6 h-6 text-slate-300" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 flex items-center">
            UUID Generator <Hash className="ml-3 w-8 h-8 text-amber-400" />
          </h1>
          <p className="text-slate-400 mt-2">
            Generate cryptographically secure v4 UUIDs instantly.
          </p>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-10 shadow-2xl flex flex-col">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-8 border-b border-white/10 gap-4">
           <div className="flex items-center space-x-4 w-full sm:w-auto">
              <label htmlFor="count" className="text-white/80 font-medium whitespace-nowrap">
                 How many?
              </label>
              <input
                 id="count"
                 type="number"
                 min="1"
                 max="100"
                 value={count}
                 onChange={(e) => setCount(Number(e.target.value))}
                 className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white font-mono focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 w-24 text-center"
              />
              <span className="text-sm text-slate-500 hidden md:inline">Max 100</span>
           </div>
           
           <button
              onClick={generateUuids}
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
           >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate
           </button>
        </div>

        {/* Results */}
        <div className="flex flex-col flex-grow min-h-[300px]">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white/90">
                 {uuids.length > 0 ? `${uuids.length} Generated UUIDs` : "Ready to generate"}
              </h2>
              {uuids.length > 0 && (
                 <button
                    onClick={copyAll}
                    className="flex items-center space-x-2 text-sm text-amber-400 hover:text-amber-300 transition-colors"
                 >
                    {copiedAll ? (
                       <>
                          <Check className="w-4 h-4" />
                          <span>All Copied!</span>
                       </>
                    ) : (
                       <>
                          <Copy className="w-4 h-4" />
                          <span>Copy All</span>
                       </>
                    )}
                 </button>
              )}
           </div>

           {uuids.length === 0 ? (
              <div className="flex flex-col items-center justify-center flex-grow bg-black/30 border border-white/5 rounded-2xl border-dashed">
                 <Hash className="w-16 h-16 text-white/5 mb-4" />
                 <p className="text-slate-500">Click generate to create UUIDs</p>
              </div>
           ) : (
              <div className="bg-black/30 border border-white/5 rounded-2xl p-2 overflow-y-auto max-h-[500px]">
                 <ul className="space-y-2">
                    {uuids.map((uuid, idx) => (
                       <li 
                          key={idx} 
                          className="flex justify-between items-center group px-4 py-3 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
                       >
                          <span className="font-mono text-amber-100 text-sm md:text-base tracking-wider">{uuid}</span>
                          <button
                             onClick={() => copySingle(uuid, idx)}
                             className="text-slate-500 hover:text-amber-400 transition-colors p-2 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100"
                             aria-label="Copy UUID"
                          >
                             {copiedIndex === idx ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                          </button>
                       </li>
                    ))}
                 </ul>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
