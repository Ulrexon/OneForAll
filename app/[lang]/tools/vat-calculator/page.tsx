"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Copy, Check, ArrowRightLeft } from "lucide-react";
import { useDictionary } from "../../DictionaryProvider";
import { useRouter } from "next/navigation";

export default function VatCalculator() {
  const dict = useDictionary();
  const router = useRouter();

  const [basePrice, setBasePrice] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<string>("");
  const [vatAmount, setVatAmount] = useState<string>("0.00");
  const [vatRate, setVatRate] = useState<number>(21);
  const [customRate, setCustomRate] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [lastEdited, setLastEdited] = useState<"base" | "total">("base");

  const [copiedBase, setCopiedBase] = useState(false);
  const [copiedTotal, setCopiedTotal] = useState(false);
  const [copiedVat, setCopiedVat] = useState(false);

  useEffect(() => {
    const rate = isCustom ? (parseFloat(customRate) || 0) : vatRate;
    
    if (lastEdited === "base") {
      const base = parseFloat(basePrice);
      if (!isNaN(base)) {
        const vat = base * (rate / 100);
        const total = base + vat;
        setVatAmount(vat.toFixed(2));
        
        // Prevent setting if it's identical to avoid cursor jumping
        if (parseFloat(totalPrice) !== total) {
            setTotalPrice(total.toFixed(2));
        }
      } else {
        setVatAmount("0.00");
        setTotalPrice("");
      }
    } else if (lastEdited === "total") {
      const total = parseFloat(totalPrice);
      if (!isNaN(total)) {
        const base = total / (1 + (rate / 100));
        const vat = total - base;
        setVatAmount(vat.toFixed(2));

        if (parseFloat(basePrice) !== base) {
            setBasePrice(base.toFixed(2));
        }
      } else {
        setVatAmount("0.00");
        setBasePrice("");
      }
    }
  }, [basePrice, totalPrice, vatRate, isCustom, customRate, lastEdited]);

  const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastEdited("base");
    setBasePrice(e.target.value);
  };

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastEdited("total");
    setTotalPrice(e.target.value);
  };

  const copyToClipboard = (text: string, type: "base" | "total" | "vat") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === "base") {
      setCopiedBase(true);
      setTimeout(() => setCopiedBase(false), 2000);
    } else if (type === "total") {
      setCopiedTotal(true);
      setTimeout(() => setCopiedTotal(false), 2000);
    } else if (type === "vat") {
      setCopiedVat(true);
      setTimeout(() => setCopiedVat(false), 2000);
    }
  };

  const presetRates = [21, 10, 4];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link
          href="/"
          className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors inline-block"
        >
          <ArrowLeft className="w-6 h-6 text-slate-300" />
        </Link>
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400 flex items-center">
            {dict.dashboard.tools.vatCalculator.title} <Calculator className="ml-3 w-8 h-8 text-indigo-400" />
          </h1>
          <p className="text-slate-400 mt-2">
            {dict.dashboard.tools.vatCalculator.desc}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Calculator Inputs */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col space-y-8">
          
          {/* Base Price */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {dict.tools.vat.basePrice}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg">$</span>
              <input
                type="number"
                value={basePrice}
                onChange={handleBaseChange}
                placeholder={dict.tools.vat.placeholder}
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono"
              />
            </div>
          </div>

          {/* Bidirectional Arrow icon purely for visual cue */}
          <div className="flex justify-center -my-2 z-10">
            <div className="bg-indigo-500/20 p-2 rounded-full border border-indigo-500/30">
               <ArrowRightLeft className="w-5 h-5 text-indigo-400 rotate-90 lg:rotate-0" />
            </div>
          </div>

          {/* Total Price */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              {dict.tools.vat.totalPrice}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium text-lg">$</span>
              <input
                type="number"
                value={totalPrice}
                onChange={handleTotalChange}
                placeholder={dict.tools.vat.placeholder}
                className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
              />
            </div>
          </div>

          {/* Tax Rates Selection */}
          <div className="pt-4 border-t border-white/10">
            <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              {dict.tools.vat.vatRate}
            </label>
            <div className="flex flex-wrap gap-3">
              {presetRates.map((rate) => (
                <button
                  key={rate}
                  onClick={() => {
                    setIsCustom(false);
                    setVatRate(rate);
                  }}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all text-sm ${
                    !isCustom && vatRate === rate
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                      : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {rate}%
                </button>
              ))}
              <button
                onClick={() => setIsCustom(true)}
                className={`flex-[1.5] py-3 px-4 rounded-xl font-bold transition-all text-sm ${
                  isCustom
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105"
                    : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5"
                }`}
              >
                {dict.tools.vat.customRate}
              </button>
            </div>
            
            {/* Custom Rate Input */}
            {isCustom && (
              <div className="mt-4 relative">
                <input
                  type="number"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  placeholder="21"
                  className="w-full bg-black/50 border border-indigo-500/30 rounded-xl py-3 px-4 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Breakdown & Results */}
        <div className="flex flex-col space-y-6">
          <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/20 backdrop-blur-md rounded-3xl p-8 shadow-2xl flex-grow flex flex-col justify-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <h2 className="text-xl font-semibold text-white/90 mb-8 relative z-10">Breakdown</h2>
            
            <div className="space-y-6 relative z-10">
              {/* Breakdown Base */}
              <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-white/5">
                <span className="text-slate-400">{dict.tools.vat.basePrice}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-mono text-white break-all max-w-[150px] text-right">
                    ${basePrice ? parseFloat(basePrice).toFixed(2) : "0.00"}
                  </span>
                  <button onClick={() => copyToClipboard(basePrice || "0", "base")} className="text-slate-500 hover:text-white transition-colors">
                    {copiedBase ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Breakdown VAT */}
              <div className="flex justify-between items-center bg-black/30 p-4 rounded-2xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-slate-400">{dict.tools.vat.vatAmount}</span>
                  <span className="text-xs text-indigo-400 font-bold">({isCustom ? (customRate || 0) : vatRate}%)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-mono text-indigo-300 break-all max-w-[150px] text-right">
                    + ${vatAmount}
                  </span>
                  <button onClick={() => copyToClipboard(vatAmount, "vat")} className="text-slate-500 hover:text-white transition-colors">
                    {copiedVat ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Breakdown Total */}
              <div className="flex justify-between items-center bg-indigo-600/20 p-5 rounded-2xl border border-indigo-500/30">
                <span className="text-white font-bold">{dict.tools.vat.totalPrice}</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-mono font-extrabold text-white break-all max-w-[150px] text-right">
                    ${totalPrice ? parseFloat(totalPrice).toFixed(2) : "0.00"}
                  </span>
                  <button onClick={() => copyToClipboard(totalPrice || "0", "total")} className="text-indigo-300 hover:text-white transition-colors">
                    {copiedTotal ? <Check className="w-6 h-6 text-emerald-400" /> : <Copy className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
