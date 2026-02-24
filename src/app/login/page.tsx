"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const login = async () => {
    // แบบ magic link (ง่ายสุด)
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert("เช็คอีเมลเพื่อกดลิงก์เข้าสู่ระบบ");
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-3">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <input
          className="w-full px-3 py-2 rounded bg-white/5 border border-white/10"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={login}
          className="w-full px-4 py-2 rounded bg-white text-black font-bold"
        >
          Send Login Link
        </button>
      </div>
    </div>
  );
}