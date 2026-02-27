"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

export default function AdminPage() {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => code.trim().length > 0 && !loading, [code, loading]);

  async function onEnter() {
    if (!canSubmit) return;

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.ok) {
        setMsg("รหัสไม่ถูกต้อง — Access Denied");
        return;
      }

      // ✅ ผ่านแล้ว (เปลี่ยนปลายทางได้)
      window.location.href = "/admin/dashboard";
    } catch {
      setMsg("เชื่อมต่อไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ padding: 24 }}>
      <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: ".02em" }}>WRU</div>

      <div style={{ marginTop: 16, fontWeight: 700 }}>Admin Access</div>

      <div style={{ marginTop: 10 }}>
        <div style={{ marginBottom: 6 }}>Access Code</div>
        <input
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter()}
          style={{ width: 260, height: 34 }}
        />
      </div>

      {msg && <div style={{ marginTop: 10, opacity: 0.9 }}>{msg}</div>}

      <button
        onClick={onEnter}
        disabled={!canSubmit}
        style={{ marginTop: 12, height: 34, width: 120 }}
      >
        {loading ? "Checking..." : "Enter"}
      </button>

      <div style={{ marginTop: 12 }}>
        <Link href="/">← Back</Link>
      </div>
    </section>
  );
}