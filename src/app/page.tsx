import Link from "next/link";

export default function Home() {
  return (
    <section className="neo-hero">
      {/* ตัวอักษร WRU ขนาดใหญ่จางๆ ด้านหลัง */}
      <div className="neo-bg-logo" aria-hidden="true">
  <img src="/wru-logo.png" alt="" />
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

          {/* ✅ ลบทางเข้า admin ออก: ไม่มีปุ่ม admin แล้ว */}
          {/* ถ้าอยากให้มีปุ่มอื่นแทน บอกได้ เช่น "ABOUT" */}
        </div>
      </div>

      {/* เงา/แสงด้านขวา */}
      <div className="neo-light" aria-hidden="true" />
    </section>
  );
}