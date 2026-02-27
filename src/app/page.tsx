import Link from "next/link";

export default function Home() {
  return (
    <section className="neo-hero">
      <div className="neo-top-note">BORN TO BE ONE FOR WRU</div>

      <div className="neo-logo-center" aria-label="WRU">
        <img src="/uploads/wru-logo.png" alt="WRU" />
      </div>

      <div className="neo-bottom">
        <div className="neo-subline">COLLECTIVE — EST. 2024</div>
        <Link href="/members" className="neo-btn">MEMBERS</Link>
      </div>

      <div className="neo-light" aria-hidden="true" />
    </section>
  );
}