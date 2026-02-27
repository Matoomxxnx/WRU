"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function LandingPage() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    setTimeout(() => {
      el.style.transition = "opacity 1s ease, transform 1s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 100);
  }, []);

  return (
    <main
      className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col"
      style={{ fontFamily: "'Barlow Condensed', sans-serif", cursor: "crosshair" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700;900&display=swap');
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px) } to { opacity:1; transform:translateY(0) } }
        .marquee { animation: marquee 24s linear infinite; }
        .fade-1 { opacity:0; animation: fadeUp 1s ease 0.3s forwards; }
        .fade-2 { opacity:0; animation: fadeUp 1s ease 0.6s forwards; }
        .fade-3 { opacity:0; animation: fadeUp 1s ease 0.9s forwards; }
      `}</style>

      {/* BG ghost text */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
        <span className="text-[40vw] font-black tracking-tighter text-white leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", opacity: 0.018 }}>
          WRU
        </span>
      </div>

      {/* NAV */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 border-b border-zinc-900">
        <span className="text-2xl tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          W<span className="text-red-600">R</span>U
        </span>
        <div className="flex items-center gap-8">
          <Link href="/members" className="text-xs tracking-[0.3em] text-zinc-500 uppercase hover:text-white transition-colors">Members</Link>
          <Link href="/login" className="text-xs tracking-[0.3em] text-zinc-500 uppercase hover:text-white transition-colors">Login</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-8 py-20">
        <p className="fade-1 text-xs tracking-[0.5em] text-red-600 uppercase mb-6">
          Born to be die for WRU
        </p>
        <h1
          ref={titleRef}
          className="leading-none tracking-tight uppercase"
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(72px, 18vw, 260px)" }}
        >
          WHERE<br />
          <span style={{ WebkitTextStroke: "1px rgba(255,255,255,0.25)", color: "transparent" }}>ARE</span><br />
          YOU
        </h1>
        <p className="fade-2 text-sm tracking-[0.5em] text-zinc-600 uppercase mt-8">
          Collective — Est. 2024
        </p>
        <div className="fade-3 mt-12 flex items-center gap-6">
          <Link
            href="/members"
            className="border border-white text-white px-10 py-3 text-xs tracking-[0.4em] uppercase font-semibold hover:bg-white hover:text-black transition-all duration-200"
          >
            Members
          </Link>
          <Link
            href="/login"
            className="text-xs tracking-[0.4em] text-zinc-500 uppercase hover:text-white transition-colors"
          >
            Admin →
          </Link>
        </div>
      </section>

      {/* MARQUEE BOTTOM */}
      <div className="relative z-10 border-t border-zinc-900 py-4 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap marquee">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="text-xs tracking-[0.4em] text-zinc-800 uppercase flex-shrink-0">
              WHERE ARE YOU <span className="text-red-900 mx-3">✦</span> WRU COLLECTIVE <span className="text-red-900 mx-3">✦</span>
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}