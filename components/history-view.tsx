"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { PageHeading } from "@/components/page-heading";
import { PanelCard } from "@/components/panel-card";
import { ExercisePlanItem, TrainingRecord } from "@/lib/types";
import { getPrevRecord, getRecordExercises } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildShareCardSvg(record: TrainingRecord, exercises: ExercisePlanItem[]) {
  const rows = exercises.slice(0, 6);
  const itemRows = rows
    .map(
      (exercise, index) => `
        <g transform="translate(64, ${340 + index * 110})">
          <text x="0" y="0" font-size="40" font-weight="700" fill="#0f172a">${escapeXml(exercise.name)}</text>
          <text x="0" y="54" font-size="28" fill="#475569">${escapeXml(`${exercise.weight || "—"}kg · ${exercise.sets || "—"} 组 · ${exercise.reps || "—"} 次`)}</text>
        </g>`,
    )
    .join("");

  return `
  <svg width="1080" height="1350" viewBox="0 0 1080 1350" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="1080" height="1350" rx="72" fill="#F8FAFC" />
    <rect x="28" y="28" width="1024" height="1294" rx="56" fill="white" />
    <circle cx="918" cy="162" r="170" fill="#F15A22" opacity="0.12" />
    <text x="64" y="110" font-size="28" font-weight="700" fill="#94A3B8" letter-spacing="8">TRAINING RECORD</text>
    <text x="64" y="192" font-size="76" font-weight="800" fill="#0F172A">${escapeXml(record.muscle)} 训练完成</text>
    <text x="64" y="246" font-size="34" fill="#64748B">${escapeXml(record.date)} · 总训练量 ${escapeXml(String(record.totalVolume || 0))}</text>

    <rect x="64" y="1050" width="952" height="208" rx="36" fill="#0F172A" />
    <text x="112" y="1128" font-size="26" font-weight="700" fill="#94A3B8">今日摘要</text>
    <text x="112" y="1196" font-size="50" font-weight="800" fill="white">${rows.length} 个动作</text>
    <text x="600" y="1196" font-size="50" font-weight="800" fill="white">${escapeXml(String(record.sessionLog.reduce((sum, item) => sum + item.completedSets.length, 0)))} 组</text>
    <text x="112" y="1242" font-size="28" fill="#CBD5E1">训练助手生成分享图，可直接发到微信或朋友圈</text>

    ${itemRows}
  </svg>`;
}

async function renderShareImage(record: TrainingRecord, exercises: ExercisePlanItem[]) {
  const svg = buildShareCardSvg(record, exercises);
  const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const image = new Image();
    image.decoding = "async";
    image.src = svgUrl;
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("image-load-failed"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("canvas-unavailable");
    }
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("blob-failed"));
      }, "image/png");
    });

    return pngBlob;
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

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
  const [sharingId, setSharingId] = useState<string | null>(null);
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

  const shareRecordImage = async (record: TrainingRecord) => {
    const exercises = getRecordExercises(record);
    if (!exercises.length) {
      setStatus("这条记录暂无可分享的训练动作");
      return;
    }

    setSharingId(record.id);
    try {
      const blob = await renderShareImage(record, exercises);
      const file = new File([blob], `${record.date}-${record.muscle}-training.png`, { type: "image/png" });

      if (navigator.share && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${record.muscle} 训练记录`,
          text: `${record.date} 的 ${record.muscle} 训练记录`,
          files: [file],
        });
        setStatus("分享面板已打开");
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${record.date}-${record.muscle}-training.png`;
      link.click();
      URL.revokeObjectURL(url);
      setStatus("分享图已下载，可以直接发到微信或朋友圈");
    } catch (error) {
      console.error(error);
      setStatus("生成分享图失败，请稍后再试");
    } finally {
      setSharingId(null);
    }
  };

  return (
    <div className="grid gap-6">
      <PageHeading eyebrow="History" title="历史" description="查看历史训练、导入导出 JSON，并和上一次同部位训练做快速对比。" actions={
        <div className="flex gap-3">
          <button
            type="button"
            onClick={exportJson}
            className="rounded-full bg-[linear-gradient(180deg,#111827,#020617)] px-4 py-2.5 text-sm font-medium text-white shadow-[0_18px_36px_rgba(15,23,42,0.18)] transition active:translate-y-[1px] active:scale-[0.99]"
          >
            导出
          </button>
          <label className="cursor-pointer rounded-full border border-white/80 bg-white/88 px-4 py-2.5 text-sm font-medium text-slate-700 shadow-[0_12px_28px_rgba(15,23,42,0.05)]">
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
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-white/78 px-4 py-3 text-sm text-slate-600 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
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
                <div
                  key={record.id}
                  className="rounded-[28px] border border-white/80 bg-white/90 p-4 shadow-[0_18px_38px_rgba(15,23,42,0.05)] md:p-5"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-[var(--accent-strong)]/12 bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)]">
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
                        className="rounded-full border border-white/80 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                      >
                        编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => setCompareId(compareId === record.id ? null : record.id)}
                        className="rounded-full border border-white/80 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                      >
                        对比上次
                      </button>
                      <button
                        type="button"
                        onClick={() => shareRecordImage(record)}
                        className="rounded-full border border-white/80 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
                      >
                        {sharingId === record.id ? "生成中..." : "分享图片"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteRecord(record.id)}
                        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 shadow-[0_10px_24px_rgba(244,63,94,0.08)]"
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
          <div className="rounded-[26px] border border-dashed border-slate-300 bg-white/78 px-4 py-8 text-center text-sm text-slate-500 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
            暂无记录。去 <Link href="/planner" className="font-medium text-slate-950">计划</Link>
          </div>
        )}
      </PanelCard>
    </div>
  );
}
