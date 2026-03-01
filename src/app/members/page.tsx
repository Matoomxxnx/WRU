import Link from "next/link";

export const dynamic = "force-dynamic";

type Member = {
  name: string;
  role?: string;
  gang_slug?: string;
  image_url?: string;
};

async function getMembers(): Promise<Member[]> {
  // ดึงข้อมูลจาก API Route ที่เราทำไว้
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://wru.vercel.app'}/api/members`, {
    cache: 'no-store'
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    // เพิ่มคลาสและโครงสร้าง CSS ให้ตรงกับหน้าหลักที่มีแสง Glow และพื้นหลังมืด
    <main className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      
      {/* เอฟเฟกต์แสง Glow ด้านหลังเหมือนหน้าหลัก */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-white/10 blur-[120px] rounded-full pointer-events-none" />

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <header className="mb-16 border-b border-white/10 pb-10">
          <div className="text-[10px] tracking-[0.5em] text-white/40 mb-2 uppercase">WRU — ROSTER</div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4">MEMBERS</h1>
          <div className="flex justify-between items-end">
            <div className="text-sm text-white/60">
              TOTAL: <span className="text-white font-mono text-lg ml-1">{members.length}</span>
            </div>
            <Link 
              href="/" 
              className="text-[10px] uppercase tracking-widest border border-white/20 px-4 py-2 hover:bg-white hover:text-black transition-all duration-300"
            >
              ← Back
            </Link>
          </div>
        </header>

        {/* ปรับ Grid ให้การ์ดดูใหญ่และมีมิติมากขึ้น */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((m, idx) => (
            <article 
              key={`${m.name}-${idx}`} 
              className="group relative bg-[#0a0a0a] border border-white/5 p-6 transition-all duration-500 hover:border-white/20 hover:bg-[#111]"
            >
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 shrink-0 overflow-hidden bg-[#1a1a1a] border border-white/10 group-hover:border-white/30 transition-colors">
                  {m.image_url ? (
                    <img src={m.image_url} alt={m.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white/20 uppercase">
                      {m.name.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xl font-bold truncate group-hover:text-white transition-colors">{m.name}</h3>
                  <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">
                    {m.role || "MEMBER"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="text-[9px] font-bold tracking-tighter px-2 py-1 bg-white/5 border border-white/10 text-white/60 uppercase">
                  {m.gang_slug || "No Gang"}
                </span>
                <span className="text-[9px] font-bold tracking-tighter px-2 py-1 bg-white/5 border border-white/10 text-green-500/80 uppercase">
                  Active
                </span>
              </div>

              {/* เส้นขีดตกแต่งที่มุมการ์ดให้ดูเหมือน UI เกม */}
              <div className="absolute top-0 right-0 w-8 h-[1px] bg-white/0 group-hover:bg-white/40 transition-all" />
              <div className="absolute top-0 right-0 w-[1px] h-8 bg-white/0 group-hover:bg-white/40 transition-all" />
            </article>
          ))}
        </div>
      </section>

      {/* Footer ตกแต่งเล็กน้อย */}
      <footer className="py-10 text-center text-[10px] text-white/20 tracking-[0.3em] uppercase">
        Collective — Est. 2024
      </footer>
    </main>
  );
}