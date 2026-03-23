"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Palette, UploadCloud, Copy, X, Image as ImageIcon, Sliders } from "lucide-react";
import { useDictionary } from "../../DictionaryProvider";

export default function ColorPicker() {
  const dict = useDictionary();
  const [mode, setMode] = useState<"image" | "manual">("image");
  
  // Image Mode State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pickedColors, setPickedColors] = useState<string[]>([]);
  const [hoverColor, setHoverColor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  
  // Manual Mode State
  const [manualColor, setManualColor] = useState<string>("#e81cff");
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      handleFile(file);
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  useEffect(() => {
    if (!previewUrl || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };
    img.src = previewUrl;
  }, [previewUrl]);

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("");
  };

  const getColorAtEvent = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    
    const pixel = ctx.getImageData(x, y, 1, 1).data;
    if (pixel[3] === 0) return "transparent";
    
    return rgbToHex(pixel[0], pixel[1], pixel[2]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const hex = getColorAtEvent(e);
    if (hex && hex !== "transparent") setHoverColor(hex);
    else setHoverColor(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const hex = getColorAtEvent(e);
    if (hex && hex !== "transparent") {
      setPickedColors(prev => [hex, ...prev].filter((c, i, a) => a.indexOf(c) === i).slice(0, 10));
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 2000);
  };

  const removeColor = (hexToRemove: string) => {
    setPickedColors(prev => prev.filter(hex => hex !== hexToRemove));
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const hexToHsl = (hex: string) => {
    let { r, g, b } = hexToRgb(hex);
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const manualRgb = hexToRgb(manualColor);
  const manualHsl = hexToHsl(manualColor);

  return (
    <div className="flex flex-col min-h-[80vh] w-full max-w-5xl mx-auto mb-12">
      <div className="mb-6 flex items-start mt-4">
        <Link
          href="/"
          className="mr-4 mt-1 p-2 rounded-full hover:bg-white/10 transition-colors inline-flex flex-shrink-0"
        >
          <ArrowLeft className="w-6 h-6 text-slate-300" />
        </Link>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-amber-400">
            <Palette className="w-10 h-10 mr-4 text-pink-400" />
            {dict.dashboard.tools.colorPicker.title}
          </h1>
          <p className="text-slate-400 text-lg mb-6">
            {dict.dashboard.tools.colorPicker.desc}
          </p>

          <div className="flex bg-black/50 rounded-xl p-1 border border-white/5 w-fit">
            <button
              onClick={() => setMode("image")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center ${
                mode === "image"
                  ? "bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Extract from Image
            </button>
            <button
              onClick={() => setMode("manual")}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center ${
                mode === "manual"
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sliders className="w-4 h-4 mr-2" />
              Manual Selection
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Workspace */}
        <div className="lg:col-span-2 flex flex-col gap-6 h-full">
          {mode === "image" ? (
            !previewUrl ? (
            <div 
              className="border-2 border-dashed border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer min-h-[400px] h-full group relative overflow-hidden"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              
              <div className="p-5 rounded-full bg-white/10 mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <UploadCloud className="w-10 h-10 text-pink-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white/90">{dict.tools.colorPicker.upload}</h3>
              <p className="text-slate-400 text-base max-w-sm">{dict.tools.colorPicker.dragDrop}. We support PNG, JPG, WebP.</p>
            </div>
          ) : (
            <div className="flex flex-col rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md overflow-hidden shadow-2xl relative h-full">
              
              {/* Toolbar */}
              <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/10">
                <div className="flex items-center">
                   <div 
                     className="w-10 h-10 rounded-full border-2 border-white/20 shadow-inner mr-4 transition-colors duration-75"
                     style={{ backgroundColor: hoverColor || 'transparent' }}
                   ></div>
                   <div className="font-mono text-sm text-white/70">
                     {hoverColor ? hoverColor.toUpperCase() : 'Hover an image area...'}
                   </div>
                </div>
                <button 
                  onClick={() => {
                    setPreviewUrl(null);
                    setSelectedFile(null);
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors"
                >
                  Change Image
                </button>
              </div>

              {/* Canvas Area */}
              <div className="p-4 bg-black/60 relative flex justify-center items-center overflow-auto max-h-[600px] min-h-[400px] cursor-crosshair group">
                 <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
                 <canvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoverColor(null)}
                    onClick={handleCanvasClick}
                    className="max-w-full h-auto rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative z-10 transition-transform active:scale-[0.99]"
                 />
                 
                 {/* Tooltip Overlay hint */}
                 <div className="absolute bottom-6 bg-black/80 backdrop-blur py-2 px-6 rounded-full border border-white/10 text-sm text-white/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                   {dict.tools.colorPicker.instruction}
                 </div>
              </div>
            </div>
          )
          ) : (
            /* Manual Selection Mode */
            <div className="flex flex-col rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md overflow-hidden shadow-2xl p-8 lg:p-12 h-full items-center justify-center">
               <h3 className="text-2xl font-semibold mb-8 text-white/90">Interactive Color Wheel</h3>
               
               {/* Huge Color Input Trick */}
               <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-[0_0_60px_rgba(255,255,255,0.1)] mb-10 group border-4 border-white/10 hover:scale-105 transition-transform">
                 <input 
                   type="color" 
                   value={manualColor}
                   onChange={(e) => setManualColor(e.target.value)}
                   className="absolute -top-10 -left-10 w-[200%] h-[200%] cursor-pointer"
                 />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20 group-hover:bg-black/10 transition-colors">
                   <Palette className="w-12 h-12 text-white/50 drop-shadow-md" />
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">HEX</span>
                    <span className="text-white font-mono text-lg">{manualColor.toUpperCase()}</span>
                    <button onClick={() => copyToClipboard(manualColor.toUpperCase())} className="mt-3 text-amber-400 hover:text-amber-300 text-xs font-medium bg-amber-500/10 px-3 py-1.5 rounded-lg w-full transition-colors flex items-center justify-center"><Copy className="w-3 h-3 mr-1"/> Copy</button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">RGB</span>
                    <span className="text-white font-mono text-lg">{manualRgb.r}, {manualRgb.g}, {manualRgb.b}</span>
                    <button onClick={() => copyToClipboard(`rgb(${manualRgb.r}, ${manualRgb.g}, ${manualRgb.b})`)} className="mt-3 text-amber-400 hover:text-amber-300 text-xs font-medium bg-amber-500/10 px-3 py-1.5 rounded-lg w-full transition-colors flex items-center justify-center"><Copy className="w-3 h-3 mr-1"/> Copy</button>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">HSL</span>
                    <span className="text-white font-mono text-lg">{manualHsl.h}°, {manualHsl.s}%, {manualHsl.l}%</span>
                    <button onClick={() => copyToClipboard(`hsl(${manualHsl.h}, ${manualHsl.s}%, ${manualHsl.l}%)`)} className="mt-3 text-amber-400 hover:text-amber-300 text-xs font-medium bg-amber-500/10 px-3 py-1.5 rounded-lg w-full transition-colors flex items-center justify-center"><Copy className="w-3 h-3 mr-1"/> {dict.tools.colorPicker.copy}</button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Side Panel for Picked Colors */}
        <div className="flex flex-col">
          <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl h-full">
            <h3 className="text-xl font-medium text-white mb-6 flex items-center">
              <Palette className="w-5 h-5 mr-3 text-pink-400" />
              Your Palette
            </h3>

            {pickedColors.length === 0 ? (
              <div className="text-center py-12 px-4 border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
                <Palette className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-slate-400 text-sm">
                  Click anywhere on the uploaded image to extract its exact color.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pickedColors.map((hex, index) => (
                  <div 
                    key={`${hex}-${index}`} 
                    className="flex justify-between items-center p-3 rounded-2xl border border-white/10 bg-white/5 group hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center">
                      <div 
                        className="w-12 h-12 rounded-xl shadow-inner mr-4 border border-white/20"
                        style={{ backgroundColor: hex }}
                      ></div>
                      <span className="font-mono text-white tracking-wide uppercase">{hex}</span>
                    </div>

                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => copyToClipboard(hex)}
                        className="p-2 mr-2 bg-white/5 hover:bg-white/20 rounded-lg transition-colors text-slate-300 relative"
                        title="Copy to clipboard"
                      >
                        {copied === hex ? (
                           <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs py-1 px-2 rounded font-medium shadow-xl">Copied!</span>
                        ) : null}
                        <Copy className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeColor(hex)}
                        className="p-2 bg-red-500/10 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        title="Remove color"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                {pickedColors.length > 0 && (
                  <button 
                    onClick={() => setPickedColors([])}
                    className="w-full mt-6 py-3 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-slate-400"
                  >
                    Clear Palette
                  </button>
                )}
              </div>
            )}
            
          </div>
        </div>
        
      </div>
    </div>
  );
}
