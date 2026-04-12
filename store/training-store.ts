"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { defaultPlans } from "@/lib/exercises";
import { buildVoicePlanFromText } from "@/lib/voice";
import {
  ExerciseField,
  ExercisePlanItem,
  Muscle,
  PlannerExercise,
  CompletedSet,
  SessionLogItem,
  TrainingRecord,
  VoicePlan,
  WorkoutSession,
} from "@/lib/types";
import {
  buildContent,
  buildRecordFromWorkout,
  buildWorkoutSession,
  buildWorkoutSummary,
  compareDatesDesc,
  createId,
  createPlannerPlan,
  getSessionLogVolume,
  normalizeExercise,
  normalizeExerciseName,
  normalizeMuscle,
  selectedPlannerExercises,
  todayString,
  yesterdayString,
} from "@/lib/utils";

type ActionResult = { ok: true; message: string } | { ok: false; message: string };

function isRecord(value: TrainingRecord | null): value is TrainingRecord {
  return !!value;
}

interface TrainingState {
  hydrated: boolean;
  legacyImported: boolean;
  selectedMuscle: Muscle;
  plannerDate: string;
  editingRecordId: string | null;
  editorPlans: Record<Muscle, PlannerExercise[]>;
  records: TrainingRecord[];
  workout: WorkoutSession | null;
  voicePlan: VoicePlan | null;
  markHydrated: (value: boolean) => void;
  initializeFromLegacy: () => void;
  setSelectedMuscle: (muscle: Muscle) => void;
  setPlannerDate: (date: string) => void;
  togglePlannerExercise: (name: string, selected?: boolean) => void;
  updatePlannerExercise: (name: string, field: ExerciseField, value: string) => void;
  applyPlanToPlanner: (muscle: Muscle, plan: ExercisePlanItem[]) => void;
  loadDefaultPlan: (muscle?: Muscle) => void;
  resetPlanner: () => void;
  savePlannerRecord: () => ActionResult;
  loadRecordIntoPlanner: (recordId: string) => void;
  deleteRecord: (recordId: string) => void;
  importRecords: (payload: string) => ActionResult;
  startWorkout: () => ActionResult;
  completeWorkoutSet: (payload: { weight: string; reps: string; restSeconds: number }) => void;
  extendRest: (seconds?: number) => void;
  skipRest: () => void;
  nextWorkoutExercise: () => void;
  skipCurrentExercise: () => void;
  finishWorkout: () => ActionResult;
  clearWorkout: () => void;
  resumeWorkoutState: () => void;
  setVoicePlan: (plan: VoicePlan | null) => void;
  parseVoicePlanFallback: (input: string) => VoicePlan;
}

function buildDefaultEditorPlans() {
  return {
    胸: createPlannerPlan("胸", defaultPlans["胸"]),
    肩: createPlannerPlan("肩", defaultPlans["肩"]),
    背: createPlannerPlan("背", defaultPlans["背"]),
    臀腿: createPlannerPlan("臀腿", defaultPlans["臀腿"]),
  } as Record<Muscle, PlannerExercise[]>;
}

function mergeRecords(existing: TrainingRecord[], incoming: TrainingRecord[]) {
  const seen = new Set(
    existing.map((record) => `${record.date}|${record.muscle}|${record.exercises.map((exercise) => normalizeExerciseName(exercise.name)).join("/")}`),
  );
  const merged = existing.slice();
  incoming.forEach((record) => {
    const key = `${record.date}|${record.muscle}|${record.exercises.map((exercise) => normalizeExerciseName(exercise.name)).join("/")}`;
    if (!seen.has(key)) {
      seen.add(key);
      merged.push(record);
    }
  });
  return merged.sort(compareDatesDesc);
}

function normalizeLegacySessionLogItem(item: Record<string, unknown>): SessionLogItem | null {
  if (!item?.name) return null;
  return {
    name: normalizeExerciseName(String(item.name)),
    targetWeight: item.targetWeight ? String(item.targetWeight) : "",
    targetSets: item.targetSets ? String(item.targetSets) : "",
    targetReps: item.targetReps ? String(item.targetReps) : "",
    targetRest: item.targetRest ? String(item.targetRest) : "",
    intensity: item.intensity ? String(item.intensity) : "",
    progression: item.progression ? String(item.progression) : "",
    completedSets: Array.isArray(item.completedSets)
      ? item.completedSets
          .map((set) => {
            if (!set || typeof set !== "object") return null;
            return {
              setNumber: Number.parseInt(String((set as Record<string, unknown>).setNumber || "1"), 10) || 1,
              weight: (set as Record<string, unknown>).weight ? String((set as Record<string, unknown>).weight) : "",
              reps: (set as Record<string, unknown>).reps ? String((set as Record<string, unknown>).reps) : "",
              restSeconds: Number.parseInt(String((set as Record<string, unknown>).restSeconds || "0"), 10) || 0,
            };
          })
          .filter((set): set is CompletedSet => !!set)
      : [],
  };
}

function normalizeLegacyRecord(record: Record<string, unknown>): TrainingRecord | null {
  if (!record || typeof record !== "object") return null;
  const date = typeof record.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.date) ? record.date : todayString();
  const muscle = normalizeMuscle(String(record.muscle || "胸"));
  const plannedExercises = Array.isArray(record.plannedExercises)
    ? record.plannedExercises.map((item) => normalizeExercise(item as Partial<ExercisePlanItem>)).filter(Boolean) as ExercisePlanItem[]
    : [];
  const sessionLog = Array.isArray(record.sessionLog)
    ? record.sessionLog.map((item) => normalizeLegacySessionLogItem(item as Record<string, unknown>)).filter(Boolean) as SessionLogItem[]
    : [];
  const exercises = Array.isArray(record.exercises)
    ? record.exercises.map((item) => normalizeExercise(item as Partial<ExercisePlanItem>)).filter(Boolean) as ExercisePlanItem[]
    : sessionLog
        .filter((item) => item.completedSets.length)
        .map((item) =>
          normalizeExercise({
            name: item.name,
            weight: item.completedSets[item.completedSets.length - 1]?.weight || "",
            sets: String(item.completedSets.length),
            reps: item.completedSets[item.completedSets.length - 1]?.reps || "",
            rest: item.targetRest,
            intensity: item.intensity,
            progression: item.progression,
          }),
        )
        .filter(Boolean) as ExercisePlanItem[];

  return {
    id: String(record.id || createId()),
    date,
    muscle,
    exercises,
    plannedExercises,
    sessionLog,
    totalVolume:
      typeof record.totalVolume === "number"
        ? record.totalVolume
        : Number.parseFloat(String(record.totalVolume || "0")) || getSessionLogVolume(sessionLog),
    startedAt: typeof record.startedAt === "string" ? record.startedAt : "",
    finishedAt: typeof record.finishedAt === "string" ? record.finishedAt : "",
    note: typeof record.note === "string" ? record.note : "",
    content: typeof record.content === "string" && record.content ? record.content : buildContent(muscle, exercises),
    source: record._wmSession ? "workout" : "manual",
    _wmSession: !!record._wmSession,
  };
}

function normalizeLegacyWorkout(raw: Record<string, unknown>): WorkoutSession | null {
  if (!Array.isArray(raw.exercises) || !raw.exercises.length) return null;
  const exercises = raw.exercises
    .map((item) => normalizeExercise(item as Partial<ExercisePlanItem>))
    .filter(Boolean) as ExercisePlanItem[];
  const sessionLog = Array.isArray(raw.sessionLog)
    ? raw.sessionLog.map((item) => normalizeLegacySessionLogItem(item as Record<string, unknown>)).filter(Boolean) as SessionLogItem[]
    : [];
  if (!exercises.length || !sessionLog.length) return null;
  return {
    muscle: normalizeMuscle(String(raw.muscle || "胸")),
    exercises,
    exIdx: Number.parseInt(String(raw.exIdx || "0"), 10) || 0,
    setDone: Number.parseInt(String(raw.setDone || "0"), 10) || 0,
    restTotal: Number.parseInt(String(raw.restTotal || "90"), 10) || 90,
    restEndAt: raw.restEndAt ? Number.parseInt(String(raw.restEndAt), 10) || null : null,
    currentSetStartedAt: Number.parseInt(String(raw.currentSetStartedAt || "0"), 10) || Date.now(),
    lastAutoSavedAt: Number.parseInt(String(raw.lastAutoSavedAt || "0"), 10) || Date.now(),
    startedAt: typeof raw.startedAt === "string" ? raw.startedAt : new Date().toISOString(),
    finishedAt: typeof raw.finishedAt === "string" ? raw.finishedAt : "",
    sessionLog,
    summary:
      raw.summary && typeof raw.summary === "object"
        ? {
            totalExercises: Number.parseInt(String((raw.summary as Record<string, unknown>).totalExercises || "0"), 10) || 0,
            totalSets: Number.parseInt(String((raw.summary as Record<string, unknown>).totalSets || "0"), 10) || 0,
            totalVolume: String((raw.summary as Record<string, unknown>).totalVolume || "0"),
            improvements: Array.isArray((raw.summary as Record<string, unknown>).improvements)
              ? ((raw.summary as Record<string, unknown>).improvements as unknown[]).map((item) => String(item))
              : [],
            cautions: Array.isArray((raw.summary as Record<string, unknown>).cautions)
              ? ((raw.summary as Record<string, unknown>).cautions as unknown[]).map((item) => String(item))
              : [],
            suggestions: Array.isArray((raw.summary as Record<string, unknown>).suggestions)
              ? ((raw.summary as Record<string, unknown>).suggestions as unknown[]).map((item) => String(item))
              : [],
          }
        : undefined,
    savedRecordId: typeof raw.savedRecordId === "string" ? raw.savedRecordId : "",
  };
}

function touchWorkout(workout: WorkoutSession, patch: Partial<WorkoutSession> = {}): WorkoutSession {
  return {
    ...workout,
    ...patch,
    lastAutoSavedAt: Date.now(),
  };
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      legacyImported: false,
      selectedMuscle: "胸",
      plannerDate: yesterdayString(),
      editingRecordId: null,
      editorPlans: buildDefaultEditorPlans(),
      records: [],
      workout: null,
      voicePlan: null,
      markHydrated: (value) => set({ hydrated: value }),
      initializeFromLegacy: () => {
        if (typeof window === "undefined" || get().legacyImported) return;
        const nextState: Partial<TrainingState> = { legacyImported: true };
        const rawRecords = window.localStorage.getItem("records");
        const rawDraft = window.localStorage.getItem("draft");

        if (!get().records.length && rawRecords) {
          try {
            const parsed = JSON.parse(rawRecords);
            const list = Array.isArray(parsed) ? parsed : parsed?.records;
            if (Array.isArray(list)) {
              nextState.records = list.map((item) => normalizeLegacyRecord(item)).filter(isRecord).sort(compareDatesDesc);
            }
          } catch {
            nextState.records = [];
          }
        }

        if (!get().workout && rawDraft) {
          try {
            const parsed = JSON.parse(rawDraft);
            const draft = normalizeLegacyWorkout(parsed);
            if (draft) nextState.workout = draft;
          } catch {
            nextState.workout = null;
          }
        }

        set(nextState as Partial<TrainingState>);
      },
      setSelectedMuscle: (selectedMuscle) => set({ selectedMuscle }),
      setPlannerDate: (plannerDate) => set({ plannerDate }),
      togglePlannerExercise: (name, selected) =>
        set((state) => {
          const muscle = state.selectedMuscle;
          return {
            editorPlans: {
              ...state.editorPlans,
              [muscle]: state.editorPlans[muscle].map((item) =>
                item.name === name ? { ...item, selected: selected ?? !item.selected } : item,
              ),
            },
          };
        }),
      updatePlannerExercise: (name, field, value) =>
        set((state) => {
          const muscle = state.selectedMuscle;
          return {
            editorPlans: {
              ...state.editorPlans,
              [muscle]: state.editorPlans[muscle].map((item) => (item.name === name ? { ...item, [field]: value } : item)),
            },
          };
        }),
      applyPlanToPlanner: (muscle, plan) =>
        set((state) => ({
          selectedMuscle: muscle,
          editingRecordId: null,
          voicePlan: null,
          editorPlans: {
            ...state.editorPlans,
            [muscle]: createPlannerPlan(muscle, plan),
          },
        })),
      loadDefaultPlan: (muscle = get().selectedMuscle) =>
        set((state) => ({
          editorPlans: {
            ...state.editorPlans,
            [muscle]: createPlannerPlan(muscle, defaultPlans[muscle]),
          },
          editingRecordId: null,
        })),
      resetPlanner: () =>
        set((state) => ({
          plannerDate: yesterdayString(),
          editingRecordId: null,
          voicePlan: null,
          editorPlans: {
            ...state.editorPlans,
            [state.selectedMuscle]: createPlannerPlan(state.selectedMuscle, defaultPlans[state.selectedMuscle]),
          },
        })),
      savePlannerRecord: () => {
        const state = get();
        const selected = selectedPlannerExercises(state.editorPlans[state.selectedMuscle]);
        if (!state.plannerDate) return { ok: false, message: "请先选择记录日期" };
        if (!selected.length) return { ok: false, message: "至少选择一个动作后再保存" };

        const record: TrainingRecord = {
          id: state.editingRecordId || createId(),
          date: state.plannerDate,
          muscle: state.selectedMuscle,
          exercises: selected,
          plannedExercises: selected,
          sessionLog: [],
          totalVolume: 0,
          startedAt: "",
          finishedAt: "",
          note: "",
          content: buildContent(state.selectedMuscle, selected),
          source: "manual",
          _wmSession: false,
        };

        set((current) => ({
          records: current.editingRecordId
            ? current.records.map((item) => (item.id === current.editingRecordId ? record : item)).sort(compareDatesDesc)
            : [record, ...current.records].sort(compareDatesDesc),
          editingRecordId: null,
        }));

        return { ok: true, message: state.editingRecordId ? "训练记录已更新" : "补录已保存" };
      },
      loadRecordIntoPlanner: (recordId) => {
        const record = get().records.find((item) => item.id === recordId);
        if (!record) return;
        set((state) => ({
          selectedMuscle: record.muscle,
          plannerDate: record.date,
          editingRecordId: recordId,
          editorPlans: {
            ...state.editorPlans,
            [record.muscle]: createPlannerPlan(
              record.muscle,
              record.plannedExercises.length ? record.plannedExercises : record.exercises,
            ),
          },
        }));
      },
      deleteRecord: (recordId) =>
        set((state) => ({
          records: state.records.filter((item) => item.id !== recordId),
          editingRecordId: state.editingRecordId === recordId ? null : state.editingRecordId,
        })),
      importRecords: (payload) => {
        try {
          const parsed = JSON.parse(payload);
          const incoming = Array.isArray(parsed) ? parsed : parsed.records;
          if (!Array.isArray(incoming)) return { ok: false, message: "导入文件格式不正确" };
          const normalized = incoming.map((item) => normalizeLegacyRecord(item)).filter(isRecord);
          set((state) => ({ records: mergeRecords(state.records, normalized) }));
          return { ok: true, message: `已导入 ${normalized.length} 条记录` };
        } catch {
          return { ok: false, message: "解析失败，请检查 JSON 文件" };
        }
      },
      startWorkout: () => {
        const state = get();
        const selected = selectedPlannerExercises(state.editorPlans[state.selectedMuscle]).map((exercise) => ({
          ...exercise,
          weight: exercise.weight || "0",
          sets: exercise.sets || "3",
          reps: exercise.reps || "8",
          rest: exercise.rest || "90",
        }));
        if (!selected.length) return { ok: false, message: "先在计划里勾选动作，再开始训练" };
        set({ workout: touchWorkout(buildWorkoutSession(state.selectedMuscle, selected)) });
        return { ok: true, message: "训练已开始" };
      },
      completeWorkoutSet: ({ weight, reps, restSeconds }) =>
        set((state) => {
          if (!state.workout) return {};
          const workout = {
            ...state.workout,
            sessionLog: state.workout.sessionLog.map((item) => ({
              ...item,
              completedSets: item.completedSets.slice(),
            })),
          };
          const currentLog = workout.sessionLog[workout.exIdx];
          if (!currentLog) return {};
          currentLog.completedSets = currentLog.completedSets.concat({
            setNumber: workout.setDone + 1,
            weight,
            reps,
            restSeconds,
          });
          workout.setDone += 1;
          const currentExercise = workout.exercises[workout.exIdx];
          const targetSets = Number.parseInt(currentExercise.sets, 10) || 0;
          const isCurrentExerciseComplete = workout.setDone >= targetSets;
          const isLastExercise = workout.exIdx >= workout.exercises.length - 1;
          workout.restTotal = restSeconds;

          if (!isCurrentExerciseComplete) {
            const nextSetStartsAt = Date.now() + restSeconds * 1000;
            return {
              workout: touchWorkout(workout, {
                restEndAt: nextSetStartsAt,
                currentSetStartedAt: nextSetStartsAt,
              }),
            };
          }

          workout.restEndAt = null;

          if (!isLastExercise) {
            return { workout: touchWorkout(workout, { restEndAt: null }) };
          }

          const finishedWorkout: WorkoutSession = {
            ...touchWorkout(workout, { restEndAt: null }),
            finishedAt: new Date().toISOString(),
          };
          const summary = buildWorkoutSummary(state.records, finishedWorkout);
          const record = buildRecordFromWorkout({ ...finishedWorkout, summary });

          return {
            workout: {
              ...finishedWorkout,
              summary,
              savedRecordId: record.id,
              restEndAt: null,
              lastAutoSavedAt: Date.now(),
            },
            records: [record, ...state.records].sort(compareDatesDesc),
          };
        }),
      extendRest: (seconds = 30) =>
        set((state) => {
          if (!state.workout) return {};
          return {
            workout: touchWorkout(state.workout, {
              restTotal: state.workout.restTotal + seconds,
              restEndAt: (state.workout.restEndAt || Date.now()) + seconds * 1000,
              currentSetStartedAt: state.workout.currentSetStartedAt + seconds * 1000,
            }),
          };
        }),
      skipRest: () =>
        set((state) =>
          state.workout
            ? {
                workout: touchWorkout(state.workout, {
                  restEndAt: null,
                  currentSetStartedAt: Date.now(),
                }),
              }
            : {},
        ),
      nextWorkoutExercise: () =>
        set((state) => {
          if (!state.workout) return {};
          const nextIdx = state.workout.exIdx + 1;
          if (nextIdx >= state.workout.exercises.length) return {};
          return {
            workout: touchWorkout(state.workout, {
              exIdx: nextIdx,
              setDone: state.workout.sessionLog[nextIdx].completedSets.length,
              restTotal: Number.parseInt(state.workout.exercises[nextIdx].rest || "90", 10) || 90,
              restEndAt: null,
              currentSetStartedAt: Date.now(),
            }),
          };
        }),
      skipCurrentExercise: () =>
        set((state) => {
          if (!state.workout) return {};
          const nextIdx = state.workout.exIdx + 1;
          if (nextIdx >= state.workout.exercises.length) return {};
          return {
            workout: touchWorkout(state.workout, {
              exIdx: nextIdx,
              setDone: state.workout.sessionLog[nextIdx].completedSets.length,
              restTotal: Number.parseInt(state.workout.exercises[nextIdx].rest || "90", 10) || 90,
              restEndAt: null,
              currentSetStartedAt: Date.now(),
            }),
          };
        }),
      finishWorkout: () => {
        const state = get();
        if (!state.workout) return { ok: false, message: "当前没有进行中的训练" };
        if (state.workout.savedRecordId) return { ok: true, message: "训练已经保存过了" };
        const finishedWorkout: WorkoutSession = {
          ...state.workout,
          finishedAt: new Date().toISOString(),
        };
        const summary = buildWorkoutSummary(state.records, finishedWorkout);
        const record = buildRecordFromWorkout({ ...finishedWorkout, summary });
        set({
          workout: {
            ...finishedWorkout,
            summary,
            savedRecordId: record.id,
            restEndAt: null,
            lastAutoSavedAt: Date.now(),
          },
          records: [record, ...state.records].sort(compareDatesDesc),
        });
        return { ok: true, message: "训练已记录并生成总结" };
      },
      clearWorkout: () => set({ workout: null }),
      resumeWorkoutState: () =>
        set((state) => {
          const workout = state.workout;
          if (!workout || workout.finishedAt) return {};

          const resumedWorkout: WorkoutSession = {
            ...workout,
            sessionLog: workout.sessionLog.map((item) => ({
              ...item,
              completedSets: item.completedSets.slice(),
            })),
          };

          let changed = false;
          const currentCompletedSets = resumedWorkout.sessionLog[resumedWorkout.exIdx]?.completedSets.length || 0;
          if (currentCompletedSets !== resumedWorkout.setDone) {
            resumedWorkout.setDone = currentCompletedSets;
            changed = true;
          }

          if (resumedWorkout.restEndAt && resumedWorkout.restEndAt <= Date.now()) {
            resumedWorkout.restEndAt = null;
            changed = true;
          }

          return changed ? { workout: touchWorkout(resumedWorkout) } : {};
        }),
      setVoicePlan: (voicePlan) => set({ voicePlan }),
      parseVoicePlanFallback: (input) => buildVoicePlanFromText(input, get().selectedMuscle, get().records),
    }),
    {
      name: "training-tracker-v2",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState) => {
        const state = persistedState as Partial<TrainingState> & {
          workout?: WorkoutSession | Record<string, unknown> | null;
        };
        if (!state?.workout) return persistedState as TrainingState;
        const workout =
          "exercises" in state.workout
            ? normalizeLegacyWorkout(state.workout as Record<string, unknown>)
            : null;
        return {
          ...state,
          workout,
        } as TrainingState;
      },
      partialize: (state) => ({
        selectedMuscle: state.selectedMuscle,
        plannerDate: state.plannerDate,
        editingRecordId: state.editingRecordId,
        editorPlans: state.editorPlans,
        records: state.records,
        workout: state.workout,
        voicePlan: state.voicePlan,
        legacyImported: state.legacyImported,
      }),
    },
  ),
);
