"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Beaker, CheckCircle, AlertTriangle } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "valid" | "invalid">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const formatJson = (spaces: number = 2) => {
    try {
      if (!input.trim()) return;
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, spaces));
      setStatus("valid");
      setErrorMessage("");
    } catch (error: any) {
      setStatus("invalid");
      setErrorMessage(error.message || "Invalid JSON syntax");
    }
  };

  const minifyJson = () => {
    formatJson(0);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-[80vh] w-full max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            href="/"
            className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors inline-block"
          >
            <ArrowLeft className="w-6 h-6 text-slate-300" />
          </Link>
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
              JSON Formatter
            </h1>
            <p className="text-slate-400 mt-2">
              Format, validate, and minify your JSON data structures.
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="hidden sm:flex items-center space-x-2 bg-black/50 border border-white/10 rounded-full px-4 py-2">
            {status === "idle" && <Beaker className="w-5 h-5 text-slate-400" />}
            {status === "valid" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
            {status === "invalid" && <AlertTriangle className="w-5 h-5 text-red-500" />}
            <span className={`text-sm font-medium ${
                status === "idle" ? "text-slate-400" :
                status === "valid" ? "text-emerald-400" : "text-red-500"
            }`}>
               {status === "idle" ? "Ready" : status === "valid" ? "Valid JSON" : "Invalid JSON"}
            </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl h-[600px]">
        {/* Left Side: Input */}
        <div className="flex flex-col h-full space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white/90">Input</h2>
            <div className="flex bg-black/50 rounded-lg p-1 border border-white/5 space-x-1">
               <button
                  onClick={() => formatJson(2)}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-sky-500/20 transition-all border border-transparent hover:border-sky-500/30"
               >
                 Format
               </button>
               <button
                  onClick={minifyJson}
                  className="px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-sky-500/20 transition-all border border-transparent hover:border-sky-500/30"
               >
                 Minify
               </button>
            </div>
          </div>
          
          <div className="relative flex-grow">
            <textarea
              value={input}
              onChange={(e) => {
                 setInput(e.target.value);
                 setStatus("idle");
              }}
              className={`w-full h-full bg-black/50 border ${
                  status === "invalid" ? "border-red-500/50 ring-1 ring-red-500/30" : "border-white/10 focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
              } rounded-xl p-4 text-white font-mono text-sm resize-none transition-all placeholder:text-white/20`}
              placeholder="Paste your JSON here..."
              spellCheck={false}
            />
            {status === "invalid" && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-950/80 backdrop-blur border border-red-500/50 text-red-200 p-3 rounded-lg text-sm shadow-xl">
                   <div className="flex items-start">
                      <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 text-red-500" />
                      <span className="break-words font-mono text-xs">{errorMessage}</span>
                   </div>
                </div>
            )}
          </div>
        </div>

        {/* Right Side: Output */}
        <div className="flex flex-col h-full space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white/90">Output</h2>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-sky-400" />
                  <span className="text-sky-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy result</span>
                </>
              )}
            </button>
          </div>
          <div className="flex-grow">
            <textarea
              readOnly
              value={output}
              className="w-full h-full bg-black/50 border border-white/10 rounded-xl p-4 text-sky-100 font-mono text-sm resize-none transition-all"
              placeholder="Formatted result will appear here..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
