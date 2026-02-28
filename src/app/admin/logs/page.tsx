"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Log = {
  id: string;
  action: string;
  detail: string;
  created_at: string;
};

const ACTION_COLORS: Record<string, string> = {
  ADD_MEMBER: "text-green-500",
  EDIT_MEMBER: "text-yellow-500",
  DELETE_MEMBER: "text-red-500",
  ADD_GANG: "text-green-400",
  EDIT_GANG: "text-yellow-400",
  DELETE_GANG: "text-red-400",
};

export default function AdminLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/admin/logs")
      .then((r) => r.json())
      .then((data) => { setLogs(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  const actions = ["all", ...Array.from(new Set(logs.map((l) => l.action)))];
  const filtered = filter === "all" ? logs : logs.filter((l) => l.action === filter);

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" });
  }

  async function clearLogs() {
    if (!confirm("ลบ log ทั้งหมด?")) return;
    await fetch("/api/admin/logs", { method: "DELETE" });
    setLogs([]);
  }

  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');`}</style>

      <header className="border-b border-zinc-900 bg-black px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard"><span className="text-xl tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>W<span className="text-red-600">R</span>U</span></Link>
          <span className="text-xs tracking-[0.3em] text-zinc-600 uppercase">/ Logs</span>
        </div>
        <Link href="/admin/dashboard" className="text-xs tracking-[0.3em] text-zinc-600 uppercase hover:text-white transition-colors">← Dashboard</Link>
      </header>

      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.4em] text-red-600 uppercase mb-1">Admin</p>
            <h1 className="text-7xl leading-none uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Logs</h1>
            <p className="text-xs tracking-[0.3em] text-zinc-600 uppercase mt-3">{logs.length} entries</p>
          </div>
          {logs.length > 0 && (
            <button onClick={clearLogs} className="border border-red-900 text-red-700 px-6 py-3 text-xs tracking-[0.3em] uppercase font-semibold hover:bg-red-900 hover:text-white transition-all duration-200">
              Clear All
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {actions.map((a) => (
            <button key={a} onClick={() => setFilter(a)}
              className={`px-4 py-2 text-xs tracking-[0.2em] uppercase font-semibold border transition-colors ${
                filter === a ? "border-white bg-white text-black" : "border-zinc-800 text-zinc-500 hover:text-white"
              }`}>
              {a}
            </button>
          ))}
        </div>

        {/* Logs Table */}
        <div className="border border-zinc-900">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-950 border-b border-zinc-900">
            <div className="col-span-3 text-xs tracking-[0.3em] text-zinc-600 uppercase">Action</div>
            <div className="col-span-6 text-xs tracking-[0.3em] text-zinc-600 uppercase">Detail</div>
            <div className="col-span-3 text-xs tracking-[0.3em] text-zinc-600 uppercase">Time</div>
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs tracking-[0.4em] text-zinc-700 uppercase">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs tracking-[0.4em] text-zinc-700 uppercase">No logs</div>
          ) : (
            filtered.map((log) => (
              <div key={log.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-900 hover:bg-zinc-950 transition-colors">
                <div className="col-span-3 flex items-center">
                  <span className={`text-xs font-bold tracking-[0.2em] uppercase ${ACTION_COLORS[log.action] ?? "text-zinc-400"}`}>
                    {log.action}
                  </span>
                </div>
                <div className="col-span-6 flex items-center">
                  <span className="text-sm text-zinc-400">{log.detail}</span>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="text-xs text-zinc-600 font-mono">{formatDate(log.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}