import { EXERCISE_NAME_ALIASES, defaultPlans, exerciseLibrary } from "@/lib/exercises";
import {
  ExerciseDefinition,
  ExercisePlanItem,
  Muscle,
  PlannerExercise,
  SessionLogItem,
  TrainingRecord,
  WorkoutSession,
  WorkoutSummary,
} from "@/lib/types";

export const muscles: Muscle[] = ["胸", "肩", "背", "臀腿"];

export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "rec_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

export function todayString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function yesterdayString() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function parseDateString(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function normalizeMuscle(value?: string): Muscle {
  if (value === "臀") return "臀腿";
  return muscles.includes(value as Muscle) ? (value as Muscle) : "胸";
}

export function normalizeExerciseName(name?: string) {
  if (!name) return "";
  return EXERCISE_NAME_ALIASES[name] || name;
}

export function parseWeightNumber(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : null;
}

export function formatWeightValue(value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "";
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return String(value);
  if (Math.abs(value) < 0.001) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

export function getRepInputValue(repsRange?: string) {
  if (!repsRange) return "";
  return repsRange.includes("-") ? repsRange.split("-")[0] : repsRange;
}

export function parseRepRange(value?: string) {
  const range = String(value || "");
  if (!range) return { low: 0, high: 0 };
  if (!range.includes("-")) {
    const rep = Number.parseInt(range, 10) || 0;
    return { low: rep, high: rep };
  }
  const [lowText, highText] = range.split("-");
  const low = Number.parseInt(lowText, 10) || 0;
  const high = Number.parseInt(highText, 10) || low;
  return { low, high };
}

export function findExerciseDefinition(name: string): ExerciseDefinition | null {
  const normalizedName = normalizeExerciseName(name);
  for (const muscle of muscles) {
    const found = exerciseLibrary[muscle].find((exercise) => exercise.name === normalizedName);
    if (found) return found;
  }
  return null;
}

export function getWeightStep(exerciseName: string) {
  const exercise = findExerciseDefinition(exerciseName);
  if (!exercise) return 2.5;
  if (exercise.equipment === "杠铃") return 2.5;
  if (exercise.equipment === "哑铃") return 2;
  if (exercise.equipment === "器械" || exercise.equipment === "绳索") return 5;
  return 0;
}

export function bumpWeight(weight: number, exerciseName: string, factor: number) {
  const step = getWeightStep(exerciseName);
  const next = weight * factor;
  if (!step) return next;
  const rounded = Math.round(next / step) * step;
  if (factor > 1 && rounded <= weight) return weight + step;
  if (factor < 1 && rounded >= weight) return Math.max(0, weight - step);
  return rounded;
}

export function getSessionLogVolume(sessionLog: SessionLogItem[]) {
  return sessionLog.reduce((sum, item) => {
    return sum + item.completedSets.reduce((setSum, set) => {
      const weight = parseWeightNumber(set.weight);
      const reps = Number.parseInt(set.reps, 10) || 0;
      if (weight === null || !reps) return setSum;
      return setSum + weight * reps;
    }, 0);
  }, 0);
}

export function normalizeExercise(exercise?: Partial<ExercisePlanItem> | null): ExercisePlanItem | null {
  if (!exercise?.name) return null;
  return {
    name: normalizeExerciseName(exercise.name),
    weight: exercise.weight === undefined || exercise.weight === null ? "" : String(exercise.weight),
    sets: exercise.sets === undefined || exercise.sets === null ? "" : String(exercise.sets),
    reps: exercise.reps === undefined || exercise.reps === null ? "" : String(exercise.reps),
    rest: exercise.rest === undefined || exercise.rest === null ? "" : String(exercise.rest),
    intensity: exercise.intensity ? String(exercise.intensity) : "",
    progression: exercise.progression ? String(exercise.progression) : "",
  };
}

export function buildExercisesFromSessionLog(sessionLog: SessionLogItem[]) {
  return sessionLog
    .filter((item) => item.completedSets.length)
    .map((item) => {
      const lastSet = item.completedSets[item.completedSets.length - 1];
      return normalizeExercise({
        name: item.name,
        weight: lastSet.weight,
        sets: String(item.completedSets.length),
        reps: lastSet.reps,
        rest: item.targetRest,
        intensity: item.intensity,
        progression: item.progression,
      });
    })
    .filter(Boolean) as ExercisePlanItem[];
}

export function getRecordExercises(record: TrainingRecord) {
  if (record.exercises.length) return record.exercises;
  return buildExercisesFromSessionLog(record.sessionLog);
}

export function buildContent(muscle: Muscle, exercises: ExercisePlanItem[]) {
  if (!exercises.length) return `${muscle}训练`;
  return `${muscle}：${exercises
    .map((exercise) => {
      const parts: string[] = [];
      if (exercise.weight) parts.push(`${exercise.weight}kg`);
      if (exercise.sets) parts.push(`${exercise.sets}组`);
      if (exercise.reps) parts.push(`${exercise.reps}次`);
      return `${exercise.name}${parts.length ? `（${parts.join(" ")}` + "）" : ""}`;
    })
    .join("、")}`;
}

export function createPlannerPlan(muscle: Muscle, selectedPlan?: ExercisePlanItem[]) {
  const planMap = new Map((selectedPlan || []).map((item) => [normalizeExerciseName(item.name), normalizeExercise(item) as ExercisePlanItem]));
  return exerciseLibrary[muscle].map((exercise): PlannerExercise => {
    const matched = planMap.get(exercise.name);
    return {
      name: exercise.name,
      selected: !!matched,
      weight: matched?.weight ?? "",
      sets: matched?.sets ?? "",
      reps: matched?.reps ?? "",
      rest: matched?.rest ?? "",
      intensity: matched?.intensity ?? "",
      progression: matched?.progression ?? "",
    };
  });
}

export function createDefaultEditorPlans() {
  return muscles.reduce(
    (acc, muscle) => {
      acc[muscle] = createPlannerPlan(muscle, defaultPlans[muscle]);
      return acc;
    },
    {} as Record<Muscle, PlannerExercise[]>,
  );
}

export function selectedPlannerExercises(plan: PlannerExercise[]) {
  return plan
    .filter((item) => item.selected)
    .map((item) => normalizeExercise(item))
    .filter(Boolean) as ExercisePlanItem[];
}

export function buildWorkoutSession(muscle: Muscle, exercises: ExercisePlanItem[]): WorkoutSession {
  const startedAt = new Date().toISOString();
  return {
    muscle,
    exercises,
    exIdx: 0,
    setDone: 0,
    restTotal: Number.parseInt(exercises[0]?.rest || "90", 10) || 90,
    restEndAt: null,
    currentSetStartedAt: Date.now(),
    startedAt,
    finishedAt: "",
    sessionLog: exercises.map((exercise) => ({
      name: exercise.name,
      targetWeight: exercise.weight,
      targetSets: exercise.sets,
      targetReps: exercise.reps,
      targetRest: exercise.rest,
      intensity: exercise.intensity,
      progression: exercise.progression,
      completedSets: [],
    })),
  };
}

export function buildRecordFromWorkout(workout: WorkoutSession): TrainingRecord {
  const exercises = buildExercisesFromSessionLog(workout.sessionLog);
  return {
    id: createId(),
    date: todayString(),
    muscle: workout.muscle,
    exercises,
    plannedExercises: workout.exercises,
    sessionLog: workout.sessionLog,
    totalVolume: getSessionLogVolume(workout.sessionLog),
    startedAt: workout.startedAt,
    finishedAt: workout.finishedAt || new Date().toISOString(),
    note: "",
    content: buildContent(workout.muscle, exercises),
    source: "workout",
    _wmSession: true,
  };
}

export function compareDatesDesc(a: TrainingRecord, b: TrainingRecord) {
  return parseDateString(b.date).getTime() - parseDateString(a.date).getTime();
}

export function getPrevRecord(records: TrainingRecord[], record: TrainingRecord) {
  return records
    .filter((item) => item.id !== record.id && item.muscle === record.muscle && getRecordExercises(item).length)
    .filter((item) => parseDateString(item.date).getTime() < parseDateString(record.date).getTime())
    .sort(compareDatesDesc)[0];
}

export function getExerciseTrendData(records: TrainingRecord[], exerciseName: string, limit = 8) {
  const normalizedName = normalizeExerciseName(exerciseName);
  const sorted = records.slice().sort((a, b) => parseDateString(a.date).getTime() - parseDateString(b.date).getTime());
  const data = sorted
    .map((record) => {
      const logItem = record.sessionLog.find((item) => normalizeExerciseName(item.name) === normalizedName && item.completedSets.length);
      if (logItem) {
        return {
          date: record.date,
          weight: logItem.completedSets.reduce((max, set) => Math.max(max, parseWeightNumber(set.weight) || 0), 0),
          volume: logItem.completedSets.reduce((sum, set) => {
            const weight = parseWeightNumber(set.weight);
            const reps = Number.parseInt(set.reps, 10) || 0;
            return weight === null ? sum : sum + weight * reps;
          }, 0),
        };
      }
      const summaryItem = getRecordExercises(record).find((exercise) => normalizeExerciseName(exercise.name) === normalizedName);
      if (!summaryItem) return null;
      const weight = parseWeightNumber(summaryItem.weight) || 0;
      const sets = Number.parseInt(summaryItem.sets, 10) || 0;
      const reps = Number.parseInt(getRepInputValue(summaryItem.reps), 10) || 0;
      return {
        date: record.date,
        weight,
        volume: weight * sets * reps,
      };
    })
    .filter(Boolean) as Array<{ date: string; weight: number; volume: number }>;

  return data.slice(-limit);
}

export function getTrackedExerciseNames(records: TrainingRecord[]) {
  const seen = new Set<string>();
  const names: string[] = [];
  records
    .slice()
    .sort(compareDatesDesc)
    .forEach((record) => {
      getRecordExercises(record).forEach((exercise) => {
        const name = normalizeExerciseName(exercise.name);
        if (!seen.has(name)) {
          seen.add(name);
          names.push(name);
        }
      });
    });
  return names;
}

export function getMuscleFrequencyData(records: TrainingRecord[], days = 28) {
  const cutoff = parseDateString(todayString());
  cutoff.setDate(cutoff.getDate() - (days - 1));
  const counts: Record<Muscle, number> = { 胸: 0, 肩: 0, 背: 0, 臀腿: 0 };
  records.forEach((record) => {
    if (parseDateString(record.date) < cutoff) return;
    if (!getRecordExercises(record).length) return;
    counts[record.muscle] += 1;
  });
  return muscles.map((muscle) => ({ muscle, count: counts[muscle] }));
}

export function buildWorkoutSummary(records: TrainingRecord[], workout: WorkoutSession): WorkoutSummary {
  const totalSets = workout.sessionLog.reduce((sum, item) => sum + item.completedSets.length, 0);
  const totalVolume = getSessionLogVolume(workout.sessionLog);
  const improvements: string[] = [];
  const cautions: string[] = [];
  const suggestions: string[] = [];

  workout.sessionLog.forEach((item) => {
    if (!item.completedSets.length) return;
    const lastSet = item.completedSets[item.completedSets.length - 1];
    const previous = records
      .slice()
      .sort(compareDatesDesc)
      .flatMap((record) => getRecordExercises(record).map((exercise) => ({ record, exercise })))
      .find(({ exercise }) => normalizeExerciseName(exercise.name) === normalizeExerciseName(item.name));

    const previousWeight = parseWeightNumber(previous?.exercise.weight);
    const currentWeight = parseWeightNumber(lastSet.weight);
    const targetRange = parseRepRange(item.targetReps);
    const actualReps = Number.parseInt(lastSet.reps, 10) || 0;
    const targetSets = Number.parseInt(item.targetSets, 10) || item.completedSets.length;

    if (currentWeight !== null && previousWeight !== null && currentWeight > previousWeight) {
      improvements.push(`${item.name}：重量比上次提升到 ${formatWeightValue(currentWeight)}kg`);
    } else if (item.completedSets.length >= targetSets) {
      improvements.push(`${item.name}：计划组数全部完成`);
    }

    if (targetRange.low && actualReps < targetRange.low) {
      cautions.push(`${item.name}：最后一组低于目标次数下限`);
    } else if (item.completedSets.length < targetSets) {
      cautions.push(`${item.name}：本次没有做满计划组数`);
    }

    if (targetRange.high && actualReps >= targetRange.high && currentWeight !== null) {
      suggestions.push(`${item.name}：下次尝试 ${formatWeightValue(bumpWeight(currentWeight, item.name, 1.03))}kg`);
    } else {
      suggestions.push(`${item.name}：先把动作质量和次数做稳，再决定是否加重`);
    }
  });

  return {
    totalExercises: workout.sessionLog.filter((item) => item.completedSets.length).length,
    totalSets,
    totalVolume: formatWeightValue(totalVolume),
    improvements: improvements.length ? improvements : ["今天以稳定完成训练为主，节奏保持得不错。"],
    cautions: cautions.length ? cautions : ["整体完成度不错，没有明显掉速动作。"],
    suggestions: Array.from(new Set(suggestions)).slice(0, 3),
  };
}

export function formatShortDate(dateStr: string) {
  return dateStr ? dateStr.slice(5).replace("-", "/") : "";
}

export function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
