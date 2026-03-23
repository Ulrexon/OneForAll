"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, QrCode, Download, Settings, Type } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function QrGenerator() {
  const [text, setText] = useState("https://allforweb.com");
  const [size, setSize] = useState(256);
  // Default dark foreground and light background
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [margin, setMargin] = useState(true);

  const canvasRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "allforweb-qr.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            <QrCode className="w-10 h-10 mr-4 text-blue-400" />
            QR Code Generator
          </h1>
          <p className="text-slate-400 text-lg">
            Create completely customizable, high-resolution QR codes in seconds.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Settings Panel */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl">
            <h3 className="text-xl font-medium text-white mb-6 flex items-center">
              <Type className="w-5 h-5 mr-2 text-blue-400" />
              Content
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">URL or Text</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-32 bg-black/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 resize-none transition-all placeholder:text-white/20"
                  placeholder="Enter your website URL, WiFi password, or any text..."
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl">
            <h3 className="text-xl font-medium text-white mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-blue-400" />
              Customization
            </h3>
            
            <div className="space-y-6">
              <div>
                 <div className="flex justify-between text-sm mb-2">
                    <label className="text-slate-400">Size</label>
                    <span className="text-white font-medium">{size}px</span>
                 </div>
                 <input 
                    type="range" 
                    min="128" 
                    max="512" 
                    step="32" 
                    value={size} 
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `linear-gradient(to right, #3b82f6 ${((size - 128) / (512 - 128)) * 100}%, transparent ${((size - 128) / (512 - 128)) * 100}%)`
                    }}
                 />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm text-slate-400 mb-2">Foreground</label>
                    <div className="flex items-center space-x-3 bg-white/5 p-2 border border-white/10 rounded-xl">
                       <input 
                         type="color" 
                         value={fgColor} 
                         onChange={(e) => setFgColor(e.target.value)}
                         className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                       />
                       <span className="text-white font-mono text-sm uppercase">{fgColor}</span>
                    </div>
                 </div>
                 <div>
                    <label className="block text-sm text-slate-400 mb-2">Background</label>
                    <div className="flex items-center space-x-3 bg-white/5 p-2 border border-white/10 rounded-xl">
                       <input 
                         type="color" 
                         value={bgColor} 
                         onChange={(e) => setBgColor(e.target.value)}
                         className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0"
                       />
                       <span className="text-white font-mono text-sm uppercase">{bgColor}</span>
                    </div>
                 </div>
              </div>

              <label className="flex items-center cursor-pointer group bg-white/5 p-4 rounded-xl border border-white/10">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={margin}
                      onChange={(e) => setMargin(e.target.checked)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${margin ? 'bg-blue-500' : 'bg-white/20'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${margin ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="ml-4 text-slate-300 group-hover:text-white transition-colors font-medium text-sm">
                    Include Safe Margin Padding
                  </div>
              </label>

            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col">
          <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl h-full flex flex-col items-center justify-center relative overflow-hidden">
            
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px' }}></div>

            <div 
              ref={canvasRef}
              className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner transition-all duration-500 relative z-10 backdrop-blur-xl"
              style={{ minHeight: "350px", width: "100%" }}
            >
              {text ? (
                <div className="bg-transparent rounded-lg shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                  <QRCodeCanvas
                    value={text}
                    size={size > 300 ? 300 : size} // Scale down preview if too large for container, but download remains full size. Wait, canvas draws to exact size. Let's just pass exact size and let CSS scale it within `max-w-full h-auto`.
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level={"H"}
                    includeMargin={margin}
                    style={{ width: "100%", height: "auto", maxWidth: "300px" }}
                  />
                </div>
              ) : (
                <div className="text-slate-500 flex flex-col items-center text-center max-w-xs">
                   <QrCode className="w-16 h-16 mb-4 opacity-30" />
                   <p className="text-lg font-medium text-slate-400">Preview Empty</p>
                   <p className="text-sm mt-2">Enter some text or a URL to generate your QR Code instantly.</p>
                </div>
              )}
            </div>

            <button
              onClick={downloadQR}
              disabled={!text}
              className="mt-8 w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-lg shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all flex items-center justify-center group relative z-10"
            >
              <Download className="w-6 h-6 mr-3 group-hover:-translate-y-1 transition-transform" />
              Download High-Res PNG
            </button>
            <p className="text-slate-500 text-sm mt-4 text-center relative z-10">
              Scan with your smartphone camera <br/> to test the QR code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
