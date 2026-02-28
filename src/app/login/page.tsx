"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: code }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("รหัสไม่ถูกต้อง — Access Denied");
      setLoading(false);
      setCode("");
    }
  }

  return (
    <main
      className="min-h-screen bg-black flex flex-col items-center justify-center"
      style={{ fontFamily: "'Barlow Condensed', sans-serif", cursor: "crosshair" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        .fu1 { opacity:0; animation: fadeUp 0.8s ease 0.1s forwards; }
        .fu2 { opacity:0; animation: fadeUp 0.8s ease 0.3s forwards; }
        .fu3 { opacity:0; animation: fadeUp 0.8s ease 0.5s forwards; }
      `}</style>

      {/* Ghost BG */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden>
        <span className="text-[35vw] font-black tracking-tighter text-white leading-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", opacity: 0.018 }}>
          WRU
        </span>
      </div>

      <div className="relative z-10 w-full max-w-xs px-8">
        {/* Logo */}
        <div className="fu1 text-center mb-14">
          <Link href="/">
            <h1 className="text-7xl tracking-[0.3em] inline-block"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              W<span className="text-red-600">R</span>U
            </h1>
          </Link>
          <p className="text-xs tracking-[0.4em] text-zinc-700 uppercase mt-2">Admin Access</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="fu2 space-y-5">
          <div>
            <label className="block text-xs tracking-[0.3em] text-zinc-600 uppercase mb-3">
              Access Code
            </label>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full bg-transparent border border-zinc-800 text-white text-center text-2xl tracking-[0.5em] py-4 px-4 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-800"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs tracking-[0.25em] uppercase text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !code}
            className="w-full border border-white text-white py-4 text-xs tracking-[0.4em] uppercase font-semibold hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-25 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Enter"}
          </button>
        </form>

        <div className="fu3 mt-10 text-center">
          <Link href="/" className="text-xs tracking-[0.3em] text-zinc-700 uppercase hover:text-zinc-400 transition-colors">
            ← Back
          </Link>
        </div>
      </div>
    </main>
  );
}