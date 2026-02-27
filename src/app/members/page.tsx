"use client";

import { useMemo, useState } from "react";
import gangsData from "../data/gangs.json";

type Member = {
  name: string;
  role?: string | null;
  avatar_url?: string | null;
  facebook_url?: string | null;
};

type Grouped = { group: string; members: Member[] };

function normalizeMember(m: any, fallbackName: string): Member {
  return {
    name: (m?.name ?? fallbackName) as string,
    role: (m?.role ?? null) as any,
    avatar_url: (m?.avatar_url ?? m?.avatarUrl ?? null) as any,
    facebook_url: (m?.facebook_url ?? m?.facebookUrl ?? null) as any,
  };
}

function parseGroups(data: any): Grouped[] {
  // รองรับ:
  // 1) { members: [...] }
  // 2) { wellesley: [...], WRU: [...], ... }
  // 3) { groups: { ... } }
  const d = data ?? {};

  if (Array.isArray(d.members)) {
    return [{ group: "Members", members: d.members.map((m: any, i: number) => normalizeMember(m, `Member ${i + 1}`)) }];
  }

  const groupsObj = d.groups && typeof d.groups === "object" ? d.groups : d;
  const entries = Object.entries(groupsObj).filter(([, v]) => Array.isArray(v)) as [string, any[]][];

  if (entries.length) {
    return entries.map(([group, arr]) => ({
      group,
      members: arr.map((m: any, i: number) => normalizeMember(m, `Member ${i + 1}`)),
    }));
  }

  return [{ group: "Members", members: [] }];
}

export default function MembersPage() {
  const groups = useMemo(() => parseGroups(gangsData as any), []);
  const allMembers = useMemo(() => groups.flatMap((g) => g.members.map((m) => ({ ...m, _group: g.group } as any))), [groups]);

  const groupNames = useMemo(() => ["All", ...groups.map((g) => g.group)], [groups]);

  const [q, setQ] = useState("");
  const [activeGroup, setActiveGroup] = useState<string>("All");
  const [selected, setSelected] = useState<any | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return allMembers.filter((m: any) => {
      const okGroup = activeGroup === "All" ? true : m._group === activeGroup;
      const hay = `${m.name ?? ""} ${m.role ?? ""} ${m._group ?? ""}`.toLowerCase();
      const okQ = query ? hay.includes(query) : true;
      return okGroup && okQ;
    });
  }, [allMembers, q, activeGroup]);

  return (
    <div className="wru-members">
      {/* Header */}
      <section className="wru-members-hero">
        <div className="wru-members-hero-left">
          <div className="wru-title" style={{ fontSize: "clamp(34px, 6vw, 64px)" }}>
            MEMBERS
          </div>
          <div className="wru-members-sub">Search & explore the roster</div>

          <div className="wru-members-stats">
            <span className="wru-pill">Total: {allMembers.length}</span>
            <span className="wru-pill">Showing: {filtered.length}</span>
          </div>

          {/* Search */}
          <div className="wru-search">
            <input
              className="wru-search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name / role / group…"
              aria-label="Search members"
            />
            {q ? (
              <button className="wru-search-clear" onClick={() => setQ("")} aria-label="Clear">
                ✕
              </button>
            ) : null}
          </div>

          {/* Filters */}
          <div className="wru-filters">
            {groupNames.map((g) => (
              <button
                key={g}
                className={`wru-filter ${activeGroup === g ? "is-active" : ""}`}
                onClick={() => setActiveGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="wru-members-hero-right">
          <div className="wru-spotlight" />
        </div>

        <div className="wru-members-hero-bottom">
          <div>WRU COLLECTION — EST. 2024</div>
          <div>BORN TO BE ONE FOR YOU</div>
        </div>
      </section>

      {/* Grid */}
      <section className="wru-grid">
        {filtered.map((m: any, idx: number) => (
          <button key={`${m.name}-${idx}`} className="wru-cardx" onClick={() => setSelected(m)}>
            <div className="wru-cardx-top">
              <div className="wru-avatar">
                {m.avatar_url ? <img src={m.avatar_url} alt={m.name} loading="lazy" /> : <div className="wru-avatar-fallback" />}
              </div>

              <div className="wru-cardx-meta">
                <div className="wru-cardx-name">{m.name}</div>
                <div className="wru-cardx-role">{m.role ?? "Member"}</div>
              </div>
            </div>

            <div className="wru-cardx-bottom">
              <span className="wru-tag">{m._group ?? "Group"}</span>
              <span className="wru-open">OPEN →</span>
            </div>
          </button>
        ))}

        {filtered.length === 0 ? (
          <div className="wru-empty">
            <div className="wru-title" style={{ fontSize: 22 }}>NO RESULTS</div>
            <div className="wru-members-sub">Try another keyword or change group filter.</div>
          </div>
        ) : null}
      </section>

      {/* Modal */}
      {selected ? (
        <div className="wru-modal" role="dialog" aria-modal="true" onClick={() => setSelected(null)}>
          <div className="wru-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="wru-modal-head">
              <div className="wru-modal-title">
                <div className="wru-title" style={{ fontSize: 26 }}>{selected.name}</div>
                <div className="wru-modal-sub">{selected.role ?? "Member"} • {selected._group ?? "Group"}</div>
              </div>
              <button className="wru-modal-x" onClick={() => setSelected(null)} aria-label="Close">✕</button>
            </div>

            <div className="wru-modal-body">
              <div className="wru-modal-avatar">
                {selected.avatar_url ? (
                  <img src={selected.avatar_url} alt={selected.name} />
                ) : (
                  <div className="wru-modal-avatar-fallback" />
                )}
              </div>

              <div className="wru-modal-actions">
                {selected.facebook_url ? (
                  <a className="wru-cta-btn" href={selected.facebook_url} target="_blank" rel="noopener noreferrer">
                    Facebook →
                  </a>
                ) : (
                  <div className="wru-muted">No link available</div>
                )}
              </div>
            </div>

            <div className="wru-modal-foot">
              <span className="wru-muted">WRU — WHERE ARE YOU</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}