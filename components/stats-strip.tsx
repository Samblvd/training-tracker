"use client";

import { useMemo } from "react";

import { useTrainingStore } from "@/store/training-store";
import { parseDateString, todayString } from "@/lib/utils";

export function StatsStrip() {
  const records = useTrainingStore((state) => state.records);

  const stats = useMemo(() => {
    const today = parseDateString(todayString());
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const weekStart = new Date(today);
    let day = weekStart.getDay();
    if (day === 0) day = 7;
    weekStart.setDate(weekStart.getDate() - day + 1);
    weekStart.setHours(0, 0, 0, 0);

    let weekCount = 0;
    let monthCount = 0;
    records.forEach((record) => {
      const date = parseDateString(record.date);
      if (date >= weekStart) weekCount += 1;
      if (date >= monthStart) monthCount += 1;
    });

    return [
      { label: "全部训练", value: records.length },
      { label: "本周完成", value: weekCount },
      { label: "本月完成", value: monthCount },
    ];
  }, [records]);

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {stats.map((item) => (
        <div key={item.label} className="rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
          <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{item.value}</div>
        </div>
      ))}
    </div>
  );
}
