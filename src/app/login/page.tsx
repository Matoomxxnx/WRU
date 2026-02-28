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
    <main style={{
      minHeight: "100vh",
      background: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 16px",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Arial",
    }}>
      {/* Ghost BG */}
      <div style={{
        position: "fixed", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        pointerEvents: "none", userSelect: "none", overflow: "hidden",
      }}>
        <span style={{
          fontSize: "35vw", fontWeight: 900,
          letterSpacing: "-0.05em", color: "rgba(255,255,255,0.018)",
          lineHeight: 1,
        }}>WRU</span>
      </div>

      {/* Light */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1,
        background: "radial-gradient(560px 320px at 55% 20%, rgba(255,255,255,0.06), transparent 62%)",
      }} />

      {/* Card */}
      <div style={{
        position: "relative", zIndex: 2,
        width: "100%", maxWidth: "360px",
        border: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
        padding: "48px 36px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            fontSize: "56px", fontWeight: 900,
            letterSpacing: "0.3em", color: "#fff", lineHeight: 1,
          }}>
            W<span style={{ color: "#cc2200" }}>R</span>U
          </div>
          <div style={{
            fontSize: "10px", letterSpacing: "0.4em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
            marginTop: "8px",
          }}>Admin Access</div>
        </div>

        {/* Label */}
        <div style={{
          fontSize: "10px", letterSpacing: "0.3em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
          marginBottom: "10px",
        }}>Password</div>

        {/* Input */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onLogin()}
          placeholder="••••••••"
          autoFocus
          style={{
            width: "100%", boxSizing: "border-box",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff", fontSize: "20px",
            letterSpacing: "0.4em", textAlign: "center",
            padding: "14px 16px", outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(255,255,255,0.4)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
        />

        {/* Error */}
        {msg && (
          <div style={{
            marginTop: "12px", fontSize: "12px",
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#ff4444", textAlign: "center",
          }}>{msg}</div>
        )}

        {/* Button */}
        <button
          onClick={onLogin}
          disabled={loading || !password}
          style={{
            marginTop: "24px", width: "100%",
            border: "1px solid rgba(255,255,255,0.8)",
            background: "transparent", color: "#fff",
            fontSize: "11px", letterSpacing: "0.4em",
            textTransform: "uppercase", padding: "14px",
            cursor: loading || !password ? "not-allowed" : "pointer",
            opacity: loading || !password ? 0.3 : 1,
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!loading && password) {
              (e.target as HTMLButtonElement).style.background = "#fff";
              (e.target as HTMLButtonElement).style.color = "#000";
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.background = "transparent";
            (e.target as HTMLButtonElement).style.color = "#fff";
          }}
        >
          {loading ? "Logging in..." : "Enter"}
        </button>

        <div style={{
          marginTop: "32px", textAlign: "center",
          fontSize: "10px", letterSpacing: "0.3em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.15)",
        }}>Born to be die for WRU</div>
      </div>
    </main>
  );
}