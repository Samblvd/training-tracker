export interface ExerciseConfig {
  name: string;
  targetSets: number;
}

export interface WorkoutSession {
  startedAt: number;
  currentExIdx: number;
  completedSets: number[];
  restEndAt: number | null;
}

export interface HoldTimer {
  startedAt: number | null;
  accumulated: number;
}
