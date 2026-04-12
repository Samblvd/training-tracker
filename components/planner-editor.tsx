"use client";

import { useMemo } from "react";

import { useTrainingStore } from "@/store/training-store";

export function PlannerEditor() {
  const plan = useTrainingStore((state) => state.editorPlans[state.selectedMuscle]);
  const togglePlannerExercise = useTrainingStore((state) => state.togglePlannerExercise);
  const updatePlannerExercise = useTrainingStore((state) => state.updatePlannerExercise);

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

  return (
    <div className="grid gap-3">
      <div className="text-sm font-semibold text-slate-950">动作确认</div>

      <div className="grid gap-3">
        {orderedPlan.map((exercise) => (
          <div
            key={exercise.name}
            className={[
              "rounded-[22px] border px-3.5 py-3.5 transition sm:rounded-[28px] sm:px-5 sm:py-4",
              exercise.selected
                ? "border-[var(--accent-strong)] bg-white shadow-[0_18px_40px_rgba(241,90,34,0.08)]"
                : "border-slate-200 bg-slate-50/80",
            ].join(" ")}
          >
            <div className="grid gap-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--accent-strong)] focus:ring-[var(--accent-strong)]"
                  checked={exercise.selected}
                  onChange={(event) => togglePlannerExercise(exercise.name, event.target.checked)}
                />
                <span>
                  <span className="block text-base font-semibold tracking-[-0.04em] text-slate-950 sm:text-lg">{exercise.name}</span>
                  <span className="mt-1 block text-xs text-slate-500 sm:text-sm">{exercise.rest || "90"} 秒休息</span>
                </span>
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { field: "weight", label: "重量", placeholder: "kg" },
                  { field: "sets", label: "组数", placeholder: "4" },
                  { field: "reps", label: "次数", placeholder: "8-10" },
                ].map((item) => (
                  <label key={item.field} className="grid gap-1.5 text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <input
                      value={exercise[item.field as "weight" | "sets" | "reps"]}
                      onChange={(event) => updatePlannerExercise(exercise.name, item.field as "weight" | "sets" | "reps", event.target.value)}
                      placeholder={item.placeholder}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[var(--accent-strong)] sm:py-3 sm:text-base"
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
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-slate-500">强度提示</span>
                  <input
                    value={exercise.intensity}
                    onChange={(event) => updatePlannerExercise(exercise.name, "intensity", event.target.value)}
                    placeholder="RPE 8"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="text-slate-500">进阶建议</span>
                  <input
                    value={exercise.progression}
                    onChange={(event) => updatePlannerExercise(exercise.name, "progression", event.target.value)}
                    placeholder="做满后再加重"
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
