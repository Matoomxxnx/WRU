"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j?.ok) {
        setMsg(j?.message ?? "รหัสไม่ถูกต้อง — Access Denied");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="relative w-full max-w-xl">
        {/* background huge WRU */}
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center opacity-[0.08]">
          <div className="text-[220px] font-black tracking-[0.2em] leading-none">WRU</div>
        </div>

        <div className="relative mx-auto w-full max-w-md text-center">
          {/* Logo */}
          <div className="text-6xl font-black tracking-[0.25em]">
            W<span className="text-red-600">R</span>U
          </div>
          <div className="mt-2 text-[10px] tracking-[0.45em] text-zinc-500 uppercase">
            Admin Access
          </div>

          <div className="mt-10 text-[10px] tracking-[0.45em] text-zinc-500 uppercase text-left">
            Access Code
          </div>

          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="mt-2 w-full bg-black border border-zinc-700 px-4 py-4 text-center tracking-[0.35em] outline-none focus:border-zinc-400"
            placeholder="••••••••"
          />

          {msg && (
            <div className="mt-3 text-xs tracking-wide text-red-400">
              {msg}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading || !code}
            className="mt-6 w-full border border-zinc-400 py-4 text-[11px] tracking-[0.45em] uppercase hover:border-white hover:text-white transition disabled:opacity-40"
          >
            {loading ? "..." : "Enter"}
          </button>

          <div className="mt-6">
            <Link
              href="/"
              className="text-[11px] tracking-[0.35em] text-zinc-400 hover:text-white transition uppercase"
            >
              ← Back
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}