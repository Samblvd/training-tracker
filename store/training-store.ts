"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ExerciseConfig, HoldTimer, WorkoutSession } from "@/lib/types";

const DEFAULT_EXERCISES: ExerciseConfig[] = [
  { name: "平板杠铃卧推", targetSets: 4 },
  { name: "上斜哑铃卧推", targetSets: 4 },
  { name: "蝴蝶机夹胸", targetSets: 3 },
  { name: "哑铃侧平举", targetSets: 4 },
  { name: "面拉", targetSets: 3 },
];

interface TrainingState {
  exercises: ExerciseConfig[];
  restSeconds: number;
  workout: WorkoutSession | null;
  holdTimer: HoldTimer;

  updateExercises: (exercises: ExerciseConfig[]) => void;
  setRestSeconds: (seconds: number) => void;
  startWorkout: () => void;
  finishWorkout: () => void;
  completeSet: () => void;
  skipRest: () => void;
  extendRest: (seconds?: number) => void;
  goToExercise: (idx: number) => void;
  toggleHold: () => void;
  resetHold: () => void;
}

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set, get) => ({
      exercises: DEFAULT_EXERCISES,
      restSeconds: 90,
      workout: null,
      holdTimer: { startedAt: null, accumulated: 0 },

      updateExercises: (exercises) => set({ exercises }),
      setRestSeconds: (restSeconds) => set({ restSeconds }),

      startWorkout: () =>
        set((state) => ({
          workout: {
            startedAt: Date.now(),
            currentExIdx: 0,
            completedSets: state.exercises.map(() => 0),
            restEndAt: null,
          },
          holdTimer: { startedAt: null, accumulated: 0 },
        })),

      finishWorkout: () =>
        set({ workout: null, holdTimer: { startedAt: null, accumulated: 0 } }),

      completeSet: () =>
        set((state) => {
          if (!state.workout) return {};
          const completedSets = [...state.workout.completedSets];
          completedSets[state.workout.currentExIdx] =
            (completedSets[state.workout.currentExIdx] ?? 0) + 1;
          return {
            workout: {
              ...state.workout,
              completedSets,
              restEndAt: Date.now() + state.restSeconds * 1000,
            },
          };
        }),

      skipRest: () =>
        set((state) =>
          state.workout ? { workout: { ...state.workout, restEndAt: null } } : {},
        ),

      extendRest: (seconds = 30) =>
        set((state) => {
          if (!state.workout) return {};
          const base =
            state.workout.restEndAt && state.workout.restEndAt > Date.now()
              ? state.workout.restEndAt
              : Date.now();
          return { workout: { ...state.workout, restEndAt: base + seconds * 1000 } };
        }),

      goToExercise: (idx) =>
        set((state) => {
          if (!state.workout) return {};
          if (idx < 0 || idx >= get().exercises.length) return {};
          return {
            workout: { ...state.workout, currentExIdx: idx, restEndAt: null },
          };
        }),

      toggleHold: () =>
        set((state) => {
          const { holdTimer } = state;
          if (holdTimer.startedAt !== null) {
            return {
              holdTimer: {
                startedAt: null,
                accumulated: holdTimer.accumulated + (Date.now() - holdTimer.startedAt),
              },
            };
          }
          return { holdTimer: { ...holdTimer, startedAt: Date.now() } };
        }),

      resetHold: () => set({ holdTimer: { startedAt: null, accumulated: 0 } }),
    }),
    {
      name: "training-simple-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        exercises: state.exercises,
        restSeconds: state.restSeconds,
        workout: state.workout,
      }),
    },
  ),
);
