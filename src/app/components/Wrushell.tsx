import Link from "next/link";

export default function WruShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="wru-noise" />
      <header className="sticky top-0 z-50 w-full wru-border bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="wru-title text-lg">
            WRU
          </Link>

          <nav className="flex items-center gap-4 text-sm text-white/70">
            <Link className="hover:text-white" href="/WRU">Home</Link>
            <Link className="hover:text-white" href="/members">Members</Link>
            <Link className="hover:text-white" href="/wellesley">Wellesley</Link>
            <Link className="hover:text-white" href="/admin">Admin</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>

      <footer className="wru-border border-x-0 border-b-0 py-8 text-center text-xs text-white/45">
        WRU — WHERE ARE YOU
      </footer>
    </>
  );
}