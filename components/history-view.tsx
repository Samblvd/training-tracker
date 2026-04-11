"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeading } from "@/components/page-heading";
import { PanelCard } from "@/components/panel-card";
import { ExercisePlanItem, TrainingRecord } from "@/lib/types";
import { getPrevRecord, getRecordExercises } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

function CompareBlock({ record, previous }: { record: TrainingRecord; previous?: TrainingRecord }) {
  const currentMap = new Map(getRecordExercises(record).map((exercise) => [exercise.name, exercise]));
  const previousMap = new Map((previous ? getRecordExercises(previous) : []).map((exercise) => [exercise.name, exercise]));
  const names = Array.from(new Set([...currentMap.keys(), ...previousMap.keys()]));

  if (!previous) {
    return (
      <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-4 text-sm text-slate-500">
        暂无更早的同部位记录可对比。
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
      <div className="mb-3 text-sm text-slate-500">
        本次 {record.date} vs 上次 {previous.date}
      </div>
      <div className="grid gap-3">
        {names.map((name) => {
          const current = currentMap.get(name);
          const prev = previousMap.get(name);
          return (
            <div key={name} className="rounded-[20px] border border-slate-200 bg-white px-4 py-3">
              <div className="text-sm font-semibold text-slate-950">{name}</div>
              <div className="mt-1 grid gap-1 text-sm text-slate-600 md:grid-cols-2">
                <div>本次：{current ? `${current.weight || "—"}kg · ${current.sets || "—"} 组 · ${current.reps || "—"} 次` : "—"}</div>
                <div>上次：{prev ? `${prev.weight || "—"}kg · ${prev.sets || "—"} 组 · ${prev.reps || "—"} 次` : "—"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function HistoryView() {
  const router = useRouter();
  const records = useTrainingStore((state) => state.records);
  const loadRecordIntoPlanner = useTrainingStore((state) => state.loadRecordIntoPlanner);
  const deleteRecord = useTrainingStore((state) => state.deleteRecord);
  const importRecords = useTrainingStore((state) => state.importRecords);
  const [compareId, setCompareId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const exportJson = () => {
    const payload = JSON.stringify(
      {
        version: 3,
        exportedAt: new Date().toISOString(),
        records,
      },
      null,
      2,
    );
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `training-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const onImportFile = async (file: File) => {
    const text = await file.text();
    const result = importRecords(text);
    setStatus(result.message);
  };

  return (
    <div className="grid gap-6">
      <PageHeading eyebrow="History" title="历史" description="查看历史训练、导入导出 JSON，并和上一次同部位训练做快速对比。" actions={
        <div className="flex gap-3">
          <button type="button" onClick={exportJson} className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white">
            导出
          </button>
          <label className="cursor-pointer rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
            导入
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onImportFile(file);
                event.currentTarget.value = "";
              }}
            />
          </label>
        </div>
      } />

      {status ? (
        <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
          {status}
        </div>
      ) : null}

      <PanelCard title={`训练记录 ${records.length}`}>
        {records.length ? (
          <div className="grid gap-4">
            {records.map((record) => {
              const exercises = getRecordExercises(record);
              const previous = getPrevRecord(records, record);
              return (
                <div key={record.id} className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                          {record.muscle}
                        </span>
                        <span className="text-sm text-slate-500">{record.date}</span>
                      </div>
                      <div className="mt-3 grid gap-2">
                        {exercises.map((exercise: ExercisePlanItem) => (
                          <div key={exercise.name} className="text-sm text-slate-700">
                            <span className="font-medium text-slate-950">{exercise.name}</span>
                            <span className="ml-2 text-slate-500">
                              {exercise.weight || "—"}kg · {exercise.sets || "—"} 组 · {exercise.reps || "—"} 次
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          loadRecordIntoPlanner(record.id);
                          router.push("/planner");
                        }}
                        className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompareId(compareId === record.id ? null : record.id)}
                        className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                      >
                        对比上次
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRecord(record.id)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>

                  {compareId === record.id ? <div className="mt-4"><CompareBlock record={record} previous={previous} /></div> : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-500">
            暂无记录。去 <Link href="/planner" className="font-medium text-slate-950">计划</Link>
          </div>
        )}
      </PanelCard>
    </div>
  );
}
