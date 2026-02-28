"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Member = {
  id: string;
  name: string;
  gang_slug: string;
  image_url?: string;
};

type Gang = {
  slug: string;
  name: string;
};

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [gangs, setGangs] = useState<Gang[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Member | null>(null);
  const [form, setForm] = useState({ name: "", gang_slug: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [mRes, gRes] = await Promise.all([fetch("/api/members"), fetch("/api/gangs")]);
    setMembers(await mRes.json());
    setGangs(await gRes.json());
    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const isEdit = modal === "edit" && selected;
    const url = isEdit ? `/api/members/${selected!.id}` : "/api/members";
    const method = isEdit ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await logAction(isEdit ? "EDIT_MEMBER" : "ADD_MEMBER", `${form.name} (${form.gang_slug})`);
    await loadData();
    setModal(null);
    setSaving(false);
  }

  async function handleDelete(member: Member) {
    if (!confirm(`ลบ ${member.name}?`)) return;
    await fetch(`/api/members/${member.id}`, { method: "DELETE" });
    await logAction("DELETE_MEMBER", member.name);
    await loadData();
  }

  async function logAction(action: string, detail: string) {
    await fetch("/api/admin/logs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, detail }) });
  }

  function openAdd() { setForm({ name: "", gang_slug: gangs[0]?.slug ?? "" }); setModal("add"); }
  function openEdit(m: Member) { setSelected(m); setForm({ name: m.name, gang_slug: m.gang_slug }); setModal("edit"); }

  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main className="min-h-screen bg-black text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');`}</style>

      {/* TOPBAR */}
      <header className="border-b border-zinc-900 bg-black px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard"><span className="text-xl tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>W<span className="text-red-600">R</span>U</span></Link>
          <span className="text-xs tracking-[0.3em] text-zinc-600 uppercase">/ Members</span>
        </div>
        <Link href="/admin/dashboard" className="text-xs tracking-[0.3em] text-zinc-600 uppercase hover:text-white transition-colors">← Dashboard</Link>
      </header>

      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs tracking-[0.4em] text-red-600 uppercase mb-1">Admin</p>
            <h1 className="text-7xl leading-none uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Members</h1>
          </div>
          <button onClick={openAdd} className="border border-white text-white px-6 py-3 text-xs tracking-[0.3em] uppercase font-semibold hover:bg-white hover:text-black transition-all duration-200">
            + Add Member
          </button>
        </div>

        {/* Search */}
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-black border border-zinc-800 text-white text-sm tracking-wider py-3 px-4 outline-none focus:border-zinc-600 transition-colors placeholder:text-zinc-700 mb-4" />

        {/* Table */}
        <div className="border border-zinc-900">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-zinc-950 border-b border-zinc-900">
            <div className="col-span-1 text-xs tracking-[0.3em] text-zinc-600 uppercase">#</div>
            <div className="col-span-5 text-xs tracking-[0.3em] text-zinc-600 uppercase">Name</div>
            <div className="col-span-4 text-xs tracking-[0.3em] text-zinc-600 uppercase">Gang</div>
            <div className="col-span-2 text-xs tracking-[0.3em] text-zinc-600 uppercase">Action</div>
          </div>
          {loading ? (
            <div className="py-16 text-center text-xs tracking-[0.4em] text-zinc-700 uppercase">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-xs tracking-[0.4em] text-zinc-700 uppercase">No members</div>
          ) : (
            filtered.map((member, idx) => (
              <div key={member.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-zinc-900 hover:bg-zinc-950 group transition-colors">
                <div className="col-span-1 flex items-center">
                  <span className="text-2xl text-zinc-800 group-hover:text-red-600 transition-colors leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="col-span-5 flex items-center">
                  <span className="font-bold tracking-widest uppercase text-sm">{member.name}</span>
                </div>
                <div className="col-span-4 flex items-center">
                  <span className="text-xs tracking-[0.2em] text-zinc-500 uppercase font-mono">{member.gang_slug}</span>
                </div>
                <div className="col-span-2 flex items-center gap-4">
                  <button onClick={() => openEdit(member)} className="text-xs tracking-wider text-zinc-600 hover:text-white uppercase transition-colors">Edit</button>
                  <button onClick={() => handleDelete(member)} className="text-xs tracking-wider text-zinc-700 hover:text-red-600 uppercase transition-colors">Del</button>
                </div>
              </div>
            ))
          )}
        </div>
        <p className="text-xs tracking-[0.3em] text-zinc-700 uppercase mt-3">Showing {filtered.length} of {members.length}</p>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4" onClick={() => setModal(null)}>
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                {modal === "add" ? "Add Member" : "Edit Member"}
              </h2>
              <button onClick={() => setModal(null)} className="text-zinc-600 hover:text-white text-xs tracking-[0.3em] uppercase">Close</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-[0.3em] text-zinc-600 uppercase mb-2">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black border border-zinc-800 text-white text-sm tracking-wider py-3 px-4 outline-none focus:border-zinc-600 transition-colors" />
              </div>
              <div>
                <label className="block text-xs tracking-[0.3em] text-zinc-600 uppercase mb-2">Gang</label>
                <select value={form.gang_slug} onChange={(e) => setForm({ ...form, gang_slug: e.target.value })}
                  className="w-full bg-black border border-zinc-800 text-white text-sm tracking-wider py-3 px-4 outline-none focus:border-zinc-600 transition-colors">
                  {gangs.map((g) => <option key={g.slug} value={g.slug}>{g.name}</option>)}
                </select>
              </div>
            </div>
            <button onClick={handleSave} disabled={saving || !form.name}
              className="mt-8 w-full border border-white text-white py-3 text-xs tracking-[0.4em] uppercase font-semibold hover:bg-white hover:text-black transition-all duration-200 disabled:opacity-25">
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}