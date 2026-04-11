"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarClock, Dumbbell, History, LayoutDashboard, TimerReset } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

import { cn, formatTimer } from "@/lib/utils";
import { useTrainingStore } from "@/store/training-store";

const navItems = [
  { href: "/", label: "训练台", icon: LayoutDashboard },
  { href: "/planner", label: "计划", icon: CalendarClock },
  { href: "/workout", label: "训练中", icon: Dumbbell },
  { href: "/analytics", label: "分析", icon: BarChart3 },
  { href: "/history", label: "历史", icon: History },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const selectedMuscle = useTrainingStore((state) => state.selectedMuscle);
  const workout = useTrainingStore((state) => state.workout);
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!workout?.restEndAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, [workout?.restEndAt]);

  const isWorkoutComplete =
    !!workout &&
    workout.exercises.length > 0 &&
    workout.sessionLog.every((item) => item.completedSets.length >= (Number.parseInt(item.targetSets || "0", 10) || 0));
  const hasActiveWorkout = !!workout && !isWorkoutComplete;
  const currentExercise = workout?.exercises[workout.exIdx];
  const currentLog = workout?.sessionLog[workout.exIdx];
  const completedSets = currentLog?.completedSets.length || 0;
  const targetSets = Number.parseInt(currentExercise?.sets || "0", 10) || 0;
  const timerBase = now || ((workout?.restEndAt || 0) - (workout?.restTotal || 0) * 1000);
  const remaining = workout?.restEndAt ? Math.max(0, Math.ceil((workout.restEndAt - timerBase) / 1000)) : 0;
  const isResting = remaining > 0;

  const mobileNavItems = hasActiveWorkout
    ? [
        { href: "/", label: "状态", icon: LayoutDashboard },
        { href: "/workout", label: isResting ? formatTimer(remaining) : "倒计时", icon: TimerReset },
      ]
    : navItems;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-900">
      <div className="lg:hidden">
        <div className="sticky top-0 z-20 border-b border-white/70 bg-[rgba(255,250,245,0.92)] px-4 py-3 backdrop-blur">
          {hasActiveWorkout ? (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-lg font-semibold tracking-[-0.04em] text-slate-950">{currentExercise?.name || "训练中"}</div>
                <div className="text-xs text-slate-500">
                  {selectedMuscle} · 第 {Math.min(completedSets + 1, targetSets || 1)} / {targetSets || 1} 组
                </div>
              </div>
              <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                {isResting ? formatTimer(remaining) : "训练中"}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-lg font-semibold tracking-[-0.04em] text-slate-950">训练助手</div>
                <div className="text-xs text-slate-500">{workout ? (isWorkoutComplete ? "全部完成，等待保存" : `${selectedMuscle} · 训练进行中`) : `${selectedMuscle} · 准备开始`}</div>
              </div>
              <Link href="/workout" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                {workout ? "查看训练" : "训练中"}
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 pb-24 md:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-6 lg:pb-6">
        <aside className="hidden w-full shrink-0 rounded-[32px] border border-white/60 bg-[radial-gradient(circle_at_top_left,rgba(241,90,34,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,250,245,0.88))] p-5 shadow-[0_32px_90px_rgba(15,23,42,0.09)] backdrop-blur lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-48px)] lg:w-[280px]">
          <div className="flex h-full flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">训练助手</h1>
              <p className="text-sm leading-6 text-slate-500">把注意力放在当前动作、当前组和训练节奏上。</p>
            </div>

            <nav className="grid gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between rounded-2xl border px-4 py-3 transition",
                      isActive
                        ? "border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--accent-strong)] shadow-[0_12px_30px_rgba(241,90,34,0.18)]"
                        : "border-transparent bg-white/70 text-slate-700 hover:border-slate-200 hover:bg-white",
                    )}
                  >
                    <span className="flex items-center gap-3 font-medium">
                      <Icon className="h-4.5 w-4.5" />
                      {item.label}
                    </span>
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400 transition group-hover:text-slate-500">
                      {isActive ? "Here" : "Go"}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="grid gap-3 rounded-[28px] border border-slate-200/70 bg-white/80 p-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-400">当前部位</div>
                <div className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-slate-950">{selectedMuscle}</div>
              </div>
              <div className="rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-[var(--accent-strong)]">
                <div className="text-xs uppercase tracking-[0.24em] text-[var(--accent-strong)]/60">训练会话</div>
                <div className="mt-1 text-xl font-semibold">{workout ? (isWorkoutComplete ? "待保存" : "进行中") : "空闲"}</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-6 py-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:hidden">
        <div className={cn("gap-1 px-2 py-2", hasActiveWorkout ? "grid grid-cols-2" : "grid grid-cols-5")}>
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                  isActive ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "text-slate-500",
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
