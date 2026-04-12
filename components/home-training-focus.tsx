"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { formatTimer } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

export function HomeTrainingFocus() {
  const router = useRouter();
  const workout = useTrainingStore((state) => state.workout);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!workout || workout.finishedAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [workout]);

  const hasActiveWorkout = !!workout && !workout.finishedAt;
  const currentExercise = workout?.exercises[workout.exIdx];
  const currentLog = workout?.sessionLog[workout.exIdx];
  const completedSets = currentLog?.completedSets.length || 0;
  const targetSets = Number.parseInt(currentExercise?.sets || "0", 10) || 0;
  const effectiveNow = now || workout?.currentSetStartedAt || 0;
  const remaining = workout?.restEndAt ? Math.max(0, Math.ceil((workout.restEndAt - effectiveNow) / 1000)) : 0;
  const isResting = remaining > 0;

  const statusText = useMemo(() => {
    if (!workout) return "准备好就开始今天的训练。";
    if (isResting) return `休息中 · ${formatTimer(remaining)}`;
    if (!currentExercise) return `${workout.muscle} 训练中`;
    return `${currentExercise.name} · 第 ${Math.min(completedSets + 1, targetSets || 1)} / ${targetSets || 1} 组`;
  }, [completedSets, currentExercise, isResting, remaining, targetSets, workout]);

  return (
    <section className="relative flex min-h-[calc(100vh-8.5rem)] items-center justify-center overflow-hidden rounded-[28px] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(241,90,34,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] px-4 py-8 shadow-[0_28px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-6 sm:py-12">
      <Link
        href="/history"
        className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/92 px-3 py-1.5 text-xs font-medium text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:text-slate-950 sm:right-5 sm:top-5 sm:px-4 sm:py-2 sm:text-sm"
      >
        查看记录
      </Link>

      <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center sm:max-w-xl sm:gap-8">
        <div className="space-y-2.5 sm:space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.36em] text-slate-400">Training Assistant</div>
          <h1 className="text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-6xl">
            {hasActiveWorkout ? "训练状态" : "开始训练"}
          </h1>
          <p className="text-sm leading-6 text-slate-500 sm:text-lg">{statusText}</p>
        </div>

        {hasActiveWorkout ? (
          <div className="grid w-full max-w-sm gap-3 sm:max-w-md sm:grid-cols-2">
            <div className="rounded-[22px] border border-slate-200 bg-white/88 px-4 py-4 text-left sm:rounded-[26px]">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">当前部位</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">{workout.muscle}</div>
            </div>
            <div className="rounded-[22px] border border-slate-200 bg-white/88 px-4 py-4 text-left sm:rounded-[26px]">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">当前节奏</div>
              <div className="mt-2 text-xl font-semibold tracking-[-0.04em] text-slate-950">
                {isResting ? formatTimer(remaining) : `${Math.min(completedSets + 1, targetSets || 1)} / ${targetSets || 1} 组`}
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/planner")}
            className="inline-flex min-h-16 min-w-[220px] items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-xl font-semibold tracking-[-0.05em] text-white shadow-[0_28px_56px_rgba(15,23,42,0.28)] transition hover:scale-[1.01] sm:min-h-20 sm:min-w-[280px] sm:px-10 sm:py-6 sm:text-2xl"
          >
            开始训练
          </button>
        )}
      </div>
    </section>
  );
}
