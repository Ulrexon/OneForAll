"use client";

import { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Download, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useDictionary } from "../../DictionaryProvider";

export default function ImageConverter() {
  const dict = useDictionary();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  // Default to webp as it's modern
  const [targetFormat, setTargetFormat] = useState<string>("image/webp");
  const [quality, setQuality] = useState<number>(0.85);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
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

  const convertImage = async () => {
    if (!selectedFile || !previewUrl) return;
    setIsConverting(true);
    setError(null);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = previewUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");
      
      // If converting to JPEG, draw a white background first
      // since JPEG doesn't support transparency and defaults to black.
      if (targetFormat === "image/jpeg") {
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError("Failed to convert image. Format may be unsupported.");
            setIsConverting(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          const ext = targetFormat.split("/")[1];
          const originalName = selectedFile.name.substring(0, selectedFile.name.lastIndexOf('.')) || selectedFile.name;
          
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          a.download = `${originalName}-converted.${ext}`;
          document.body.appendChild(a);
          a.click();
          
          // Cleanup
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          setIsConverting(false);
        },
        targetFormat,
        quality
      );
    } catch (err) {
      console.error(err);
      setError("An error occurred during conversion.");
      setIsConverting(false);
    }
  };

  const extensionLabel = (mimeType: string) => mimeType.split("/")[1].toUpperCase();

  return (
    <div className="max-w-5xl mx-auto flex flex-col min-h-[80vh]">
      <div className="mb-8 flex items-start mt-4">
        <Link
          href="/"
          className="mr-4 mt-1 p-2 rounded-full hover:bg-white/10 transition-colors inline-flex flex-shrink-0"
        >
          <ArrowLeft className="w-6 h-6 text-slate-300" />
        </Link>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">
            <ImageIcon className="w-10 h-10 mr-4 text-fuchsia-400" />
            {dict.dashboard.tools.imageConverter.title}
          </h1>
          <p className="text-slate-400 text-lg">
            {dict.dashboard.tools.imageConverter.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Zone */}
        <div 
          className="border-2 border-dashed border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer min-h-[400px] group relative overflow-hidden"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          
          <div className="p-4 rounded-full bg-white/10 mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-8 h-8 text-fuchsia-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-white/90">{dict.tools.image.upload}</h3>
          <p className="text-slate-400 text-sm">PNG, JPG, WebP, GIF</p>
          
          {selectedFile && (
            <div className="mt-6 p-4 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-xl text-fuchsia-200 text-sm max-w-[80%] truncate relative z-10 shadow-lg">
              <span className="font-semibold text-fuchsia-100">Selected:</span> {selectedFile.name}
            </div>
          )}
        </div>

        {/* Options & Preview */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md">
            <h3 className="text-xl font-medium text-white mb-6">{dict.tools.image.settings}</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-slate-400 mb-3">{dict.tools.image.targetFormat}</label>
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/5">
                  {["image/webp", "image/jpeg", "image/png"].map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        targetFormat === fmt 
                        ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25 scale-[1.02]' 
                        : 'text-slate-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {extensionLabel(fmt)}
                    </button>
                  ))}
                </div>
              </div>

              {(targetFormat === "image/jpeg" || targetFormat === "image/webp") && (
                <div className="pt-2">
                  <div className="flex justify-between text-sm mb-3">
                    <label className="text-slate-400 flex items-center">
                      <span className="font-medium mr-2">{dict.tools.image.quality}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                        {quality > 0.8 ? dict.tools.image.high : quality > 0.5 ? dict.tools.image.medium : dict.tools.image.low}
                      </span>
                    </label>
                    <span className="text-white font-bold">{Math.round(quality * 100)}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.1" 
                    max="1" 
                    step="0.05" 
                    value={quality} 
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `linear-gradient(to right, #d946ef ${quality * 100}%, transparent ${quality * 100}%)`
                    }}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={convertImage}
              disabled={!selectedFile || isConverting}
              className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-lg shadow-xl shadow-fuchsia-500/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all flex items-center justify-center group"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="w-6 h-6 mr-3 animate-spin" />
                  {dict.tools.image.processing}
                </>
              ) : (
                <>
                  <Download className="w-6 h-6 mr-3 group-hover:-translate-y-1 transition-transform" />
                  {dict.tools.image.convert}
                </>
              )}
            </button>
          </div>

          {/* Preview Image */}
          <div className="p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-md flex flex-col flex-grow relative overflow-hidden h-full min-h-[200px]">
            <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">{dict.tools.image.previewTitle}</h3>
            <div className="flex items-center justify-center flex-grow relative rounded-xl overflow-hidden bg-black/50">
               {previewUrl ? (
                 <>
                   {/* Checkboard pattern for transparency visualization */}
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%), linear-gradient(-45deg, #222 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #222 75%), linear-gradient(-45deg, transparent 75%, #222 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>
                   <img src={previewUrl} alt="Preview" className="w-full h-full object-contain relative z-10" />
                 </>
               ) : (
                 <div className="text-slate-600 flex flex-col items-center">
                   <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                   <p className="text-sm">{dict.tools.image.noImage}</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
