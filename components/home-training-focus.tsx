"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTrainingStore } from "@/store/training-store";

export function HomeTrainingFocus() {
  const router = useRouter();
  const workout = useTrainingStore((state) => state.workout);

  const hasActiveWorkout = !!workout && !workout.finishedAt;

  return (
    <section className="relative flex min-h-[calc(100vh-8.5rem)] items-center justify-center overflow-hidden rounded-[28px] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(241,90,34,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] px-4 py-8 sm:min-h-[calc(100vh-7rem)] sm:rounded-[36px] sm:px-6 sm:py-12 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
      <Link
        href="/history"
        className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white/92 px-3 py-1.5 text-xs font-medium text-slate-600 sm:right-5 sm:top-5 sm:px-4 sm:py-2 sm:text-sm shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:text-slate-950"
      >
        查看记录
      </Link>

      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center sm:max-w-xl sm:gap-8">
        <div className="space-y-2.5 sm:space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.36em] text-slate-400">Training Assistant</div>
          <h1 className="text-4xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-6xl">
            {hasActiveWorkout ? "继续训练" : "开始训练"}
          </h1>
          <p className="text-sm leading-6 text-slate-500 sm:text-lg">
            {hasActiveWorkout
              ? "回到当前训练动作，继续按照节奏完成今天的训练。"
              : "首页只保留一个入口。点下去，再选择今天要练的部位。"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push(hasActiveWorkout ? "/workout" : "/planner")}
          className="inline-flex min-h-16 min-w-[220px] items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-xl sm:min-h-20 sm:min-w-[280px] sm:px-10 sm:py-6 sm:text-2xl font-semibold tracking-[-0.05em] text-white shadow-[0_28px_56px_rgba(15,23,42,0.28)] transition hover:scale-[1.01]"
        >
          {hasActiveWorkout ? "继续" : "开始训练"}
        </button>
      </div>
    </section>
  );
}
