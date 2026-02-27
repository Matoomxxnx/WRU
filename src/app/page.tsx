import Link from "next/link";

export default function Home() {
  return (
    <section className="lx-hero">
      <div className="lx-hero-left">
        <div className="lx-eyebrow">WRU COLLECTION — EST. 2024</div>
        <div className="lx-rule" />

        <h1 className="lx-title">
          WHERE <span className="lx-outline">ARE</span> YOU
        </h1>

        <p className="lx-desc">
          A minimal editorial layout — dark, quiet, and deliberate.
        </p>

        <div className="lx-actions">
          <Link href="/members" className="lx-btn">
            View Members
          </Link>
          <span className="lx-hint">See the full roster</span>
        </div>

        <div className="lx-meta">
          <span>WRU / PEOPLE</span>
          <span className="lx-dot" />
          <span>BORN TO BE ONE FOR YOU</span>
        </div>
      </div>

      <div className="lx-hero-right" aria-hidden="true">
        <div className="lx-spot" />
        <div className="lx-grain" />
      </div>
    </section>
  );
}