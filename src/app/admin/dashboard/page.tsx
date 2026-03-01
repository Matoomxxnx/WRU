"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ members: 0, logs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [mRes, logsRes] = await Promise.all([
          fetch("/api/members"),
          fetch("/api/admin/logs"),
        ]);
        const mData = await mRes.json();
        const logsData = await logsRes.json();
        setStats({
          members: Array.isArray(mData) ? mData.length : (mData.data?.length ?? 0),
          logs: Array.isArray(logsData) ? logsData.length : (logsData.data?.length ?? 0),
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchStats();
  }, []);

  const navItems = [
    { href: "/admin/members", label: "Members", sub: "เพิ่ม / ลบ / แก้ไขสมาชิก", num: stats.members },
    { href: "/admin/logs", label: "Logs", sub: "ประวัติการแก้ไข", num: stats.logs },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; }
        .db-header { border-bottom: 1px solid #111; background: #000; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .db-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.3em; color: #fff; text-decoration: none; }
        .db-logo span { color: #cc2200; }
        .db-link { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #555; text-decoration: none; transition: color 0.2s; }
        .db-link:hover { color: #fff; }
        .db-link-danger:hover { color: #cc2200; }
        .db-body { padding: 40px 32px; max-width: 800px; margin: 0 auto; }
        .db-kicker { font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #cc2200; margin-bottom: 4px; }
        .db-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(48px, 8vw, 72px); line-height: 1; margin: 0 0 40px; }
        .db-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 40px; }
        .db-stat { border: 1px solid #111; padding: 24px; background: #080808; }
        .db-stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 56px; line-height: 1; color: #fff; }
        .db-stat-label { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #444; margin-top: 8px; }
        .db-nav { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .db-card { border: 1px solid #111; padding: 32px; text-decoration: none; color: #fff; display: block; transition: border-color 0.2s, background 0.2s; }
        .db-card:hover { border-color: #333; background: #080808; }
        .db-card:hover .db-card-label { color: #cc2200; }
        .db-card:hover .db-card-arrow { color: #666; }
        .db-card-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .db-card-label { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 0.05em; transition: color 0.2s; }
        .db-card-num { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: #333; }
        .db-card-sub { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #444; margin-top: 12px; }
        .db-card-arrow { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #333; margin-top: 24px; transition: color 0.2s; }
      `}</style>

      <header className="db-header">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/" className="db-logo">W<span>R</span>U</Link>
          <span style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#333" }}>/ Admin</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <Link href="/WRU" className="db-link">View Site</Link>
          <Link href="/api/auth/logout" className="db-link db-link-danger">Logout</Link>
        </div>
      </header>

      <div className="db-body">
        <div className="db-kicker">Admin</div>
        <h1 className="db-title">Dashboard</h1>

        <div className="db-stats">
          {[
            { label: "Total Members", value: stats.members },
            { label: "Log Entries", value: stats.logs },
          ].map((s) => (
            <div key={s.label} className="db-stat">
              <div className="db-stat-num">{loading ? "—" : s.value}</div>
              <div className="db-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="db-nav">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="db-card">
              <div className="db-card-top">
                <div className="db-card-label">{item.label}</div>
                <div className="db-card-num">{loading ? "—" : item.num}</div>
              </div>
              <div className="db-card-sub">{item.sub}</div>
              <div className="db-card-arrow">Manage →</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}