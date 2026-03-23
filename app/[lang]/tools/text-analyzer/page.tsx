"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Hash, Clock, Copy, Check } from "lucide-react";
import { useDictionary } from "../../DictionaryProvider";

export default function TextAnalyzer() {
  const dict = useDictionary();
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Analytics Logic
  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    // Split by whitespace, filter out empty strings
    const wordsArray = text.trim().split(/\s+/).filter(w => w.length > 0);
    const words = wordsArray.length;
    
    // Split by 2+ newlines for paragraphs
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (text.length > 0 ? 1 : 0);
    
    // Reading time (assume 250 words per minute)
    const readingTimeMins = words / 250;
    const readingTime = readingTimeMins > 0 && readingTimeMins < 1 
      ? "< 1"
      : `${Math.round(readingTimeMins)}`;

    // Keyword density extraction (simple)
    const stopWords = new Set(["the", "and", "a", "an", "in", "on", "at", "to", "for", "of", "with", "is", "are", "was", "were", "it", "this", "that", "el", "la", "los", "las", "un", "una", "en", "por", "para", "con", "de", "que", "se", "del", "al", "su", "lo"]);
    const wordCounts: Record<string, number> = {};
    
    wordsArray.forEach(w => {
      const cleanWord = w.toLowerCase().replace(/[^a-z0-9áéíóúüñ]/g, "");
      if (cleanWord.length > 2 && !stopWords.has(cleanWord)) {
        wordCounts[cleanWord] = (wordCounts[cleanWord] || 0) + 1;
      }
    });

    const topKeywords = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({ word, count, percentage: ((count / Math.max(words, 1)) * 100).toFixed(1) }));

    return { chars, charsNoSpaces, words, paragraphs, readingTime, topKeywords };
  }, [text]);

  // Case conversions
  const handleCase = (type: "upper" | "lower" | "title") => {
    if (type === "upper") setText(text.toUpperCase());
    if (type === "lower") setText(text.toLowerCase());
    if (type === "title") {
      setText(
        text.toLowerCase().split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      );
    }
  };

  const clearText = () => setText("");

  const copyText = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
            <FileText className="w-10 h-10 mr-4 text-orange-400" />
            {dict.dashboard.tools.textAnalyzer.title}
          </h1>
          <p className="text-slate-400 text-lg">
            {dict.dashboard.tools.textAnalyzer.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Area */}
        <div className="lg:col-span-2 flex flex-col gap-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold text-white/90">Content</h2>
            <div className="flex space-x-2">
              <button onClick={() => handleCase('upper')} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-slate-300 transition-colors uppercase border border-white/5">AA</button>
              <button onClick={() => handleCase('lower')} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-slate-300 transition-colors lowercase border border-white/5">aa</button>
              <button onClick={() => handleCase('title')} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-semibold text-slate-300 transition-colors capitalize border border-white/5">Aa</button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={dict.tools.text.placeholder}
            className="w-full h-[400px] lg:h-[500px] bg-black/50 border border-white/10 rounded-2xl p-6 text-white text-lg leading-relaxed focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 resize-none transition-all placeholder:text-white/20 shadow-inner"
          />
          <div className="flex justify-between items-center mt-2">
            <button 
              onClick={clearText}
              className="text-red-400 hover:text-red-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-500/10 transition-colors"
            >
              {dict.tools.text.clear}
            </button>
            <button
              onClick={copyText}
              disabled={!text}
              className="flex items-center px-6 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 hover:from-orange-500/30 hover:to-red-500/30 text-orange-400 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:grayscale"
            >
              {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="flex flex-col gap-6">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-full">
            <h3 className="text-xl font-medium text-white mb-6 border-b border-white/10 pb-4">
              Real-time Statistics
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center transition-transform hover:scale-105">
                <span className="block text-3xl font-bold text-orange-400 mb-1">{stats.words}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{dict.tools.text.words}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center transition-transform hover:scale-105">
                <span className="block text-3xl font-bold text-orange-400 mb-1">{stats.chars}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{dict.tools.text.chars}</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center transition-transform hover:scale-105">
                <span className="block text-3xl font-bold text-orange-400 mb-1">{stats.charsNoSpaces}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">No Spaces</span>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center transition-transform hover:scale-105">
                <span className="block text-3xl font-bold text-orange-400 mb-1">{stats.paragraphs}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Paragraphs</span>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between mb-8 shadow-inner">
              <div className="flex items-center text-orange-300 font-medium">
                <Clock className="w-5 h-5 mr-3 opacity-80" /> {dict.tools.text.readingTime}
              </div>
              <span className="text-orange-400 font-bold text-lg">{stats.readingTime} {dict.tools.text.minutes}</span>
            </div>

            <div className="flex-grow bg-white/5 rounded-2xl p-5 border border-white/5">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center pb-2 border-b border-white/10">
                <Hash className="w-4 h-4 mr-2 text-orange-400" /> {dict.tools.text.keywordDensity}
              </h4>
              
              {stats.topKeywords.length > 0 ? (
                <div className="space-y-3">
                  {stats.topKeywords.map((kw, i) => (
                    <div key={i} className="flex items-center justify-between text-sm group">
                      <span className="text-slate-200 font-medium max-w-[120px] truncate group-hover:text-white transition-colors">{kw.word}</span>
                      <div className="flex items-center space-x-3 text-slate-400 font-mono text-xs">
                        <span className="text-orange-300/80">{kw.count}x</span>
                        <span className="w-10 text-right opacity-50">{kw.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Start typing to extract keywords.
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
