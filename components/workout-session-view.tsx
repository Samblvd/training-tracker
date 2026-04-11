"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { PanelCard } from "@/components/panel-card";
import { formatTimer, getRepInputValue } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

export function WorkoutSessionView() {
  const workout = useTrainingStore((state) => state.workout);
  const completeWorkoutSet = useTrainingStore((state) => state.completeWorkoutSet);
  const extendRest = useTrainingStore((state) => state.extendRest);
  const skipRest = useTrainingStore((state) => state.skipRest);
  const nextWorkoutExercise = useTrainingStore((state) => state.nextWorkoutExercise);
  const skipCurrentExercise = useTrainingStore((state) => state.skipCurrentExercise);
  const finishWorkout = useTrainingStore((state) => state.finishWorkout);
  const clearWorkout = useTrainingStore((state) => state.clearWorkout);

  const weightRef = useRef<HTMLInputElement>(null);
  const repsRef = useRef<HTMLInputElement>(null);
  const restRef = useRef<HTMLInputElement>(null);
  const [now, setNow] = useState(0);
  const [status, setStatus] = useState("");

  const currentExercise = workout?.exercises[workout.exIdx];
  const currentLog = workout?.sessionLog[workout.exIdx];
  const completedSets = currentLog?.completedSets || [];
  const targetSets = Number.parseInt(currentExercise?.sets || "0", 10) || 0;
  const isExerciseDone = !!workout && !!currentExercise && completedSets.length >= targetSets;
  const isWorkoutFinished = !!workout?.finishedAt;

  useEffect(() => {
    if (!workout?.restEndAt) {
      return;
    }

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 500);
    return () => window.clearInterval(timer);
  }, [workout?.restEndAt]);

  const completedCount = workout?.sessionLog.reduce((sum, item) => sum + item.completedSets.length, 0) || 0;
  const remaining = workout?.restEndAt ? Math.max(0, Math.ceil((workout.restEndAt - now) / 1000)) : 0;
  const lastSet = completedSets[completedSets.length - 1];
  const inputKey = `${currentExercise?.name || "empty"}-${completedSets.length}`;

  if (!workout) {
    return (
      <PanelCard title="训练中">
        <div className="flex flex-wrap gap-3">
          <Link href="/planner" className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white">
            计划
          </Link>
          <Link href="/history" className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
            历史
          </Link>
        </div>
      </PanelCard>
    );
  }

  if (isWorkoutFinished && workout.summary) {
    return (
      <PanelCard title="训练总结">
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: "完成动作", value: workout.summary.totalExercises },
              { label: "完成组数", value: workout.summary.totalSets },
              { label: "训练量", value: workout.summary.totalVolume },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { title: "进步", items: workout.summary.improvements },
              { title: "提醒", items: workout.summary.cautions },
              { title: "建议", items: workout.summary.suggestions },
            ].map((group) => (
              <div key={group.title} className="rounded-[24px] border border-slate-200 bg-white px-4 py-4">
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

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => clearWorkout()}
              className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white"
            >
              清空当前总结
            </button>
            <Link href="/history" className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
              去历史页查看
            </Link>
          </div>
        </div>
      </PanelCard>
    );
  }

  return (
    <PanelCard title={`${workout.muscle} · 训练中`}>
      <div className="grid gap-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.24em] text-slate-400">当前动作</div>
              <div className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{currentExercise?.name}</div>
              <div className="mt-2 text-sm text-slate-600">
                第 {workout.exIdx + 1} / {workout.exercises.length} 个动作 · 已完成 {completedCount} 组
              </div>
            </div>
            <div className="rounded-[24px] bg-slate-950 px-4 py-4 text-white">
              <div className="text-xs uppercase tracking-[0.24em] text-white/60">休息倒计时</div>
              <div className="mt-1 text-3xl font-semibold">{formatTimer(remaining)}</div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {[
              { label: "目标重量", value: `${currentExercise?.weight || "0"}kg` },
              { label: "目标组数", value: `${currentExercise?.sets || "0"} 组` },
              { label: "目标次数", value: `${currentExercise?.reps || "0"} 次` },
            ].map((item) => (
              <div key={item.label} className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-xl font-semibold text-slate-950">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-950">记录这一组</div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "重量",
                  defaultValue: lastSet?.weight || currentExercise?.weight || "0",
                  inputRef: weightRef,
                },
                {
                  label: "次数",
                  defaultValue: lastSet?.reps || getRepInputValue(currentExercise?.reps) || "8",
                  inputRef: repsRef,
                },
                {
                  label: "休息",
                  defaultValue: currentExercise?.rest || "90",
                  inputRef: restRef,
                },
              ].map((field) => (
                <label key={`${inputKey}-${field.label}`} className="grid gap-1 text-sm">
                  <span className="text-slate-500">{field.label}</span>
                  <input
                    key={`${inputKey}-${field.label}`}
                    ref={field.inputRef}
                    defaultValue={field.defaultValue}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  completeWorkoutSet({
                    weight: weightRef.current?.value || currentExercise?.weight || "0",
                    reps: repsRef.current?.value || getRepInputValue(currentExercise?.reps) || "8",
                    restSeconds:
                      Number.parseInt(restRef.current?.value || "", 10) || Number.parseInt(currentExercise?.rest || "90", 10) || 90,
                  });
                  setStatus("本组已记录");
                }}
                className="rounded-full bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-medium text-white"
              >
                完成这一组
              </button>
              <button
                type="button"
                onClick={() => extendRest(30)}
                className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                +30 秒休息
              </button>
              <button
                type="button"
                onClick={() => skipRest()}
                className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                跳过休息
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => nextWorkoutExercise()}
                className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                下一动作
              </button>
              <button
                type="button"
                onClick={() => skipCurrentExercise()}
                className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
              >
                跳过当前动作
              </button>
              <button
                type="button"
                onClick={() => {
                  const result = finishWorkout();
                  setStatus(result.message);
                }}
                className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white"
              >
                保存并结束训练
              </button>
            </div>

            {isExerciseDone ? (
              <div className="mt-4 rounded-[22px] bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-strong)]">
                当前动作计划组数已完成，可以进入下一个动作，或直接结束训练。
              </div>
            ) : null}

            {status ? <div className="mt-4 text-sm text-slate-500">{status}</div> : null}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5">
            <div className="text-sm font-semibold text-slate-950">已完成组</div>
            <div className="mt-4 grid gap-3">
              {completedSets.length ? (
                completedSets.map((set) => (
                  <div key={set.setNumber} className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
                    <div className="text-sm font-semibold text-slate-950">第 {set.setNumber} 组</div>
                    <div className="mt-1 text-sm text-slate-600">
                      {set.weight}kg · {set.reps} 次 · 休息 {set.restSeconds} 秒
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-6 text-sm text-slate-500">
                  还没有完成的组，先记录第一组。
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PanelCard>
  );
}
