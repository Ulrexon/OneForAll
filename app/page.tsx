import Link from "next/link";
import { Fingerprint, Code, Hash, FileJson, ArrowRight, Image as ImageIcon } from "lucide-react";
import Franky from "./components/Franky";

export default function Home() {
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <Franky />
      <div className="text-center mb-16 relative">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-pulse">
          AllForWeb
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 max-w-2xl font-light">
          Your premium, unified toolkit for everyday development and productivity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {tools.map((tool, idx) => (
          <Link href={tool.href} key={idx} className="group outline-none">
            <div className={`relative h-full p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20 ${tool.border}`}>
              {/* Dynamic Gradient Background on Hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${tool.color} transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="mb-6 p-4 rounded-2xl bg-white/5 inline-flex w-fit backdrop-blur-sm border border-white/5 group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white/90 group-hover:text-white transition-colors break-words">{tool.title}</h2>
                <p className="text-slate-400 flex-grow text-sm md:text-base leading-relaxed">
                  {tool.description}
                </p>
                <div className="mt-8 flex items-center text-sm font-medium text-white/50 group-hover:text-white/90 transition-colors">
                  Open Tool <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
