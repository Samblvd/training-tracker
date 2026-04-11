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
    <div className="flex flex-col gap-4 rounded-[28px] border border-white/60 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]">
          {eyebrow}
        </span>
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 md:text-4xl">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 md:text-base">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
    </div>
  );
}
