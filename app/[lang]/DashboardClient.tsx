"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Fingerprint, Code, Hash, FileJson, ArrowRight, Image as ImageIcon, Search, QrCode, Palette, FileText, Gamepad2, Hammer, Sliders, Timer, Calculator, Clock } from "lucide-react";

export default function DashboardClient({ dict, lang }: { dict: any; lang: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"dev" | "focus" | "calc">("dev");

  useEffect(() => {
    if (tabParam === "dev" || tabParam === "focus" || tabParam === "calc") {
      setActiveTab(tabParam);
      localStorage.setItem("dashboard_tab", tabParam);
    } else {
      const saved = localStorage.getItem("dashboard_tab") as "dev" | "focus" | "calc" | null;
      if (saved === "dev" || saved === "focus" || saved === "calc") {
        setActiveTab(saved);
        // Re-inject into URL for consistency
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", saved);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    }
  }, [tabParam, pathname, router, searchParams]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = (tab: "dev" | "focus" | "calc") => {
    setActiveTab(tab);
    localStorage.setItem("dashboard_tab", tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const tools = [
    {
      title: dict.dashboard.tools.zenPomodoro.title,
      description: dict.dashboard.tools.zenPomodoro.desc,
      icon: <Timer className="w-8 h-8 text-rose-400" />,
      href: `/${lang}/tools/pomodoro`,
      color: "from-rose-500/20 to-orange-500/0",
      border: "hover:border-rose-500/50",
      category: "focus"
    },
    {
      title: dict.dashboard.tools.typingTest.title,
      description: dict.dashboard.tools.typingTest.desc,
      icon: <Gamepad2 className="w-8 h-8 text-emerald-400" />,
      href: `/${lang}/tools/typing-test`,
      color: "from-emerald-500/20 to-teal-500/0",
      border: "hover:border-emerald-500/50",
      category: "focus"
    },
    {
      title: dict.dashboard.tools.textAnalyzer.title,
      description: dict.dashboard.tools.textAnalyzer.desc,
      icon: <FileText className="w-8 h-8 text-orange-400" />,
      href: `/${lang}/tools/text-analyzer`,
      color: "from-orange-500/20 to-red-500/0",
      border: "hover:border-orange-500/50",
      category: "dev"
    },
    {
      title: dict.dashboard.tools.colorPicker.title,
      description: dict.dashboard.tools.colorPicker.desc,
      icon: <Palette className="w-8 h-8 text-pink-400" />,
      href: `/${lang}/tools/color-picker`,
      color: "from-pink-500/20 to-amber-500/0",
      border: "hover:border-pink-500/50",
      category: "dev"
    },
    {
      title: dict.dashboard.tools.qrGenerator.title,
      description: dict.dashboard.tools.qrGenerator.desc,
      icon: <QrCode className="w-8 h-8 text-blue-400" />,
      href: `/${lang}/tools/qr-generator`,
      color: "from-blue-500/20 to-indigo-500/0",
      border: "hover:border-blue-500/50",
      category: "dev"
    },
    {
      title: dict.dashboard.tools.glassmorphism.title,
      description: dict.dashboard.tools.glassmorphism.desc,
      icon: <Sliders className="w-8 h-8 text-sky-400" />,
      href: `/${lang}/tools/glassmorphism`,
      color: "from-sky-500/20 to-cyan-500/0",
      border: "hover:border-sky-500/50",
      category: "dev"
    },
    {
      title: dict.dashboard.tools.imageConverter.title,
      description: dict.dashboard.tools.imageConverter.desc,
      icon: <ImageIcon className="w-8 h-8 text-fuchsia-400" />,
      href: `/${lang}/tools/image-converter`,
      color: "from-fuchsia-500/20 to-purple-500/0",
      border: "hover:border-fuchsia-500/50",
      category: "dev"
    },
    {
      title: dict.dashboard.tools.base64.title,
      description: dict.dashboard.tools.base64.desc,
      icon: <Hash className="w-8 h-8 text-blue-400" />,
      href: `/${lang}/tools/base64`,
      color: "from-blue-500/20 to-cyan-500/0",
      border: "hover:border-blue-500/50",
      category: "dev"
    },
    {
      title: dict.dashboard.tools.json.title,
      description: dict.dashboard.tools.json.desc,
      icon: <FileJson className="w-8 h-8 text-yellow-400" />,
      href: `/${lang}/tools/json`,
      color: "from-yellow-500/20 to-orange-500/0",
      border: "hover:border-yellow-500/50",
      category: "dev"
    },
    {
      title: dict.dashboard.tools.jwt.title,
      description: dict.dashboard.tools.jwt.desc,
      icon: <Code className="w-8 h-8 text-green-400" />,
      href: `/${lang}/tools/jwt`,
      color: "from-green-500/20 to-emerald-500/0",
      border: "hover:border-green-500/50",
      category: "dev"
    },
    {
      title: dict.dashboard.tools.uuid.title,
      description: dict.dashboard.tools.uuid.desc,
      icon: <Fingerprint className="w-8 h-8 text-purple-400" />,
      href: `/${lang}/tools/uuid`,
      color: "from-purple-500/20 to-pink-500/0",
      border: "hover:border-purple-500/50",
      category: "dev"
    },
    {
      title: dict.dashboard.tools.vatCalculator.title,
      description: dict.dashboard.tools.vatCalculator.desc,
      icon: <Calculator className="w-8 h-8 text-indigo-400" />,
      href: `/${lang}/tools/vat-calculator`,
      color: "from-indigo-500/20 to-blue-500/0",
      border: "hover:border-indigo-500/50",
      category: "calc"
    },
    {
      title: dict.dashboard.tools.timeCalculator.title,
      description: dict.dashboard.tools.timeCalculator.desc,
      icon: <Clock className="w-8 h-8 text-cyan-400" />,
      href: `/${lang}/tools/time-calculator`,
      color: "from-cyan-500/20 to-sky-500/0",
      border: "hover:border-cyan-500/50",
      category: "calc"
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
          {dict.dashboard.title}
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-light">
          {dict.dashboard.subtitle}
        </p>
      </div>

      <div className="w-full max-w-2xl mb-8 relative z-20">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-6 h-6 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder={dict.dashboard.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all backdrop-blur-md shadow-2xl text-lg hover:bg-black/60"
        />
      </div>

      {/* Tabs */}
      <div className="flex bg-black/50 rounded-xl p-1 border border-white/5 w-fit mx-auto mb-10 z-20 relative">
        <button
          onClick={() => handleTabChange("dev")}
          className={`px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === "dev"
              ? "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 shadow-lg"
              : "text-slate-400 hover:text-white"
            }`}
        >
          <Hammer className="w-4 h-4 mr-2" />
          {dict.dashboard.tabDev}
        </button>
        <button
          onClick={() => handleTabChange("calc")}
          className={`px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === "calc"
              ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 shadow-lg"
              : "text-slate-400 hover:text-white"
            }`}
        >
          <Calculator className="w-4 h-4 mr-2" />
          {dict.dashboard.tabCalc}
        </button>
        <button
          onClick={() => handleTabChange("focus")}
          className={`px-8 py-3 rounded-lg text-sm font-bold transition-all flex items-center ${activeTab === "focus"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-lg"
              : "text-slate-400 hover:text-white"
            }`}
        >
          <Gamepad2 className="w-4 h-4 mr-2" />
          {dict.dashboard.tabFocus}
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
          <h3 className="text-xl font-medium text-white/90 mb-2">{dict.dashboard.noToolsTitle}</h3>
          <p className="text-slate-400">
            {dict.dashboard.noToolsDesc} "{searchQuery}".
          </p>
        </div>
      )}
    </div>
  );
}
