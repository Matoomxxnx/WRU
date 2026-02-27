"use client";

import { useMemo } from "react";
import gangsData from "../data/gangs.json";
import MemberCard from "../components/MemberCard";

type Member = {
  name: string;
  role?: string | null;
  avatar_url?: string | null;
  facebook_url?: string | null;
};

export default function MembersPage() {
  const members = useMemo(() => {
    // ✅ รองรับหลายรูปแบบของ json กันพัง
    const anyData: any = gangsData as any;

    // เคส: { members: [...] }
    if (Array.isArray(anyData?.members)) return anyData.members as Member[];

    // เคส: { wellesley: [...], ... } (รวมทุกกลุ่ม)
    const groups = Object.values(anyData || {}).filter(Array.isArray) as any[];
    if (groups.length) return groups.flat() as Member[];

    // เคส: ไม่เจอ
    return [] as Member[];
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <section className="wru-hero" style={{ minHeight: "auto" }}>
        <div className="wru-hero-grid" style={{ minHeight: 260 }}>
          <div className="wru-hero-left" style={{ padding: 36 }}>
            <div className="wru-title" style={{ fontSize: "clamp(34px, 6vw, 64px)" }}>
              MEMBERS
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 8 }}>
              View the roster
            </div>

            <div style={{ marginTop: 14, color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
              Total: {members.length}
            </div>
          </div>

          <div className="wru-hero-right">
            <div className="wru-spotlight" />
          </div>
        </div>

        <div className="wru-hero-bottom">
          <div>WRU COLLECTION — EST. 2024</div>
          <div>BORN TO BE ONE FOR YOU</div>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
        }}
      >
        {members.map((m, idx) => (
          <MemberCard
            key={`${m.name}-${idx}`}
            name={m.name ?? `Member ${idx + 1}`}
            role={m.role ?? null}
            avatarUrl={m.avatar_url ?? null}
            facebookUrl={m.facebook_url ?? null}
          />
        ))}
      </section>

      {members.length === 0 ? (
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
          ไม่พบข้อมูลสมาชิกใน gangs.json (เช็ค key ในไฟล์ data)
        </div>
      ) : null}
    </div>
  );
}