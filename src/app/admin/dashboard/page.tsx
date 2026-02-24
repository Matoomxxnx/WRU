"use client";

import { useEffect, useState } from "react";

type Role = "founder" | "leader" | "member";
type Member = {
  id: string;
  name: string;
  role: Role;
  facebook_url: string | null;
  avatar_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export default function AdminDashboard() {
  const [items, setItems] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("member");
  const [facebook_url, setFacebook] = useState("");
  const [avatar_url, setAvatar] = useState("");
  const [sort_order, setSort] = useState(0);

  async function load() {
    const r = await fetch("/api/members", { cache: "no-store" });
    const j = await r.json();
    setItems(j?.data ?? []);
  }

  async function add() {
    if (!name.trim()) return alert("ใส่ชื่อก่อน");
    const r = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        role,
        facebook_url: facebook_url.trim() || null,
        avatar_url: avatar_url.trim() || null,
        sort_order,
        is_active: true,
      }),
    });
    const j = await r.json();
    if (!r.ok) return alert(j?.message ?? "error");
    setName(""); setFacebook(""); setAvatar(""); setSort(0); setRole("member");
    load();
  }

  async function del(id: string) {
    if (!confirm("ลบใช่ไหม")) return;
    const r = await fetch(`/api/members?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const j = await r.json();
    if (!r.ok) return alert(j?.message ?? "error");
    load();
  }

  async function toggleActive(m: Member) {
    const r = await fetch("/api/members", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: m.id, is_active: !m.is_active }),
    });
    const j = await r.json();
    if (!r.ok) return alert(j?.message ?? "error");
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard (Members)</h1>

        <div className="grid md:grid-cols-2 gap-3 rounded-xl border border-white/10 p-4 bg-white/5">
          <input className="px-3 py-2 rounded bg-black/40 border border-white/10"
            placeholder="name" value={name} onChange={(e)=>setName(e.target.value)} />
          <select className="px-3 py-2 rounded bg-black/40 border border-white/10"
            value={role} onChange={(e)=>setRole(e.target.value as Role)}>
            <option value="founder">founder</option>
            <option value="leader">leader</option>
            <option value="member">member</option>
          </select>
          <input className="px-3 py-2 rounded bg-black/40 border border-white/10"
            placeholder="facebook_url" value={facebook_url} onChange={(e)=>setFacebook(e.target.value)} />
          <input className="px-3 py-2 rounded bg-black/40 border border-white/10"
            placeholder="avatar_url" value={avatar_url} onChange={(e)=>setAvatar(e.target.value)} />
          <input className="px-3 py-2 rounded bg-black/40 border border-white/10"
            type="number" placeholder="sort_order" value={sort_order}
            onChange={(e)=>setSort(Number(e.target.value))} />
          <button onClick={add} className="px-4 py-2 rounded bg-white text-black font-bold">
            Add Member
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="p-3 text-sm text-white/70">ทั้งหมด: {items.length}</div>
          <div className="divide-y divide-white/10">
            {items.map((m) => (
              <div key={m.id} className="p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-bold truncate">{m.name}</div>
                  <div className="text-xs text-white/50">
                    role: {m.role} • sort: {m.sort_order} • active: {String(m.is_active)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(m)} className="px-3 py-2 rounded border border-white/15">
                    {m.is_active ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => del(m.id)} className="px-3 py-2 rounded border border-red-500/40 text-red-300">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-white/40">
          หน้าเว็บโชว์: /meenpro (ดึงจาก /api/members)
        </div>
      </div>
    </div>
  );
}