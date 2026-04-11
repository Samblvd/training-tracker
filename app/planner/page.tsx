"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { MusclePicker } from "@/components/muscle-picker";
import { PageHeading } from "@/components/page-heading";
import { PlannerEditor } from "@/components/planner-editor";
import { VoicePlanPanel } from "@/components/voice-plan-panel";
import { useTrainingStore } from "@/store/training-store";

export default function PlannerPage() {
  const router = useRouter();
  const plannerDate = useTrainingStore((state) => state.plannerDate);
  const editingRecordId = useTrainingStore((state) => state.editingRecordId);
  const selectedMuscle = useTrainingStore((state) => state.selectedMuscle);
  const setPlannerDate = useTrainingStore((state) => state.setPlannerDate);
  const savePlannerRecord = useTrainingStore((state) => state.savePlannerRecord);
  const startWorkout = useTrainingStore((state) => state.startWorkout);
  const resetPlanner = useTrainingStore((state) => state.resetPlanner);
  const [status, setStatus] = useState("");

  return (
    <div className="grid gap-6">
      <PageHeading eyebrow="Planner" title={`${selectedMuscle} 计划`} description="编辑今天或补录日期的训练计划，也可以从语音/文本快速导入。" />

      <div className="grid gap-4 rounded-[28px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="grid gap-4 lg:grid-cols-[1fr_280px] lg:items-end">
          <MusclePicker />
          <label className="grid gap-2 text-sm">
            <span className="text-slate-500">记录日期</span>
            <input
              type="date"
              value={plannerDate}
              onChange={(event) => setPlannerDate(event.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              const result = savePlannerRecord();
              setStatus(result.message);
            }}
            className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white"
          >
            {editingRecordId ? "保存修改" : "保存补录"}
          </button>
          <button
            type="button"
            onClick={() => {
              const result = startWorkout();
              setStatus(result.message);
              if (result.ok) router.push("/workout");
            }}
            className="rounded-full bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-medium text-white"
          >
            开始训练
          </button>
          <button
            type="button"
            onClick={() => {
              resetPlanner();
              setStatus("当前计划已重置");
            }}
            className="rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            清空当前编辑
          </button>
        </div>

        {status ? <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">{status}</div> : null}
      </div>

      <PlannerEditor />
      <VoicePlanPanel />
    </div>
  );
}
