import Link from "next/link";

export const dynamic = "force-dynamic";

type Member = {
  name: string;
  role?: string;
  gang_slug?: string;
  image_url?: string;
  facebook_url?: string; // เพิ่มฟิลด์นี้เพื่อให้รองรับการคลิก
};

async function getMembers(): Promise<Member[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://wru.vercel.app'}/api/members`, {
    cache: 'no-store'
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* เอฟเฟกต์แสง Glow หลังชื่อ MEMBERS */}
      <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <header className="mb-12 border-b border-white/5 pb-8 flex justify-between items-end">
          <div>
            <div className="text-[10px] tracking-[0.5em] text-white/30 mb-2 uppercase">WRU — ROSTER</div>
            <h1 className="text-7xl font-black italic tracking-tighter leading-none">MEMBERS</h1>
            <div className="text-[10px] text-white/40 mt-4 uppercase tracking-widest">
              Total: <span className="text-white font-mono">{members.length}</span>
            </div>
          </div>
          <Link href="/" className="mb-back border border-white/20 px-4 py-1 text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
            ← Back
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((m, idx) => (
            <article key={`${m.name}-${idx}`} className="group relative bg-[#0c0c0c] border border-white/5 p-5 transition-all hover:bg-[#121212]">
              <div className="flex items-center gap-4">
                {/* ส่วนรูปภาพหรือตัวอักษรแรก */}
                <div className="w-14 h-14 bg-[#1a1a1a] flex items-center justify-center border border-white/10 overflow-hidden">
                  {m.image_url ? (
                    <img src={m.image_url} alt={m.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <span className="text-xl font-black text-white/20">{m.name.charAt(0)}</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* ชื่อผู้เล่น + ลิงก์เฟสบุ๊ก */}
                  {m.facebook_url ? (
                    <a 
                      href={m.facebook_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-lg font-bold block truncate hover:text-blue-400 transition-colors flex items-center gap-1"
                      title="Visit Facebook"
                    >
                      {m.name}
                      <svg className="w-3 h-3 opacity-30" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/></svg>
                    </a>
                  ) : (
                    <h3 className="text-lg font-bold truncate">{m.name}</h3>
                  )}
                  <p className="text-[9px] text-white/30 uppercase tracking-widest">{m.role || "Member"}</p>
                </div>
              </div>

              {/* Tag แก็งและสถานะ */}
              <div className="flex gap-2 mt-5">
                <span className="text-[8px] font-bold px-2 py-1 bg-white/5 border border-white/10 text-white/50 uppercase">
                  {m.gang_slug || "No Gang"}
                </span>
                <span className="text-[8px] font-bold px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-500 uppercase">
                  Active
                </span>
              </div>

              {/* เส้นขีดตกแต่งที่มุม (ให้เหมือน UI ในรูปสุดท้ายที่คุณส่งมา) */}
              <div className="absolute top-0 right-0 w-4 h-[1px] bg-white/10" />
              <div className="absolute top-0 right-0 w-[1px] h-4 bg-white/10" />
            </article>
          ))}
        </div>
      </section>

      <footer className="py-10 text-center text-[9px] text-white/10 tracking-[0.5em] uppercase">
        Collective — Est. 2024
      </footer>
    </main>
  );
}