"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTrainingStore } from "@/store/training-store";

export function HomeTrainingFocus() {
  const router = useRouter();
  const workout = useTrainingStore((state) => state.workout);

  const hasActiveWorkout = !!workout && !workout.finishedAt;

  return (
    <section className="relative flex min-h-[calc(100vh-7rem)] items-center justify-center overflow-hidden rounded-[36px] border border-white/70 bg-[radial-gradient(circle_at_top,rgba(241,90,34,0.12),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.95))] px-6 py-12 shadow-[0_28px_80px_rgba(15,23,42,0.08)]">
      <Link
        href="/history"
        className="absolute right-5 top-5 rounded-full border border-slate-200 bg-white/92 px-4 py-2 text-sm font-medium text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:text-slate-950"
      >
        查看记录
      </Link>

      <div className="mx-auto flex max-w-xl flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.36em] text-slate-400">Training Assistant</div>
          <h1 className="text-5xl font-semibold tracking-[-0.08em] text-slate-950 sm:text-6xl">
            {hasActiveWorkout ? "继续训练" : "开始训练"}
          </h1>
          <p className="text-base leading-7 text-slate-500 sm:text-lg">
            {hasActiveWorkout
              ? "回到当前训练动作，继续按照节奏完成今天的训练。"
              : "首页只保留一个入口。点下去，再选择今天要练的部位。"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.push(hasActiveWorkout ? "/workout" : "/planner")}
          className="inline-flex min-h-20 min-w-[280px] items-center justify-center rounded-full bg-slate-950 px-10 py-6 text-2xl font-semibold tracking-[-0.05em] text-white shadow-[0_28px_56px_rgba(15,23,42,0.28)] transition hover:scale-[1.01]"
        >
          {hasActiveWorkout ? "继续" : "开始训练"}
        </button>
      </div>
    </section>
  );
}
