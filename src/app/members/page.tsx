import Link from "next/link";

// บังคับให้หน้าจอนี้เช็กข้อมูลใหม่เสมอ
export const dynamic = "force-dynamic";

type Member = {
  name: string;
  role?: string;
  gang_slug?: string;
  image_url?: string;
};

// ฟังก์ชันดึงข้อมูลจาก API ของคุณ
async function getMembers(): Promise<Member[]> {
  // เปลี่ยน URL เป็นของเว็บคุณ (ใช้ Relative path ได้ใน Next.js Server Component)
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://wru.vercel.app'}/api/members`, {
    cache: 'no-store'
  });
  
  if (!res.ok) return [];
  return res.json();
}

export default async function MembersPage() {
  const members = await getMembers();

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
          <article key={`${m.name}-${idx}`} className="mb-card">
            <div className="mb-card-top">
              <div className="mb-avatar">
                {m.image_url ? (
                  <img src={m.image_url} alt={m.name} />
                ) : (
                  <span>{m.name.slice(0, 1).toUpperCase()}</span>
                )}
              </div>

              <div className="mb-meta">
                <div className="mb-name">{m.name}</div>
                <div className="mb-role">{m.role || "MEMBER"}</div>
              </div>
            </div>

            <div className="mb-tagrow">
              <span className="mb-tag">{(m.gang_slug || "No Gang").toUpperCase()}</span>
              <span className="mb-tag mb-tag-ghost">ACTIVE</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}