"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Member = {
  id: string;
  name: string;
  gang_slug: string;
  image_url?: string;
  facebook_url?: string;
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
  const [form, setForm] = useState({ name: "", gang_slug: "", image_url: "", facebook_url: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [mRes, gRes] = await Promise.all([fetch("/api/members"), fetch("/api/gangs")]);
      const mJson = await mRes.json();
      const gJson = await gRes.json();
      setMembers(Array.isArray(mJson) ? mJson : mJson.data ?? []);
      setGangs(Array.isArray(gJson) ? gJson : gJson.data ?? []);
    } catch { setMembers([]); setGangs([]); }
    finally { setLoading(false); }
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

  function openAdd() {
    setForm({ name: "", gang_slug: gangs[0]?.slug ?? "", image_url: "", facebook_url: "" });
    setModal("add");
  }
  function openEdit(m: Member) {
    setSelected(m);
    setForm({ name: m.name, gang_slug: m.gang_slug, image_url: m.image_url ?? "", facebook_url: m.facebook_url ?? "" });
    setModal("edit");
  }

  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; }
        .adm-header { border-bottom: 1px solid #111; background: #000; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .adm-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.3em; color: #fff; text-decoration: none; }
        .adm-logo span { color: #cc2200; }
        .adm-link { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #555; text-decoration: none; }
        .adm-link:hover { color: #fff; }
        .adm-body { padding: 40px 32px; max-width: 900px; margin: 0 auto; }
        .adm-kicker { font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #cc2200; margin-bottom: 4px; }
        .adm-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(48px, 8vw, 72px); line-height: 1; margin: 0 0 32px; }
        .adm-toprow { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; }
        .adm-btn { border: 1px solid rgba(255,255,255,0.8); background: transparent; color: #fff; padding: 12px 24px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; transition: 0.2s; }
        .adm-btn:hover { background: #fff; color: #000; }
        .adm-input { width: 100%; background: transparent; border: 1px solid #222; color: #fff; padding: 12px 16px; font-size: 13px; outline: none; margin-bottom: 16px; font-family: inherit; }
        .adm-input:focus { border-color: #444; }
        .adm-input::placeholder { color: #333; }
        .adm-table { border: 1px solid #111; width: 100%; }
        .adm-thead { display: grid; grid-template-columns: 48px 1fr 120px 60px 100px; gap: 16px; padding: 12px 24px; background: #0a0a0a; border-bottom: 1px solid #111; }
        .adm-th { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #444; }
        .adm-row { display: grid; grid-template-columns: 48px 1fr 120px 60px 100px; gap: 16px; padding: 14px 24px; border-bottom: 1px solid #0d0d0d; transition: background 0.15s; align-items: center; }
        .adm-row:hover { background: #080808; }
        .adm-num { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #222; line-height: 1; }
        .adm-row:hover .adm-num { color: #cc2200; }
        .adm-name { font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-size: 14px; }
        .adm-gang { font-size: 11px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; }
        .adm-avatar { width: 36px; height: 36px; border-radius: 50%; overflow: hidden; background: #111; border: 1px solid #222; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #444; }
        .adm-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .adm-actions { display: flex; align-items: center; gap: 16px; }
        .adm-act { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; background: none; border: none; color: #444; cursor: pointer; font-family: inherit; }
        .adm-act:hover { color: #fff; }
        .adm-act-del:hover { color: #cc2200; }
        .adm-empty { padding: 64px 24px; text-align: center; font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; color: #333; }
        .adm-count { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #333; margin-top: 12px; }
        .adm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.88); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
        .adm-modal { background: #0a0a0a; border: 1px solid #222; width: 100%; max-width: 460px; padding: 32px; max-height: 90vh; overflow-y: auto; }
        .adm-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; }
        .adm-modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.1em; }
        .adm-close { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #444; background: none; border: none; cursor: pointer; font-family: inherit; }
        .adm-close:hover { color: #fff; }
        .adm-label { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #555; display: block; margin-bottom: 8px; }
        .adm-hint { font-size: 10px; letter-spacing: 0.1em; color: #333; margin-top: 6px; }
        .adm-field { margin-bottom: 18px; }
        .adm-select { width: 100%; background: #000; border: 1px solid #222; color: #fff; padding: 12px 16px; font-size: 13px; outline: none; font-family: inherit; }
        .adm-divider { border: none; border-top: 1px solid #1a1a1a; margin: 20px 0; }
        .adm-section-label { font-size: 10px; letter-spacing: 0.35em; text-transform: uppercase; color: #333; margin-bottom: 16px; }
        .adm-save { margin-top: 28px; width: 100%; border: 1px solid rgba(255,255,255,0.8); background: transparent; color: #fff; padding: 14px; font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; cursor: pointer; transition: 0.2s; font-family: inherit; }
        .adm-save:hover:not(:disabled) { background: #fff; color: #000; }
        .adm-save:disabled { opacity: 0.25; cursor: not-allowed; }
        .adm-preview { width: 56px; height: 56px; border-radius: 50%; overflow: hidden; background: #111; border: 1px solid #222; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; font-size: 11px; color: #333; }
        .adm-preview img { width: 100%; height: 100%; object-fit: cover; }
      `}</style>

      <header className="adm-header">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/dashboard" className="adm-logo">W<span>R</span>U</Link>
          <span style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#333" }}>/ Members</span>
        </div>
        <Link href="/admin/dashboard" className="adm-link">← Dashboard</Link>
      </header>

      <div className="adm-body">
        <div className="adm-toprow">
          <div>
            <div className="adm-kicker">Admin</div>
            <h1 className="adm-title">Members</h1>
          </div>
          <button className="adm-btn" onClick={openAdd}>+ Add Member</button>
        </div>

        <input className="adm-input" type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />

        <div className="adm-table">
          <div className="adm-thead">
            <div className="adm-th">#</div>
            <div className="adm-th">Name</div>
            <div className="adm-th">Gang</div>
            <div className="adm-th">Photo</div>
            <div className="adm-th">Action</div>
          </div>
          {loading ? (
            <div className="adm-empty">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="adm-empty">No members</div>
          ) : (
            filtered.map((member, idx) => (
              <div key={member.id} className="adm-row">
                <div className="adm-num">{String(idx + 1).padStart(2, "0")}</div>
                <div className="adm-name">{member.name}</div>
                <div className="adm-gang">{member.gang_slug}</div>
                <div>
                  <div className="adm-avatar">
                    {member.image_url
                      ? <img src={member.image_url} alt={member.name} />
                      : "—"}
                  </div>
                </div>
                <div className="adm-actions">
                  <button className="adm-act" onClick={() => openEdit(member)}>Edit</button>
                  <button className="adm-act adm-act-del" onClick={() => handleDelete(member)}>Del</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="adm-count">Showing {filtered.length} of {members.length}</div>
      </div>

      {/* MODAL */}
      {modal && (
        <div className="adm-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head">
              <div className="adm-modal-title">{modal === "add" ? "Add Member" : "Edit Member"}</div>
              <button className="adm-close" onClick={() => setModal(null)}>Close</button>
            </div>

            {/* Name */}
            <div className="adm-field">
              <label className="adm-label">Name</label>
              <input className="adm-input" style={{ marginBottom: 0 }} type="text"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            {/* Gang */}
            <div className="adm-field">
              <label className="adm-label">Gang</label>
              <select className="adm-select" value={form.gang_slug}
                onChange={(e) => setForm({ ...form, gang_slug: e.target.value })}>
                {gangs.map((g) => <option key={g.slug} value={g.slug}>{g.name}</option>)}
              </select>
            </div>

            <hr className="adm-divider" />
            <div className="adm-section-label">Links & Media</div>

            {/* Image URL */}
            <div className="adm-field">
              <label className="adm-label">Image URL</label>
              {form.image_url && (
                <div className="adm-preview">
                  <img src={form.image_url} alt="preview"
                    onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              )}
              <input className="adm-input" style={{ marginBottom: 0 }} type="text"
                placeholder="https://i.imgur.com/xxx.jpg"
                value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
              <div className="adm-hint">วางลิ้งรูปภาพ (imgur, supabase storage, หรือ url อื่นๆ)</div>
            </div>

            {/* Facebook URL */}
            <div className="adm-field">
              <label className="adm-label">Facebook URL</label>
              <input className="adm-input" style={{ marginBottom: 0 }} type="text"
                placeholder="https://facebook.com/username"
                value={form.facebook_url} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} />
              <div className="adm-hint">ลิ้งโปรไฟล์ Facebook ของสมาชิก</div>
            </div>

            <button className="adm-save" onClick={handleSave} disabled={saving || !form.name}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}