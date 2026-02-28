"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ gangs: 0, members: 0, logs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [gangsRes, logsRes] = await Promise.all([
          fetch("/api/gangs"),
          fetch("/api/admin/logs"),
        ]);
        const gangsData = await gangsRes.json();
        const logsData = await logsRes.json();
        const totalMembers = Array.isArray(gangsData)
          ? gangsData.reduce((sum: number, g: { members?: unknown[] }) => sum + (g.members?.length ?? 0), 0)
          : 0;
        setStats({
          gangs: Array.isArray(gangsData) ? gangsData.length : 0,
          members: totalMembers,
          logs: Array.isArray(logsData) ? logsData.length : 0,
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    }
    fetchStats();
  }, []);

  const navItems = [
    { href: "/admin/members", label: "Members", sub: "เพิ่ม / ลบ / แก้ไขสมาชิก", num: stats.members },
    { href: "/admin/gangs", label: "Gangs", sub: "เพิ่ม / ลบ / แก้ไข Gang", num: stats.gangs },
    { href: "/admin/upload", label: "Upload", sub: "จัดการรูปสมาชิก", num: null },
    { href: "/admin/logs", label: "Logs", sub: "ประวัติการแก้ไข", num: stats.logs },
  ];

  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');`}</style>
      <header className="border-b border-zinc-900 bg-black px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/"><span className="text-xl tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>W<span className="text-red-600">R</span>U</span></Link>
          <span className="text-xs tracking-[0.3em] text-zinc-600 uppercase">/ Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/WRU" className="text-xs tracking-[0.3em] text-zinc-600 uppercase hover:text-white transition-colors">View Site</Link>
          <Link href="/api/auth/signout" className="text-xs tracking-[0.3em] text-zinc-600 uppercase hover:text-red-500 transition-colors">Logout</Link>
        </div>
      </header>
      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] text-red-600 uppercase mb-1">Admin</p>
          <h1 className="text-7xl leading-none uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Dashboard</h1>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-12">
          {[{ label: "Total Gangs", value: stats.gangs }, { label: "Total Members", value: stats.members }, { label: "Log Entries", value: stats.logs }].map((s) => (
            <div key={s.label} className="border border-zinc-900 p-6 bg-zinc-950">
              <div className="text-6xl leading-none text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{loading ? "—" : s.value}</div>
              <div className="text-xs tracking-[0.3em] text-zinc-600 uppercase mt-2">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="border border-zinc-900 p-8 hover:border-zinc-700 hover:bg-zinc-950 transition-all duration-200 group cursor-pointer">
                <div className="flex items-start justify-between">
                  <h2 className="text-4xl uppercase group-hover:text-red-500 transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{item.label}</h2>
                  {item.num !== null && <span className="text-2xl text-zinc-700" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{loading ? "—" : item.num}</span>}
                </div>
                <p className="text-xs tracking-[0.3em] text-zinc-600 uppercase mt-3">{item.sub}</p>
                <div className="mt-6 text-xs tracking-[0.3em] text-zinc-700 group-hover:text-zinc-400 uppercase transition-colors">Manage →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}