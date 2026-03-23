"use client";

import { useEffect } from "react";

export default function AdBanner() {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-black/50 backdrop-blur-xl border-t border-white/10 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex justify-center items-center min-h-[66px] md:min-h-[106px]">
      {/* We add basic styling to ensure it's visible even without an ad load, 
          as AdSense might take time to verify or requires ad slots. */}
      <div className="w-full max-w-[728px] overflow-hidden flex justify-center items-center text-xs text-white/30 rounded-lg">
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client="ca-pub-1141041890300704"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
