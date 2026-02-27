import Link from "next/link";

export default function Home() {
  return (
    <section className="wru-hero">
      <div className="wru-hero-grid">
        <div className="wru-hero-left">
          <div className="wru-title wru-hero-big">WHERE</div>
          <div className="wru-title wru-hero-mid wru-stroke">ARE</div>
          <div className="wru-title wru-hero-big">YOU</div>

          {/* ✅ ปุ่มเข้าไปดูรายชื่อ */}
          <div className="wru-cta">
            <Link href="/members" className="wru-cta-btn">
              View Members →
            </Link>
            <div className="wru-cta-sub">See the full roster</div>
          </div>
        </div>

        <div className="wru-hero-right">
          <div className="wru-spotlight" />
        </div>
      </div>

      <div className="wru-hero-bottom">
        <div>WRU COLLECTION — EST. 2024</div>
        <div>BORN TO BE ONE FOR YOU</div>
      </div>
    </section>
  );
}