"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useTrainingStore } from "@/store/training-store";
import { ExerciseConfig } from "@/lib/types";

export default function SettingsPage() {
  const storeExercises = useTrainingStore((s) => s.exercises);
  const storeRest = useTrainingStore((s) => s.restSeconds);
  const updateExercises = useTrainingStore((s) => s.updateExercises);
  const setRestSeconds = useTrainingStore((s) => s.setRestSeconds);

  const [exercises, setExercises] = useState<ExerciseConfig[]>(storeExercises);
  const [rest, setRest] = useState(String(storeRest));
  const [saved, setSaved] = useState(false);

  const save = () => {
    updateExercises(exercises.filter((ex) => ex.name.trim()));
    setRestSeconds(Math.max(10, Number(rest) || 90));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const updateEx = (i: number, patch: Partial<ExerciseConfig>) => {
    const next = [...exercises];
    next[i] = { ...next[i], ...patch };
    setExercises(next);
  };

  return (
    <div className="min-h-screen px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),2rem)]">
      <div className="flex items-center gap-3 py-3">
        <Link
          href="/"
          className="rounded-full border border-white/80 bg-white/70 p-2.5 shadow-sm backdrop-blur"
        >
          <ArrowLeft className="h-5 w-5 text-slate-700" />
        </Link>
        <h1 className="text-xl font-semibold tracking-[-0.04em] text-slate-950">
          设置
        </h1>
      </div>

      <div className="mt-6 space-y-5">
        {/* Rest duration */}
        <div className="rounded-[24px] border border-white/80 bg-white/72 p-5 shadow-[0_16px_36px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            默认组间休息
          </div>
          <div className="mt-3 flex items-center gap-3">
            <input
              type="number"
              value={rest}
              onChange={(e) => setRest(e.target.value)}
              className="w-24 rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-center text-xl font-semibold text-slate-900 outline-none focus:border-[var(--accent-strong)]"
            />
            <span className="text-slate-500">秒</span>
          </div>
        </div>

        {/* Exercise list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              训练动作
            </span>
            <button
              onClick={() => setExercises([...exercises, { name: "", targetSets: 4 }])}
              className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-strong)] transition hover:brightness-95"
            >
              + 添加
            </button>
          </div>

          <div className="rounded-[24px] border border-white/80 bg-white/72 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.06)] backdrop-blur space-y-2.5">
            {exercises.map((ex, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={ex.name}
                  onChange={(e) => updateEx(i, { name: e.target.value })}
                  placeholder="动作名称"
                  className="flex-1 rounded-[16px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-slate-900 outline-none focus:border-[var(--accent-strong)]"
                />
                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={ex.targetSets}
                    onChange={(e) => updateEx(i, { targetSets: Math.max(1, Number(e.target.value) || 1) })}
                    className="w-14 rounded-[16px] border border-slate-200 bg-slate-50 px-2 py-2.5 text-center text-slate-900 outline-none focus:border-[var(--accent-strong)]"
                  />
                  <span className="text-xs text-slate-400">组</span>
                </div>
                <button
                  onClick={() => setExercises(exercises.filter((_, j) => j !== i))}
                  className="shrink-0 p-1.5 text-slate-300 transition hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            {exercises.length === 0 && (
              <div className="py-4 text-center text-sm text-slate-400">
                还没有动作，点击上方「添加」
              </div>
            )}
          </div>
        </div>

        <button
          onClick={save}
          className="min-h-[4rem] w-full rounded-full bg-[linear-gradient(180deg,#111827,#020617)] text-lg font-semibold text-white shadow-[0_20px_40px_rgba(15,23,42,0.22)] transition active:scale-[0.98]"
        >
          {saved ? "已保存 ✓" : "保存"}
        </button>
      </div>
    </div>
  );
}
