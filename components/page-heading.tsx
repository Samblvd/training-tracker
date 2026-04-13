import { ReactNode } from "react";

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[32px] border border-white/80 bg-[radial-gradient(circle_at_top,rgba(241,90,34,0.10),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.99),rgba(248,250,252,0.96))] p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-end md:justify-between md:p-7">
      <div className="space-y-2">
        <span className="inline-flex rounded-full border border-[var(--accent-strong)]/12 bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)] md:text-xs">
          {eyebrow}
        </span>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-950 md:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
