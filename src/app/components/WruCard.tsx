import Link from "next/link";

export default function WruCard({
  title,
  meta,
  href,
}: {
  title: string;
  meta?: string;
  href?: string;
}) {
  const content = (
    <div className="wru-card p-5 transition hover:bg-white/5">
      <div className="wru-title text-lg truncate">{title}</div>
      <div className="mt-1 text-xs text-white/60 truncate">{meta ?? "WRU / SECTION"}</div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-white/45">
        <span>OPEN</span>
        <span>→</span>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}