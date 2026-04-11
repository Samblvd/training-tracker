import { defaultPlans, exerciseLibrary, voiceExerciseAliases, voiceMuscleKeywords } from "@/lib/exercises";
import { ExercisePlanItem, Muscle, TrainingRecord, VoicePlan } from "@/lib/types";
import {
  buildContent,
  findExerciseDefinition,
  formatWeightValue,
  getRecordExercises,
  normalizeExercise,
  normalizeExerciseName,
  normalizeMuscle,
  parseWeightNumber,
} from "@/lib/utils";

type VoiceOverride = Partial<ExercisePlanItem>;

const voiceExerciseKeywordIndex = buildVoiceExerciseKeywordIndex();

function buildVoiceExerciseKeywordIndex() {
  const keywordMap: Record<string, string> = {};
  Object.values(exerciseLibrary).forEach((items) => {
    items.forEach((exercise) => {
      keywordMap[exercise.name] = normalizeExerciseName(exercise.name);
    });
  });
  Object.entries(voiceExerciseAliases).forEach(([alias, name]) => {
    keywordMap[alias] = normalizeExerciseName(name);
  });
  return Object.entries(keywordMap)
    .sort((a, b) => b[0].length - a[0].length)
    .map(([keyword, name]) => ({ keyword, name }));
}

export function buildExerciseLibraryPrompt() {
  return (Object.keys(exerciseLibrary) as Muscle[])
    .map((muscle) => `${muscle}：${exerciseLibrary[muscle].map((exercise) => exercise.name).join("、")}`)
    .join("\n");
}

export function buildRecentWorkoutPrompt(records: TrainingRecord[], limit = 4) {
  const rows = records.slice(0, limit).map((record) => {
    const exercises = getRecordExercises(record)
      .map((exercise) => {
        const parts = [exercise.name];
        if (exercise.weight) parts.push(`${exercise.weight}kg`);
        if (exercise.sets) parts.push(`${exercise.sets}组`);
        if (exercise.reps) parts.push(`${exercise.reps}次`);
        return parts.join(" ");
      })
      .join("；");
    return `${record.date} ${record.muscle}：${exercises}`;
  });
  return rows.length ? rows.join("\n") : "暂无历史训练记录。";
}

export function extractJsonFromModelResponse(content: string) {
  const raw = String(content || "").trim();
  const fencedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fencedMatch ? fencedMatch[1].trim() : raw;
  return JSON.parse(jsonText);
}

export function parseVoiceNumberToken(token: string | number | undefined | null) {
  const digitMap: Record<string, number> = { 零: 0, 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9 };
  if (token === undefined || token === null) return 0;
  const input = String(token).replace(/两/g, "二").trim();
  if (!input) return 0;
  if (/^\d+(?:\.\d+)?$/.test(input)) return Number(input);
  if (input === "十") return 10;
  if (input.includes("十")) {
    const [leftText, rightText] = input.split("十");
    const left = leftText ? digitMap[leftText] || 0 : 1;
    const right = rightText ? digitMap[rightText] || 0 : 0;
    return left * 10 + right;
  }
  return digitMap[input] || 0;
}

export function normalizeVoiceTranscript(rawText: string) {
  const replacements: Array<[RegExp, string]> = [
    [/公斤|千克/g, "kg"],
    [/公 斤/g, "kg"],
    [/ＫＧ|Kg/g, "kg"],
    [/背部|背阔/g, "背"],
    [/胸部|胸肌/g, "胸"],
    [/肩部|肩膀/g, "肩"],
    [/腿部|下肢/g, "臀腿"],
    [/今天我要练|今天练|今天想练/g, ""],
    [/然后|再来|还有|接着/g, "，"],
    [/加重到/g, " "],
    [/乘以|乘/g, "x"],
  ];
  return replacements.reduce((text, [pattern, next]) => text.replace(pattern, next), String(rawText || ""))
    .replace(/\s+/g, " ")
    .trim();
}

function parseVoiceMuscle(text: string) {
  for (const item of voiceMuscleKeywords) {
    for (const keyword of item.keywords) {
      if (text.includes(keyword)) return item.muscle;
    }
  }
  return "";
}

function getVoiceMuscleFromExercise(name: string) {
  const exercise = findExerciseDefinition(name);
  if (!exercise) return "";
  if (exercise.musclePrimary === "肩后束") return "肩";
  if (exercise.musclePrimary === "二头") return "背";
  if (exercise.musclePrimary === "三头") return "胸";
  if (["股四头", "腿后侧", "臀", "小腿"].includes(exercise.musclePrimary)) return "臀腿";
  return normalizeMuscle(exercise.musclePrimary);
}

function findVoiceExerciseMatches(text: string) {
  const rawMatches = voiceExerciseKeywordIndex
    .map((entry) => ({ ...entry, index: text.indexOf(entry.keyword) }))
    .filter((entry) => entry.index >= 0)
    .sort((a, b) => (a.index !== b.index ? a.index - b.index : b.keyword.length - a.keyword.length));

  const pickedRanges: Array<{ start: number; end: number }> = [];
  const pickedNames = new Set<string>();
  return rawMatches.filter((match) => {
    const start = match.index;
    const end = start + match.keyword.length;
    const overlaps = pickedRanges.some((range) => start < range.end && end > range.start);
    if (overlaps || pickedNames.has(match.name)) return false;
    pickedRanges.push({ start, end });
    pickedNames.add(match.name);
    return true;
  });
}

function matchVoiceExerciseName(segment: string) {
  return findVoiceExerciseMatches(segment)[0]?.name || "";
}

function getLastExercise(records: TrainingRecord[], exerciseName: string, muscle: Muscle) {
  return records
    .flatMap((record) => getRecordExercises(record).map((exercise) => ({ record, exercise })))
    .find(({ record, exercise }) => record.muscle === muscle && normalizeExerciseName(exercise.name) === normalizeExerciseName(exerciseName))
    ?.exercise;
}

function getVoiceDefaultRepRange(name: string) {
  const exercise = findExerciseDefinition(name);
  if (!exercise) return "8-12";
  return exercise.type === "复合" ? "6-10" : "10-15";
}

function getVoiceDefaultSets(name: string) {
  const exercise = findExerciseDefinition(name);
  return exercise?.type === "复合" ? "4" : "3";
}

function getVoiceDefaultWeight(name: string) {
  const exercise = findExerciseDefinition(name);
  if (!exercise) return "";
  if (exercise.equipment === "徒手") return "0";
  if (exercise.equipment === "杠铃") return exercise.type === "复合" ? "40" : "20";
  if (exercise.equipment === "哑铃") return exercise.type === "复合" ? "16" : "8";
  if (exercise.equipment === "器械") return exercise.type === "复合" ? "40" : "20";
  if (exercise.equipment === "绳索") return "15";
  return "";
}

function getVoiceTemplateForExercise(records: TrainingRecord[], name: string, muscle: Muscle) {
  const normalizedName = normalizeExerciseName(name);
  const defaultItem = defaultPlans[muscle].find((exercise) => normalizeExerciseName(exercise.name) === normalizedName);
  if (defaultItem) return defaultItem;
  const last = getLastExercise(records, normalizedName, muscle);
  if (last) return last;
  return {
    name: normalizedName,
    weight: getVoiceDefaultWeight(normalizedName),
    sets: getVoiceDefaultSets(normalizedName),
    reps: getVoiceDefaultRepRange(normalizedName),
    rest: findExerciseDefinition(normalizedName)?.type === "复合" ? "90" : "60",
    intensity: findExerciseDefinition(normalizedName)?.type === "复合" ? "RPE 8" : "RPE 7",
    progression: "动作稳定后再尝试加重",
  };
}

function parseVoiceExerciseOverrides(segment: string): VoiceOverride {
  const setsMatch = segment.match(/([零一二三四五六七八九十两\d]+)\s*组/);
  const repsRangeMatch = segment.match(/([零一二三四五六七八九十两\d]+)\s*(?:到|至|-|~)\s*([零一二三四五六七八九十两\d]+)\s*次/);
  const repsMatch = segment.match(/([零一二三四五六七八九十两\d]+)\s*次/);
  const weightMatch = segment.match(/(\d+(?:\.\d+)?)\s*(?:kg|KG|公斤|千克|斤)/);
  const restMatch = segment.match(/休息\s*([零一二三四五六七八九十两\d]+)\s*(秒|分钟|分)/);
  const restValue = restMatch ? parseVoiceNumberToken(restMatch[1]) * (restMatch[2] === "秒" ? 1 : 60) : 0;
  const weightUnit = weightMatch?.[0] || "";
  const parsedWeight = weightMatch?.[1] ? Number(weightMatch[1]) : null;
  const weight = parsedWeight === null ? "" : formatWeightValue(/斤/.test(weightUnit) ? parsedWeight / 2 : parsedWeight);
  return {
    sets: setsMatch ? String(parseVoiceNumberToken(setsMatch[1])) : "",
    reps: repsRangeMatch
      ? `${parseVoiceNumberToken(repsRangeMatch[1])}-${parseVoiceNumberToken(repsRangeMatch[2])}`
      : repsMatch
        ? String(parseVoiceNumberToken(repsMatch[1]))
        : "",
    weight,
    rest: restValue ? String(restValue) : "",
    intensity: segment.includes("轻松") ? "RPE 6-7" : segment.includes("冲") || segment.includes("吃力") ? "RPE 8-9" : "",
  };
}

function buildVoiceExercisePlan(records: TrainingRecord[], name: string, muscle: Muscle, overrides: VoiceOverride = {}) {
  const template = getVoiceTemplateForExercise(records, name, muscle);
  const exercise = findExerciseDefinition(name);
  const fallbackWeight = parseWeightNumber(template.weight);
  const progression =
    overrides.progression ||
    template.progression ||
    (fallbackWeight === null ? "先把次数做满，再考虑加重" : `做满后可尝试 ${formatWeightValue(fallbackWeight + 2.5)}kg`);
  return normalizeExercise({
    name: normalizeExerciseName(name),
    weight: overrides.weight || template.weight,
    sets: overrides.sets || template.sets,
    reps: overrides.reps || template.reps,
    rest: overrides.rest || template.rest || (exercise?.type === "复合" ? "90" : "60"),
    intensity: overrides.intensity || template.intensity || (exercise?.type === "复合" ? "RPE 8" : "RPE 7"),
    progression,
  }) as ExercisePlanItem;
}

export function buildVoicePlanFromText(rawText: string, currentMuscle: Muscle, records: TrainingRecord[]): VoicePlan {
  const normalizedText = normalizeVoiceTranscript(rawText);
  const segments = normalizedText.split(/[，,。；;]+/).map((part) => part.trim()).filter(Boolean);
  const matched = segments
    .map((segment) => {
      const exerciseName = matchVoiceExerciseName(segment);
      return exerciseName ? { name: exerciseName, overrides: parseVoiceExerciseOverrides(segment) } : null;
    })
    .filter(Boolean) as Array<{ name: string; overrides: VoiceOverride }>;

  const parsedMuscle = parseVoiceMuscle(normalizedText) || (matched[0] ? getVoiceMuscleFromExercise(matched[0].name) : currentMuscle);
  const muscle = normalizeMuscle(parsedMuscle);

  const exercises = matched.length
    ? matched.map((item) => buildVoiceExercisePlan(records, item.name, muscle, item.overrides))
    : defaultPlans[muscle].map((item) => normalizeExercise(item) as ExercisePlanItem);

  return {
    muscle,
    source: matched.length ? "voice" : "fallback",
    transcript: normalizedText,
    suggestions: matched.length ? [] : [`没有识别到具体动作，已回退为 ${muscle} 默认计划`],
    exercises,
  };
}

function normalizeVoiceModelReps(value: unknown) {
  if (value === undefined || value === null || value === "") return "";
  if (Array.isArray(value) && value.length >= 2) return `${parseVoiceNumberToken(value[0])}-${parseVoiceNumberToken(value[1])}`;
  const textValue = String(value).trim();
  if (/^\d+\s*[-~到至]\s*\d+$/.test(textValue)) return textValue.replace(/[~到至]/g, "-").replace(/\s+/g, "");
  const rangeMatch = textValue.match(/([零一二三四五六七八九十两\d]+)\s*[-~到至]\s*([零一二三四五六七八九十两\d]+)/);
  if (rangeMatch) return `${parseVoiceNumberToken(rangeMatch[1])}-${parseVoiceNumberToken(rangeMatch[2])}`;
  return String(parseVoiceNumberToken(textValue) || textValue.replace(/[^\d.]/g, "")).trim();
}

function normalizeVoiceModelWeight(weight: unknown, unit: unknown) {
  if (weight === undefined || weight === null || weight === "") return "";
  const rawText = String(weight).trim();
  const numeric = typeof weight === "number" ? weight : Number.parseFloat(rawText.replace(/[^\d.]/g, ""));
  if (!Number.isFinite(numeric)) return "";
  const detectedUnit = String(unit || rawText).toLowerCase();
  const normalized = /斤/.test(rawText) || /斤/.test(detectedUnit) ? numeric / 2 : numeric;
  return formatWeightValue(normalized);
}

export function normalizeVoiceModelPlan(
  payload: Record<string, unknown>,
  transcript: string,
  currentMuscle: Muscle,
  records: TrainingRecord[],
): VoicePlan {
  const muscle = normalizeMuscle(String(payload.muscle || payload.target_muscle || payload.body_part || currentMuscle));
  const rawExercises = Array.isArray(payload.exercises) ? payload.exercises : [];
  const exercises = rawExercises
    .map((exercise) => {
      if (!exercise || typeof exercise !== "object") return null;
      const name = normalizeExerciseName(String((exercise as Record<string, unknown>).name || ""));
      if (!name || !findExerciseDefinition(name)) return null;
      return buildVoiceExercisePlan(records, name, muscle, {
        sets: (exercise as Record<string, unknown>).sets ? String(parseVoiceNumberToken((exercise as Record<string, unknown>).sets as string)) : "",
        reps: normalizeVoiceModelReps((exercise as Record<string, unknown>).reps),
        weight: normalizeVoiceModelWeight((exercise as Record<string, unknown>).weight, (exercise as Record<string, unknown>).weight_unit),
        rest: (exercise as Record<string, unknown>).rest ? String(parseVoiceNumberToken((exercise as Record<string, unknown>).rest as string)) : "",
        intensity: String((exercise as Record<string, unknown>).intensity || "").trim(),
        progression: String(
          (exercise as Record<string, unknown>).progression ||
            (exercise as Record<string, unknown>).suggestion ||
            (exercise as Record<string, unknown>).note ||
            "",
        ).trim(),
      });
    })
    .filter(Boolean) as ExercisePlanItem[];

  if (!exercises.length) {
    throw new Error("没有识别到可导入的动作，请换一种说法再试");
  }

  const suggestions = Array.isArray(payload.suggestions)
    ? payload.suggestions.map((item) => String(item).trim()).filter(Boolean).slice(0, 3)
    : [];

  return {
    muscle,
    source: "doubao",
    transcript,
    suggestions,
    exercises,
  };
}

export function buildVoiceSummary(plan: VoicePlan) {
  return [
    `识别到 ${plan.exercises.length} 个动作`,
    `训练部位：${plan.muscle}`,
    plan.source === "fallback" ? "未命中动作名，已回退默认计划" : "",
  ].filter(Boolean);
}

export function planPreviewText(plan: VoicePlan) {
  return buildContent(plan.muscle, plan.exercises);
}
