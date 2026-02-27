"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onEnter() {
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setMsg("รหัสไม่ถูกต้อง — Access Denied");
        return;
      }

      // ✅ เข้าผ่านแล้ว: พาไปหน้า admin dashboard ของคุณ
      window.location.href = "/admin/dashboard";
    } catch (e) {
      setMsg("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Admin Access</h1>

      <div style={{ marginTop: 12 }}>
        <div>Access Code</div>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          type="password"
          style={{ width: 260 }}
        />
      </div>

      <button onClick={onEnter} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? "Checking..." : "Enter"}
      </button>

      {msg && <div style={{ marginTop: 10, opacity: 0.9 }}>{msg}</div>}

      <div style={{ marginTop: 10 }}>
        <Link href="/">← Back</Link>
      </div>
    </div>
  );
}