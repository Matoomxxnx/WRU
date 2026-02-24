"use client";

import { useEffect, useState } from "react";

type Gang = {
  id: string | number;
  name: string;
  created_at?: string;
};

export default function DashboardPage() {
  const [items, setItems] = useState<Gang[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/gangs", { cache: "no-store" });
    const json = await res.json();
    setItems(json?.data ?? []);
    setLoading(false);
  }

  async function add() {
    const n = name.trim();
    if (!n) return;

    setSaving(true);
    const res = await fetch("/api/gangs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: n }),
    });

    const json = await res.json();
    setSaving(false);

    if (!res.ok) {
      alert(json?.message ?? "เพิ่มไม่สำเร็จ");
      return;
    }

    setName("");
    await load();
  }

  async function remove(id: Gang["id"]) {
    if (!confirm("ลบรายการนี้ใช่ไหม?")) return;

    const res = await fetch(`/api/gangs?id=${encodeURIComponent(String(id))}`, {
      method: "DELETE",
    });

    const json = await res.json();
    if (!res.ok) {
      alert(json?.message ?? "ลบไม่สำเร็จ");
      return;
    }

    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>หลังบ้าน: รายชื่อ Gangs</h1>

      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="พิมพ์ชื่อ gang..."
          style={{ flex: 1, padding: 10, border: "1px solid #ddd", borderRadius: 8 }}
        />
        <button
          onClick={add}
          disabled={saving}
          style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd" }}
        >
          {saving ? "กำลังบันทึก..." : "เพิ่ม"}
        </button>
      </div>

      <div style={{ marginTop: 18 }}>
        {loading ? (
          <p>กำลังโหลด...</p>
        ) : items.length === 0 ? (
          <p>ยังไม่มีข้อมูล</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {items.map((g) => (
              <div
                key={String(g.id)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>{g.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{String(g.id)}</div>
                </div>
                <button
                  onClick={() => remove(g.id)}
                  style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd" }}
                >
                  ลบ
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}