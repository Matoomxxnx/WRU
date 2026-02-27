import Link from "next/link";

const items = [
  { href: "/", label: "Home" },
  { href: "/members", label: "Members" },
];

export default function WruShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="wru-noise" />

      <header className="wru-topbar">
        <div className="wru-topbar-inner">
          <Link href="/" className="wru-brand">
            WRU
          </Link>

          <nav className="wru-nav">
            {items.map((it) => (
              <Link key={it.href} href={it.href} className="wru-navlink">
                {it.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="wru-container">{children}</main>

      <footer className="wru-footer">WRU — WHERE ARE YOU</footer>
    </>
  );
}