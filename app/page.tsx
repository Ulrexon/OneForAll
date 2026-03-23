"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Fingerprint, Code, Hash, FileJson, ArrowRight, Image as ImageIcon, Search, QrCode, Palette, FileText, Gamepad2, Hammer, Sliders, Timer } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"dev" | "focus">("dev");

  const tools = [
    {
      title: "Zen Pomodoro",
      description: "Boost productivity with deep-work timers and native algorithmic brown noise.",
      icon: <Timer className="w-8 h-8 text-rose-400" />,
      href: "/tools/pomodoro",
      color: "from-rose-500/20 to-orange-500/0",
      border: "hover:border-rose-500/50",
      category: "focus"
    },
    {
      title: "Speed Typing Test",
      description: "Test your Words Per Minute (WPM) accuracy and speed.",
      icon: <Gamepad2 className="w-8 h-8 text-emerald-400" />,
      href: "/tools/typing-test",
      color: "from-emerald-500/20 to-teal-500/0",
      border: "hover:border-emerald-500/50",
      category: "focus"
    },
    {
      title: "Text Analyzer",
      description: "Get real-time word counts, stats, and keyword density from texts.",
      icon: <FileText className="w-8 h-8 text-orange-400" />,
      href: "/tools/text-analyzer",
      color: "from-orange-500/20 to-red-500/0",
      border: "hover:border-orange-500/50",
      category: "dev"
    },
    {
      title: "Color Picker",
      description: "Extract pixel-perfect color palettes directly from your images.",
      icon: <Palette className="w-8 h-8 text-pink-400" />,
      href: "/tools/color-picker",
      color: "from-pink-500/20 to-amber-500/0",
      border: "hover:border-pink-500/50",
      category: "dev"
    },
    {
      title: "QR Code Generator",
      description: "Create customizable, high-resolution QR codes in seconds.",
      icon: <QrCode className="w-8 h-8 text-blue-400" />,
      href: "/tools/qr-generator",
      color: "from-blue-500/20 to-indigo-500/0",
      border: "hover:border-blue-500/50",
      category: "dev"
    },
    {
      title: "Glassmorphism Generator",
      description: "Visually generate the incredibly satisfying frosted-glass CSS effect.",
      icon: <Sliders className="w-8 h-8 text-sky-400" />,
      href: "/tools/glassmorphism",
      color: "from-sky-500/20 to-cyan-500/0",
      border: "hover:border-sky-500/50",
      category: "dev"
    },
    {
      title: "Image Converter",
      description: "Convert images seamlessly between WebP, PNG, and JPEG instantly.",
      icon: <ImageIcon className="w-8 h-8 text-fuchsia-400" />,
      href: "/tools/image-converter",
      color: "from-fuchsia-500/20 to-purple-500/0",
      border: "hover:border-fuchsia-500/50",
      category: "dev"
    },
    {
      title: "Base64 Encoder/Decoder",
      description: "Instantly encode or decode text and strings to Base64 format.",
      icon: <Hash className="w-8 h-8 text-blue-400" />,
      href: "/tools/base64",
      color: "from-blue-500/20 to-cyan-500/0",
      border: "hover:border-blue-500/50",
      category: "dev"
    },
    {
      title: "JSON Formatter",
      description: "Format, validate, and beautify your JSON data structures securely.",
      icon: <FileJson className="w-8 h-8 text-yellow-400" />,
      href: "/tools/json",
      color: "from-yellow-500/20 to-orange-500/0",
      border: "hover:border-yellow-500/50",
      category: "dev"
    },
    {
      title: "JWT Decoder",
      description: "Decode JSON Web Tokens and inspect headers, claims, and payloads.",
      icon: <Code className="w-8 h-8 text-green-400" />,
      href: "/tools/jwt",
      color: "from-green-500/20 to-emerald-500/0",
      border: "hover:border-green-500/50",
      category: "dev"
    },
    {
      title: "UUID v4 Generator",
      description: "Generate universally unique secure identifiers in bulk.",
      icon: <Fingerprint className="w-8 h-8 text-purple-400" />,
      href: "/tools/uuid",
      color: "from-purple-500/20 to-pink-500/0",
      border: "hover:border-purple-500/50",
      category: "dev"
    }
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const toolCat = tool.category || "dev";
    const matchesTab = toolCat === activeTab;

    return matchesSearch && matchesTab;
  });

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

      <div className="w-full max-w-2xl mb-8 relative z-20">
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

      {/* Tabs */}
      <div className="flex bg-black/50 rounded-xl p-1 border border-white/5 w-fit mx-auto mb-10 z-20 relative">
        <button
          onClick={() => setActiveTab("dev")}
          className={`px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === "dev"
              ? "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 shadow-lg"
              : "text-slate-400 hover:text-white"
            }`}
        >
          <Hammer className="w-4 h-4 mr-2" />
          Developer Tools
        </button>
        <button
          onClick={() => setActiveTab("focus")}
          className={`px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === "focus"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg"
              : "text-slate-400 hover:text-white"
            }`}
        >
          <Gamepad2 className="w-4 h-4 mr-2" />
          Relax & Focus
        </button>
      </div>

      {filteredTools.length > 0 ? (
        <motion.div 
          key={activeTab + searchQuery} 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-24"
        >
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.href}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
              }}
            >
              <Link
                href={tool.href}
                className={`group h-full flex flex-col relative overflow-hidden rounded-3xl p-8 bg-black/40 border border-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-black/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 ${tool.border}`}
              >
              <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  {tool.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{tool.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm truncate-2-lines">{tool.description}</p>
              </div>

              <div className="absolute top-8 right-8 text-white/10 group-hover:text-white/40 transition-colors duration-500 group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowRight className="w-6 h-6" />
              </div>
            </Link>
            </motion.div>
          ))}
        </motion.div>
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
  );
}
