import Link from "next/link";

export default function WruShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="wru-noise" />

      <header className="lx-topbar">
        <div className="lx-topbar-inner">
          <Link href="/" className="lx-brand">
            WRU
          </Link>

          <nav className="lx-nav">
            <Link className="lx-link" href="/">Home</Link>
            <Link className="lx-link" href="/members">Members</Link>
          </nav>
        </div>
      </header>

      <main className="lx-container">{children}</main>

      <footer className="lx-footer">WRU — WHERE ARE YOU</footer>
    </>
  );
}