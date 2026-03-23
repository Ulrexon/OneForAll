"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { useDictionary } from "../../DictionaryProvider";

export default function Base64Converter() {
  const dict = useDictionary();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleProcess = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (err) {
      setError("Invalid input for Base64 decoding.");
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-[80vh] w-full max-w-5xl mx-auto">
      <div className="mb-8 flex items-center">
        <Link
          href="/"
          className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors inline-block"
        >
          <ArrowLeft className="w-6 h-6 text-slate-300" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            {dict.dashboard.tools.base64.title}
          </h1>
          <p className="text-slate-400 mt-2">
            {dict.dashboard.tools.base64.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white/90">Input</h2>
            <div className="flex bg-black/50 rounded-lg p-1 border border-white/5">
              <button
                onClick={() => setMode("encode")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === "encode"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {dict.tools.base64.encode}
              </button>
              <button
                onClick={() => setMode("decode")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  mode === "decode"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {dict.tools.base64.decode}
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 bg-black/50 border border-white/10 rounded-xl p-4 text-white font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 resize-none transition-all placeholder:text-white/20"
            placeholder={dict.tools.base64.inputPlaceholder}
          />
          <button
            onClick={handleProcess}
            disabled={!input}
            className="mt-6 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            {mode === "encode" ? dict.tools.base64.encode : dict.tools.base64.decode}
          </button>
        </div>

        <div className="flex flex-col h-full mt-8 lg:mt-0">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white/90">Output</h2>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{dict.tools.base64.copy}</span>
                </>
              )}
            </button>
          </div>
          <div className="relative w-full h-64">
            <textarea
              readOnly
              value={output}
              className={`w-full h-full bg-black/50 border ${
                error ? "border-red-500/50" : "border-white/10"
              } rounded-xl p-4 text-white font-mono focus:outline-none resize-none transition-all`}
              placeholder={dict.tools.base64.outputPlaceholder}
            />
            {error && (
              <div className="absolute top-4 right-4 bg-red-500/10 text-red-400 px-3 py-1 rounded-md text-sm border border-red-500/20">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
