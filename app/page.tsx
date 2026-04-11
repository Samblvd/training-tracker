import Link from "next/link";
import { ArrowRight, Dumbbell } from "lucide-react";

import { PageHeading } from "@/components/page-heading";
import { StatsStrip } from "@/components/stats-strip";

export default function HomePage() {
  return (
    <>
      <PageHeading eyebrow="Dashboard" title="训练记录" description="从今天的计划、训练中流程和历史数据三个入口快速回到主任务。" actions={<div className="flex gap-3">
        <Link
          href="/planner"
          className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          计划
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/workout"
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
        >
          训练中
          <Dumbbell className="h-4 w-4" />
        </Link>
      </div>} />

      <StatsStrip />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { href: "/planner", label: "计划" },
          { href: "/workout", label: "训练中" },
          { href: "/history", label: "历史" },
          { href: "/analytics", label: "分析" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[24px] border border-slate-200 bg-white px-5 py-6 text-lg font-semibold tracking-[-0.03em] text-slate-950 transition hover:border-slate-300"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </>
  );
}
