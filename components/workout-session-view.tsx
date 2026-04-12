"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { formatTimer, getRepInputValue } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

export function WorkoutSessionView() {
  const router = useRouter();
  const workout = useTrainingStore((state) => state.workout);
  const completeWorkoutSet = useTrainingStore((state) => state.completeWorkoutSet);
  const extendRest = useTrainingStore((state) => state.extendRest);
  const skipRest = useTrainingStore((state) => state.skipRest);
  const nextWorkoutExercise = useTrainingStore((state) => state.nextWorkoutExercise);
  const clearWorkout = useTrainingStore((state) => state.clearWorkout);

  const weightRef = useRef<HTMLInputElement>(null);
  const repsRef = useRef<HTMLInputElement>(null);
  const [now, setNow] = useState(0);

  const triggerHaptic = (duration = 24) => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(duration);
    }
  };

  useEffect(() => {
    if (!workout) return;
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [workout]);

  const currentExercise = workout?.exercises[workout.exIdx];
  const currentLog = workout?.sessionLog[workout.exIdx];
  const completedSets = currentLog?.completedSets || [];
  const targetSets = Number.parseInt(currentExercise?.sets || "0", 10) || 0;
  const nextExercise = workout?.exercises[workout.exIdx + 1];
  const actionIndex = workout ? workout.exIdx + 1 : 0;
  const totalActions = workout?.exercises.length || 0;
  const nextSetNumber = Math.min(completedSets.length + 1, targetSets || 1);
  const progressPercent = totalActions ? Math.min(100, Math.round((actionIndex / totalActions) * 100)) : 0;
  const isExerciseDone = !!workout && !!currentExercise && completedSets.length >= targetSets;
  const isWorkoutFinished = !!workout?.finishedAt;
  const effectiveNow = now || workout?.currentSetStartedAt || 0;
  const remaining = workout?.restEndAt ? Math.max(0, Math.ceil((workout.restEndAt - effectiveNow) / 1000)) : 0;
  const isResting = remaining > 0;
  const currentSetElapsed = workout ? Math.max(0, Math.floor((effectiveNow - workout.currentSetStartedAt) / 1000)) : 0;
  const lastSet = completedSets[completedSets.length - 1];
  const workoutDuration = useMemo(() => {
    if (!workout?.startedAt) return 0;
    return Math.max(0, Math.floor((effectiveNow - new Date(workout.startedAt).getTime()) / 1000));
  }, [effectiveNow, workout]);
  const finishedDuration = (() => {
    if (!workout?.startedAt || !workout?.finishedAt) return 0;
    return Math.max(0, Math.floor((new Date(workout.finishedAt).getTime() - new Date(workout.startedAt).getTime()) / 1000));
  })();
  const autoSavedText = (() => {
    if (!workout?.lastAutoSavedAt) return "已自动保存";
    const diff = Math.max(0, Math.floor((effectiveNow - workout.lastAutoSavedAt) / 1000));
    if (diff < 2) return "已自动保存";
    if (diff < 60) return `${diff} 秒前已自动保存`;
    const mins = Math.floor(diff / 60);
    if (mins < 60) return `${mins} 分钟前已自动保存`;
    return "已自动保存";
  })();

  useEffect(() => {
    if (!isExerciseDone || !nextExercise) return;
    const timer = window.setTimeout(() => {
      nextWorkoutExercise();
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [isExerciseDone, nextExercise, nextWorkoutExercise]);

  if (!workout) {
    return (
      <section className="flex min-h-[calc(100vh-8.5rem)] items-center justify-center rounded-[28px] border border-white/70 bg-white/95 px-4 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center sm:gap-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Workout</div>
            <h1 className="text-3xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-4xl">还没有开始训练</h1>
            <p className="text-sm leading-6 text-slate-500 sm:text-base">先回到首页，从开始训练进入今天的训练流程。</p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-14 min-w-[220px] items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-lg font-semibold text-white sm:min-h-16 sm:min-w-[240px] sm:px-8 sm:py-4 sm:text-xl"
          >
            回到首页
          </Link>
        </div>
      </section>
    );
  }

  if (isWorkoutFinished && workout.summary) {
    const highlightNotes = [...workout.summary.improvements, ...workout.summary.suggestions].slice(0, 2);
    const cautionNote = workout.summary.cautions[0];
    return (
      <section className="flex min-h-[calc(100vh-8.5rem)] items-center justify-center rounded-[28px] border border-white/70 bg-white/95 px-4 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-6 sm:py-10">
        <div className="mx-auto grid w-full max-w-xl gap-4 text-center sm:gap-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Workout Summary</div>
            <h1 className="text-3xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-5xl">今天的训练完成了</h1>
            <p className="text-sm leading-6 text-slate-500 sm:text-base">训练已经自动保存。看一眼总结，然后准备下一次训练。</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "完成动作", value: workout.summary.totalExercises },
              { label: "完成组数", value: workout.summary.totalSets },
              { label: "总时长", value: formatTimer(finishedDuration) },
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-3.5 py-4 sm:rounded-[28px] sm:px-4 sm:py-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-3 text-left">
            {highlightNotes.length ? (
              <div className="rounded-[22px] border border-slate-200 bg-white px-3.5 py-3.5 sm:rounded-[28px] sm:px-4 sm:py-4">
                <div className="text-sm font-semibold text-slate-950">下次继续这样练</div>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {highlightNotes.map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 px-3 py-2">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {cautionNote ? (
              <div className="rounded-[22px] border border-amber-200 bg-amber-50/70 px-3.5 py-3 text-sm leading-6 text-amber-900 sm:rounded-[28px] sm:px-4 sm:py-4">
                {cautionNote}
              </div>
            ) : null}
            <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-3.5 py-3 text-sm leading-6 text-slate-600 sm:rounded-[28px] sm:px-4 sm:py-4">
              总训练量 {workout.summary.totalVolume}，记录已经保存到训练历史里。
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              clearWorkout();
              router.push("/");
            }}
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-lg font-semibold text-white sm:min-h-16 sm:px-8 sm:py-4 sm:text-xl"
          >
            知道了
          </button>
        </div>
      </section>
    );
  }

  if (isResting) {
    return (
      <section className="flex min-h-[calc(100vh-8.5rem)] items-center justify-center rounded-[28px] border border-slate-900 bg-slate-950 px-4 py-6 text-white shadow-[0_28px_80px_rgba(15,23,42,0.30)] sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-6 sm:py-10">
        <div className="mx-auto grid w-full max-w-lg gap-5 text-center sm:max-w-xl sm:gap-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45 sm:text-xs">
              <span>{workout?.muscle}</span>
              <span>{actionIndex}/{totalActions}</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-white" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">休息中</h1>
            <div className="text-6xl font-semibold tracking-[-0.09em] text-white sm:text-8xl">{formatTimer(remaining)}</div>
            <p className="text-sm leading-6 text-white/65 sm:text-base">下一组：第 {nextSetNumber} / {targetSets || 1} 组</p>
            <div className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/65">{currentExercise?.name}</div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                triggerHaptic();
                skipRest();
              }}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-white px-5 py-3.5 text-base font-semibold text-slate-950 sm:min-h-16 sm:px-6 sm:py-4 sm:text-lg"
            >
              跳过休息
            </button>
            <button
              type="button"
              onClick={() => {
                triggerHaptic(14);
                extendRest(30);
              }}
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/10 px-5 py-3.5 text-base font-semibold text-white sm:min-h-16 sm:px-6 sm:py-4 sm:text-lg"
            >
              延长 30 秒
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (isExerciseDone && nextExercise) {
    return (
      <section className="flex min-h-[calc(100vh-8.5rem)] items-center justify-center rounded-[28px] border border-white/70 bg-white/95 px-4 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-6 sm:py-10">
        <div className="mx-auto grid w-full max-w-lg gap-4 text-center sm:max-w-xl sm:gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-xs">
              <span>{workout?.muscle}</span>
              <span>{actionIndex}/{totalActions}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100">
              <div className="h-2 rounded-full bg-[var(--accent-strong)]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-4xl">当前动作完成</h1>
            <p className="text-sm leading-6 text-slate-500 sm:text-base">下一动作：{nextExercise.name}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              nextWorkoutExercise();
            }}
            className="inline-flex min-h-14 items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-lg font-semibold text-white sm:min-h-16 sm:px-8 sm:py-4 sm:text-xl"
          >
            进入下一动作
          </button>
          <div className="text-xs text-slate-400">如果不操作，会自动进入下一动作。</div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative flex min-h-[calc(100vh-8.5rem)] items-center justify-center rounded-[28px] border border-white/70 bg-white/95 px-3 py-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-4 sm:py-8 lg:px-6 lg:py-10">
      <div className="mx-auto grid w-full max-w-md gap-3 pb-28 text-center sm:max-w-lg sm:gap-4 sm:pb-32">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400 sm:text-xs">
            <span>{workout?.muscle}</span>
            <span>{actionIndex}/{totalActions}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-[var(--accent-strong)]" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <h1 className="text-2xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-3xl">{currentExercise?.name}</h1>
          <div className="text-sm font-medium text-slate-500 sm:text-base">第 {nextSetNumber} / {targetSets || 1} 组</div>
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 sm:text-xs">
            <span className="rounded-full bg-slate-100 px-2.5 py-1">训练时长 {formatTimer(workoutDuration)}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">目标 {currentExercise?.weight || "0"}kg × {getRepInputValue(currentExercise?.reps) || currentExercise?.reps || "8"}</span>
          </div>
          <div className="text-[11px] text-emerald-600/90 sm:text-xs">{autoSavedText}</div>
        </div>

        <div className="rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-3 sm:rounded-[24px] sm:px-5 sm:py-4">
          <div className="text-xs uppercase tracking-[0.24em] text-slate-400">本组计时</div>
          <div className="mt-1 text-3xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-4xl">{formatTimer(currentSetElapsed)}</div>
          <div className="mt-2 text-xs text-slate-500">已完成 {completedSets.length} / {targetSets || 1} 组</div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 sm:gap-3">
          <label className="grid gap-1.5 text-left text-sm">
            <span className="text-slate-500">重量</span>
            <input
              ref={weightRef}
              defaultValue={lastSet?.weight || currentExercise?.weight || "0"}
              className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-lg font-semibold text-slate-950 outline-none transition focus:border-[var(--accent-strong)] sm:rounded-[20px] sm:py-3 sm:text-xl"
            />
          </label>
          <label className="grid gap-1.5 text-left text-sm">
            <span className="text-slate-500">次数</span>
            <input
              ref={repsRef}
              defaultValue={lastSet?.reps || getRepInputValue(currentExercise?.reps) || "8"}
              className="rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-2.5 text-lg font-semibold text-slate-950 outline-none transition focus:border-[var(--accent-strong)] sm:rounded-[20px] sm:py-3 sm:text-xl"
            />
          </label>
        </div>

      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 sm:inset-x-4 sm:bottom-4 lg:inset-x-6">
        <div className="pointer-events-auto rounded-[26px] border border-slate-200 bg-white/96 p-2 shadow-[0_24px_56px_rgba(15,23,42,0.12)] backdrop-blur">
          <button
            type="button"
            onClick={() => {
              triggerHaptic();
              completeWorkoutSet({
                weight: weightRef.current?.value || currentExercise?.weight || "0",
                reps: repsRef.current?.value || getRepInputValue(currentExercise?.reps) || "8",
                restSeconds: Number.parseInt(currentExercise?.rest || "90", 10) || 90,
              });
            }}
            className="inline-flex min-h-[4.5rem] w-full items-center justify-center rounded-[22px] bg-slate-950 px-6 py-4 text-2xl font-semibold tracking-[-0.05em] text-white shadow-[0_18px_40px_rgba(15,23,42,0.24)] transition active:scale-[0.99] sm:min-h-20 sm:rounded-[26px] sm:text-3xl"
          >
            完成本组
          </button>
        </div>
      </div>
    </section>
  );
}
