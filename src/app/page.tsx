import Link from "next/link";

export default function Home() {
  return (
    <section className="neo-hero">

      {/* โลโก้กลางหน้า */}
      <div className="neo-logo-center">
        <img src="/uploads/wru-logo.png" alt="WRU Logo" />
      </div>

      {/* ข้อความเล็กด้านบน */}
      <div className="neo-top-note">
        BORN TO BE ONE FOR WRU
      </div>

      {/* เส้นเล็ก + ปุ่ม */}
      <div className="neo-bottom">
        <div className="neo-subline">
          COLLECTIVE — EST. 2024
        </div>

        <Link href="/members" className="neo-btn">
          MEMBERS
        </Link>
      </div>

      <div className="neo-light" aria-hidden="true" />
    </section>
  );
}