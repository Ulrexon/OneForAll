"use client";

import { useState } from "react";
import Link from "next/link";
import { Fingerprint, Code, Hash, FileJson, ArrowRight, Image as ImageIcon, Search } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const tools = [
    {
      title: "Image Converter",
      description: "Convert images seamlessly between WebP, PNG, and JPEG instantly.",
      icon: <ImageIcon className="w-8 h-8 text-fuchsia-400" />,
      href: "/tools/image-converter",
      color: "from-fuchsia-500/20 to-pink-500/0",
      border: "hover:border-fuchsia-500/50"
    },
    {
      title: "Base64 Encoder/Decoder",
      description: "Instantly encode or decode text and files in Base64.",
      icon: <Code className="w-8 h-8 text-emerald-400" />,
      href: "/tools/base64",
      color: "from-emerald-500/20 to-teal-500/0",
      border: "hover:border-emerald-500/50"
    },
    {
      title: "JSON Formatter",
      description: "Format, validate, and minify JSON data instantly.",
      icon: <FileJson className="w-8 h-8 text-sky-400" />,
      href: "/tools/json",
      color: "from-sky-500/20 to-blue-500/0",
      border: "hover:border-sky-500/50"
    },
    {
      title: "JWT Decoder",
      description: "Decode JSON Web Tokens and view header/payload data.",
      icon: <Fingerprint className="w-8 h-8 text-rose-400" />,
      href: "/tools/jwt",
      color: "from-rose-500/20 to-pink-500/0",
      border: "hover:border-rose-500/50"
    },
    {
      title: "UUID Generator",
      description: "Generate cryptographically secure v4 UUIDs in bulk.",
      icon: <Hash className="w-8 h-8 text-amber-400" />,
      href: "/tools/uuid",
      color: "from-amber-500/20 to-orange-500/0",
      border: "hover:border-amber-500/50"
    }
  ];

  const filteredTools = tools.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center mb-10 relative">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-pulse">
          AllForWeb
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-light">
          Your premium, unified toolkit for everyday development and productivity.
        </p>
      </div>

      <div className="w-full max-w-2xl mb-12 relative z-20">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search tools by name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-md shadow-2xl text-lg hover:bg-black/60"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool, idx) => (
            <Link href={tool.href} key={idx} className="group outline-none">
              <div className={`relative h-full p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 ${tool.border}`}>
                {/* Dynamic Gradient Background on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${tool.color} transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-flex w-fit backdrop-blur-sm border border-white/5 group-hover:scale-110 transition-transform duration-300">
                    {tool.icon}
                  </div>
                  <h2 className="text-2xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors">{tool.title}</h2>
                  <p className="text-slate-400 flex-grow text-sm md:text-base leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-8 flex items-center text-sm font-medium text-white/50 group-hover:text-white/90 transition-colors">
                    Open Tool <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16 px-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md mt-4">
            <Search className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white/90 mb-2">No tools found</h3>
            <p className="text-slate-400">
              We couldn't find any tools matching "{searchQuery}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
