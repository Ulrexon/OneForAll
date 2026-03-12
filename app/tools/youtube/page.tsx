"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Youtube, Loader2, Info } from "lucide-react";

export default function YoutubeDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ title: string; formats: any[] } | null>(null);

  const handleFetch = async () => {
    if (!url.trim() || !url.includes("youtube.com") && !url.includes("youtu.be")) {
      setError("Please enter a valid YouTube URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(`/api/youtube?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch video information.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-indigo-500 flex items-center">
            YouTube Downloader <Youtube className="ml-3 w-8 h-8 text-red-500" />
          </h1>
          <p className="text-slate-400 mt-2">
            Fetch high-quality video links directly from YouTube.
          </p>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError(""); // Clear error on change
            }}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-grow bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/30 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all text-lg"
          />
          <button
            onClick={handleFetch}
            disabled={loading || !url}
            className="md:w-48 py-4 rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-bold text-lg shadow-lg shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Fetch Options"}
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center">
            <Info className="w-5 h-5 mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Note block since actual ytdl downloads are heavily rate limited/blocked on browsers directly without proxy */}
        <div className="mt-8 bg-blue-900/20 border border-blue-500/20 p-6 rounded-2xl">
            <h3 className="text-blue-400 font-semibold mb-2 flex items-center"><Info className="w-5 h-5 mr-2"/> Disclaimer</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
               This tool relies on scraping techniques to fetch raw media streams. YouTube frequently updates their backend which can cause fetching libraries (`ytdl-core`) to fail. If a download does not initiate, it's likely due to temporary IP blocks by YouTube's CDNs.
            </p>
        </div>

        {result && (
          <div className="mt-8 border-t border-white/10 pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-2xl font-bold text-white mb-6 bg-black/30 w-fit px-4 py-2 rounded-lg border border-white/5">
                {result.title}
             </h2>
             
             <div className="space-y-4">
                {result.formats.map((format, idx) => (
                   <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-red-500/30 transition-colors">
                      <div className="flex items-center space-x-6 mb-4 sm:mb-0 w-full sm:w-auto">
                         <div className="bg-black/50 px-3 py-1.5 rounded-md border border-white/5 text-sm font-mono text-indigo-300">
                             {format.qualityLabel || "Audio Only"}
                         </div>
                         <div className="text-slate-400 text-sm">
                             {format.container} • {format.hasVideo ? "Video + Audio" : "Audio Only"}
                         </div>
                      </div>
                      
                      <a
                        href={format.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/40 hover:text-white transition-all flex items-center justify-center font-medium"
                      >
                         <Download className="w-4 h-4 mr-2" /> Download
                      </a>
                   </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
