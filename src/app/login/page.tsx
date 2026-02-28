"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onLogin() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok || !j?.ok) {
        setMsg(j?.message ?? "รหัสไม่ถูกต้อง");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-zinc-800 bg-zinc-950/40 p-8">
        <div className="mb-6">
          <div className="text-xs tracking-[0.4em] text-zinc-500 uppercase">WRU Admin</div>
          <h1 className="text-4xl mt-2 tracking-[0.15em] uppercase">Login</h1>
          <div className="text-sm text-zinc-500 mt-2">ใส่รหัสเพื่อเข้าหลังบ้าน</div>
        </div>

        <label className="block text-xs tracking-[0.3em] text-zinc-500 uppercase mb-2">
          Admin Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onLogin()}
          className="w-full bg-black border border-zinc-800 px-4 py-3 outline-none focus:border-zinc-500"
          placeholder="••••••••"
        />

        {msg && <div className="mt-3 text-sm text-red-400">{msg}</div>}

        <button
          onClick={onLogin}
          disabled={loading || !password}
          className="mt-6 w-full border border-white px-4 py-3 text-xs tracking-[0.35em] uppercase hover:bg-white hover:text-black transition disabled:opacity-30"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-6 text-xs text-zinc-600">
          หากเข้าไม่ได้ ให้เช็ค env <span className="text-zinc-400">ADMIN_PASSWORD</span> บน Vercel
        </div>
      </div>
    </main>
  );
}