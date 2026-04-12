export type Muscle = "胸" | "肩" | "背" | "臀腿";

export type ExerciseField = "weight" | "sets" | "reps" | "rest" | "intensity" | "progression";

export interface ExerciseDefinition {
  name: string;
  musclePrimary: string;
  muscleSecondary?: string[];
  movement: string;
  pattern: string;
  equipment: string;
  type: string;
  unilateral?: boolean;
}

export interface ExercisePlanItem {
  name: string;
  weight: string;
  sets: string;
  reps: string;
  rest: string;
  intensity: string;
  progression: string;
}

export interface PlannerExercise extends ExercisePlanItem {
  selected: boolean;
}

export interface CompletedSet {
  setNumber: number;
  weight: string;
  reps: string;
  restSeconds: number;
}

export interface SessionLogItem {
  name: string;
  targetWeight: string;
  targetSets: string;
  targetReps: string;
  targetRest: string;
  intensity: string;
  progression: string;
  completedSets: CompletedSet[];
}

export interface TrainingRecord {
  id: string;
  date: string;
  muscle: Muscle;
  exercises: ExercisePlanItem[];
  plannedExercises: ExercisePlanItem[];
  sessionLog: SessionLogItem[];
  totalVolume: number;
  startedAt: string;
  finishedAt: string;
  note: string;
  content: string;
  source: "manual" | "workout";
  _wmSession?: boolean;
}

export interface WorkoutSession {
  muscle: Muscle;
  exercises: ExercisePlanItem[];
  exIdx: number;
  setDone: number;
  restTotal: number;
  restEndAt: number | null;
  currentSetStartedAt: number;
  startedAt: string;
  finishedAt: string;
  sessionLog: SessionLogItem[];
  summary?: WorkoutSummary;
  savedRecordId?: string;
}

export interface WorkoutSummary {
  totalExercises: number;
  totalSets: number;
  totalVolume: string;
  improvements: string[];
  cautions: string[];
  suggestions: string[];
}

export interface VoicePlan {
  muscle: Muscle;
  source: "doubao" | "voice" | "fallback";
  transcript: string;
  suggestions: string[];
  exercises: ExercisePlanItem[];
}
