import Link from "next/link";

type Props = {
  name: string;
  role?: string | null;
  avatarUrl?: string | null;
  facebookUrl?: string | null;
};

export default function MemberCard({
  name,
  role,
  avatarUrl,
  facebookUrl,
}: Props) {
  const card = (
    <div className="wru-card p-5 transition hover:bg-white/5">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          {/* ไม่บังคับต้องมีรูป */}
          {avatarUrl ? (
            // ใช้ img ธรรมดาไว้ก่อน กันปัญหา next/image
            <img
              src={avatarUrl}
              alt={name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </div>

        <div className="min-w-0">
          <div className="wru-title truncate text-lg">{name}</div>
          <div className="truncate text-xs text-white/60">{role ?? "Member"}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px] text-white/45">
        <span>WRU / PEOPLE</span>
        <span>OPEN →</span>
      </div>
    </div>
  );

  // ถ้ามีลิงก์ facebook ให้กดได้
  if (facebookUrl) {
    return (
      <Link href={facebookUrl} target="_blank" rel="noopener noreferrer">
        {card}
      </Link>
    );
  }

  return card;
}