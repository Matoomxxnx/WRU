export default function WruHero({
  title = "WHERE ARE YOU",
  subtitle = "BORN TO BE ONE FOR YOU",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="wru-card p-8 md:p-10">
      <div className="wru-title text-4xl md:text-6xl">{title}</div>
      <div className="mt-2 text-xs md:text-sm text-white/60">{subtitle}</div>
      <div className="mt-6 h-px w-full bg-white/10" />
      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/55">
        <span className="rounded-full wru-border bg-black/30 px-3 py-1">Dark</span>
        <span className="rounded-full wru-border bg-black/30 px-3 py-1">Minimal</span>
        <span className="rounded-full wru-border bg-black/30 px-3 py-1">Cinematic</span>
      </div>
    </section>
  );
}