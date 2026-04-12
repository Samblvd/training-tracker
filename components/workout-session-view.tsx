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
  const nextSetNumber = Math.min(completedSets.length + 1, targetSets || 1);
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

  if (!workout) {
    return (
      <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-[36px] border border-white/70 bg-white/95 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Workout</div>
            <h1 className="text-4xl font-semibold tracking-[-0.07em] text-slate-950">还没有开始训练</h1>
            <p className="text-base leading-7 text-slate-500">先回到首页，从开始训练进入今天的训练流程。</p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-16 min-w-[240px] items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-xl font-semibold text-white"
          >
            回到首页
          </Link>
        </div>
      </section>
    );
  }

  if (isWorkoutFinished && workout.summary) {
    return (
      <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-[36px] border border-white/70 bg-white/95 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mx-auto grid w-full max-w-2xl gap-6 text-center">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Workout Summary</div>
            <h1 className="text-4xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-5xl">今天的训练完成了</h1>
            <p className="text-base leading-7 text-slate-500">训练已经自动保存。下面是这次训练的简短总结。</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "完成动作", value: workout.summary.totalExercises },
              { label: "完成组数", value: workout.summary.totalSets },
              { label: "总训练量", value: workout.summary.totalVolume },
            ].map((item) => (
              <div key={item.label} className="rounded-[28px] border border-slate-200 bg-slate-50/80 px-4 py-5">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 text-left md:grid-cols-3">
            {[
              { title: "进步", items: workout.summary.improvements },
              { title: "提醒", items: workout.summary.cautions },
              { title: "下次建议", items: workout.summary.suggestions },
            ].map((group) => (
              <div key={group.title} className="rounded-[28px] border border-slate-200 bg-white px-4 py-4">
                <div className="text-sm font-semibold text-slate-950">{group.title}</div>
                <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                  {group.items.map((item) => (
                    <div key={item} className="rounded-2xl bg-slate-50 px-3 py-2">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                clearWorkout();
                router.push("/");
              }}
              className="inline-flex min-h-16 min-w-[220px] items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-xl font-semibold text-white"
            >
              知道了
            </button>
            <Link
              href="/history"
              className="inline-flex min-h-16 min-w-[220px] items-center justify-center rounded-full border border-slate-300 bg-white px-8 py-4 text-base font-medium text-slate-700"
            >
              查看训练记录
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (isResting) {
    return (
      <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-[36px] border border-slate-900 bg-slate-950 px-6 py-10 text-white shadow-[0_28px_80px_rgba(15,23,42,0.30)]">
        <div className="mx-auto grid w-full max-w-xl gap-8 text-center">
          <div className="space-y-3">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-white/45">Rest</div>
            <h1 className="text-4xl font-semibold tracking-[-0.07em] sm:text-5xl">休息中</h1>
            <div className="text-8xl font-semibold tracking-[-0.09em] text-white">{formatTimer(remaining)}</div>
            <p className="text-base leading-7 text-white/65">
              下一组：第 {nextSetNumber} / {targetSets || 1} 组
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => skipRest()}
              className="inline-flex min-h-16 items-center justify-center rounded-full bg-white px-6 py-4 text-lg font-semibold text-slate-950"
            >
              跳过休息
            </button>
            <button
              type="button"
              onClick={() => extendRest(30)}
              className="inline-flex min-h-16 items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-4 text-lg font-semibold text-white"
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
      <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-[36px] border border-white/70 bg-white/95 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mx-auto grid w-full max-w-xl gap-6 text-center">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Exercise Complete</div>
            <h1 className="text-4xl font-semibold tracking-[-0.07em] text-slate-950">当前动作完成</h1>
            <p className="text-base leading-7 text-slate-500">下一动作是 {nextExercise.name}，继续把训练推进下去。</p>
          </div>
          <button
            type="button"
            onClick={() => nextWorkoutExercise()}
            className="inline-flex min-h-16 items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-xl font-semibold text-white"
          >
            进入下一动作
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-[36px] border border-white/70 bg-white/95 px-4 py-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-6 sm:py-10">
      <div className="mx-auto grid w-full max-w-xl gap-6 text-center">
        <div className="space-y-3">
          <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Workout Live</div>
          <h1 className="text-4xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-5xl">{currentExercise?.name}</h1>
          <div className="text-lg text-slate-500">
            第 {nextSetNumber} / {targetSets || 1} 组
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 px-5 py-5">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">本组计时</div>
            <div className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-slate-950">{formatTimer(currentSetElapsed)}</div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-slate-50/80 px-5 py-5">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-400">训练时长</div>
            <div className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-slate-950">{formatTimer(workoutDuration)}</div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-2 text-left text-sm">
            <span className="text-slate-500">重量</span>
            <input
              ref={weightRef}
              defaultValue={lastSet?.weight || currentExercise?.weight || "0"}
              className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-2xl font-semibold text-slate-950 outline-none transition focus:border-[var(--accent-strong)]"
            />
          </label>
          <label className="grid gap-2 text-left text-sm">
            <span className="text-slate-500">次数</span>
            <input
              ref={repsRef}
              defaultValue={lastSet?.reps || getRepInputValue(currentExercise?.reps) || "8"}
              className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-2xl font-semibold text-slate-950 outline-none transition focus:border-[var(--accent-strong)]"
            />
          </label>
        </div>

        <button
          type="button"
          onClick={() => {
            completeWorkoutSet({
              weight: weightRef.current?.value || currentExercise?.weight || "0",
              reps: repsRef.current?.value || getRepInputValue(currentExercise?.reps) || "8",
              restSeconds: Number.parseInt(currentExercise?.rest || "90", 10) || 90,
            });
          }}
          className="inline-flex min-h-24 items-center justify-center rounded-[32px] bg-slate-950 px-8 py-6 text-3xl font-semibold tracking-[-0.05em] text-white shadow-[0_24px_56px_rgba(15,23,42,0.24)] transition hover:scale-[1.01]"
        >
          完成本组
        </button>
      </div>
    </section>
  );
}
