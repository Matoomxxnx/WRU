import Link from "next/link";

export const dynamic = "force-dynamic";

type Member = {
  name: string;
  role: string; // เราจะใช้ค่านี้แยกกลุ่ม เช่น 'founder', 'leader', 'member'
  gang_slug?: string;
  image_url?: string;
  facebook_url?: string;
};

async function getMembers(): Promise<Member[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://wru.vercel.app'}/api/members`, {
    cache: 'no-store'
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function MembersPage() {
  const allMembers = await getMembers();

  // ฟังก์ชันแยกกลุ่มสมาชิก
  const categories = [
    { 
      title: "FOUNDERS", 
      data: allMembers.filter(m => m.role?.toLowerCase() === 'founder'),
      color: "border-yellow-500/50" 
    },
    { 
      title: "LEADERS", 
      data: allMembers.filter(m => m.role?.toLowerCase() === 'leader'),
      color: "border-red-500/50" 
    },
    { 
      title: "MEMBERS", 
      data: allMembers.filter(m => !['founder', 'leader'].includes(m.role?.toLowerCase() || '')),
      color: "border-white/10" 
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white font-sans p-8 md:p-16">
      <header className="max-w-7xl mx-auto mb-20 flex justify-between items-start">
        <div>
          <div className="text-[10px] tracking-[0.5em] text-white/30 mb-2 uppercase">WRU — ROSTER</div>
          <h1 className="text-8xl font-black italic tracking-tighter leading-none">MEMBERS</h1>
        </div>
        <Link href="/" className="border border-white/20 px-6 py-2 text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
          ← BACK
        </Link>
      </header>

      <div className="max-w-7xl mx-auto space-y-24">
        {categories.map((cat) => (
          cat.data.length > 0 && (
            <section key={cat.title}>
              {/* หัวข้อกลุ่ม พร้อมตัวเลขจำนวนสมาชิก */}
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-4xl font-black italic tracking-tight uppercase">{cat.title}</h2>
                <span className="text-xl font-mono text-white/20">
                  / {cat.data.length.toString().padStart(2, '0')}
                </span>
                <div className="h-[1px] flex-1 bg-white/5 ml-4"></div>
              </div>

              {/* Grid รายชื่อในแต่ละกลุ่ม */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.data.map((m, idx) => (
                  <article 
                    key={`${m.name}-${idx}`} 
                    className={`relative bg-[#0d0d0d] border ${cat.color} p-6 flex items-center gap-6 group hover:bg-[#151515] transition-all`}
                  >
                    {/* รูปภาพโปรไฟล์ */}
                    <div className="relative w-20 h-20 shrink-0 border border-white/10 overflow-hidden">
                      {m.image_url ? (
                        <img src={m.image_url} alt={m.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-2xl font-black opacity-20 uppercase">
                          {m.name.charAt(0)}
                        </div>
                      )}
                      {/* จุดเขียวแสดงสถานะ (Online) */}
                      <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0d0d0d]"></div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Badge บอกตำแหน่งด้านบนชื่อ */}
                      <div className="mb-1">
                        <span className={`text-[8px] font-bold px-2 py-[2px] rounded-full border ${cat.color} text-white/60 uppercase tracking-tighter`}>
                          👑 {cat.title.slice(0, -1)}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold truncate mb-1">{m.name}</h3>
                      
                      {/* ลิงก์ Facebook */}
                      {m.facebook_url && (
                        <a 
                          href={m.facebook_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-blue-400 hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest"
                        >
                          Facebook
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        ))}
      </div>
    </main>
  );
}