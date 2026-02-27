"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Member = {
  id: number;
  name: string;
  nickname: string;
  role: string;
  status: "active" | "inactive";
};

export default function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [editing, setEditing] = useState<Member | null>(null);

  useEffect(() => {
    fetch("/api/members")
      .then((r) => r.json())
      .then((data) => { setMembers(data); setLoading(false); });
  }, []);

  const filtered = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.nickname.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  const activeCount = members.filter((m) => m.status === "active").length;
  const inactiveCount = members.filter((m) => m.status === "inactive").length;

  function toggleStatus(id: number) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === "active" ? "inactive" : "active" } : m
      )
    );
  }

  return (
    <main
      className="min-h-screen bg-zinc-950 text-white"
      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');`}</style>

      {/* TOPBAR */}
      <header className="border-b border-zinc-800 bg-black px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <span className="text-xl tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            W<span className="text-red-600">R</span>U
          </span>
          <span className="text-xs tracking-[0.3em] text-zinc-600 uppercase">/ Admin</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/members" className="text-xs tracking-[0.3em] text-zinc-600 uppercase hover:text-white transition-colors">
            View Site
          </Link>
          <Link href="/api/auth/logout" className="text-xs tracking-[0.3em] text-zinc-600 uppercase hover:text-white transition-colors">
            Logout
          </Link>
        </div>
      </header>

      <div className="px-8 py-8 max-w-5xl mx-auto">

        {/* PAGE TITLE */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.4em] text-red-600 uppercase mb-1">Admin</p>
          <h1 className="text-6xl leading-none uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Dashboard
          </h1>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { label: "Total", value: members.length, accent: "text-white" },
            { label: "Active", value: activeCount, accent: "text-green-500" },
            { label: "Inactive", value: inactiveCount, accent: "text-zinc-500" },
          ].map((s) => (
            <div key={s.label} className="border border-zinc-800 p-6 bg-black">
              <div className={`text-6xl leading-none ${s.accent}`} style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {loading ? "—" : s.value}
              </div>
              <div className="text-xs tracking-[0.3em] text-zinc-600 uppercase mt-2">{s.label}</div>
            </div>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search name / nickname..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-black border border-zinc-800 text-white text-sm tracking-wider py-3 px-4 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700"
          />
          <div className="flex border border-zinc-800 overflow-hidden">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-3 text-xs tracking-[0.2em] uppercase font-semibold transition-colors ${
                  filter === f ? "bg-white text-black" : "text-zinc-500 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="border border-zinc-800">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-900 border-b border-zinc-800">
            {["#", "Name", "Nickname", "Role", "Status", "Action"].map((h, i) => (
              <div key={h} className={`${i === 0 ? "col-span-1" : i === 1 ? "col-span-3" : i === 2 ? "col-span-2" : i === 3 ? "col-span-3" : i === 4 ? "col-span-1" : "col-span-2"} text-xs tracking-[0.3em] text-zinc-600 uppercase`}>
                {h}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="py-16 text-center text-xs tracking-[0.4em] text-zinc-700 uppercase">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs tracking-[0.4em] text-zinc-700 uppercase">No results</div>
          ) : (
            filtered.map((member) => (
              <div
                key={member.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-900 hover:bg-zinc-900 group transition-colors"
              >
                <div className="col-span-1 flex items-center">
                  <span className="text-2xl text-zinc-700 group-hover:text-red-600 transition-colors leading-none"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {String(member.id).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="font-bold tracking-widest uppercase text-sm">{member.name}</span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-xs tracking-[0.2em] text-zinc-500 uppercase font-mono">{member.nickname}</span>
                </div>
                <div className="col-span-3 flex items-center">
                  <span className="text-sm text-zinc-500">{member.role}</span>
                </div>
                <div className="col-span-1 flex items-center">
                  <button
                    onClick={() => toggleStatus(member.id)}
                    className={`text-xs font-semibold tracking-[0.2em] uppercase transition-colors ${
                      member.status === "active"
                        ? "text-green-500 hover:text-yellow-500"
                        : "text-zinc-600 hover:text-green-500"
                    }`}
                    title="Click to toggle"
                  >
                    {member.status}
                  </button>
                </div>
                <div className="col-span-2 flex items-center gap-4">
                  <button
                    onClick={() => setEditing(member)}
                    className="text-xs tracking-wider text-zinc-600 hover:text-white uppercase transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove ${member.name}?`)) {
                        setMembers((prev) => prev.filter((m) => m.id !== member.id));
                      }
                    }}
                    className="text-xs tracking-wider text-zinc-700 hover:text-red-600 uppercase transition-colors"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-xs tracking-[0.3em] text-zinc-700 uppercase mt-3">
          Showing {filtered.length} of {members.length}
        </p>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                Edit Member
              </h2>
              <button onClick={() => setEditing(null)} className="text-zinc-600 hover:text-white text-xs tracking-[0.3em] uppercase">
                Close
              </button>
            </div>

            <div className="space-y-4">
              {(["name", "nickname", "role"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-xs tracking-[0.3em] text-zinc-600 uppercase mb-2">{field}</label>
                  <input
                    type="text"
                    value={editing[field]}
                    onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                    className="w-full bg-black border border-zinc-800 text-white text-sm tracking-wider py-3 px-4 outline-none focus:border-zinc-600 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs tracking-[0.3em] text-zinc-600 uppercase mb-2">Status</label>
                <select
                  value={editing.status}
                  onChange={(e) => setEditing({ ...editing, status: e.target.value as "active" | "inactive" })}
                  className="w-full bg-black border border-zinc-800 text-white text-sm tracking-wider py-3 px-4 outline-none focus:border-zinc-600 transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setMembers((prev) => prev.map((m) => (m.id === editing.id ? editing : m)));
                setEditing(null);
              }}
              className="mt-8 w-full border border-white text-white py-3 text-xs tracking-[0.4em] uppercase font-semibold hover:bg-white hover:text-black transition-all duration-200"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </main>
  );
}