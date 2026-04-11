"use client";

import { RefreshCcw } from "lucide-react";

import { PanelCard } from "@/components/panel-card";
import { useTrainingStore } from "@/store/training-store";

export function PlannerEditor() {
  const selectedMuscle = useTrainingStore((state) => state.selectedMuscle);
  const plan = useTrainingStore((state) => state.editorPlans[state.selectedMuscle]);
  const togglePlannerExercise = useTrainingStore((state) => state.togglePlannerExercise);
  const updatePlannerExercise = useTrainingStore((state) => state.updatePlannerExercise);
  const loadDefaultPlan = useTrainingStore((state) => state.loadDefaultPlan);

  return (
    <PanelCard
      title={`${selectedMuscle} 计划编辑`}
      action={
        <button
          type="button"
          onClick={() => loadDefaultPlan(selectedMuscle)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
        >
          <RefreshCcw className="h-4 w-4" />
          恢复默认
        </button>
      }
    >
      <div className="grid gap-3">
        {plan.map((exercise) => (
          <div
            key={exercise.name}
            className={`rounded-[24px] border p-4 transition ${
              exercise.selected ? "border-[var(--accent-strong)] bg-white shadow-[0_18px_40px_rgba(241,90,34,0.08)]" : "border-slate-200 bg-slate-50/70"
            }`}
          >
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-[var(--accent-strong)] focus:ring-[var(--accent-strong)]"
                  checked={exercise.selected}
                  onChange={(event) => togglePlannerExercise(exercise.name, event.target.checked)}
                />
                <span>
                  <span className="block text-base font-semibold tracking-[-0.03em] text-slate-950">{exercise.name}</span>
                  <span className="mt-1 block text-sm text-slate-500">
                    {exercise.intensity || "未设置强度"} · {exercise.rest || "90"} 秒休息
                  </span>
                </span>
              </label>

              <div className="grid flex-1 gap-3 sm:grid-cols-3 xl:max-w-[560px]">
                {[
                  { field: "weight", label: "重量", placeholder: "kg" },
                  { field: "sets", label: "组数", placeholder: "4" },
                  { field: "reps", label: "次数", placeholder: "8-10" },
                ].map((item) => (
                  <label key={item.field} className="grid gap-1 text-sm">
                    <span className="text-slate-500">{item.label}</span>
                    <input
                      value={exercise[item.field as "weight" | "sets" | "reps"]}
                      onChange={(event) => updatePlannerExercise(exercise.name, item.field as "weight" | "sets" | "reps", event.target.value)}
                      placeholder={item.placeholder}
                      className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[180px_1fr]">
              <label className="grid gap-1 text-sm">
                <span className="text-slate-500">休息秒数</span>
                <input
                  value={exercise.rest}
                  onChange={(event) => updatePlannerExercise(exercise.name, "rest", event.target.value)}
                  placeholder="90"
                  className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
                />
              </label>
              <div className="grid gap-3 lg:grid-cols-2">
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-500">强度提示</span>
                  <input
                    value={exercise.intensity}
                    onChange={(event) => updatePlannerExercise(exercise.name, "intensity", event.target.value)}
                    placeholder="RPE 8"
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  <span className="text-slate-500">进阶建议</span>
                  <input
                    value={exercise.progression}
                    onChange={(event) => updatePlannerExercise(exercise.name, "progression", event.target.value)}
                    placeholder="做满后再加重"
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
                  />
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PanelCard>
  );
}
