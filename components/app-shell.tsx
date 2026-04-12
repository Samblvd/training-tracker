"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarClock, Dumbbell, History, LayoutDashboard } from "lucide-react";
import { ReactNode } from "react";

import { cn } from "@/lib/utils";
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

  const isWorkoutComplete =
    !!workout &&
    workout.exercises.length > 0 &&
    workout.sessionLog.every((item) => item.completedSets.length >= (Number.parseInt(item.targetSets || "0", 10) || 0));
  const hasActiveWorkout = !!workout && !isWorkoutComplete;
  const isResting = !!workout?.restEndAt;

  const mobileNavItems = [
    { href: "/", label: "开始", icon: LayoutDashboard },
    { href: "/history", label: "记录", icon: History },
  ];
  const hideMobileNav = pathname === "/planner" || (hasActiveWorkout && pathname === "/workout");

  return (
    <div className="min-h-screen bg-[var(--bg)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-4 px-4 pb-24 pt-[max(env(safe-area-inset-top),0.35rem)] md:px-6 lg:flex-row lg:gap-8 lg:px-8 lg:py-6 lg:pb-6">
        <aside className="hidden w-full shrink-0 rounded-[32px] border border-white/60 bg-[radial-gradient(circle_at_top_left,rgba(241,90,34,0.16),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,250,245,0.88))] p-5 shadow-[0_32px_90px_rgba(15,23,42,0.09)] backdrop-blur lg:sticky lg:top-6 lg:flex lg:h-[calc(100vh-48px)] lg:w-[280px]">
          <div className="flex h-full flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-[-0.05em] text-slate-950">训练助手</h1>
              <p className="text-sm leading-6 text-slate-500">把注意力放在开始、当前动作、倒计时和完成节奏上。</p>
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
                <div className="mt-1 text-xl font-semibold">{workout ? (isWorkoutComplete ? "已完成" : isResting ? "休息中" : "进行中") : "待开始"}</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col gap-4 pb-20 pt-0 lg:gap-6 lg:py-1 lg:pb-0">{children}</main>
      </div>

      {hideMobileNav ? null : (
        <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden">
          <nav className="border-t border-slate-200 bg-white/95 px-2 py-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] shadow-[0_-12px_30px_rgba(15,23,42,0.06)] backdrop-blur">
            <div className={cn("grid grid-cols-2 gap-1")}>
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
      )}
    </div>
  );
}
