"use client";

import { useState } from "react";

import { PageHeading } from "@/components/page-heading";
import { PanelCard } from "@/components/panel-card";
import { formatShortDate, formatWeightValue, getExerciseTrendData, getMuscleFrequencyData, getTrackedExerciseNames } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

export function AnalyticsView() {
  const records = useTrainingStore((state) => state.records);
  const trackedNames = getTrackedExerciseNames(records);
  const [requestedExercise, setRequestedExercise] = useState("");
  const exercise = trackedNames.includes(requestedExercise) ? requestedExercise : trackedNames[0] || "";

  const trendData = exercise ? getExerciseTrendData(records, exercise, 8) : [];
  const latest = trendData[trendData.length - 1];
  const bestWeight = trendData.reduce((max, item) => Math.max(max, item.weight), 0);
  const maxWeight = trendData.reduce((max, item) => Math.max(max, item.weight), 0) || 1;
  const maxVolume = trendData.reduce((max, item) => Math.max(max, item.volume), 0) || 1;
  const frequencyData = getMuscleFrequencyData(records, 28);
  const frequencyMax = frequencyData.reduce((max, item) => Math.max(max, item.count), 0) || 1;

  return (
    <div className="grid gap-6">
      <PageHeading eyebrow="Analytics" title="分析" description="查看动作重量趋势、训练量变化和近四周部位频率。" />

      <PanelCard
        title="动作趋势"
        action={
          <select
            value={exercise}
            onChange={(event) => setRequestedExercise(event.target.value)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 outline-none"
          >
            {trackedNames.length ? trackedNames.map((item) => <option key={item}>{item}</option>) : <option>暂无动作数据</option>}
          </select>
        }
      >
        {exercise ? (
          <div className="grid gap-5">
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { label: "最近工作重量", value: latest ? `${formatWeightValue(latest.weight)}kg` : "-" },
                { label: "历史最高重量", value: trendData.length ? `${formatWeightValue(bestWeight)}kg` : "-" },
                { label: "最近训练量", value: latest ? `${formatWeightValue(latest.volume)}kg` : "-" },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {[
                { title: "动作重量趋势", metric: "weight" as const, max: maxWeight, className: "chart-bar" },
                { title: "动作训练量趋势", metric: "volume" as const, max: maxVolume, className: "chart-bar-volume" },
              ].map((chart) => (
                <div key={chart.title} className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-950">{chart.title}</div>
                  <div className="mt-4 flex min-h-52 items-end gap-3">
                    {trendData.length ? (
                      trendData.map((item) => {
                        const rawValue = chart.metric === "weight" ? item.weight : item.volume;
                        const height = Math.max(16, Math.round((rawValue / chart.max) * 160));
                        return (
                          <div key={`${chart.title}-${item.date}`} className="flex flex-1 flex-col items-center gap-2">
                            <span className="text-xs font-medium text-slate-500">{formatWeightValue(rawValue)}</span>
                            <div className="flex min-h-40 w-full items-end">
                              <div className={`${chart.className} w-full rounded-[16px]`} style={{ height }} />
                            </div>
                            <span className="text-xs text-slate-400">{formatShortDate(item.date)}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full rounded-[22px] border border-dashed border-slate-300 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-500">
                        还没有足够的趋势数据。
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
            还没有可分析的数据，先去记录一次训练。
          </div>
        )}
      </PanelCard>

      <PanelCard title="近 4 周部位频率">
        <div className="grid gap-3">
          {frequencyData.map((item) => (
            <div key={item.muscle} className="grid items-center gap-3 md:grid-cols-[56px_1fr_auto]">
              <div className="text-sm font-semibold text-slate-700">{item.muscle}</div>
              <div className="h-3 rounded-full bg-slate-200">
                <div className="frequency-fill h-3 rounded-full" style={{ width: `${Math.max(8, (item.count / frequencyMax) * 100)}%` }} />
              </div>
              <div className="text-sm text-slate-500">{item.count} 次</div>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}
