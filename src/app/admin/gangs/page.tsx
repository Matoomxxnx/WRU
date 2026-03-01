"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Gang = {
  id: string;
  slug: string;
  name: string;
  description: string;
  members?: { name: string }[];
};

export default function AdminGangs() {
  const [gangs, setGangs] = useState<Gang[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"add" | "edit" | null>(null);
  const [selected, setSelected] = useState<Gang | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/gangs");
      const json = await res.json();
      setGangs(Array.isArray(json) ? json : json.data ?? []);
    } catch {
      setGangs([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    const isEdit = modal === "edit" && selected;
    const url = isEdit ? `/api/gangs/${selected!.id}` : "/api/gangs";
    const method = isEdit ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    await logAction(isEdit ? "EDIT_GANG" : "ADD_GANG", form.name);
    await loadData();
    setModal(null);
    setSaving(false);
  }

  async function handleDelete(gang: Gang) {
    if (!confirm(`ลบ ${gang.name}? สมาชิกทั้งหมดใน gang นี้จะถูกลบด้วย`)) return;
    await fetch(`/api/gangs/${gang.id}`, { method: "DELETE" });
    await logAction("DELETE_GANG", gang.name);
    await loadData();
  }

  async function logAction(action: string, detail: string) {
    await fetch("/api/admin/logs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, detail }) });
  }

  function openAdd() { setForm({ name: "", slug: "", description: "" }); setModal("add"); }
  function openEdit(g: Gang) { setSelected(g); setForm({ name: g.name, slug: g.slug, description: g.description }); setModal("edit"); }

  return (
    <main style={{ minHeight: "100vh", background: "#000", color: "#fff", fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');
        * { box-sizing: border-box; }
        .adm-header { border-bottom: 1px solid #111; background: #000; padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 50; }
        .adm-logo { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 0.3em; color: #fff; text-decoration: none; }
        .adm-logo span { color: #cc2200; }
        .adm-link { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #555; text-decoration: none; }
        .adm-link:hover { color: #fff; }
        .adm-body { padding: 40px 32px; max-width: 900px; margin: 0 auto; }
        .adm-kicker { font-size: 10px; letter-spacing: 0.4em; text-transform: uppercase; color: #cc2200; margin-bottom: 4px; }
        .adm-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(48px, 8vw, 72px); line-height: 1; letter-spacing: 0.02em; margin: 0 0 32px; }
        .adm-toprow { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; }
        .adm-btn { border: 1px solid rgba(255,255,255,0.8); background: transparent; color: #fff; padding: 12px 24px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; cursor: pointer; transition: 0.2s; }
        .adm-btn:hover { background: #fff; color: #000; }
        .adm-input { width: 100%; background: transparent; border: 1px solid #222; color: #fff; padding: 12px 16px; font-size: 13px; letter-spacing: 0.1em; outline: none; margin-bottom: 16px; }
        .adm-input:focus { border-color: #444; }
        .adm-table { border: 1px solid #111; width: 100%; }
        .adm-thead { display: grid; grid-template-columns: 1fr 120px 1fr 60px 100px; gap: 16px; padding: 12px 24px; background: #0a0a0a; border-bottom: 1px solid #111; }
        .adm-th { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #444; }
        .adm-row { display: grid; grid-template-columns: 1fr 120px 1fr 60px 100px; gap: 16px; padding: 16px 24px; border-bottom: 1px solid #0d0d0d; transition: background 0.15s; align-items: center; }
        .adm-row:hover { background: #080808; }
        .adm-name { font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-size: 14px; }
        .adm-slug { font-size: 11px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; font-family: monospace; }
        .adm-desc { font-size: 13px; color: #555; }
        .adm-count-cell { font-size: 13px; color: #444; }
        .adm-actions { display: flex; align-items: center; gap: 16px; }
        .adm-act { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; background: none; border: none; color: #444; cursor: pointer; }
        .adm-act:hover { color: #fff; }
        .adm-act-del:hover { color: #cc2200; }
        .adm-empty { padding: 64px 24px; text-align: center; font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; color: #333; }
        .adm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }
        .adm-modal { background: #0a0a0a; border: 1px solid #222; width: 100%; max-width: 440px; padding: 32px; }
        .adm-modal-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
        .adm-modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 0.1em; }
        .adm-close { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #444; background: none; border: none; cursor: pointer; }
        .adm-close:hover { color: #fff; }
        .adm-label { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: #444; display: block; margin-bottom: 8px; }
        .adm-field { margin-bottom: 16px; }
        .adm-save { margin-top: 32px; width: 100%; border: 1px solid rgba(255,255,255,0.8); background: transparent; color: #fff; padding: 14px; font-size: 11px; letter-spacing: 0.4em; text-transform: uppercase; cursor: pointer; transition: 0.2s; }
        .adm-save:hover:not(:disabled) { background: #fff; color: #000; }
        .adm-save:disabled { opacity: 0.25; cursor: not-allowed; }
      `}</style>

      <header className="adm-header">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin/dashboard" className="adm-logo">W<span>R</span>U</Link>
          <span style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#333" }}>/ Gangs</span>
        </div>
        <Link href="/admin/dashboard" className="adm-link">← Dashboard</Link>
      </header>

      <div className="adm-body">
        <div className="adm-toprow">
          <div>
            <div className="adm-kicker">Admin</div>
            <h1 className="adm-title">Gangs</h1>
          </div>
          <button className="adm-btn" onClick={openAdd}>+ Add Gang</button>
        </div>

        <div className="adm-table">
          <div className="adm-thead">
            <div className="adm-th">Name</div>
            <div className="adm-th">Slug</div>
            <div className="adm-th">Description</div>
            <div className="adm-th">Members</div>
            <div className="adm-th">Action</div>
          </div>
          {loading ? (
            <div className="adm-empty">Loading...</div>
          ) : gangs.length === 0 ? (
            <div className="adm-empty">No gangs</div>
          ) : (
            gangs.map((gang) => (
              <div key={gang.id} className="adm-row">
                <div className="adm-name">{gang.name}</div>
                <div className="adm-slug">{gang.slug}</div>
                <div className="adm-desc">{gang.description}</div>
                <div className="adm-count-cell">{gang.members?.length ?? 0}</div>
                <div className="adm-actions">
                  <button className="adm-act" onClick={() => openEdit(gang)}>Edit</button>
                  <button className="adm-act adm-act-del" onClick={() => handleDelete(gang)}>Del</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {modal && (
        <div className="adm-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="adm-modal-head">
              <div className="adm-modal-title">{modal === "add" ? "Add Gang" : "Edit Gang"}</div>
              <button className="adm-close" onClick={() => setModal(null)}>Close</button>
            </div>
            {[
              { key: "name", label: "Name" },
              { key: "slug", label: "Slug (เช่น wellesley)" },
              { key: "description", label: "Description" },
            ].map(({ key, label }) => (
              <div key={key} className="adm-field">
                <label className="adm-label">{label}</label>
                <input className="adm-input" style={{ marginBottom: 0 }} type="text"
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
            <button className="adm-save" onClick={handleSave} disabled={saving || !form.name || !form.slug}>
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}