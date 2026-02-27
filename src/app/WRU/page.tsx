import gangs from "../data/gangs.json";
import Link from "next/link";

type GangMember = {
  name: string;
};

type Gang = {
  slug: string;
  name: string;
  description: string;
  members: GangMember[];
};

export default function MembersPage() {
  const gangsData: Gang[] = gangs as Gang[];

  const totalMembers = gangsData.reduce((sum, g) => sum + g.members.length, 0);

  return (
    <main
      className="min-h-screen bg-black text-white"
      style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&display=swap');`}</style>

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-zinc-900 bg-black px-8 py-5 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl tracking-[0.3em]" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            W<span className="text-red-600">R</span>U
          </span>
        </Link>
        <span className="text-xs tracking-[0.3em] text-zinc-600 uppercase">
          {gangsData.length} Gangs · {totalMembers} Members
        </span>
      </nav>

      {/* HEADER */}
      <header className="px-8 pt-12 pb-8 border-b border-zinc-900">
        <p className="text-xs tracking-[0.4em] text-red-600 uppercase mb-2">The Crew</p>
        <h1
          className="text-8xl leading-none tracking-tight uppercase"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          Members
        </h1>
        <p className="text-xs tracking-[0.3em] text-zinc-600 uppercase mt-4">
          {totalMembers} Total
        </p>
      </header>

      {/* GANG SECTIONS */}
      <section className="px-8 pb-20">
        {gangsData.map((gang) => (
          <div key={gang.slug} className="mt-12">

            {/* Gang Header */}
            <div className="flex items-baseline gap-4 pb-4 border-b border-zinc-800">
              <h2
                className="text-4xl tracking-wider uppercase"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {gang.name}
              </h2>
              <span className="text-xs tracking-[0.3em] text-red-600 uppercase">
                {gang.description}
              </span>
              <span className="ml-auto text-xs tracking-[0.3em] text-zinc-700 uppercase">
                {gang.members.length} members
              </span>
            </div>

            {/* Member Rows */}
            {gang.members.map((member, idx) => (
              <div
                key={idx}
                className="flex items-center gap-6 py-4 border-b border-zinc-900 hover:bg-zinc-950 group transition-colors duration-150 px-2"
              >
                <span
                  className="text-3xl text-zinc-800 group-hover:text-red-600 transition-colors leading-none w-10 text-right flex-shrink-0"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-lg font-bold tracking-widest uppercase flex-1">
                  {member.name}
                </span>
                <span className="text-xs tracking-[0.3em] text-zinc-700 uppercase">
                  {gang.slug}
                </span>
              </div>
            ))}

          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer className="border-t border-zinc-900 px-8 py-5 flex items-center justify-between">
        <span className="text-xs tracking-[0.3em] text-zinc-800 uppercase">
          Born to be die for WRU
        </span>
        <Link href="/">
          <span
            className="text-xs tracking-[0.4em] text-zinc-700 uppercase"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            ← Home
          </span>
        </Link>
      </footer>
    </main>
  );
}