import { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PanelCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur", className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{title}</h2>
          {description ? <p className="text-sm leading-6 text-slate-600">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
