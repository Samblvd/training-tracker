"use client";

import { useTrainingStore } from "@/store/training-store";
import { cn, muscles } from "@/lib/utils";

const copyMap = {
  胸: "卧推、夹胸、推胸",
  肩: "推举、侧平举、后束",
  背: "下拉、划船、二头",
  臀腿: "深蹲、硬拉、腿举",
};

export function MusclePicker() {
  const selectedMuscle = useTrainingStore((state) => state.selectedMuscle);
  const setSelectedMuscle = useTrainingStore((state) => state.setSelectedMuscle);

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {muscles.map((muscle) => (
        <button
          key={muscle}
          type="button"
          onClick={() => setSelectedMuscle(muscle)}
          className={cn(
            "rounded-[24px] border px-4 py-4 text-left transition",
            selectedMuscle === muscle
              ? "border-[var(--accent-strong)] bg-[var(--accent-soft)] shadow-[0_18px_40px_rgba(241,90,34,0.12)]"
              : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white",
          )}
        >
          <div className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{muscle}</div>
          <div className="mt-1 text-sm text-slate-600">{copyMap[muscle]}</div>
        </button>
      ))}
    </div>
  );
}
