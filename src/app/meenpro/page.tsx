"use client";

import { useEffect, useMemo, useState } from "react";

type Member = {
  id: string;
  name: string | null;
  role: string | null;
  facebook_url: string | null;
  avatar_url: string | null;
  sort_order?: number | null;
  is_active?: boolean | null;
  created_at?: string | null;
};

function normalizeRole(role?: string | null) {
  const r = (role ?? "").trim().toLowerCase();

  // รองรับหลายรูปแบบ
  if (["founder", "founders", "owner", "boss", "admin"].includes(r)) return "FOUNDERS";
  if (["leader", "leaders", "mod", "manager"].includes(r)) return "LEADERS";
  if (["member", "members", "user"].includes(r)) return "MEMBERS";

  // ถ้าไม่ตรงอะไร ให้ไป MEMBERS
  return "MEMBERS";
}

function safeText(v?: string | null) {
  return (v ?? "").toString();
}

export default function MeenproPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/gangs")
      .then((res) => res.json())
      .then((json) => setMembers(Array.isArray(json?.data) ? json.data : []))
      .catch(() => setMembers([]));
  }, []);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return members
      .filter((m) => (m.is_active === undefined || m.is_active === null ? true : !!m.is_active))
      .filter((m) => {
        if (!query) return true;
        const hay = `${safeText(m.name)} ${safeText(m.role)}`.toLowerCase();
        return hay.includes(query);
      })
      .sort((a, b) => {
        // sort_order ก่อน (น้อยขึ้นก่อน)
        const ao = a.sort_order ?? 999999;
        const bo = b.sort_order ?? 999999;
        if (ao !== bo) return ao - bo;

        // created_at ต่อ (เก่าก่อน)
        const ad = a.created_at ? new Date(a.created_at).getTime() : 0;
        const bd = b.created_at ? new Date(b.created_at).getTime() : 0;
        return ad - bd;
      });
  }, [members, q]);

  const groups = useMemo(() => {
    const g: Record<"FOUNDERS" | "LEADERS" | "MEMBERS", Member[]> = {
      FOUNDERS: [],
      LEADERS: [],
      MEMBERS: [],
    };

    for (const m of filtered) {
      const key = normalizeRole(m.role) as "FOUNDERS" | "LEADERS" | "MEMBERS";
      g[key].push(m);
    }
    return g;
  }, [filtered]);

  const Section = ({
    title,
    indexLabel,
    items,
    accent,
  }: {
    title: string;
    indexLabel: string;
    items: Member[];
    accent: "gold" | "red" | "white";
  }) => {
    const border =
      accent === "gold"
        ? "border-yellow-500/30 hover:border-yellow-500/60"
        : accent === "red"
        ? "border-red-500/25 hover:border-red-500/60"
        : "border-white/10 hover:border-white/25";

    const badge =
      accent === "gold"
        ? "text-yellow-400/90"
        : accent === "red"
        ? "text-red-400/90"
        : "text-white/70";

    return (
      <section className="w-full mt-12">
        <div className="flex items-baseline gap-3 mb-5">
          <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-[0.15em]">
            {title}
          </h2>
          <span className="text-xs text-white/30 uppercase tracking-[0.25em]">
            / {indexLabel}
          </span>
        </div>

        {items.length === 0 ? (
          <p className="text-white/30 text-sm">No members yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((m) => (
              <div
                key={m.id}
                className={[
                  "group rounded-2xl bg-white/[0.03] backdrop-blur-sm border transition-all duration-300 overflow-hidden",
                  border,
                ].join(" ")}
              >
                <div className="p-5 flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={m.avatar_url || "/uploads/meenpro.png"}
                      alt={safeText(m.name) || "member"}
                      className="w-14 h-14 rounded-full object-cover border border-white/10"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={["text-[11px] uppercase tracking-[0.2em]", badge].join(" ")}>
                        {title.slice(0, -1)}
                      </span>
                    </div>

                    <h3 className="font-bold uppercase tracking-wide text-white truncate">
                      {safeText(m.name) || "Unnamed"}
                    </h3>

                    {m.facebook_url ? (
                      <a
                        href={m.facebook_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-400 hover:underline"
                      >
                        Facebook
                      </a>
                    ) : (
                      <p className="text-sm text-white/30">No link</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-[0.35em] text-center text-white/90">
          MEENPRO
        </h1>
        <p className="text-xs md:text-sm text-white/35 uppercase tracking-[0.6em] text-center mt-3">
          MEENPRO MEMBERS
        </p>

        {/* Search */}
        <div className="mt-10 flex justify-center">
          <div className="w-full max-w-xl">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search members..."
                className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-white/25 text-white/90 placeholder:text-white/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <Section title="FOUNDERS" indexLabel="01" items={groups.FOUNDERS} accent="gold" />
        <Section title="LEADERS" indexLabel="02" items={groups.LEADERS} accent="red" />
        <Section title="MEMBERS" indexLabel="03" items={groups.MEMBERS} accent="white" />
      </div>
    </main>
  );
}