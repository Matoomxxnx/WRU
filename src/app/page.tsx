import Link from "next/link";

export default function Home() {
  return (
    <section className="neo-hero">
      {/* โลโก้ใหญ่จางๆ ด้านหลัง */}
      <div className="neo-bg-logo" aria-hidden="true">
        <img src="/uploads/wru-logo.png" alt="" />
      </div>

      {/* ข้อความเล็กด้านบน */}
      <div className="neo-top-note">BORN TO BE ONE FOR WRU</div>

      {/* ข้อความกลางหน้า */}
      <div className="neo-center">
        <div className="neo-title neo-title-top">WHERE</div>
        <div className="neo-title neo-title-mid neo-outline">ARE</div>
        <div className="neo-title neo-title-bot">YOU</div>

        <div className="neo-subline">COLLECTIVE — EST. 2024</div>

        <div className="neo-actions">
          <Link href="/members" className="neo-btn">
            MEMBERS
          </Link>
        </div>
      </div>

      {/* เงา/แสง */}
      <div className="neo-light" aria-hidden="true" />
    </section>
  );
}