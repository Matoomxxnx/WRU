import Link from "next/link";

export default function WruShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="wru-noise" />

      <header className="neo-topbar">
        <div className="neo-topbar-inner">
          <Link href="/" className="neo-brand" aria-label="WRU Home">
            <span className="neo-brand-w">W</span>
            <span className="neo-brand-r">R</span>
            <span className="neo-brand-u">U</span>
          </Link>

          <nav className="neo-nav">
            <Link className="neo-link" href="/members">Members</Link>
            <Link className="neo-link" href="/login">Login</Link>
          </nav>
        </div>
      </header>

      <main className="neo-container">{children}</main>

      <footer className="neo-ticker" aria-hidden="true">
        <div className="neo-ticker-track">
          <span>WRU COLLECTIVE • WHERE ARE YOU • WRU COLLECTIVE • WHERE ARE YOU • </span>
          <span>WRU COLLECTIVE • WHERE ARE YOU • WRU COLLECTIVE • WHERE ARE YOU • </span>
        </div>
      </footer>
    </>
  );
}