"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Plus, Trash2, Printer, RefreshCcw, HandCoins, Download } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { jsPDF } from "jspdf";
import { useDictionary } from "../../DictionaryProvider";

interface TimeEntry {
  id: string;
  h: string;
  m: string;
}

export default function TimeCalculator() {
  const dict = useDictionary();

  // Initialize with 5 empty rows
  const [entries, setEntries] = useState<TimeEntry[]>(Array.from({ length: 5 }, () => ({ id: uuidv4(), h: "", m: "" })));
  const [hourlyRate, setHourlyRate] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const addEntry = () => {
    setEntries([...entries, { id: uuidv4(), h: "", m: "" }]);
  };

  const removeEntry = (id: string) => {
    if (entries.length > 1) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const updateEntry = (id: string, field: "h" | "m", value: string) => {
    // Basic validation to only allow numbers up to 2 chars, max 59 for minutes
    let val = value.replace(/\D/g, "").slice(0, 2);
    if (field === "m" && parseInt(val) > 59) val = "59";
    
    setEntries(
      entries.map((e) => {
        if (e.id === id) {
          return { ...e, [field]: val };
        }
        return e;
      })
    );
  };

  const clearAll = () => {
    setEntries(Array.from({ length: 5 }, () => ({ id: uuidv4(), h: "", m: "" })));
    setHourlyRate("");
    setName("");
    setDate("");
  };

  const handlePrint = () => {
    window.print();
  };

  const { totalMins, displayTotal, totalDecimal, totalPay } = useMemo(() => {
    const mins = entries.reduce((acc, curr) => {
      const h = parseInt(curr.h) || 0;
      const m = parseInt(curr.m) || 0;
      return acc + (h * 60) + m;
    }, 0);

    const hours = Math.floor(mins / 60);
    const remainderMins = mins % 60;
    const totalStr = `${hours.toString().padStart(2, "0")}:${remainderMins.toString().padStart(2, "0")}`;
    
    const decimal = (mins / 60).toFixed(2);
    const pay = (parseFloat(decimal) * (parseFloat(hourlyRate) || 0)).toFixed(2);

    return { totalMins: mins, displayTotal: totalStr, totalDecimal: decimal, totalPay: pay };
  }, [entries, hourlyRate]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.text(dict.tools.time.receipt, 20, 20);
    
    // Subheader
    doc.setFontSize(14);
    const dateStr = date || new Date().toLocaleDateString();
    const nameStr = name || "__________________";
    doc.text(nameStr, 20, 30);
    doc.text(dateStr, 150, 30);
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Table Header
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    let y = 45;
    doc.text(`${dict.tools.time.hours}:${dict.tools.time.minutes}`, 20, y);
    doc.text(dict.tools.time.decimal, 150, y);
    
    // Table content
    doc.setFont("helvetica", "normal");
    y += 10;
    entries.forEach((entry) => {
        const h = entry.h || "00";
        const m = entry.m || "00";
        const dec = ((parseInt(entry.h)||0) + (parseInt(entry.m)||0)/60).toFixed(2);
        
        doc.text(`${h}:${m}`, 20, y);
        doc.text(dec, 150, y);
        y += 10;
        
        // Add new page if y exceeds A4 height
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });
    
    // Line separator
    doc.line(20, y, 190, y);
    y += 10;
    if (y > 260) { doc.addPage(); y = 20; }
    
    // Summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(`${dict.tools.time.totalHours}:`, 20, y);
    doc.text(displayTotal, 80, y);
    y += 8;
    
    doc.text(`${dict.tools.time.totalDecimal}:`, 20, y);
    doc.text(totalDecimal, 80, y);
    y += 8;
    
    doc.text(`${dict.tools.time.hourlyRate}:`, 20, y);
    doc.text(`$${hourlyRate || "0.00"}`, 80, y);
    y += 15;
    
    // Total Pay
    doc.setFontSize(16);
    doc.text(`${dict.tools.time.totalPay}:`, 20, y);
    doc.text(`$${totalPay}`, 80, y);
    
    doc.save("Time-Receipt.pdf");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      
      {/* Non-Printable Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6 print:hidden">
        <div className="flex items-start md:items-center">
          <Link
            href="/?tab=calc"
            className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors inline-block shrink-0 mt-1 md:mt-0"
          >
            <ArrowLeft className="w-6 h-6 text-slate-300" />
          </Link>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 flex items-center flex-wrap gap-2">
              {dict.dashboard.tools.timeCalculator.title} <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 shrink-0" />
            </h1>
            <p className="text-slate-400 mt-2">
              {dict.dashboard.tools.timeCalculator.desc}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 sm:gap-4 w-full md:w-auto">
          <button
            onClick={clearAll}
            className="flex-1 md:flex-none justify-center px-4 py-3 sm:py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium border border-white/10 flex items-center transition-all min-w-[3rem]"
            title={dict.tools.time.clearAll}
          >
            <RefreshCcw className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">{dict.tools.time.clearAll}</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex-1 md:flex-none justify-center px-6 py-3 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/25 flex items-center transition-all min-w-[3rem]"
          >
            <Download className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 md:flex-none justify-center px-6 py-3 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/25 flex items-center transition-all min-w-[3rem]"
          >
            <Printer className="w-5 h-5 sm:w-4 sm:h-4 sm:mr-2" />
            <span className="hidden sm:inline">{dict.tools.time.print}</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Header */}
      <div className="hidden print:block mb-8 text-black border-b border-black/20 pb-4">
        <h1 className="text-3xl font-bold mb-2">{dict.tools.time.receipt}</h1>
        <div className="flex justify-between text-lg">
          <span className="font-semibold">{name || "__________________"}</span>
          <span>{date || "____/____/____"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:flex print:flex-col print:gap-4 print:m-0 print:p-0">
        
        {/* Left Column: Time Entries */}
        <div className="lg:col-span-7 bg-black/40 print:bg-transparent backdrop-blur-md border border-white/10 print:border-none rounded-3xl p-6 lg:p-8 print:p-0 shadow-2xl print:shadow-none print:text-black">
          
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 print:border-black/20">
             <div className="flex gap-8 sm:gap-16 font-semibold text-slate-400 print:text-black uppercase tracking-wider text-sm">
                <span>{dict.tools.time.hours}</span>
                <span>{dict.tools.time.minutes}</span>
             </div>
             <span className="font-semibold text-slate-400 print:text-black uppercase tracking-wider text-sm hidden sm:block">
               {dict.tools.time.decimal}
             </span>
          </div>

          <div className="space-y-4">
            {entries.map((entry, index) => {
              const rowDecimal = (
                 (parseInt(entry.h) || 0) + (parseInt(entry.m) || 0) / 60
              ).toFixed(2);

              return (
                <div key={entry.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="00"
                        value={entry.h}
                        onChange={(e) => updateEntry(entry.id, "h", e.target.value)}
                        className="w-16 sm:w-20 print:w-16 bg-black/50 print:bg-transparent border border-white/10 print:border-b print:border-black/20 print:border-x-0 print:border-t-0 print:rounded-none rounded-xl py-3 print:py-1 text-center text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono transition-all print:text-black"
                      />
                      <span className="absolute -right-2 sm:-right-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold hidden sm:block print:block">:</span>
                    </div>
                    
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="00"
                        value={entry.m}
                        onChange={(e) => updateEntry(entry.id, "m", e.target.value)}
                        className="w-16 sm:w-20 print:w-16 bg-black/50 print:bg-transparent border border-white/10 print:border-b print:border-black/20 print:border-x-0 print:border-t-0 print:rounded-none rounded-xl py-3 print:py-1 text-center text-white text-xl font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono transition-all print:text-black"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-6">
                    <span className="text-lg font-mono text-cyan-400 print:text-black font-semibold min-w-[40px] sm:min-w-[60px] text-right hidden sm:block print:block">
                      {rowDecimal}
                    </span>
                    
                    <button
                      onClick={() => removeEntry(entry.id)}
                      disabled={entries.length === 1}
                      className="p-3 rounded-xl bg-red-500/10 text-red-400 print:hidden hover:bg-red-500/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title={dict.tools.time.remove}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={addEntry}
            className="w-full mt-6 py-4 rounded-xl border-2 border-dashed border-white/10 print:hidden hover:border-cyan-500/50 hover:bg-cyan-500/5 text-slate-400 hover:text-cyan-400 font-bold flex items-center justify-center transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            {dict.tools.time.addEntry}
          </button>
        </div>

        {/* Right Column: Settings & Summary */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Settings Card */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl print:hidden">
             
             <div className="space-y-6">
               <div>
                  <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    {dict.tools.time.hourlyRate}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      placeholder={dict.tools.time.ratePlaceholder}
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-white text-xl font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono"
                    />
                  </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                 <div>
                    <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {dict.tools.time.name}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      {dict.tools.time.date}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-[10px] sm:text-base leading-none"
                    />
                 </div>
               </div>
             </div>
          </div>

          {/* Results Summary Card */}
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border print:border-none border-cyan-500/20 print:bg-transparent backdrop-blur-md rounded-3xl p-8 print:p-0 shadow-2xl flex-grow flex flex-col justify-center relative overflow-hidden print:mt-4 print:overflow-visible">
            {/* Ambient Background Glow */}
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 print:hidden"></div>
            
            <div className="space-y-6 print:space-y-2 relative z-10 print:text-black print:w-full print:max-w-md print:self-end">
              {/* Total Hours */}
              <div className="flex justify-between items-center bg-black/30 print:bg-transparent p-4 print:p-2 rounded-2xl print:rounded-none border border-white/5 print:border-b print:border-black/20 print:border-x-0 print:border-t-0">
                <span className="text-slate-400 print:text-slate-600 font-semibold">{dict.tools.time.totalHours}</span>
                <span className="text-2xl print:text-xl font-mono text-white print:text-black font-bold text-right">
                  {displayTotal}
                </span>
              </div>

              {/* Total Decimal */}
              <div className="flex justify-between items-center bg-black/30 print:bg-transparent p-4 print:p-2 rounded-2xl print:rounded-none border border-white/5 print:border-b print:border-black/20 print:border-x-0 print:border-t-0">
                <span className="text-slate-400 print:text-slate-600 font-semibold">{dict.tools.time.totalDecimal}</span>
                <span className="text-2xl print:text-xl font-mono text-cyan-300 print:text-black font-bold text-right">
                  {totalDecimal}
                </span>
              </div>

              {/* Total Pay */}
              <div className="flex justify-between items-center bg-cyan-600/20 print:bg-transparent p-6 print:p-4 rounded-2xl print:rounded-xl border border-cyan-500/30 print:border-2 print:border-black print:mt-6 mt-4">
                <div className="flex items-center">
                   <HandCoins className="w-6 h-6 mr-3 text-cyan-400 print:text-black" />
                   <span className="text-white print:text-black font-bold text-lg">{dict.tools.time.totalPay}</span>
                </div>
                <span className="text-4xl print:text-3xl font-mono font-extrabold text-white print:text-black text-right">
                  ${totalPay}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
