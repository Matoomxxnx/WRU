import Link from "next/link";
import gangsData from "../data/gangs.json";

type Member = {
  name: string;
  role?: string;
  group?: string;
  avatar?: string;
};

function getAllMembers(): (Member & { groupKey: string })[] {
  const g: any = gangsData || {};
  const out: (Member & { groupKey: string })[] = [];

  for (const key of Object.keys(g)) {
    const arr = Array.isArray(g[key]) ? g[key] : [];
    for (const m of arr) {
      out.push({
        name: m?.name ?? "Unknown",
        role: m?.role ?? "",
        group: m?.group ?? key,
        avatar: m?.avatar_url ?? m?.avatar ?? "",
        groupKey: key,
      });
    }
  }
  return out;
}

export default function MembersPage() {
  const members = getAllMembers();

  return (
    <section className="mb-wrap">
      <header className="mb-head">
        <div className="mb-kicker">WRU — ROSTER</div>
        <h1 className="mb-title">MEMBERS</h1>
        <div className="mb-sub">
          Total: <span className="mb-strong">{members.length}</span>
        </div>

        <div className="mb-actions">
          <Link className="mb-back" href="/">← Back</Link>
        </div>
      </header>

      <div className="mb-grid">
        {members.map((m, idx) => (
          <article key={`${m.groupKey}-${m.name}-${idx}`} className="mb-card">
            <div className="mb-card-top">
              <div className="mb-avatar">
                {m.avatar ? (
                  // ใช้ img ปกติพอ (ไม่ง้อ next/image)
                  <img src={m.avatar} alt={m.name} />
                ) : (
                  <span>{m.name.slice(0, 1).toUpperCase()}</span>
                )}
              </div>

              <div className="mb-meta">
                <div className="mb-name">{m.name}</div>
                <div className="mb-role">{m.role || "—"}</div>
              </div>
            </div>

            <div className="mb-tagrow">
              <span className="mb-tag">{(m.group || m.groupKey).toUpperCase()}</span>
              <span className="mb-tag mb-tag-ghost">ACTIVE</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}