"use client";

import { ArrowLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { PlannerEditor } from "@/components/planner-editor";
import { VoicePlanPanel } from "@/components/voice-plan-panel";
import { muscles } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

function PlannerPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedMuscle = useTrainingStore((state) => state.selectedMuscle);
  const setSelectedMuscle = useTrainingStore((state) => state.setSelectedMuscle);
  const startWorkout = useTrainingStore((state) => state.startWorkout);
  const loadDefaultPlan = useTrainingStore((state) => state.loadDefaultPlan);
  const workout = useTrainingStore((state) => state.workout);
  const [status, setStatus] = useState("");
  const selectedMuscleFromUrl = useMemo(() => {
    const value = searchParams.get("muscle");
    return muscles.find((muscle) => muscle === value) || null;
  }, [searchParams]);
  const step = selectedMuscleFromUrl ? "confirm" : "select";

  const hasActiveWorkout = !!workout && !workout.finishedAt;
  const secondaryActionClass =
    "inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full px-3 py-2.5 text-center text-xs font-medium leading-none whitespace-nowrap font-sans transition sm:min-h-11 sm:px-4 sm:py-2.5 sm:text-sm";

  useEffect(() => {
    if (selectedMuscleFromUrl && selectedMuscleFromUrl !== selectedMuscle) {
      setSelectedMuscle(selectedMuscleFromUrl);
    }
  }, [selectedMuscle, selectedMuscleFromUrl, setSelectedMuscle]);

  if (hasActiveWorkout) {
    return (
      <section className="flex min-h-[calc(100vh-8.5rem)] items-center justify-center rounded-[28px] border border-white/70 bg-white/95 px-4 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-6 sm:py-10">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center sm:gap-6">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Workout In Progress</div>
            <h1 className="text-3xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-4xl">今天的训练已经开始了</h1>
            <p className="text-sm leading-6 text-slate-500 sm:text-base">直接回到训练页，继续当前动作和节奏。</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/workout")}
            className="inline-flex min-h-14 min-w-[220px] items-center justify-center rounded-full bg-slate-950 px-7 py-3.5 text-lg font-semibold text-white sm:min-h-16 sm:min-w-[240px] sm:px-8 sm:py-4 sm:text-xl"
          >
            继续训练
          </button>
        </div>
      </section>
    );
  }

  if (step === "select") {
    return (
      <section className="flex min-h-[calc(100vh-8.5rem)] items-center justify-center rounded-[28px] border border-white/70 bg-white/95 px-4 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-6 sm:py-10">
        <div className="mx-auto grid w-full max-w-3xl gap-5 text-center sm:gap-7">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Step 1</div>
            <h1 className="text-3xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-5xl">今天练哪里</h1>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            {muscles.map((muscle) => (
              <Link
                key={muscle}
                href={`/planner?muscle=${encodeURIComponent(muscle)}`}
                className={[
                  "block rounded-[24px] border px-4 py-5 text-left transition sm:rounded-[32px] sm:px-6 sm:py-8",
                  selectedMuscle === muscle
                    ? "border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_18px_40px_rgba(241,90,34,0.10)]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                <div className="text-xs uppercase tracking-[0.24em] opacity-60">训练部位</div>
                <div className="mt-1.5 text-xl font-semibold tracking-[-0.05em] sm:mt-3 sm:text-3xl">{muscle}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-5 pb-28 sm:gap-6 lg:pb-0">
      <section className="rounded-[28px] border border-white/70 bg-white/95 px-4 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:rounded-[36px] sm:px-6 sm:py-8">
        <div className="grid gap-4 sm:gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Step 2</div>
            <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => loadDefaultPlan(selectedMuscle)}
                className={`${secondaryActionClass} border border-[var(--accent-strong)]/20 bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_10px_24px_rgba(241,90,34,0.10)]`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                恢复默认
              </button>
              <button
                type="button"
                onClick={() => router.push("/planner")}
                className={`${secondaryActionClass} border border-slate-200 bg-slate-50 text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.05)]`}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                重新选部位
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-4xl">确认今天的动作</h1>
          </div>

          {status ? <div className="text-sm text-slate-500">{status}</div> : null}

          <PlannerEditor />
        </div>
      </section>

      <div className="hidden lg:block">
        <VoicePlanPanel />
      </div>

      <div className="pointer-events-none fixed inset-x-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 lg:hidden">
        <div className="pointer-events-auto rounded-[24px] border border-slate-200 bg-white/96 p-2 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur">
          <button
            type="button"
            onClick={() => {
              const result = startWorkout();
              setStatus(result.message);
              if (result.ok) {
                router.push("/workout");
              }
            }}
            className="inline-flex min-h-14 w-full items-center justify-center rounded-full bg-slate-950 px-5 py-3.5 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
          >
            开始今天训练
          </button>
        </div>
      </div>

      <div className="hidden lg:block">
        <button
          type="button"
          onClick={() => {
            const result = startWorkout();
            setStatus(result.message);
            if (result.ok) {
              router.push("/workout");
            }
          }}
          className="inline-flex min-h-16 w-full items-center justify-center rounded-full bg-slate-950 px-6 py-4 text-xl font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
        >
          开始今天训练
        </button>
      </div>
    </div>
  );
}

export default function PlannerPage() {
  return (
    <Suspense fallback={null}>
      <PlannerPageContent />
    </Suspense>
  );
}
