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
  id: string;
  name: string;
  slug?: string | null;
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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    try {
      const [mRes, gRes] = await Promise.all([
        fetch("/api/members", { cache: "no-store" }),
        fetch("/api/gangs", { cache: "no-store" }),
      ]);

      const mJson: any = await mRes.json().catch(() => ({}));
      const gJson: any = await gRes.json().catch(() => ({}));

      // members รองรับหลายรูปแบบ
      const mRows: Member[] =
        Array.isArray(mJson) ? mJson :
        Array.isArray(mJson.members) ? mJson.members :
        Array.isArray(mJson.data) ? mJson.data :
        [];

      // gangs รองรับ data
      const gRows: Gang[] =
        Array.isArray(gJson) ? gJson :
        Array.isArray(gJson.gangs) ? gJson.gangs :
        Array.isArray(gJson.data) ? gJson.data :
        [];

      setMembers(mRows);
      setGangs(gRows);
    } catch {
      setMembers([]);
      setGangs([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const isEdit = modal === "edit" && selected;
      const url = isEdit ? `/api/members/${selected!.id}` : "/api/members";
      const method = isEdit ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      await loadData();
      setModal(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(member: Member) {
    if (!confirm(`ลบ ${member.name}?`)) return;

    await fetch(`/api/members/${member.id}`, { method: "DELETE" });
    await loadData();
  }

  function openAdd() {
    const first = gangs[0];
    const gangValue = (first?.slug ?? first?.id ?? "") as string;

    setSelected(null);
    setForm({ name: "", gang_slug: gangValue });
    setModal("add");
  }

  function openEdit(m: Member) {
    setSelected(m);
    setForm({ name: m.name, gang_slug: m.gang_slug });
    setModal("edit");
  }

  const filtered = (Array.isArray(members) ? members : []).filter((m) =>
    String(m?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-8 py-4 flex justify-between">
        <Link href="/admin/dashboard">← Dashboard</Link>
      </header>

      <div className="px-8 py-10 max-w-4xl mx-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-3xl uppercase">Members</h1>
          <button onClick={openAdd} className="border px-4 py-2">
            + Add
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 border px-3 py-2 bg-black"
        />

        {loading ? (
          <div>Loading...</div>
        ) : filtered.length === 0 ? (
          <div>No members</div>
        ) : (
          filtered.map((member) => (
            <div key={member.id} className="flex justify-between border-b py-3">
              <div>
                <div>{member.name}</div>
                <div className="text-sm text-zinc-500">{member.gang_slug}</div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => openEdit(member)}>Edit</button>
                <button onClick={() => handleDelete(member)}>Del</button>
              </div>
            </div>
          ))
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 w-96">
            <h2 className="mb-4">{modal === "add" ? "Add Member" : "Edit Member"}</h2>

            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mb-3 border px-3 py-2 bg-black"
            />

            <select
              value={form.gang_slug}
              onChange={(e) => setForm({ ...form, gang_slug: e.target.value })}
              className="w-full mb-4 border px-3 py-2 bg-black"
            >
              {gangs.map((g) => {
                const value = (g.slug ?? g.id) as string;
                return (
                  <option key={g.id} value={value}>
                    {g.name}
                  </option>
                );
              })}
            </select>

            <button
              onClick={handleSave}
              disabled={!form.name || saving}
              className="w-full border py-2"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}