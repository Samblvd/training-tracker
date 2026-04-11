"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, PauseCircle, PlayCircle } from "lucide-react";

import { PanelCard } from "@/components/panel-card";
import { cn, formatTimer, getRepInputValue } from "@/lib/utils";
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
  const completedCount = workout?.sessionLog.reduce((sum, item) => sum + item.completedSets.length, 0) || 0;
  const totalTargetSets = workout?.exercises.reduce((sum, item) => sum + (Number.parseInt(item.sets || "0", 10) || 0), 0) || 0;
  const isExerciseDone = !!workout && !!currentExercise && completedSets.length >= targetSets;
  const isWorkoutFinished = !!workout?.finishedAt;
  const timerBase = now || ((workout?.restEndAt || 0) - (workout?.restTotal || 0) * 1000);
  const remaining = workout?.restEndAt ? Math.max(0, Math.ceil((workout.restEndAt - timerBase) / 1000)) : 0;
  const isResting = remaining > 0;
  const lastSet = completedSets[completedSets.length - 1];
  const inputKey = `${currentExercise?.name || "empty"}-${completedSets.length}`;
  const progressPercent = totalTargetSets ? Math.min(100, Math.round((completedCount / totalTargetSets) * 100)) : 0;
  const nextExercise = workout?.exercises[workout.exIdx + 1];
  const nextSetNumber = Math.min(completedSets.length + 1, targetSets || 1);

  useEffect(() => {
    if (!workout?.restEndAt) return;
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 500);
    return () => window.clearInterval(timer);
  }, [workout?.restEndAt]);

  if (!workout) {
    return (
      <PanelCard title="还没开始训练" description="先回到计划页确认动作，或者直接回首页从开始训练进入。" className="overflow-hidden">
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white">
            回首页开始训练
          </Link>
          <Link href="/planner" className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700">
            去计划页调整
          </Link>
        </div>
      </PanelCard>
    );
  }

  if (isWorkoutFinished && workout.summary) {
    return (
      <PanelCard title="训练完成" description="这次训练已经自动保存好了，下面是给你的简短复盘。" className="overflow-hidden">
        <div className="grid gap-5">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: "完成动作", value: workout.summary.totalExercises },
              { label: "完成组数", value: workout.summary.totalSets },
              { label: "总训练量", value: workout.summary.totalVolume },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4">
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
                <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-slate-950">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { title: "进步", items: workout.summary.improvements },
              { title: "提醒", items: workout.summary.cautions },
              { title: "下次建议", items: workout.summary.suggestions },
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
            <Link href="/" className="rounded-full bg-slate-950 px-4 py-3 text-sm font-medium text-white">
              返回首页
            </Link>
            <Link href="/history" className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              去历史页查看
            </Link>
            <button type="button" onClick={() => clearWorkout()} className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700">
              清空当前总结
            </button>
          </div>
        </div>
      </PanelCard>
    );
  }

  return (
    <div className="grid gap-5">
      <PanelCard title={`${workout.muscle} · 训练中`} description="只专注当前动作、当前组和节奏，其余信息都往后放。" className="overflow-hidden">
        <div className="grid gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.24em] text-slate-400">训练进度</div>
              <div className="mt-2 text-sm text-slate-600">
                动作 {workout.exIdx + 1} / {workout.exercises.length} · 已完成 {completedCount} / {totalTargetSets || completedCount} 组
              </div>
            </div>
            <Link href="/" className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-500 transition hover:text-slate-800">
              退出训练页
            </Link>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-[var(--accent-strong)] transition-all" style={{ width: `${progressPercent}%` }} />
          </div>

          <div className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(241,245,249,0.96))] p-5 shadow-[0_18px_50px_rgba(15,23,42,0.07)] md:p-7">
            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">当前动作</div>
                <div className="mt-2 text-4xl font-semibold tracking-[-0.06em] text-slate-950 md:text-5xl">{currentExercise?.name}</div>
                <div className="mt-3 text-base text-slate-600">
                  第 {Math.min(completedSets.length + 1, targetSets || 1)} / {targetSets || 1} 组
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "目标重量", value: `${currentExercise?.weight || "0"}kg` },
                    { label: "目标次数", value: `${currentExercise?.reps || "0"} 次` },
                    { label: "休息节奏", value: `${currentExercise?.rest || "90"} 秒` },
                  ].map((item) => (
                    <div key={item.label} className="rounded-[22px] border border-slate-200 bg-white/80 px-4 py-4">
                      <div className="text-xs uppercase tracking-[0.24em] text-slate-400">{item.label}</div>
                      <div className="mt-2 text-xl font-semibold text-slate-950">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={cn(
                  "rounded-[28px] px-5 py-6 text-center",
                  isResting ? "bg-slate-950 text-white" : isExerciseDone ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "bg-white border border-slate-200 text-slate-900",
                )}
              >
                {isResting ? (
                  <div className="grid gap-4">
                    <div className="inline-flex items-center justify-center gap-2 text-sm font-medium text-white/70">
                      <PauseCircle className="h-4 w-4" /> 休息中
                    </div>
                    <div className="text-6xl font-semibold tracking-[-0.08em]">{formatTimer(remaining)}</div>
                    <div className="text-sm text-white/70">下一组是第 {nextSetNumber} / {targetSets || 1} 组</div>
                    <div className="flex flex-wrap justify-center gap-3">
                      <button type="button" onClick={() => skipRest()} className="rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-950">
                        跳过休息
                      </button>
                      <button type="button" onClick={() => extendRest(30)} className="rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white">
                        延长 30 秒
                      </button>
                    </div>
                  </div>
                ) : isExerciseDone ? (
                  <div className="grid gap-4 text-left">
                    <div className="text-sm font-semibold uppercase tracking-[0.24em]">当前动作已完成</div>
                    <div className="text-3xl font-semibold tracking-[-0.05em]">{currentExercise?.name}</div>
                    <div className="text-sm leading-6 text-current/80">
                      {nextExercise ? `下一动作是 ${nextExercise.name}，继续把节奏推进下去。` : "最后一组完成后会自动保存，并直接进入训练总结。"}
                    </div>
                    {nextExercise ? (
                      <div className="flex flex-wrap gap-3">
                        <button type="button" onClick={() => nextWorkoutExercise()} className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-medium text-white">
                          进入下一动作
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid gap-2 text-left">
                    <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                      <PlayCircle className="h-4 w-4" /> 当前工作组
                    </div>
                    <div className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">第 {nextSetNumber} / {targetSets || 1} 组</div>
                    <div className="text-sm leading-6 text-slate-500">只需要填这一组的重量和次数，完成后会自动进入休息。</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </PanelCard>

      {!isResting && !isExerciseDone ? (
        <PanelCard title="完成本组" description="输入这一组的实际完成情况，剩下交给训练节奏。" className="overflow-hidden">
          <div className="grid gap-5 xl:grid-cols-[1fr_0.75fr]">
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-3">
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
                    label: "休息秒数",
                    defaultValue: currentExercise?.rest || "90",
                    inputRef: restRef,
                  },
                ].map((field) => (
                  <label key={`${inputKey}-${field.label}`} className="grid gap-2 text-sm">
                    <span className="text-slate-500">{field.label}</span>
                    <input
                      key={`${inputKey}-${field.label}`}
                      ref={field.inputRef}
                      defaultValue={field.defaultValue}
                      className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-lg font-medium text-slate-950 outline-none transition focus:border-[var(--accent-strong)]"
                    />
                  </label>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    completeWorkoutSet({
                      weight: weightRef.current?.value || currentExercise?.weight || "0",
                      reps: repsRef.current?.value || getRepInputValue(currentExercise?.reps) || "8",
                      restSeconds:
                        Number.parseInt(restRef.current?.value || "", 10) || Number.parseInt(currentExercise?.rest || "90", 10) || 90,
                    });
                    setStatus("本组已记录，准备进入休息");
                  }}
                  className="rounded-full bg-[var(--accent-strong)] px-6 py-3.5 text-base font-semibold text-white transition hover:brightness-110"
                >
                  完成本组
                </button>
                <button type="button" onClick={() => skipCurrentExercise()} className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                  跳过当前动作
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const result = finishWorkout();
                    setStatus(result.message);
                  }}
                  className="rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700"
                >
                  提前结束训练
                </button>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 px-4 py-4">
              <div className="text-sm font-semibold text-slate-950">本组默认值</div>
              <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
                <div>第 1 组默认使用目标值。</div>
                <div>后续组会默认沿用上一组的重量和次数。</div>
                <div>休息时长默认取动作计划里的设定。</div>
              </div>
            </div>
          </div>
        </PanelCard>
      ) : null}

      <PanelCard title="已完成组" description="只保留当前动作的已完成内容，方便快速回看。" className="overflow-hidden">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {completedSets.length ? (
            completedSets.map((set) => (
              <div key={set.setNumber} className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
                <div className="text-sm font-semibold text-slate-950">第 {set.setNumber} 组</div>
                <div className="mt-1 text-sm text-slate-600">{set.weight}kg × {set.reps} 次</div>
                <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400">休息 {set.restSeconds} 秒</div>
              </div>
            ))
          ) : (
            <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-6 text-sm text-slate-500">
              还没有完成的组，先把第一组做出来。
            </div>
          )}
        </div>
      </PanelCard>

      {status ? <div className="px-1 text-sm text-slate-500">{status}</div> : null}
    </div>
  );
}
