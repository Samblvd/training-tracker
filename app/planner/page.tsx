"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { PlannerEditor } from "@/components/planner-editor";
import { VoicePlanPanel } from "@/components/voice-plan-panel";
import { muscles } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

export default function PlannerPage() {
  const router = useRouter();
  const selectedMuscle = useTrainingStore((state) => state.selectedMuscle);
  const setSelectedMuscle = useTrainingStore((state) => state.setSelectedMuscle);
  const startWorkout = useTrainingStore((state) => state.startWorkout);
  const workout = useTrainingStore((state) => state.workout);
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [status, setStatus] = useState("");

  const hasActiveWorkout = !!workout && !workout.finishedAt;

  if (hasActiveWorkout) {
    return (
      <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-[36px] border border-white/70 bg-white/95 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Workout In Progress</div>
            <h1 className="text-4xl font-semibold tracking-[-0.07em] text-slate-950">今天的训练已经开始了</h1>
            <p className="text-base leading-7 text-slate-500">直接回到训练页，继续当前动作和节奏。</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/workout")}
            className="inline-flex min-h-16 min-w-[240px] items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-xl font-semibold text-white"
          >
            继续训练
          </button>
        </div>
      </section>
    );
  }

  if (step === "select") {
    return (
      <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-[36px] border border-white/70 bg-white/95 px-6 py-10 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="mx-auto grid w-full max-w-3xl gap-8 text-center">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Step 1</div>
            <h1 className="text-4xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-5xl">今天练哪里</h1>
            <p className="text-base leading-7 text-slate-500">只选一个部位，下一步再确认今天的动作。</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {muscles.map((muscle) => (
              <button
                key={muscle}
                type="button"
                onClick={() => {
                  setSelectedMuscle(muscle);
                  setStep("confirm");
                }}
                className={[
                  "rounded-[32px] border px-6 py-8 text-left transition",
                  selectedMuscle === muscle
                    ? "border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_18px_40px_rgba(241,90,34,0.10)]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                <div className="text-xs uppercase tracking-[0.24em] opacity-60">训练部位</div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.05em]">{muscle}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[36px] border border-white/70 bg-white/95 px-5 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-6 sm:py-8">
        <div className="grid gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Step 2</div>
              <h1 className="text-3xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-4xl">确认今天的动作</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                这里是今天的 {selectedMuscle} 训练卡片。把动作、重量、组数、次数调顺以后，就直接进入训练。
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep("select")}
              className="rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600"
            >
              重新选部位
            </button>
          </div>

          <PlannerEditor />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                const result = startWorkout();
                setStatus(result.message);
                if (result.ok) {
                  router.push("/workout");
                }
              }}
              className="inline-flex min-h-16 flex-1 items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-xl font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
            >
              开始今天训练
            </button>
          </div>

          {status ? <div className="text-sm text-slate-500">{status}</div> : null}
        </div>
      </section>

      <div className="hidden lg:block">
        <VoicePlanPanel />
      </div>
    </div>
  );
}
