"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react";
import { useTrainingStore } from "@/store/training-store";
import { cn, formatMs, formatTimer } from "@/lib/utils";
import { ExerciseConfig } from "@/lib/types";

export function WorkoutPage() {
  const workout = useTrainingStore((s) => s.workout);
  const exercises = useTrainingStore((s) => s.exercises);
  const startWorkout = useTrainingStore((s) => s.startWorkout);

  if (!workout) return <StartScreen exercises={exercises} onStart={startWorkout} />;
  return <WorkoutScreen />;
}

// ─────────────────────── Start Screen ─────────────────────

function StartScreen({
  exercises,
  onStart,
}: {
  exercises: ExerciseConfig[];
  onStart: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col px-5 pt-[max(env(safe-area-inset-top),1.5rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <div className="flex justify-end py-3">
        <Link
          href="/settings"
          className="rounded-full border border-white/80 bg-white/70 p-2.5 shadow-sm backdrop-blur"
        >
          <Settings className="h-5 w-5 text-slate-500" />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-8">
        <div className="space-y-1.5 text-center">
          <h1 className="text-[2.8rem] font-semibold tracking-[-0.07em] text-slate-950">
            训练助手
          </h1>
          <p className="text-sm text-slate-500">
            {exercises.length} 个动作 · 准备好了就开始
          </p>
        </div>

        <div className="space-y-2 rounded-[28px] border border-white/80 bg-white/72 p-4 shadow-[0_20px_48px_rgba(15,23,42,0.07)] backdrop-blur">
          {exercises.map((ex, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-[18px] bg-white/80 px-4 py-3"
            >
              <span className="font-medium text-slate-900">{ex.name}</span>
              <span className="text-sm text-slate-400">{ex.targetSets} 组</span>
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          className="min-h-[4.5rem] w-full rounded-full bg-[linear-gradient(180deg,#111827,#020617)] text-xl font-semibold tracking-[-0.04em] text-white shadow-[0_28px_56px_rgba(15,23,42,0.26)] transition active:scale-[0.98] active:translate-y-px"
        >
          开始训练
        </button>
      </div>
    </div>
  );
}

// ────────────────────── Workout Screen ────────────────────

function WorkoutScreen() {
  const [now, setNow] = useState(() => Date.now());
  const prevRestingRef = useRef(false);

  const workout = useTrainingStore((s) => s.workout);
  const exercises = useTrainingStore((s) => s.exercises);
  const holdTimer = useTrainingStore((s) => s.holdTimer);
  const completeSet = useTrainingStore((s) => s.completeSet);
  const skipRest = useTrainingStore((s) => s.skipRest);
  const extendRest = useTrainingStore((s) => s.extendRest);
  const goToExercise = useTrainingStore((s) => s.goToExercise);
  const finishWorkout = useTrainingStore((s) => s.finishWorkout);
  const toggleHold = useTrainingStore((s) => s.toggleHold);
  const resetHold = useTrainingStore((s) => s.resetHold);

  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(t);
  }, []);

  if (!workout) return null;

  const exIdx = workout.currentExIdx;
  const currentEx = exercises[exIdx];
  const setsCount = workout.completedSets[exIdx] ?? 0;
  const targetSets = currentEx?.targetSets ?? 3;
  const totalDots = Math.max(setsCount, targetSets);

  const elapsed = Math.floor((now - workout.startedAt) / 1000);
  const restLeft = workout.restEndAt
    ? Math.max(0, Math.ceil((workout.restEndAt - now) / 1000))
    : 0;
  const isResting = restLeft > 0;
  const holdMs =
    holdTimer.accumulated + (holdTimer.startedAt ? now - holdTimer.startedAt : 0);
  const isHolding = holdTimer.startedAt !== null;

  // Vibrate when rest ends
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (prevRestingRef.current && !isResting) {
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([80, 40, 80]);
      }
    }
    prevRestingRef.current = isResting;
  }, [isResting]);

  const haptic = (ms = 24) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(ms);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-5 pt-[max(env(safe-area-inset-top),1rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          训练中
        </span>
        <span className="font-mono text-2xl font-semibold tracking-tighter text-slate-950">
          {formatTimer(elapsed)}
        </span>
        <Link
          href="/settings"
          className="rounded-full border border-white/80 bg-white/70 p-2 backdrop-blur"
        >
          <Settings className="h-4 w-4 text-slate-400" />
        </Link>
      </div>

      {/* Exercise nav */}
      <div className="mt-5 flex items-center gap-3">
        <button
          onClick={() => goToExercise(exIdx - 1)}
          disabled={exIdx === 0}
          className="rounded-full border border-white/80 bg-white/70 p-2.5 shadow-sm backdrop-blur transition disabled:opacity-20"
        >
          <ChevronLeft className="h-5 w-5 text-slate-700" />
        </button>

        <div className="flex-1 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            {exIdx + 1} / {exercises.length}
          </div>
          <div className="mt-0.5 text-2xl font-semibold leading-tight tracking-[-0.04em] text-slate-950">
            {currentEx?.name}
          </div>
        </div>

        <button
          onClick={() => goToExercise(exIdx + 1)}
          disabled={exIdx === exercises.length - 1}
          className="rounded-full border border-white/80 bg-white/70 p-2.5 shadow-sm backdrop-blur transition disabled:opacity-20"
        >
          <ChevronRight className="h-5 w-5 text-slate-700" />
        </button>
      </div>

      {/* Set counter */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5 py-6">
        <div className="text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            已完成组数
          </div>
          <div className="mt-1 font-bold leading-none tracking-[-0.08em] text-slate-950"
            style={{ fontSize: "clamp(5rem, 28vw, 8rem)" }}>
            {setsCount}
          </div>
          <div className="mt-2 text-sm text-slate-400">目标 {targetSets} 组</div>
        </div>

        {/* Progress dots */}
        <div className="flex flex-wrap justify-center gap-3">
          {Array.from({ length: totalDots }, (_, i) => (
            <div
              key={i}
              className={cn(
                "h-4 w-4 rounded-full transition-all duration-300",
                i < setsCount
                  ? "bg-[var(--accent-strong)] shadow-[0_4px_14px_rgba(241,90,34,0.40)]"
                  : "bg-slate-200",
              )}
            />
          ))}
        </div>
      </div>

      {/* Action area */}
      {isResting ? (
        <div className="rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_28px_56px_rgba(15,23,42,0.24)]">
          <div className="flex flex-col items-center gap-5">
            <div className="text-center">
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                休息中
              </div>
              <div className="mt-1 font-mono text-6xl font-bold tracking-[-0.06em]">
                {formatTimer(restLeft)}
              </div>
            </div>
            <div className="flex w-full gap-3">
              <button
                onClick={() => {
                  haptic();
                  skipRest();
                }}
                className="flex-1 rounded-full border border-white/20 bg-white/10 py-3.5 text-base font-semibold transition active:scale-[0.97]"
              >
                跳过
              </button>
              <button
                onClick={() => {
                  haptic(14);
                  extendRest(30);
                }}
                className="flex-1 rounded-full border border-white/20 bg-white/10 py-3.5 text-base font-semibold transition active:scale-[0.97]"
              >
                +30 秒
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            haptic();
            completeSet();
          }}
          className="min-h-[4.5rem] w-full rounded-full bg-[linear-gradient(180deg,#111827,#020617)] text-2xl font-bold tracking-[-0.04em] text-white shadow-[0_24px_48px_rgba(15,23,42,0.28)] transition active:scale-[0.98] active:translate-y-px"
        >
          完成本组
        </button>
      )}

      {/* Hold timer */}
      <div className="mt-4 rounded-[24px] border border-white/80 bg-white/72 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.06)] backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              等长 / 拉伸计时
            </div>
            <div
              className={cn(
                "mt-0.5 font-mono text-3xl font-bold tracking-[-0.05em] transition-colors",
                isHolding ? "text-[var(--accent-strong)]" : "text-slate-950",
              )}
            >
              {formatMs(holdMs)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleHold}
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-semibold transition active:scale-[0.97]",
                isHolding
                  ? "bg-[var(--accent-strong)] text-white shadow-[0_8px_20px_rgba(241,90,34,0.28)]"
                  : "bg-slate-950 text-white shadow-[0_8px_20px_rgba(15,23,42,0.18)]",
              )}
            >
              {isHolding ? "停止" : "开始"}
            </button>
            <button
              onClick={resetHold}
              className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-500 transition active:scale-[0.97]"
            >
              重置
            </button>
          </div>
        </div>
      </div>

      {/* End workout */}
      <button
        onClick={finishWorkout}
        className="mt-4 py-2 text-center text-sm text-slate-400 transition hover:text-slate-600"
      >
        结束训练
      </button>
    </div>
  );
}
