"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wru-container">
      <div className="wru-hero" style={{ minHeight: "auto" }}>
        <div style={{ padding: 22 }}>
          <div className="wru-title" style={{ fontSize: 26 }}>MEMBERS ERROR</div>
          <pre style={{ marginTop: 12, whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
            {error.message}
          </pre>
          <button className="wru-cta-btn" style={{ marginTop: 14 }} onClick={() => reset()}>
            Try again →
          </button>
        </div>
      </div>
    </div>
  );
}