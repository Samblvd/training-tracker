"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { PlannerEditor } from "@/components/planner-editor";
import { VoicePlanPanel } from "@/components/voice-plan-panel";
import { muscles } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

const FALLBACK_QUOTES = [
  "你不需要一开始就很强，只需要今天先开始。",
  "训练不是证明自己，而是一次次兑现自己。",
  "今天多做一组，明天就少一点后悔。",
  "把注意力放在下一组，进步会自己累积起来。",
];

interface HitokotoResponse {
  hitokoto?: string;
  from?: string;
  from_who?: string | null;
}

export default function PlannerPage() {
  const router = useRouter();
  const selectedMuscle = useTrainingStore((state) => state.selectedMuscle);
  const setSelectedMuscle = useTrainingStore((state) => state.setSelectedMuscle);
  const startWorkout = useTrainingStore((state) => state.startWorkout);
  const workout = useTrainingStore((state) => state.workout);
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [status, setStatus] = useState("");
  const [quote, setQuote] = useState(FALLBACK_QUOTES[0]);
  const [quoteSource, setQuoteSource] = useState("");

  const hasActiveWorkout = !!workout && !workout.finishedAt;

  useEffect(() => {
    if (step !== "select") return;

    let cancelled = false;

    async function loadQuote() {
      try {
        const response = await fetch(
          "https://v1.hitokoto.cn/?c=d&c=e&c=k&encode=json&max_length=28",
          {
            cache: "no-store",
          },
        );
        const payload = (await response.json()) as HitokotoResponse;
        if (cancelled) return;
        if (payload.hitokoto) {
          setQuote(payload.hitokoto);
          setQuoteSource(
            [payload.from_who, payload.from].filter(Boolean).join(" · ") || "一言",
          );
          return;
        }
        throw new Error("empty quote");
      } catch {
        if (cancelled) return;
        const fallback = FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
        setQuote(fallback);
        setQuoteSource("训练助手");
      }
    }

    loadQuote();

    return () => {
      cancelled = true;
    };
  }, [step]);

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
      <section className="flex min-h-[calc(100vh-8.5rem)] items-center justify-center rounded-[28px] border border-white/70 bg-white/95 px-4 py-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-6 sm:py-10">
        <div className="mx-auto grid w-full max-w-3xl gap-6 text-center sm:gap-8">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Step 1</div>
            <h1 className="text-3xl font-semibold tracking-[-0.07em] text-slate-950 sm:text-5xl">今天练哪里</h1>
            <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">{quote}</p>
            {quoteSource ? <div className="text-xs text-slate-400">{quoteSource}</div> : null}
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
                  "rounded-[26px] border px-5 py-6 text-left transition sm:rounded-[32px] sm:px-6 sm:py-8",
                  selectedMuscle === muscle
                    ? "border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_18px_40px_rgba(241,90,34,0.10)]"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                ].join(" ")}
              >
                <div className="text-xs uppercase tracking-[0.24em] opacity-60">训练部位</div>
                <div className="mt-2 text-2xl font-semibold tracking-[-0.05em] sm:mt-3 sm:text-3xl">{muscle}</div>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="grid gap-5 sm:gap-6">
      <section className="rounded-[28px] border border-white/70 bg-white/95 px-4 py-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:rounded-[36px] sm:px-6 sm:py-8">
        <div className="grid gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">Step 2</div>
              <h1 className="text-2xl font-semibold tracking-[-0.06em] text-slate-950 sm:text-4xl">确认今天的动作</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-500">
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
              className="inline-flex min-h-14 flex-1 items-center justify-center rounded-full bg-slate-950 px-5 py-3.5 text-lg font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] sm:min-h-16 sm:px-6 sm:py-4 sm:text-xl"
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
