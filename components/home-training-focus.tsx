"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, Play, History, BarChart3, ChevronRight, TimerReset, Dumbbell } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PanelCard } from "@/components/panel-card";
import { StatsStrip } from "@/components/stats-strip";
import { formatTimer, muscles } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

export function HomeTrainingFocus() {
  const router = useRouter();
  const selectedMuscle = useTrainingStore((state) => state.selectedMuscle);
  const setSelectedMuscle = useTrainingStore((state) => state.setSelectedMuscle);
  const editorPlans = useTrainingStore((state) => state.editorPlans);
  const workout = useTrainingStore((state) => state.workout);
  const startWorkout = useTrainingStore((state) => state.startWorkout);

  const [status, setStatus] = useState("");
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!workout?.restEndAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [workout?.restEndAt]);

  const selectedExercises = editorPlans[selectedMuscle]?.filter((item) => item.selected) || [];
  const selectedCount = selectedExercises.length;
  const currentExercise = workout?.exercises[workout.exIdx];
  const currentLog = workout?.sessionLog[workout.exIdx];
  const completedSets = currentLog?.completedSets.length || 0;
  const targetSets = Number.parseInt(currentExercise?.sets || "0", 10) || 0;
  const timerBase = now || ((workout?.restEndAt || 0) - (workout?.restTotal || 0) * 1000);
  const remaining = workout?.restEndAt ? Math.max(0, Math.ceil((workout.restEndAt - timerBase) / 1000)) : 0;
  const isResting = remaining > 0;

  const workoutStatus = useMemo(() => {
    if (!workout) return null;
    if (isResting) {
      return {
        label: "休息中",
        detail: `${formatTimer(remaining)} 后进入第 ${Math.min(completedSets + 1, targetSets)} 组`,
      };
    }
    if (currentExercise) {
      return {
        label: "进行中",
        detail: `${currentExercise.name} · 第 ${Math.min(completedSets + 1, targetSets || 1)} / ${targetSets || 1} 组`,
      };
    }
    return {
      label: "训练进行中",
      detail: `${workout.muscle} · ${workout.exercises.length} 个动作`,
    };
  }, [completedSets, currentExercise, isResting, remaining, targetSets, workout]);

  const handlePrimaryAction = () => {
    if (workout) {
      router.push("/workout");
      return;
    }

    const result = startWorkout();
    setStatus(result.message);
    if (result.ok) {
      router.push("/workout");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <PanelCard
          title={workout ? "继续今天的训练" : "今天练什么"}
          description={workout ? "先回到当前动作和节奏，不要让训练被页面信息打断。" : "先选部位，再直接开始训练。计划和记录都放在后面。"}
          className="overflow-hidden border-slate-200 bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(241,245,249,0.95))]"
        >
          <div className="grid gap-6">
            <div className="grid gap-3 sm:grid-cols-4">
              {muscles.map((muscle) => {
                const active = muscle === selectedMuscle;
                return (
                  <button
                    key={muscle}
                    type="button"
                    onClick={() => setSelectedMuscle(muscle)}
                    className={[
                      "rounded-[24px] border px-4 py-4 text-left transition",
                      active
                        ? "border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_14px_34px_rgba(15,23,42,0.10)]"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950",
                    ].join(" ")}
                  >
                    <div className="text-xs uppercase tracking-[0.2em] opacity-70">训练部位</div>
                    <div className="mt-2 text-xl font-semibold tracking-[-0.04em]">{muscle}</div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_24px_80px_rgba(15,23,42,0.30)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="space-y-3">
                  <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                    {workout ? "训练继续" : "训练启动"}
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tracking-[-0.05em] md:text-4xl">
                      {workout ? workoutStatus?.label : `${selectedMuscle} 训练准备好了`}
                    </div>
                    <div className="mt-2 max-w-xl text-sm leading-6 text-white/70 md:text-base">
                      {workoutStatus?.detail || `当前已选 ${selectedCount} 个动作，直接开始后只用关注当前动作、组数和倒计时。`}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent-strong)] px-6 py-4 text-base font-semibold text-white transition hover:brightness-110"
                >
                  {workout ? <TimerReset className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  {workout ? "继续训练" : "开始训练"}
                </button>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/50">当前部位</div>
                  <div className="mt-2 text-2xl font-semibold">{workout?.muscle || selectedMuscle}</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/50">当前动作</div>
                  <div className="mt-2 text-xl font-semibold">{currentExercise?.name || `${selectedCount} 个已选动作`}</div>
                </div>
                <div className="rounded-[24px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="text-xs uppercase tracking-[0.24em] text-white/50">当前节奏</div>
                  <div className="mt-2 text-xl font-semibold">
                    {isResting ? `${formatTimer(remaining)} 休息中` : workout ? `第 ${Math.min(completedSets + 1, targetSets || 1)} / ${targetSets || 1} 组` : "准备开始"}
                  </div>
                </div>
              </div>
            </div>

            {status ? <div className="text-sm text-slate-500">{status}</div> : null}
          </div>
        </PanelCard>

        <div className="grid gap-6">
          <PanelCard title="计划工具" description="这些入口是辅助，不要抢掉开始训练的主流程。">
            <div className="grid gap-3">
              <Link
                href="/planner"
                className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-slate-800 transition hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-[var(--accent-soft)] p-2 text-[var(--accent-strong)]"><Mic className="h-5 w-5" /></span>
                  <div>
                    <div className="font-semibold">语音输入计划</div>
                    <div className="text-sm text-slate-500">口语说出今天怎么练，再微调即可。</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </Link>

              <Link
                href="/planner"
                className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white px-4 py-4 text-slate-800 transition hover:border-slate-300"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-slate-100 p-2 text-slate-700"><Dumbbell className="h-5 w-5" /></span>
                  <div>
                    <div className="font-semibold">自己选动作</div>
                    <div className="text-sm text-slate-500">手动调整动作、组数、次数和休息时长。</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </Link>
            </div>
          </PanelCard>

          <PanelCard title="训练之后再看" description="先完成今天的训练，再回来看复盘数据。">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <Link href="/history" className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 transition hover:border-slate-300">
                <div className="flex items-center gap-3 text-slate-900">
                  <History className="h-5 w-5 text-slate-500" />
                  <span className="font-semibold">历史记录</span>
                </div>
                <div className="mt-2 text-sm text-slate-500">训练结束后再回头看完整记录。</div>
              </Link>
              <Link href="/analytics" className="rounded-[24px] border border-slate-200 bg-white px-4 py-4 transition hover:border-slate-300">
                <div className="flex items-center gap-3 text-slate-900">
                  <BarChart3 className="h-5 w-5 text-slate-500" />
                  <span className="font-semibold">趋势分析</span>
                </div>
                <div className="mt-2 text-sm text-slate-500">把趋势和频率留到训练后复盘。</div>
              </Link>
            </div>
          </PanelCard>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <PanelCard title="训练统计" description="保留轻量感知，但不抢主流程。" className="order-2 xl:order-1">
          <StatsStrip />
        </PanelCard>

        <PanelCard title="今天的计划" description="默认计划已经就位，不想思考时直接开始。" className="order-1 xl:order-2">
          <div className="space-y-3">
            {selectedExercises.slice(0, 4).map((exercise) => (
              <div key={exercise.name} className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3">
                <div className="font-semibold text-slate-950">{exercise.name}</div>
                <div className="mt-1 text-sm text-slate-500">
                  {exercise.weight || "0"}kg · {exercise.sets || "3"} 组 · {exercise.reps || "8"} 次 · 休息 {exercise.rest || "90"} 秒
                </div>
              </div>
            ))}
            {!selectedExercises.length ? <div className="rounded-[22px] border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">当前没有选中的动作，去计划页补一下即可。</div> : null}
          </div>
        </PanelCard>
      </div>
    </div>
  );
}
