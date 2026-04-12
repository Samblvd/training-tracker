"use client";

import { useMemo, useState } from "react";

import { useTrainingStore } from "@/store/training-store";

export function PlannerEditor() {
  const plan = useTrainingStore((state) => state.editorPlans[state.selectedMuscle]);
  const togglePlannerExercise = useTrainingStore((state) => state.togglePlannerExercise);
  const updatePlannerExercise = useTrainingStore((state) => state.updatePlannerExercise);
  const [showAvailableExercises, setShowAvailableExercises] = useState(false);

  const orderedPlan = useMemo(
    () =>
      plan
        .map((exercise, index) => ({ exercise, index }))
        .sort((a, b) => {
          if (a.exercise.selected === b.exercise.selected) return a.index - b.index;
          return a.exercise.selected ? -1 : 1;
        })
        .map(({ exercise }) => exercise),
    [plan],
  );
  const selectedExercises = orderedPlan.filter((exercise) => exercise.selected);
  const availableExercises = orderedPlan.filter((exercise) => !exercise.selected);
  const estimatedMinutes = Math.max(
    12,
    selectedExercises.reduce((sum, exercise) => {
      const sets = Number.parseInt(exercise.sets || "3", 10) || 3;
      const rest = Number.parseInt(exercise.rest || "90", 10) || 90;
      return sum + Math.max(2, Math.round((sets * rest) / 60) + 1);
    }, 0),
  );

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="grid gap-1">
          <div className="text-sm font-semibold text-slate-950">动作确认</div>
          <div className="text-xs text-slate-500">预计 {estimatedMinutes} 分钟完成今天训练</div>
        </div>
        <div className="rounded-full border border-white/80 bg-white/88 px-3 py-1 text-xs font-medium text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          已选 {selectedExercises.length} 个
        </div>
      </div>

      <div className="grid gap-4">
        {selectedExercises.map((exercise) => (
          <div
            key={exercise.name}
            className={[
              "rounded-[24px] border px-3.5 py-3.5 shadow-[0_18px_36px_rgba(15,23,42,0.05)] transition sm:rounded-[30px] sm:px-5 sm:py-4.5",
              exercise.selected
                ? "border-[var(--accent-strong)]/20 bg-white/92"
                : "border-slate-200 bg-white/72",
            ].join(" ")}
          >
            <div className="grid gap-3">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--accent-strong)] focus:ring-[var(--accent-strong)]"
                  checked={exercise.selected}
                  onChange={(event) => {
                    const nextSelected = event.target.checked;
                    if (!nextSelected && exercise.selected) {
                      const shouldDelete = window.confirm(`是否确认删除“${exercise.name}”这个训练动作？`);
                      if (!shouldDelete) {
                        event.preventDefault();
                        return;
                      }
                    }
                    togglePlannerExercise(exercise.name, nextSelected);
                  }}
                />
                <span>
                  <span className="block text-base font-semibold tracking-[-0.04em] text-slate-950 sm:text-lg">{exercise.name}</span>
                  <span className="mt-1 block text-xs text-slate-500 sm:text-sm">{exercise.rest || "90"} 秒休息 · {exercise.sets || "3"} 组</span>
                </span>
              </label>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[
                  { field: "weight", label: "重量", placeholder: "kg" },
                  { field: "sets", label: "组数", placeholder: "4" },
                  { field: "reps", label: "次数", placeholder: "8-10" },
                ].map((item) => (
                  <label key={item.field} className="grid min-w-0 gap-1 text-sm">
                    <span className="text-xs text-slate-500">{item.label}</span>
                    <input
                      value={exercise[item.field as "weight" | "sets" | "reps"]}
                      onChange={(event) => updatePlannerExercise(exercise.name, item.field as "weight" | "sets" | "reps", event.target.value)}
                      placeholder={item.placeholder}
                      className="min-w-0 w-full rounded-[18px] border border-slate-200/90 bg-slate-50/90 px-3 py-2.5 text-center text-base font-medium text-slate-900 outline-none transition focus:border-[var(--accent-strong)] focus:bg-white"
                    />
                  </label>
                ))}
              </div>

              <div className="hidden gap-3 lg:grid lg:grid-cols-[180px_1fr_1fr]">
                <label className="grid gap-1.5 text-sm">
                  <span className="text-slate-500">休息秒数</span>
                  <input
                    value={exercise.rest}
                    onChange={(event) => updatePlannerExercise(exercise.name, "rest", event.target.value)}
                    placeholder="90"
                    className="rounded-[18px] border border-slate-200/90 bg-slate-50/90 px-3 py-3 text-slate-900 outline-none transition focus:border-[var(--accent-strong)] focus:bg-white"
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-slate-500">强度提示</span>
                  <input
                    value={exercise.intensity}
                    onChange={(event) => updatePlannerExercise(exercise.name, "intensity", event.target.value)}
                    placeholder="RPE 8"
                    className="rounded-[18px] border border-slate-200/90 bg-slate-50/90 px-3 py-3 text-slate-900 outline-none transition focus:border-[var(--accent-strong)] focus:bg-white"
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-slate-500">进阶建议</span>
                  <input
                    value={exercise.progression}
                    onChange={(event) => updatePlannerExercise(exercise.name, "progression", event.target.value)}
                    placeholder="做满后再加重"
                    className="rounded-[18px] border border-slate-200/90 bg-slate-50/90 px-3 py-3 text-slate-900 outline-none transition focus:border-[var(--accent-strong)] focus:bg-white"
                  />
                </label>
              </div>
            </div>
          </div>
        ))}

        <div className="rounded-[24px] border border-white/80 bg-white/86 px-3.5 py-3.5 shadow-[0_18px_36px_rgba(15,23,42,0.04)] sm:rounded-[30px] sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={() => setShowAvailableExercises((current) => !current)}
            className="inline-flex w-full items-center justify-between gap-3 text-left"
          >
            <div>
              <div className="text-sm font-semibold text-slate-950">添加动作</div>
              <div className="mt-1 text-xs text-slate-500">还可以再加入 {availableExercises.length} 个动作</div>
            </div>
            <span className="rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
              {showAvailableExercises ? "收起" : "展开"}
            </span>
          </button>

          {showAvailableExercises ? (
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {availableExercises.map((exercise) => (
                <button
                  key={exercise.name}
                  type="button"
                  onClick={() => togglePlannerExercise(exercise.name, true)}
                  className="rounded-[18px] border border-slate-200/90 bg-slate-50/85 px-3.5 py-3 text-left transition hover:border-[var(--accent-strong)]/28 hover:bg-[var(--accent-soft)]"
                >
                  <div className="text-sm font-semibold text-slate-950">{exercise.name}</div>
                  <div className="mt-1 text-xs text-slate-500">{exercise.rest || "90"} 秒休息</div>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
