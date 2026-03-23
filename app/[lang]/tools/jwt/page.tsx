"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound, AlertTriangle } from "lucide-react";
import { useDictionary } from "../../DictionaryProvider";

export default function JwtDecoder() {
  const dict = useDictionary();
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token.trim()) {
      setHeader("");
      setPayload("");
      setError("");
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Must contain 3 parts separated by dots.");
      }

      // Decode base64url to base64, then to string format
      const decodeBase64Url = (str: string) => {
        str = str.replace(/-/g, '+').replace(/_/g, '/');
        const pad = str.length % 4;
        if (pad) {
          if (pad === 1) throw new Error('Invalid Length');
          str += new Array(5 - pad).join('=');
        }
        return decodeURIComponent(escape(atob(str)));
      };

      const decodedHeader = JSON.parse(decodeBase64Url(parts[0]));
      const decodedPayload = JSON.parse(decodeBase64Url(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to parse JWT token.");
      setHeader("");
      setPayload("");
    }
  }, [token]);

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
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400 flex items-center">
            {dict.dashboard.tools.jwt.title} <KeyRound className="ml-3 w-8 h-8 text-rose-400" />
          </h1>
          <p className="text-slate-400 mt-2">
            {dict.dashboard.tools.jwt.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Input Section */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl flex flex-col h-[500px]">
          <h2 className="text-xl font-semibold text-white/90 mb-4">{dict.tools.jwt.tokenInput}</h2>
          <div className="relative flex-grow">
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className={`w-full h-full bg-black/50 border ${
                  error ? 'border-red-500/50' : 'border-white/10 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50'
              } rounded-xl p-4 text-rose-200 font-mono text-sm resize-none transition-all placeholder:text-white/20 break-all`}
              placeholder="Paste your JWT (ey...) here"
              spellCheck={false}
            />
             {error && (
                <div className="absolute bottom-4 left-4 right-4 bg-red-950/90 backdrop-blur border border-red-500/50 text-red-200 p-3 rounded-lg text-sm shadow-xl flex items-center">
                   <AlertTriangle className="w-5 h-5 mr-3 flex-shrink-0" />
                   {error}
                </div>
            )}
          </div>
        </div>

        {/* Decoded Output Section */}
        <div className="flex flex-col h-[500px] space-y-6">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-1/3">
             <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">{dict.tools.jwt.header}</h2>
             <textarea
                readOnly
                value={header}
                className="w-full flex-grow bg-black/30 border border-white/5 rounded-xl p-3 text-emerald-300 font-mono text-xs resize-none"
                placeholder="Decoded header..."
             />
          </div>
          
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col h-2/3">
             <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">{dict.tools.jwt.payload}</h2>
             <textarea
                readOnly
                value={payload}
                className="w-full flex-grow bg-black/30 border border-white/5 rounded-xl p-4 text-sky-300 font-mono text-sm resize-none"
                placeholder="Decoded payload..."
             />
          </div>
        </div>
      </div>
    </div>
  );
}
