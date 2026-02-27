export default function WRUPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 140px)" }} className="wru-hero">
      <div className="wru-hero-grid">
        <div className="wru-hero-left">
          <div className="wru-title wru-hero-big">WHERE</div>
          <div className="wru-title wru-hero-mid wru-stroke">ARE</div>
          <div className="wru-title wru-hero-big">YOU</div>
        </div>

        <div className="wru-hero-right">
          <div className="wru-spotlight" />
        </div>
      </div>

      <div className="wru-hero-bottom">
        <div className="text-xs text-white/60">WRU COLLECTION — EST. 2024</div>
        <div className="text-xs text-white/60">BORN TO BE ONE FOR YOU</div>
      </div>
    </div>
  );
}