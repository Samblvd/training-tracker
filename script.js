const EXERCISE_NAME_ALIASES = {
  "平板卧推": "平板杠铃卧推",
  "哑铃平板卧推": "哑铃卧推",
  "上斜器械推胸": "器械推胸",
  "杠铃推肩": "杠铃推举",
  "侧平举": "哑铃侧平举",
  "绳索面拉": "面拉",
  "高位下拉": "宽握下拉",
  "分腿蹲": "保加利亚分腿蹲",
  "单腿硬拉": "单腿罗马尼亚硬拉"
};

function createExercise(def) {
  return {
    name: def.name || "",
    muscle_primary: def.muscle_primary || "",
    muscle_secondary: Array.isArray(def.muscle_secondary) ? def.muscle_secondary : [],
    movement: def.movement || "",
    pattern: def.pattern || "",
    equipment: def.equipment || "",
    type: def.type || "",
    unilateral: !!def.unilateral
  };
}

function normalizeExerciseName(name) {
  if (!name) return "";
  return EXERCISE_NAME_ALIASES[name] || name;
}

const exerciseLibrary = {
  胸: [
    createExercise({ name: "平板杠铃卧推", muscle_primary: "胸", muscle_secondary: ["三头", "肩前束"], movement: "推", pattern: "水平推", equipment: "杠铃", type: "复合" }),
    createExercise({ name: "上斜杠铃卧推", muscle_primary: "胸", muscle_secondary: ["三头", "肩前束"], movement: "推", pattern: "水平推", equipment: "杠铃", type: "复合" }),
    createExercise({ name: "哑铃卧推", muscle_primary: "胸", muscle_secondary: ["三头", "肩前束"], movement: "推", pattern: "水平推", equipment: "哑铃", type: "复合" }),
    createExercise({ name: "上斜哑铃卧推", muscle_primary: "胸", muscle_secondary: ["三头", "肩前束"], movement: "推", pattern: "水平推", equipment: "哑铃", type: "复合" }),
    createExercise({ name: "俯卧撑", muscle_primary: "胸", muscle_secondary: ["三头", "肩前束"], movement: "推", pattern: "水平推", equipment: "徒手", type: "复合" }),
    createExercise({ name: "器械推胸", muscle_primary: "胸", muscle_secondary: ["三头"], movement: "推", pattern: "水平推", equipment: "器械", type: "复合" }),
    createExercise({ name: "蝴蝶机夹胸", muscle_primary: "胸", movement: "推", pattern: "夹胸", equipment: "器械", type: "孤立" }),
    createExercise({ name: "绳索夹胸", muscle_primary: "胸", movement: "推", pattern: "夹胸", equipment: "绳索", type: "孤立" }),
    createExercise({ name: "绳索下压", muscle_primary: "三头", movement: "推", pattern: "伸展", equipment: "绳索", type: "孤立" }),
    createExercise({ name: "仰卧臂屈伸", muscle_primary: "三头", movement: "推", pattern: "伸展", equipment: "杠铃", type: "孤立" }),
    createExercise({ name: "哑铃臂屈伸", muscle_primary: "三头", movement: "推", pattern: "伸展", equipment: "哑铃", type: "孤立", unilateral: true })
  ],
  肩: [
    createExercise({ name: "杠铃推举", muscle_primary: "肩", muscle_secondary: ["三头"], movement: "推", pattern: "垂直推", equipment: "杠铃", type: "复合" }),
    createExercise({ name: "哑铃推肩", muscle_primary: "肩", muscle_secondary: ["三头"], movement: "推", pattern: "垂直推", equipment: "哑铃", type: "复合" }),
    createExercise({ name: "阿诺德推举", muscle_primary: "肩", muscle_secondary: ["三头"], movement: "推", pattern: "垂直推", equipment: "哑铃", type: "复合" }),
    createExercise({ name: "器械推肩", muscle_primary: "肩", muscle_secondary: ["三头"], movement: "推", pattern: "垂直推", equipment: "器械", type: "复合" }),
    createExercise({ name: "哑铃侧平举", muscle_primary: "肩", movement: "外展", pattern: "侧平举", equipment: "哑铃", type: "孤立" }),
    createExercise({ name: "绳索侧平举", muscle_primary: "肩", movement: "外展", pattern: "侧平举", equipment: "绳索", type: "孤立", unilateral: true }),
    createExercise({ name: "反向飞鸟", muscle_primary: "肩后束", muscle_secondary: ["背"], movement: "拉", pattern: "后束", equipment: "哑铃", type: "孤立" }),
    createExercise({ name: "面拉", muscle_primary: "肩后束", muscle_secondary: ["背"], movement: "拉", pattern: "后束", equipment: "绳索", type: "孤立" })
  ],
  背: [
    createExercise({ name: "杠铃划船", muscle_primary: "背", muscle_secondary: ["二头"], movement: "拉", pattern: "水平拉", equipment: "杠铃", type: "复合" }),
    createExercise({ name: "哑铃划船", muscle_primary: "背", muscle_secondary: ["二头"], movement: "拉", pattern: "水平拉", equipment: "哑铃", type: "复合", unilateral: true }),
    createExercise({ name: "坐姿划船", muscle_primary: "背", muscle_secondary: ["二头"], movement: "拉", pattern: "水平拉", equipment: "器械", type: "复合" }),
    createExercise({ name: "T杠划船", muscle_primary: "背", muscle_secondary: ["二头"], movement: "拉", pattern: "水平拉", equipment: "杠铃", type: "复合" }),
    createExercise({ name: "器械划船", muscle_primary: "背", muscle_secondary: ["二头"], movement: "拉", pattern: "水平拉", equipment: "器械", type: "复合" }),
    createExercise({ name: "引体向上", muscle_primary: "背", muscle_secondary: ["二头"], movement: "拉", pattern: "垂直拉", equipment: "徒手", type: "复合" }),
    createExercise({ name: "宽握下拉", muscle_primary: "背", muscle_secondary: ["二头"], movement: "拉", pattern: "垂直拉", equipment: "器械", type: "复合" }),
    createExercise({ name: "窄握下拉", muscle_primary: "背", muscle_secondary: ["二头"], movement: "拉", pattern: "垂直拉", equipment: "器械", type: "复合" }),
    createExercise({ name: "对握下拉", muscle_primary: "背", muscle_secondary: ["二头"], movement: "拉", pattern: "垂直拉", equipment: "器械", type: "复合" }),
    createExercise({ name: "杠铃弯举", muscle_primary: "二头", movement: "拉", pattern: "弯举", equipment: "杠铃", type: "孤立" }),
    createExercise({ name: "哑铃弯举", muscle_primary: "二头", movement: "拉", pattern: "弯举", equipment: "哑铃", type: "孤立", unilateral: true }),
    createExercise({ name: "锤式弯举", muscle_primary: "二头", movement: "拉", pattern: "弯举", equipment: "哑铃", type: "孤立", unilateral: true }),
    createExercise({ name: "绳索弯举", muscle_primary: "二头", movement: "拉", pattern: "弯举", equipment: "绳索", type: "孤立" }),
    createExercise({ name: "面拉", muscle_primary: "肩后束", muscle_secondary: ["背"], movement: "拉", pattern: "后束", equipment: "绳索", type: "孤立" })
  ],
  臀腿: [
    createExercise({ name: "杠铃深蹲", muscle_primary: "臀腿", muscle_secondary: ["核心"], movement: "蹲", pattern: "膝主导", equipment: "杠铃", type: "复合" }),
    createExercise({ name: "史密斯深蹲", muscle_primary: "臀腿", movement: "蹲", pattern: "膝主导", equipment: "器械", type: "复合" }),
    createExercise({ name: "腿举", muscle_primary: "臀腿", movement: "蹲", pattern: "膝主导", equipment: "器械", type: "复合" }),
    createExercise({ name: "保加利亚分腿蹲", muscle_primary: "臀腿", movement: "蹲", pattern: "单腿", equipment: "哑铃", type: "复合", unilateral: true }),
    createExercise({ name: "弓步蹲", muscle_primary: "臀腿", movement: "蹲", pattern: "单腿", equipment: "哑铃", type: "复合", unilateral: true }),
    createExercise({ name: "坐姿腿屈伸", muscle_primary: "股四头", movement: "伸展", pattern: "孤立", equipment: "器械", type: "孤立" }),
    createExercise({ name: "坐姿腿弯举", muscle_primary: "腿后侧", movement: "弯曲", pattern: "孤立", equipment: "器械", type: "孤立" }),
    createExercise({ name: "俯卧腿弯举", muscle_primary: "腿后侧", movement: "弯曲", pattern: "孤立", equipment: "器械", type: "孤立" }),
    createExercise({ name: "罗马尼亚硬拉", muscle_primary: "臀腿", muscle_secondary: ["下背"], movement: "拉", pattern: "髋主导", equipment: "杠铃", type: "复合" }),
    createExercise({ name: "单腿罗马尼亚硬拉", muscle_primary: "臀腿", muscle_secondary: ["核心"], movement: "拉", pattern: "髋主导", equipment: "哑铃", type: "复合", unilateral: true }),
    createExercise({ name: "臀桥", muscle_primary: "臀", movement: "推", pattern: "髋主导", equipment: "杠铃", type: "复合" }),
    createExercise({ name: "站姿提踵", muscle_primary: "小腿", movement: "推", pattern: "踝关节", equipment: "器械", type: "孤立" }),
    createExercise({ name: "坐姿提踵", muscle_primary: "小腿", movement: "推", pattern: "踝关节", equipment: "器械", type: "孤立" })
  ]
};

const defaultPlans = {
  胸: [
    { name: "平板杠铃卧推", weight: "70", sets: "4", reps: "8" },
    { name: "上斜哑铃卧推", weight: "26", sets: "4", reps: "10" },
    { name: "蝴蝶机夹胸", weight: "35", sets: "3", reps: "12" },
    { name: "绳索夹胸", weight: "15", sets: "3", reps: "12" }
  ],
  肩: [
    { name: "哑铃推肩", weight: "20", sets: "4", reps: "10" },
    { name: "哑铃侧平举", weight: "10", sets: "4", reps: "15" },
    { name: "绳索侧平举", weight: "8", sets: "3", reps: "15" },
    { name: "反向飞鸟", weight: "10", sets: "3", reps: "15" }
  ],
  背: [
    { name: "引体向上", weight: "0", sets: "4", reps: "8" },
    { name: "宽握下拉", weight: "65", sets: "4", reps: "10" },
    { name: "坐姿划船", weight: "60", sets: "4", reps: "10" },
    { name: "面拉", weight: "20", sets: "3", reps: "15" }
  ],
  臀腿: [
    { name: "杠铃深蹲", weight: "70", sets: "4", reps: "8" },
    { name: "罗马尼亚硬拉", weight: "60", sets: "4", reps: "10" },
    { name: "保加利亚分腿蹲", weight: "20", sets: "3", reps: "10" },
    { name: "坐姿腿弯举", weight: "45", sets: "3", reps: "12" }
  ]
};

const mockPlans = {
  胸: {
    增肌: [
      { name: "平板杠铃卧推", weight: "70", sets: "4", reps: "8", note: "控制离心，顶峰停顿" },
      { name: "上斜哑铃卧推", weight: "26", sets: "4", reps: "10", note: "全程保持背部收紧" },
      { name: "蝴蝶机夹胸", weight: "35", sets: "3", reps: "15", note: "顶峰收缩 1 秒" },
      { name: "绳索夹胸", weight: "15", sets: "3", reps: "12", note: "上身前倾，感受胸部发力" }
    ],
    保持: [
      { name: "平板杠铃卧推", weight: "60", sets: "3", reps: "10", note: "" },
      { name: "上斜哑铃卧推", weight: "22", sets: "3", reps: "10", note: "" },
      { name: "蝴蝶机夹胸", weight: "30", sets: "3", reps: "12", note: "" }
    ],
    恢复: [
      { name: "器械推胸", weight: "40", sets: "3", reps: "15", note: "轻重量，感受肌肉" },
      { name: "蝴蝶机夹胸", weight: "25", sets: "3", reps: "15", note: "充分拉伸" }
    ]
  },
  肩: {
    增肌: [
      { name: "哑铃推肩", weight: "20", sets: "4", reps: "10", note: "不要耸肩" },
      { name: "哑铃侧平举", weight: "10", sets: "4", reps: "15", note: "小臂略低于大臂" },
      { name: "绳索侧平举", weight: "8", sets: "3", reps: "15", note: "单侧交替" },
      { name: "反向飞鸟", weight: "10", sets: "3", reps: "15", note: "感受后束收缩" }
    ],
    保持: [
      { name: "哑铃侧平举", weight: "10", sets: "3", reps: "12", note: "" },
      { name: "哑铃推肩", weight: "18", sets: "3", reps: "10", note: "" },
      { name: "反向飞鸟", weight: "8", sets: "3", reps: "12", note: "" }
    ],
    恢复: [
      { name: "哑铃侧平举", weight: "8", sets: "3", reps: "15", note: "轻重量，高次数" },
      { name: "绳索侧平举", weight: "5", sets: "3", reps: "15", note: "" }
    ]
  },
  背: {
    增肌: [
      { name: "引体向上", weight: "0", sets: "4", reps: "8", note: "全程控制，顶峰收缩" },
      { name: "宽握下拉", weight: "65", sets: "4", reps: "10", note: "下拉至锁骨，挺胸" },
      { name: "坐姿划船", weight: "60", sets: "4", reps: "10", note: "顶峰收缩，背部发力" },
      { name: "面拉", weight: "20", sets: "3", reps: "15", note: "手肘与肩同高" }
    ],
    保持: [
      { name: "宽握下拉", weight: "60", sets: "3", reps: "10", note: "" },
      { name: "坐姿划船", weight: "55", sets: "3", reps: "10", note: "" },
      { name: "面拉", weight: "18", sets: "3", reps: "12", note: "" }
    ],
    恢复: [
      { name: "宽握下拉", weight: "45", sets: "3", reps: "15", note: "轻重量，感受背部" },
      { name: "面拉", weight: "15", sets: "3", reps: "15", note: "" }
    ]
  },
  臀腿: {
    增肌: [
      { name: "杠铃深蹲", weight: "70", sets: "4", reps: "8", note: "髋膝同向，背部挺直" },
      { name: "罗马尼亚硬拉", weight: "60", sets: "4", reps: "10", note: "髋关节主导，背部挺直" },
      { name: "保加利亚分腿蹲", weight: "20", sets: "3", reps: "10", note: "单侧，控制下降速度" },
      { name: "坐姿腿弯举", weight: "45", sets: "3", reps: "12", note: "顶峰收缩，感受腿后侧" }
    ],
    保持: [
      { name: "腿举", weight: "100", sets: "3", reps: "12", note: "" },
      { name: "罗马尼亚硬拉", weight: "50", sets: "3", reps: "10", note: "" },
      { name: "坐姿腿弯举", weight: "35", sets: "3", reps: "12", note: "" }
    ],
    恢复: [
      { name: "臀桥", weight: "0", sets: "3", reps: "15", note: "感受臀部收缩" },
      { name: "坐姿腿屈伸", weight: "30", sets: "3", reps: "15", note: "轻重量，充分伸展" }
    ]
  }
};

const muscleTagClass = {
  胸: "muscle-chest",
  肩: "muscle-shoulder",
  背: "muscle-back",
  臀腿: "muscle-legs"
};

const appState = {
  ui: {
    toastTimer: null
  },
  composer: {
    editingIndex: -1,
    planMeta: {}
  },
  voice: {
    plan: null,
    recognition: null,
    isListening: false
  },
  workout: {
    exercises: [],
    exIdx: 0,
    setDone: 0,
    restTimer: null,
    restEndTime: 0,
    restTotal: 90,
    sessionLog: [],
    exDoneTimer: null,
    summary: null,
    startedAt: "",
    finishedAt: ""
  },
  data: {
    records: sanitizeRecords(JSON.parse(localStorage.getItem("records") || "[]"))
  }
};

const voiceExerciseAliases = {
  "绳索引拉": "宽握下拉",
  "引拉": "宽握下拉",
  "绳索下拉": "宽握下拉",
  "高位下拉": "宽握下拉",
  "宽拉": "宽握下拉",
  "宽握拉": "宽握下拉",
  "背阔下拉": "宽握下拉",
  "窄握拉": "窄握下拉",
  "对握拉": "对握下拉",
  "下拉": "宽握下拉",
  "平板卧推": "平板杠铃卧推",
  "杠铃卧推": "平板杠铃卧推",
  "卧推": "平板杠铃卧推",
  "上斜卧推": "上斜杠铃卧推",
  "上斜杠铃": "上斜杠铃卧推",
  "上斜哑铃": "上斜哑铃卧推",
  "哑铃平板卧推": "哑铃卧推",
  "哑铃卧推": "哑铃卧推",
  "推胸": "器械推胸",
  "器械推胸": "器械推胸",
  "飞鸟": "反向飞鸟",
  "后束飞鸟": "反向飞鸟",
  "推肩": "哑铃推肩",
  "哑铃推肩": "哑铃推肩",
  "肩推": "器械推肩",
  "器械肩推": "器械推肩",
  "推举": "杠铃推举",
  "杠铃推举": "杠铃推举",
  "阿诺德": "阿诺德推举",
  "侧平举": "哑铃侧平举",
  "绳索侧平举": "绳索侧平举",
  "面拉": "面拉",
  "划船": "坐姿划船",
  "坐姿划船": "坐姿划船",
  "器械划船": "器械划船",
  "杠铃划船": "杠铃划船",
  "哑铃划船": "哑铃划船",
  "t杠划船": "T杠划船",
  "引体": "引体向上",
  "引体向上": "引体向上",
  "深蹲": "杠铃深蹲",
  "杠铃深蹲": "杠铃深蹲",
  "史密斯深蹲": "史密斯深蹲",
  "腿举": "腿举",
  "弓步": "弓步蹲",
  "弓步蹲": "弓步蹲",
  "分腿蹲": "保加利亚分腿蹲",
  "保加利亚": "保加利亚分腿蹲",
  "腿弯举": "坐姿腿弯举",
  "腿屈伸": "坐姿腿屈伸",
  "硬拉": "罗马尼亚硬拉",
  "罗马尼亚硬拉": "罗马尼亚硬拉",
  "单腿硬拉": "单腿罗马尼亚硬拉",
  "臀桥": "臀桥",
  "夹胸": "绳索夹胸",
  "绳索夹胸": "绳索夹胸"
};

const voiceMuscleKeywords = [
  { muscle: "胸", keywords: ["胸部", "胸肌", "练胸", "胸"] },
  { muscle: "肩", keywords: ["肩部", "肩膀", "练肩", "肩"] },
  { muscle: "背", keywords: ["背部", "背阔", "练背", "背"] },
  { muscle: "臀腿", keywords: ["臀腿", "腿部", "下肢", "练腿", "臀", "腿"] }
];

const voiceExerciseKeywordIndex = buildVoiceExerciseKeywordIndex();
const VOICE_PLAN_API_ENDPOINT = "/api/voice-plan";

persistRecords();
renderExercises();
setTodayHeader();
rebuildList();
updateStats();
updateLoadLastBtn();
updateDraftBanner();

document.getElementById("muscle-pills").addEventListener("click", function (e) {
  const btn = e.target.closest(".pill");
  if (!btn) return;
  setMuscle(btn.dataset.value);
});

document.getElementById("manual-arrange-btn").onclick = function () {
  if (isExerciseSectionOpen()) hideExerciseSection();
  else showExerciseSection();
};

document.getElementById("start-workout-btn").onclick = function () {
  if (!hasSelectedExercises()) {
    applyPlanToEditor(getCurrentMuscle(), defaultPlans[getCurrentMuscle()], false);
    showToast("已使用默认训练结构");
  }

  const plan = collectExercisesForWorkout();
  if (!plan.length) {
    showToast("当前部位还没有可用动作");
    return;
  }

  startWorkoutSession(plan);
};

document.getElementById("backfill-open-btn").onclick = function () {
  openBackfill();
};

document.getElementById("backfill-cancel-btn").onclick = function () {
  resetComposer();
};

document.getElementById("backfill-save-btn").onclick = function () {
  saveBackfillRecord();
};

document.getElementById("draft-resume-btn").onclick = function () {
  resumeDraft();
};

document.getElementById("draft-discard-btn").onclick = function () {
  clearDraft();
};

document.getElementById("voice-open-btn").onclick = openVoiceModal;
document.getElementById("voice-modal-close").onclick = closeVoiceModal;
document.getElementById("voice-modal").onclick = function (e) {
  if (e.target === this) closeVoiceModal();
};
document.getElementById("voice-start-btn").onclick = function () {
  startVoiceRecognition();
};
document.getElementById("voice-stop-btn").onclick = function () {
  stopVoiceRecognition();
};
document.getElementById("voice-parse-btn").onclick = function () {
  parseVoicePlanInput();
};
document.getElementById("voice-import-btn").onclick = function () {
  if (!appState.voice.plan || !appState.voice.plan.exercises || !appState.voice.plan.exercises.length) {
    showToast("请先识别训练计划");
    return;
  }
  applyPlanToEditor(appState.voice.plan.muscle, appState.voice.plan.exercises, true);
  closeVoiceModal();
  showToast("训练计划已导入");
};
document.getElementById("voice-reset-btn").onclick = function () {
  appState.voice.plan = null;
  resetVoiceResultView();
  setVoiceStatus(getVoiceSupportMessage());
};

document.getElementById("progress-exercise-select").addEventListener("change", function () {
  renderProgressPanel();
});

document.getElementById("export-btn").onclick = function () {
  const data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    records: appState.data.records
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "training-" + getTodayStr() + ".json";
  link.click();
  URL.revokeObjectURL(url);
};

document.getElementById("import-file").onchange = function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    try {
      const parsed = JSON.parse(ev.target.result);
      const incoming = Array.isArray(parsed) ? parsed : parsed.records;
      const normalized = sanitizeRecords(incoming || []);
      const existing = {};
      let added = 0;

      appState.data.records.forEach(function (record) {
        existing[getRecordKey(record)] = true;
      });

      normalized.forEach(function (record) {
        const key = getRecordKey(record);
        if (existing[key]) return;
        appState.data.records.push(record);
        existing[key] = true;
        added++;
      });

      persistRecords();
      rebuildList();
      updateStats();
      updateLoadLastBtn();
      showToast("导入成功，新增 " + added + " 条记录");
    } catch (err) {
      showToast("解析失败，请检查文件");
    }

    e.target.value = "";
  };
  reader.readAsText(file);
};

document.getElementById("compare-modal-close").onclick = closeCompareModal;
document.getElementById("compare-modal").onclick = function (e) {
  if (e.target === this) closeCompareModal();
};

document.getElementById("wm-exit-btn").onclick = function () {
  clearInterval(appState.workout.restTimer);
  clearTimeout(appState.workout.exDoneTimer);
  appState.workout.restEndTime = 0;

  if (hasWorkoutProgress()) {
    saveDraft();
    showToast("已保存草稿");
  }

  document.getElementById("workout-overlay").style.display = "none";
};

document.getElementById("wm-done-btn").onclick = function () {
  const exercise = appState.workout.exercises[appState.workout.exIdx];
  const actualWeight = document.getElementById("wm-input-weight").value || exercise.weight;
  const actualReps = document.getElementById("wm-input-reps").value || getRepInputValue(exercise.reps);
  const restSecs = parseInt(document.getElementById("wm-input-rest").value, 10) || parseInt(exercise.rest, 10) || 90;

  appState.workout.restTotal = restSecs;
  appState.workout.sessionLog[appState.workout.exIdx].completedSets.push({
    setNumber: appState.workout.setDone + 1,
    weight: actualWeight,
    reps: actualReps,
    restSeconds: restSecs
  });

  appState.workout.setDone++;
  wmAutoSave();

  if (appState.workout.setDone >= exercise.sets) {
    clearInterval(appState.workout.restTimer);
    wmShow("ex-done");
  } else {
    wmShow("resting");
  }
};

document.getElementById("wm-skip-btn").onclick = function () {
  clearInterval(appState.workout.restTimer);
  appState.workout.restEndTime = 0;
  wmShow("working");
};

document.getElementById("wm-extend-rest-btn").onclick = function () {
  appState.workout.restEndTime += 30000;
  appState.workout.restTotal += 30;
  wmTickRest();
};

document.getElementById("wm-skip-ex-btn").onclick = function () {
  wmSkipCurrentExercise();
};

document.getElementById("wm-skip-ex-rest-btn").onclick = function () {
  wmSkipCurrentExercise();
};

document.getElementById("wm-next-ex-btn").onclick = function () {
  wmAdvanceToNextExercise();
};

document.getElementById("wm-finish-btn").onclick = function () {
  clearInterval(appState.workout.restTimer);
  clearTimeout(appState.workout.exDoneTimer);
  appState.workout.restEndTime = 0;
  appState.workout.finishedAt = new Date().toISOString();
  wmAutoSave({ isFinal: true });
  clearDraft();
  document.getElementById("workout-overlay").style.display = "none";
  showToast("训练已记录");
};

document.addEventListener("visibilitychange", function () {
  if (!document.hidden && appState.workout.restEndTime > 0 && appState.workout.restTimer) {
    wmTickRest();
  }
});

function setTodayHeader() {
  const today = getTodayStr();
  document.getElementById("today-date").textContent = today.replace(/-/g, " / ");
}

function getTodayStr() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

function getCurrentMuscle() {
  return normalizeMuscle(document.getElementById("muscle").value);
}

function normalizeMuscle(value) {
  if (value === "臀") return "臀腿";
  return exerciseLibrary[value] ? value : "胸";
}

function parseDateString(value) {
  return new Date(value + "T00:00:00");
}

function sanitizeRecords(list) {
  if (!Array.isArray(list)) return [];
  return list.map(normalizeRecord).filter(Boolean);
}

function isLegacyGymRecord(record) {
  return !record.type || record.type === "健身";
}

function normalizeRecord(record) {
  if (!record || typeof record !== "object") return null;
  if (!isLegacyGymRecord(record)) return null;

  const date = typeof record.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.date)
    ? record.date
    : getTodayStr();
  const muscle = normalizeMuscle(record.muscle);
  const plannedExercises = Array.isArray(record.plannedExercises)
    ? record.plannedExercises.map(normalizeExercise).filter(Boolean)
    : [];
  const sessionLog = Array.isArray(record.sessionLog)
    ? record.sessionLog.map(normalizeSessionLogItem).filter(Boolean)
    : [];
  const exercises = Array.isArray(record.exercises)
    ? record.exercises.map(normalizeExercise).filter(Boolean)
    : buildExercisesFromSessionLog(sessionLog);
  const totalVolume = record.totalVolume === undefined || record.totalVolume === null || record.totalVolume === ""
    ? getSessionLogVolume(sessionLog)
    : Number(record.totalVolume) || 0;

  return {
    date: date,
    muscle: muscle,
    exercises: exercises,
    plannedExercises: plannedExercises,
    sessionLog: sessionLog,
    totalVolume: totalVolume,
    startedAt: typeof record.startedAt === "string" ? record.startedAt : "",
    finishedAt: typeof record.finishedAt === "string" ? record.finishedAt : "",
    note: record.note || "",
    content: record.content || buildContent(muscle, exercises),
    _wmSession: !!record._wmSession
  };
}

function normalizeExercise(exercise) {
  if (!exercise || !exercise.name) return null;
  return {
    name: normalizeExerciseName(exercise.name),
    weight: exercise.weight === undefined || exercise.weight === null ? "" : String(exercise.weight),
    sets: exercise.sets === undefined || exercise.sets === null ? "" : String(exercise.sets),
    reps: exercise.reps === undefined || exercise.reps === null ? "" : String(exercise.reps),
    rest: exercise.rest === undefined || exercise.rest === null ? "" : String(exercise.rest),
    intensity: exercise.intensity || "",
    progression: exercise.progression || ""
  };
}

function normalizeCompletedSet(set) {
  if (!set || typeof set !== "object") return null;
  return {
    setNumber: parseInt(set.setNumber, 10) || 1,
    weight: set.weight === undefined || set.weight === null ? "" : String(set.weight),
    reps: set.reps === undefined || set.reps === null ? "" : String(set.reps),
    restSeconds: parseInt(set.restSeconds, 10) || 0
  };
}

function normalizeSessionLogItem(item) {
  if (!item || !item.name) return null;
  return {
    name: normalizeExerciseName(item.name),
    targetWeight: item.targetWeight === undefined || item.targetWeight === null ? "" : String(item.targetWeight),
    targetSets: item.targetSets === undefined || item.targetSets === null ? "" : String(item.targetSets),
    targetReps: item.targetReps === undefined || item.targetReps === null ? "" : String(item.targetReps),
    targetRest: item.targetRest === undefined || item.targetRest === null ? "" : String(item.targetRest),
    intensity: item.intensity || "",
    progression: item.progression || "",
    completedSets: Array.isArray(item.completedSets)
      ? item.completedSets.map(normalizeCompletedSet).filter(Boolean)
      : []
  };
}

function buildExercisesFromSessionLog(sessionLog) {
  return (sessionLog || []).filter(function (item) {
    return item.completedSets && item.completedSets.length;
  }).map(function (item) {
    const lastSet = item.completedSets[item.completedSets.length - 1];
    return normalizeExercise({
      name: item.name,
      weight: lastSet.weight,
      sets: String(item.completedSets.length),
      reps: lastSet.reps,
      rest: item.targetRest,
      intensity: item.intensity,
      progression: item.progression
    });
  }).filter(Boolean);
}

function getSessionLogVolume(sessionLog) {
  return (sessionLog || []).reduce(function (sum, item) {
    return sum + (item.completedSets || []).reduce(function (setSum, set) {
      const weight = parseWeightNumber(set.weight);
      const reps = parseInt(set.reps, 10) || 0;
      if (weight === null || !reps) return setSum;
      return setSum + weight * reps;
    }, 0);
  }, 0);
}

function persistRecords() {
  localStorage.setItem("records", JSON.stringify(appState.data.records));
}

function getRecordExercises(record) {
  if (record && record.exercises && record.exercises.length) return record.exercises;
  return buildExercisesFromSessionLog(record && record.sessionLog ? record.sessionLog : []);
}

function getRecordKey(record) {
  const exerciseNames = getRecordExercises(record).map(function (exercise) {
    return exercise.name;
  }).join("/");
  return [record.date, record.muscle, exerciseNames].join("|");
}

function buildContent(muscle, exercises) {
  if (!exercises || !exercises.length) return muscle + "训练";
  return muscle + "：" + exercises.map(function (exercise) {
    const parts = [];
    if (exercise.weight) parts.push(exercise.weight + "kg");
    if (exercise.sets) parts.push(exercise.sets + "组");
    if (exercise.reps) parts.push(exercise.reps + "次");
    return exercise.name + (parts.length ? "（" + parts.join(" ") + "）" : "");
  }).join("、");
}

function setMuscle(value) {
  const muscle = normalizeMuscle(value);
  document.getElementById("muscle").value = muscle;
  document.querySelectorAll("#muscle-pills .pill").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.value === muscle);
  });
  renderExercises();
  updateLoadLastBtn();
}

function renderExercises() {
  const muscle = getCurrentMuscle();
  const list = document.getElementById("exercise-list");
  list.innerHTML = "";

  exerciseLibrary[muscle].forEach(function (exercise) {
    const row = document.createElement("div");
    row.className = "exercise-row";

    const label = document.createElement("label");
    label.className = "ex-label";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = exercise.name;
    checkbox.addEventListener("change", function () {
      row.classList.toggle("is-checked", this.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(exercise.name));

    const details = document.createElement("div");
    details.className = "exercise-details";
    details.innerHTML =
      '<div class="ex-input-group"><span class="ex-input-label">KG</span><input type="number" class="input-weight" min="0"></div>' +
      '<div class="ex-input-group"><span class="ex-input-label">组</span><input type="number" class="input-sets" min="0"></div>' +
      '<div class="ex-input-group"><span class="ex-input-label">次</span><input type="number" class="input-reps" min="0"></div>';

    row.appendChild(label);
    row.appendChild(details);
    list.appendChild(row);
  });
}

function isExerciseSectionOpen() {
  return document.getElementById("exercise-section").style.display === "flex";
}

function showExerciseSection() {
  document.getElementById("exercise-section").style.display = "flex";
  document.getElementById("manual-arrange-btn").textContent = "收起动作编辑";
  updateLoadLastBtn();
}

function hideExerciseSection() {
  document.getElementById("exercise-section").style.display = "none";
  document.getElementById("manual-arrange-btn").textContent = "自己选动作";
}

function updateLoadLastBtn() {
  const btn = document.getElementById("load-last-btn");
  const last = getLastRecord(getCurrentMuscle());
  if (!btn) return;
  btn.style.display = last ? "inline-flex" : "none";
}

function getLastRecord(muscle) {
  for (let i = appState.data.records.length - 1; i >= 0; i--) {
    if (appState.data.records[i].muscle === muscle && getRecordExercises(appState.data.records[i]).length) {
      return appState.data.records[i];
    }
  }
  return null;
}

function applyPlanToEditor(muscle, plan, shouldShowSection) {
  setMuscle(muscle);

  const planMap = {};
  appState.composer.planMeta = {};
  (plan || []).forEach(function (exercise) {
    const normalized = normalizeExercise(exercise);
    if (normalized) {
      planMap[normalized.name] = normalized;
      appState.composer.planMeta[normalized.name] = {
        rest: exercise.rest || "",
        intensity: exercise.intensity || "",
        progression: exercise.progression || "",
        reps: exercise.reps !== undefined ? String(exercise.reps) : normalized.reps
      };
    }
  });

  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    const checkbox = row.querySelector("input[type='checkbox']");
    const selected = planMap[checkbox.value];

    checkbox.checked = !!selected;
    row.classList.toggle("is-checked", !!selected);
    row.querySelector(".input-weight").value = selected ? selected.weight : "";
    row.querySelector(".input-sets").value = selected ? selected.sets : "";
    row.querySelector(".input-reps").value = selected ? getRepInputValue(selected.reps) : "";
  });

  if (shouldShowSection) showExerciseSection();
}

function hasSelectedExercises() {
  return !!document.querySelector("#exercise-list .exercise-row input[type='checkbox']:checked");
}

function collectSelectedExercises() {
  const selected = [];
  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    const checkbox = row.querySelector("input[type='checkbox']");
    if (!checkbox.checked) return;
    const meta = appState.composer.planMeta[checkbox.value] || {};
    selected.push({
      name: checkbox.value,
      weight: row.querySelector(".input-weight").value,
      sets: row.querySelector(".input-sets").value,
      reps: meta.reps || row.querySelector(".input-reps").value,
      rest: meta.rest || "",
      intensity: meta.intensity || "",
      progression: meta.progression || ""
    });
  });
  return selected;
}

function collectExercisesForWorkout() {
  return collectSelectedExercises().map(function (exercise) {
    return {
      name: exercise.name,
      weight: exercise.weight || "—",
      sets: parseInt(exercise.sets, 10) || 3,
      reps: exercise.reps || "—",
      rest: parseInt(exercise.rest, 10) || 90,
      intensity: exercise.intensity || "",
      progression: exercise.progression || ""
    };
  });
}

function openBackfill(date) {
  document.getElementById("backfill-section").style.display = "flex";
  document.getElementById("backfill-open-btn").style.display = "none";
  document.getElementById("backfill-date").value = date || getYesterdayStr();
  document.getElementById("backfill-save-btn").textContent = appState.composer.editingIndex >= 0 ? "保存修改" : "保存补录";
  showExerciseSection();
}

function getYesterdayStr() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

function resetComposer() {
  appState.composer.editingIndex = -1;
  document.getElementById("backfill-section").style.display = "none";
  document.getElementById("backfill-open-btn").style.display = "inline-block";
  document.getElementById("backfill-save-btn").textContent = "保存补录";
  clearExerciseInputs();
  hideExerciseSection();
}

function clearExerciseInputs() {
  appState.composer.planMeta = {};
  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    row.classList.remove("is-checked");
    row.querySelectorAll("input").forEach(function (input) {
      if (input.type === "checkbox") input.checked = false;
      else input.value = "";
    });
  });
}

function saveBackfillRecord() {
  const date = document.getElementById("backfill-date").value;
  const exercises = collectSelectedExercises();
  const muscle = getCurrentMuscle();
  const isEditing = appState.composer.editingIndex >= 0;
  let record;

  if (!date) {
    showToast("请填写日期");
    return;
  }

  if (!exercises.length) {
    showToast("请先选择至少一个动作");
    return;
  }

  record = {
    date: date,
    muscle: muscle,
    exercises: exercises,
    note: "",
    content: buildContent(muscle, exercises),
    _wmSession: false
  };

  if (isEditing) {
    appState.data.records[appState.composer.editingIndex] = record;
  } else {
    appState.data.records.push(record);
  }

  persistRecords();
  rebuildList();
  updateStats();
  updateLoadLastBtn();
  resetComposer();
  showToast(isEditing ? "已保存修改" : "已保存补录");
}

function rebuildList() {
  const list = document.getElementById("list");
  const sorted = appState.data.records.map(function (record, index) {
    return { record: record, index: index };
  });

  list.innerHTML = "";
  sorted.sort(function (a, b) {
    return parseDateString(b.record.date).getTime() - parseDateString(a.record.date).getTime();
  });

  sorted.forEach(function (item) {
    addToList(item.record, item.index);
  });
}

function addToList(record, index) {
  const recordExercises = getRecordExercises(record);
  const li = document.createElement("li");
  li.className = "record-card";
  li.setAttribute("data-index", index);

  const header = document.createElement("div");
  header.className = "card-header";

  const headerLeft = document.createElement("div");
  headerLeft.className = "card-header-left";

  const tag = document.createElement("span");
  tag.className = "card-tag " + (muscleTagClass[record.muscle] || "muscle-chest");
  tag.textContent = record.muscle;

  const date = document.createElement("span");
  date.className = "card-date";
  date.textContent = record.date;

  const buttonGroup = document.createElement("div");
  buttonGroup.className = "btn-group";

  if (recordExercises.length) {
    const compareBtn = document.createElement("button");
    compareBtn.className = "cmp-btn";
    compareBtn.textContent = "对比上次";
    compareBtn.onclick = function () {
      showCompare(appState.data.records[index], index);
    };
    buttonGroup.appendChild(compareBtn);
  }

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "编辑";
  editBtn.onclick = function () {
    loadRecordToComposer(index);
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "del-btn";
  deleteBtn.textContent = "删除";
  deleteBtn.onclick = function () {
    deleteRecord(index);
  };

  buttonGroup.appendChild(editBtn);
  buttonGroup.appendChild(deleteBtn);

  headerLeft.appendChild(tag);
  headerLeft.appendChild(date);
  header.appendChild(headerLeft);
  header.appendChild(buttonGroup);

  const body = document.createElement("div");
  body.className = "card-body";

  if (recordExercises.length) {
    recordExercises.forEach(function (exercise) {
      const row = document.createElement("div");
      row.className = "card-ex-row";

      const name = document.createElement("span");
      name.className = "card-ex-name";
      name.textContent = exercise.name;

      const detail = document.createElement("span");
      detail.className = "card-ex-detail";
      const parts = [];
      if (exercise.weight) parts.push(exercise.weight + " kg");
      if (exercise.sets) parts.push(exercise.sets + " 组");
      if (exercise.reps) parts.push(exercise.reps + " 次");
      detail.textContent = parts.join(" × ");

      row.appendChild(name);
      row.appendChild(detail);
      body.appendChild(row);
    });
  } else {
    const content = document.createElement("div");
    content.className = "card-content";
    content.textContent = record.content || "";
    body.appendChild(content);
  }

  li.appendChild(header);
  li.appendChild(body);
  document.getElementById("list").appendChild(li);
}

function loadRecordToComposer(index) {
  const record = appState.data.records[index];
  appState.composer.editingIndex = index;
  setMuscle(record.muscle);
  openBackfill(record.date);
  applyPlanToEditor(record.muscle, record.plannedExercises && record.plannedExercises.length ? record.plannedExercises : getRecordExercises(record), true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteRecord(index) {
  if (appState.composer.editingIndex === index) {
    resetComposer();
  } else if (appState.composer.editingIndex > index) {
    appState.composer.editingIndex--;
  }

  appState.data.records.splice(index, 1);
  persistRecords();
  rebuildList();
  updateStats();
  updateLoadLastBtn();
}

function updateStats() {
  const today = parseDateString(getTodayStr());
  const weekStart = new Date(today);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  let day = weekStart.getDay();

  if (day === 0) day = 7;
  weekStart.setDate(weekStart.getDate() - day + 1);
  weekStart.setHours(0, 0, 0, 0);

  let weekCount = 0;
  let monthCount = 0;

  appState.data.records.forEach(function (record) {
    const date = parseDateString(record.date);
    if (date >= weekStart) weekCount++;
    if (date >= monthStart) monthCount++;
  });

  document.getElementById("total").textContent = appState.data.records.length;
  document.getElementById("count-week").textContent = weekCount;
  document.getElementById("count-month").textContent = monthCount;
  document.getElementById("record-count").textContent = appState.data.records.length + " 条";
  renderProgressPanel();
}

function formatShortDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.slice(5).replace("-", "/");
}

function getExerciseSessionData(record, exerciseName) {
  const normalizedName = normalizeExerciseName(exerciseName);
  const sessionLog = record.sessionLog || [];

  for (let i = 0; i < sessionLog.length; i++) {
    const item = sessionLog[i];
    if (normalizeExerciseName(item.name) !== normalizedName) continue;
    if (!item.completedSets || !item.completedSets.length) return null;

    return {
      date: record.date,
      weight: item.completedSets.reduce(function (maxWeight, set) {
        const weight = parseWeightNumber(set.weight);
        if (weight === null) return maxWeight;
        return Math.max(maxWeight, weight);
      }, 0),
      volume: item.completedSets.reduce(function (sum, set) {
        const weight = parseWeightNumber(set.weight);
        const reps = parseInt(set.reps, 10) || 0;
        if (weight === null || !reps) return sum;
        return sum + weight * reps;
      }, 0),
      sets: item.completedSets.length
    };
  }

  return null;
}

function getExerciseSummaryData(record, exerciseName) {
  const normalizedName = normalizeExerciseName(exerciseName);
  const exercises = getRecordExercises(record);

  for (let i = 0; i < exercises.length; i++) {
    const exercise = exercises[i];
    if (normalizeExerciseName(exercise.name) !== normalizedName) continue;

    const weight = parseWeightNumber(exercise.weight);
    const sets = parseInt(exercise.sets, 10) || 0;
    const reps = parseInt(getRepInputValue(exercise.reps), 10) || 0;

    return {
      date: record.date,
      weight: weight === null ? 0 : weight,
      volume: weight === null || !sets || !reps ? 0 : weight * sets * reps,
      sets: sets
    };
  }

  return null;
}

function getExerciseTrendData(exerciseName, limit) {
  const data = [];
  const sorted = appState.data.records.slice().sort(function (a, b) {
    return parseDateString(a.date).getTime() - parseDateString(b.date).getTime();
  });

  sorted.forEach(function (record) {
    const point = getExerciseSessionData(record, exerciseName) || getExerciseSummaryData(record, exerciseName);
    if (point) data.push(point);
  });

  return limit ? data.slice(-limit) : data;
}

function getTrackedExerciseNames() {
  const seen = {};
  const names = [];

  for (let i = appState.data.records.length - 1; i >= 0; i--) {
    getRecordExercises(appState.data.records[i]).forEach(function (exercise) {
      const name = normalizeExerciseName(exercise.name);
      if (seen[name]) return;
      seen[name] = true;
      names.push(name);
    });
  }

  return names;
}

function renderTrendChart(containerId, data, metric, variant) {
  const container = document.getElementById(containerId);
  const max = data.reduce(function (currentMax, item) {
    return Math.max(currentMax, item[metric] || 0);
  }, 0);
  let bars;

  clearNode(container);

  if (!data.length) {
    const empty = document.createElement("div");
    empty.className = "trend-empty";
    empty.textContent = "还没有足够的训练数据";
    container.appendChild(empty);
    return;
  }

  bars = document.createElement("div");
  bars.className = "trend-bars";

  data.forEach(function (item) {
    const col = document.createElement("div");
    const value = document.createElement("div");
    const wrap = document.createElement("div");
    const bar = document.createElement("div");
    const label = document.createElement("div");
    const height = max ? Math.max(14, Math.round((item[metric] || 0) / max * 120)) : 14;
    const valueText = metric === "weight"
      ? formatWeightValue(item.weight) + "kg"
      : formatWeightValue(item.volume) + "kg";

    col.className = "trend-col";
    value.className = "trend-value";
    value.textContent = valueText;
    wrap.className = "trend-bar-wrap";
    bar.className = "trend-bar " + variant;
    bar.style.height = height + "px";
    label.className = "trend-label";
    label.textContent = formatShortDate(item.date);

    wrap.appendChild(bar);
    col.appendChild(value);
    col.appendChild(wrap);
    col.appendChild(label);
    bars.appendChild(col);
  });

  container.appendChild(bars);
}

function getMuscleFrequencyData(days) {
  const cutoff = parseDateString(getTodayStr());
  const counts = { 胸: 0, 肩: 0, 背: 0, 臀腿: 0 };
  cutoff.setDate(cutoff.getDate() - (days - 1));

  appState.data.records.forEach(function (record) {
    if (parseDateString(record.date) < cutoff) return;
    if (!getRecordExercises(record).length) return;
    counts[normalizeMuscle(record.muscle)]++;
  });

  return ["胸", "肩", "背", "臀腿"].map(function (muscle) {
    return { muscle: muscle, count: counts[muscle] || 0 };
  });
}

function renderFrequencyList() {
  const list = document.getElementById("progress-frequency-list");
  const data = getMuscleFrequencyData(28);
  const max = data.reduce(function (currentMax, item) {
    return Math.max(currentMax, item.count);
  }, 0);

  clearNode(list);

  data.forEach(function (item) {
    const row = document.createElement("div");
    const name = document.createElement("span");
    const track = document.createElement("div");
    const fill = document.createElement("div");
    const count = document.createElement("span");
    const width = max ? Math.max(8, Math.round(item.count / max * 100)) : 0;

    row.className = "frequency-row";
    name.className = "frequency-name";
    name.textContent = item.muscle;
    track.className = "frequency-track";
    fill.className = "frequency-fill";
    fill.style.width = width + "%";
    count.className = "frequency-count";
    count.textContent = item.count + " 次";

    track.appendChild(fill);
    row.appendChild(name);
    row.appendChild(track);
    row.appendChild(count);
    list.appendChild(row);
  });
}

function renderProgressSelectOptions(select, names, currentValue) {
  clearNode(select);

  if (!names.length) {
    const emptyOption = document.createElement("option");
    emptyOption.value = "";
    emptyOption.textContent = "暂无动作数据";
    select.appendChild(emptyOption);
    return "";
  }

  names.forEach(function (name) {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });

  return names.indexOf(currentValue) >= 0 ? currentValue : names[0];
}

function renderProgressPanel() {
  const select = document.getElementById("progress-exercise-select");
  const names = getTrackedExerciseNames();
  let currentValue;
  let data;
  let latest;
  let bestWeight;

  if (!select) return;
  currentValue = renderProgressSelectOptions(select, names, select.value);

  if (!names.length) {
    document.getElementById("progress-latest-weight").textContent = "-";
    document.getElementById("progress-best-weight").textContent = "-";
    document.getElementById("progress-latest-volume").textContent = "-";
    renderTrendChart("progress-weight-chart", [], "weight", "");
    renderTrendChart("progress-volume-chart", [], "volume", "volume");
    renderFrequencyList();
    return;
  }

  select.value = currentValue;
  data = getExerciseTrendData(select.value, 8);
  latest = data.length ? data[data.length - 1] : null;
  bestWeight = data.reduce(function (maxWeight, item) {
    return Math.max(maxWeight, item.weight || 0);
  }, 0);

  document.getElementById("progress-latest-weight").textContent =
    latest ? formatWeightValue(latest.weight) + "kg" : "-";
  document.getElementById("progress-best-weight").textContent =
    data.length ? formatWeightValue(bestWeight) + "kg" : "-";
  document.getElementById("progress-latest-volume").textContent =
    latest ? formatWeightValue(latest.volume) + "kg" : "-";

  renderTrendChart("progress-weight-chart", data, "weight", "");
  renderTrendChart("progress-volume-chart", data, "volume", "volume");
  renderFrequencyList();
}

function findExerciseDefinition(name) {
  const normalizedName = normalizeExerciseName(name);
  const muscles = Object.keys(exerciseLibrary);

  for (let i = 0; i < muscles.length; i++) {
    const match = exerciseLibrary[muscles[i]].find(function (exercise) {
      return exercise.name === normalizedName;
    });
    if (match) return match;
  }

  return null;
}

function parseWeightNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatWeightValue(value) {
  if (value === undefined || value === null || value === "") return "";
  if (!Number.isFinite(value)) return String(value);
  if (Math.abs(value) < 0.001) return "0";
  return Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
}

function toRepRange(value) {
  if (typeof value === "string" && value.indexOf("-") >= 0) return value;
  const reps = parseInt(value, 10);
  if (!reps) return "";
  if (reps <= 10) return reps + "-" + (reps + 2);
  if (reps <= 12) return reps + "-" + (reps + 3);
  return reps + "-" + (reps + 5);
}

function getRepInputValue(repsRange) {
  if (repsRange === undefined || repsRange === null) return "";
  const range = String(repsRange);
  if (range.indexOf("-") === -1) return range;
  return range.split("-")[0];
}

function parseRepRange(value) {
  const range = String(value || "");
  let parts;
  let low;
  let high;

  if (!range) return { low: 0, high: 0 };
  if (range.indexOf("-") === -1) {
    low = parseInt(range, 10) || 0;
    return { low: low, high: low };
  }

  parts = range.split("-");
  low = parseInt(parts[0], 10) || 0;
  high = parseInt(parts[1], 10) || low;
  return { low: low, high: high };
}

function getLastWorkoutByMuscle(muscle, options) {
  const targetMuscle = normalizeMuscle(muscle);
  const shouldExcludeCurrentSession = options && options.excludeCurrentSession;
  const today = getTodayStr();

  for (let i = appState.data.records.length - 1; i >= 0; i--) {
    const record = appState.data.records[i];
    if (record.muscle !== targetMuscle || !getRecordExercises(record).length) continue;
    if (shouldExcludeCurrentSession && record._wmSession && record.date === today && record.muscle === targetMuscle) continue;
    return record;
  }

  return null;
}

function getExerciseHistory(exerciseName, limit, options) {
  const history = [];
  const normalizedName = normalizeExerciseName(exerciseName);
  const targetMuscle = options && options.muscle ? normalizeMuscle(options.muscle) : "";
  const shouldExcludeCurrentSession = options && options.excludeCurrentSession;
  const today = getTodayStr();

  for (let i = appState.data.records.length - 1; i >= 0; i--) {
    const record = appState.data.records[i];
    const exercises = getRecordExercises(record);

    if (targetMuscle && record.muscle !== targetMuscle) continue;
    if (shouldExcludeCurrentSession && record._wmSession && record.date === today && (!targetMuscle || record.muscle === targetMuscle)) continue;

    for (let j = 0; j < exercises.length; j++) {
      const exercise = exercises[j];
      if (normalizeExerciseName(exercise.name) !== normalizedName) continue;
      history.push({
        name: normalizedName,
        date: record.date,
        muscle: record.muscle,
        weight: exercise.weight,
        weightNum: parseWeightNumber(exercise.weight),
        sets: exercise.sets,
        setsNum: parseInt(exercise.sets, 10) || 0,
        reps: exercise.reps,
        repsNum: parseInt(exercise.reps, 10) || 0
      });
      break;
    }

    if (limit && history.length >= limit) break;
  }

  return history;
}

function getLastExerciseData(exerciseName, options) {
  const history = getExerciseHistory(exerciseName, 1, options);
  return history.length ? history[0] : null;
}

function getHistoryWeight(name) {
  const last = getLastExerciseData(name);
  return last ? last.weightNum : null;
}

function getDefaultInitialWeight(template) {
  const baseWeight = parseWeightNumber(template.weight);
  return baseWeight === null ? "" : formatWeightValue(baseWeight);
}

function getAiIntensity(goal, status) {
  if (goal === "恢复") return "RPE 6-7，动作质量优先";
  if (status === "push") return "RPE 8，最后 1 组保留 1 次余力";
  if (status === "hold") return "RPE 7-8，稳定完成所有组";
  return "RPE 7，先把动作和次数做稳";
}

function getAiRestSeconds(exerciseName, goal, status) {
  const exercise = findExerciseDefinition(exerciseName);
  if (!exercise) return goal === "增肌" ? 90 : 75;
  if (exercise.type === "复合") {
    if (status === "reduce") return 120;
    return goal === "增肌" ? 120 : 90;
  }
  return goal === "恢复" ? 60 : 75;
}

function getWeightStep(exerciseName) {
  const exercise = findExerciseDefinition(exerciseName);
  if (!exercise) return 2.5;
  if (exercise.equipment === "杠铃") return 2.5;
  if (exercise.equipment === "哑铃") return 2;
  if (exercise.equipment === "器械" || exercise.equipment === "绳索") return 5;
  return 0;
}

function bumpWeight(weight, exerciseName, factor) {
  const step = getWeightStep(exerciseName);
  const next = weight * factor;
  let rounded;
  if (!step) return next;
  rounded = Math.round(next / step) * step;
  if (factor > 1 && rounded <= weight) return weight + step;
  if (factor < 1 && rounded >= weight) return Math.max(0, weight - step);
  return rounded;
}

function getProgressionHint(exerciseName, status, baseWeight) {
  const exercise = findExerciseDefinition(exerciseName);
  let nextWeight;
  if (exercise && exercise.equipment === "徒手") {
    return "如果全部完成，下次先增加 1-2 次，或增加轻负重。";
  }
  if (baseWeight === null) {
    return "如果全部完成，下次加 2%-5% 或上调 1 档。";
  }
  if (status === "push") {
    nextWeight = formatWeightValue(bumpWeight(baseWeight, exerciseName, 1.03));
    return "如果全部完成，下次可以尝试 " + nextWeight + "kg。";
  }
  if (status === "reduce") {
    return "先保持动作稳定和次数达标，再考虑回到更高重量。";
  }
  return "先保持当前重量，把所有组都做到区间上限再加重。";
}

function getExerciseOutcome(lastExercise, repRange, targetSets) {
  if (!lastExercise) return "new";
  if (lastExercise.setsNum >= targetSets && lastExercise.repsNum >= repRange.high) return "push";
  if (lastExercise.repsNum < repRange.low || lastExercise.setsNum < targetSets) return "reduce";
  return "hold";
}

function getAiWeightSuggestion(template, goal, lastExercise, recentHistory, repRange, targetSets) {
  const baseWeight = lastExercise && lastExercise.weightNum !== null
    ? lastExercise.weightNum
    : parseWeightNumber(template.weight);
  let outcome = getExerciseOutcome(lastExercise, repRange, targetSets);
  const allStableRecent = recentHistory.length >= 4 && recentHistory.slice(0, 4).every(function (item) {
    return item.setsNum >= targetSets && item.repsNum >= repRange.low;
  });
  let nextWeight = baseWeight;

  if (baseWeight === null) {
    return {
      weight: getDefaultInitialWeight(template),
      status: "new"
    };
  }

  if (outcome === "push") {
    nextWeight = bumpWeight(baseWeight, template.name, allStableRecent ? 1.05 : 1.03);
  } else if (outcome === "reduce") {
    nextWeight = bumpWeight(baseWeight, template.name, 0.98);
  }

  if (goal === "恢复" && outcome === "push") {
    nextWeight = baseWeight;
    outcome = "hold";
  }

  return {
    weight: formatWeightValue(nextWeight),
    status: outcome
  };
}

function buildAiExercise(template, goal, lastWorkoutMap) {
  const normalizedName = normalizeExerciseName(template.name);
  const lastWorkoutExercise = lastWorkoutMap[normalizedName] || null;
  const lastExercise = getLastExerciseData(normalizedName) || lastWorkoutExercise;
  const targetSets = parseInt(template.sets, 10) || (lastWorkoutExercise ? parseInt(lastWorkoutExercise.sets, 10) : 0) || 3;
  const repRange = parseRepRange(toRepRange(template.reps || (lastWorkoutExercise ? lastWorkoutExercise.reps : "")));
  const recentHistory = getExerciseHistory(normalizedName, 4);
  const weightSuggestion = getAiWeightSuggestion(template, goal, lastExercise, recentHistory, repRange, targetSets);

  return {
    name: normalizedName,
    sets: targetSets,
    reps: repRange.low && repRange.high ? repRange.low + "-" + repRange.high : toRepRange(template.reps),
    weight: weightSuggestion.weight,
    rest: getAiRestSeconds(normalizedName, goal, weightSuggestion.status),
    intensity: getAiIntensity(goal, weightSuggestion.status),
    progression: getProgressionHint(normalizedName, weightSuggestion.status, parseWeightNumber(weightSuggestion.weight))
  };
}

function buildAiPlan(muscle, goal, duration) {
  const normalizedMuscle = normalizeMuscle(muscle);
  const basePlan = (mockPlans[normalizedMuscle] && mockPlans[normalizedMuscle][goal]) || defaultPlans[normalizedMuscle] || [];
  const lastWorkout = getLastWorkoutByMuscle(normalizedMuscle);
  const lastWorkoutMap = {};

  if (lastWorkout && lastWorkout.exercises) {
    lastWorkout.exercises.forEach(function (exercise) {
      lastWorkoutMap[normalizeExerciseName(exercise.name)] = exercise;
    });
  }

  return {
    muscle: normalizedMuscle,
    goal: goal,
    duration: parseInt(duration, 10) || 45,
    exercises: basePlan.map(function (exercise) {
      return buildAiExercise(exercise, goal, lastWorkoutMap);
    }),
    lastWorkoutDate: lastWorkout ? lastWorkout.date : ""
  };
}

function buildVoiceExerciseKeywordIndex() {
  const keywordMap = {};

  Object.keys(exerciseLibrary).forEach(function (muscle) {
    exerciseLibrary[muscle].forEach(function (exercise) {
      keywordMap[exercise.name] = normalizeExerciseName(exercise.name);
    });
  });

  Object.keys(EXERCISE_NAME_ALIASES).forEach(function (alias) {
    keywordMap[alias] = normalizeExerciseName(EXERCISE_NAME_ALIASES[alias]);
  });

  Object.keys(voiceExerciseAliases).forEach(function (alias) {
    keywordMap[alias] = normalizeExerciseName(voiceExerciseAliases[alias]);
  });

  return Object.keys(keywordMap).sort(function (a, b) {
    return b.length - a.length;
  }).map(function (keyword) {
    return {
      keyword: keyword,
      name: keywordMap[keyword]
    };
  });
}

function getVoiceSupportMessage() {
  return supportsVoiceRecognition()
    ? "支持浏览器原生语音识别；也可以直接在下方输入文字。"
    : "当前浏览器不支持原生语音识别，可以直接在下方输入训练计划。";
}

function supportsVoiceRecognition() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function setVoiceStatus(message) {
  document.getElementById("voice-status").textContent = message;
}

function resetVoiceResultView() {
  document.getElementById("voice-result").style.display = "none";
  document.getElementById("voice-result-title").textContent = "";
  document.getElementById("voice-result-meta").innerHTML = "";
  document.getElementById("voice-transcript").textContent = "";
  document.getElementById("voice-result-list").innerHTML = "";
}

function openVoiceModal() {
  appState.voice.plan = null;
  resetVoiceResultView();
  setVoiceStatus(getVoiceSupportMessage());
  document.getElementById("voice-modal").style.display = "flex";
}

function closeVoiceModal() {
  stopVoiceRecognition();
  document.getElementById("voice-modal").style.display = "none";
}

function ensureVoiceRecognition() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return null;
  if (appState.voice.recognition) return appState.voice.recognition;

  appState.voice.recognition = new Recognition();
  appState.voice.recognition.lang = "zh-CN";
  appState.voice.recognition.continuous = true;
  appState.voice.recognition.interimResults = true;

  appState.voice.recognition.onstart = function () {
    appState.voice.isListening = true;
    setVoiceStatus("正在听写，请继续说完整的训练计划。");
  };

  appState.voice.recognition.onresult = function (event) {
    let finalText = "";
    let interimText = "";
    const input = document.getElementById("voice-input");

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
      else interimText += event.results[i][0].transcript;
    }

    if (finalText) {
      input.value = normalizeVoiceTranscript((input.value + " " + finalText).replace(/\s+/g, " ").trim());
      setVoiceStatus("已转成文字，可以继续说，也可以直接识别训练计划。");
    } else if (interimText) {
      setVoiceStatus("正在识别：" + interimText);
    }
  };

  appState.voice.recognition.onerror = function (event) {
    appState.voice.isListening = false;
    setVoiceStatus("语音识别失败：" + (event.error || "请改用手动输入"));
  };

  appState.voice.recognition.onend = function () {
    appState.voice.isListening = false;
    if (document.getElementById("voice-modal").style.display === "flex") {
      setVoiceStatus(document.getElementById("voice-input").value.trim() ? "听写结束，可以识别训练计划了。" : getVoiceSupportMessage());
    }
  };

  return appState.voice.recognition;
}

function startVoiceRecognition() {
  const recognition = ensureVoiceRecognition();
  if (!recognition) {
    showToast("当前浏览器不支持语音识别");
    setVoiceStatus(getVoiceSupportMessage());
    return;
  }
  if (appState.voice.isListening) return;
  try {
    recognition.start();
  } catch (err) {
    setVoiceStatus("请稍等一下，再次点击开始听写。");
  }
}

function stopVoiceRecognition() {
  if (!appState.voice.recognition || !appState.voice.isListening) return;
  appState.voice.recognition.stop();
}

function normalizeVoiceTranscript(rawText) {
  let text = String(rawText || "");
  const replacements = [
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
    [/乘以|乘/g, "x"]
  ];

  replacements.forEach(function (item) {
    text = text.replace(item[0], item[1]);
  });

  return text.replace(/\s+/g, " ").trim();
}

function parseVoiceNumberToken(token) {
  const digitMap = { "零": 0, "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9 };
  let parts;
  let left;
  let right;

  if (!token) return 0;
  token = String(token).replace(/两/g, "二").trim();
  if (!token) return 0;
  if (/^\d+(?:\.\d+)?$/.test(token)) return Number(token);
  if (token === "十") return 10;
  if (token.indexOf("十") > -1) {
    parts = token.split("十");
    left = parts[0] ? (digitMap[parts[0]] || 0) : 1;
    right = parts[1] ? (digitMap[parts[1]] || 0) : 0;
    return left * 10 + right;
  }
  return digitMap[token] || 0;
}

function getVoiceMuscleFromExercise(name) {
  const exercise = findExerciseDefinition(name);
  if (!exercise) return "";
  if (exercise.muscle_primary === "肩后束") return "肩";
  if (exercise.muscle_primary === "二头") return "背";
  if (exercise.muscle_primary === "三头") return "胸";
  if (["股四头", "腿后侧", "臀", "小腿"].indexOf(exercise.muscle_primary) > -1) return "臀腿";
  return normalizeMuscle(exercise.muscle_primary);
}

function parseVoiceMuscle(text) {
  for (let i = 0; i < voiceMuscleKeywords.length; i++) {
    for (let j = 0; j < voiceMuscleKeywords[i].keywords.length; j++) {
      if (text.indexOf(voiceMuscleKeywords[i].keywords[j]) > -1) return voiceMuscleKeywords[i].muscle;
    }
  }
  return "";
}

function getLastWorkoutExerciseMap(muscle) {
  const lastWorkout = getLastWorkoutByMuscle(muscle);
  const map = {};

  if (!lastWorkout || !lastWorkout.exercises) return map;
  lastWorkout.exercises.forEach(function (exercise) {
    map[normalizeExerciseName(exercise.name)] = exercise;
  });
  return map;
}

function getVoiceDefaultRepRange(name) {
  const exercise = findExerciseDefinition(name);
  if (!exercise) return "8-12";
  if (exercise.type === "复合") return "6-10";
  return "10-15";
}

function getVoiceDefaultSets(name) {
  const exercise = findExerciseDefinition(name);
  return exercise && exercise.type === "复合" ? "4" : "3";
}

function getVoiceDefaultWeight(name) {
  const exercise = findExerciseDefinition(name);
  if (!exercise) return "";
  if (exercise.equipment === "徒手") return "0";
  if (exercise.equipment === "杠铃") return exercise.type === "复合" ? "40" : "20";
  if (exercise.equipment === "哑铃") return exercise.type === "复合" ? "16" : "8";
  if (exercise.equipment === "器械") return exercise.type === "复合" ? "40" : "20";
  if (exercise.equipment === "绳索") return "15";
  return "";
}

function getVoiceTemplateForExercise(name, muscle) {
  const normalizedName = normalizeExerciseName(name);
  const plan = defaultPlans[muscle] || [];
  const last = getLastExerciseData(normalizedName, { muscle: muscle });

  for (let i = 0; i < plan.length; i++) {
    if (normalizeExerciseName(plan[i].name) === normalizedName) return normalizeExercise(plan[i]);
  }

  if (last) {
    return normalizeExercise({
      name: normalizedName,
      weight: last.weight,
      sets: last.sets,
      reps: last.reps
    });
  }

  return normalizeExercise({
    name: normalizedName,
    weight: getVoiceDefaultWeight(normalizedName),
    sets: getVoiceDefaultSets(normalizedName),
    reps: getVoiceDefaultRepRange(normalizedName)
  });
}

function matchVoiceExerciseName(segment) {
  const matches = findVoiceExerciseMatches(segment);
  if (matches.length) return matches[0].name;
  return "";
}

function extractVoiceSegments(text) {
  return text.split(/[，,。；;]+/).map(function (part) {
    return part.trim();
  }).filter(Boolean);
}

function findVoiceExerciseMatches(text) {
  const rawMatches = [];
  const pickedRanges = [];
  const pickedNames = {};

  voiceExerciseKeywordIndex.forEach(function (entry) {
    const index = text.indexOf(entry.keyword);
    if (index === -1) return;
    rawMatches.push({
      index: index,
      end: index + entry.keyword.length,
      keyword: entry.keyword,
      name: entry.name
    });
  });

  rawMatches.sort(function (a, b) {
    if (a.index !== b.index) return a.index - b.index;
    return b.keyword.length - a.keyword.length;
  });

  return rawMatches.filter(function (match) {
    const overlaps = pickedRanges.some(function (range) {
      return match.index < range.end && match.end > range.start;
    });
    if (overlaps || pickedNames[match.name]) return false;
    pickedRanges.push({ start: match.index, end: match.end });
    pickedNames[match.name] = true;
    return true;
  });
}

function parseVoiceExerciseOverrides(segment) {
  const setsMatch = segment.match(/([零一二三四五六七八九十两\d]+)\s*组/);
  const repsRangeMatch = segment.match(/([零一二三四五六七八九十两\d]+)\s*(?:到|至|-|~)\s*([零一二三四五六七八九十两\d]+)\s*次/);
  const repsMatch = segment.match(/([零一二三四五六七八九十两\d]+)\s*次/);
  const weightMatch = segment.match(/(\d+(?:\.\d+)?)\s*(?:kg|KG|公斤|千克)/);
  const restMatch = segment.match(/休息\s*([零一二三四五六七八九十两\d]+)\s*(秒|分钟|分)/);
  const intensityMatch = segment.match(/RPE\s*([\d.]+)/i);
  let restValue = 0;
  let intensity = "";

  if (restMatch) {
    restValue = parseVoiceNumberToken(restMatch[1]);
    if (restMatch[2] !== "秒") restValue = restValue * 60;
  }

  if (intensityMatch) intensity = "RPE " + intensityMatch[1];
  else if (segment.indexOf("轻松") > -1) intensity = "RPE 6-7";
  else if (segment.indexOf("吃力") > -1 || segment.indexOf("冲") > -1) intensity = "RPE 8-9";

  return {
    sets: setsMatch ? String(parseVoiceNumberToken(setsMatch[1])) : "",
    reps: repsRangeMatch
      ? parseVoiceNumberToken(repsRangeMatch[1]) + "-" + parseVoiceNumberToken(repsRangeMatch[2])
      : (repsMatch ? String(parseVoiceNumberToken(repsMatch[1])) : ""),
    weight: weightMatch ? String(weightMatch[1]) : "",
    rest: restValue ? restValue : "",
    intensity: intensity
  };
}

function buildVoiceExercisePlan(name, muscle, overrides) {
  const template = getVoiceTemplateForExercise(name, muscle);
  const personalized = buildAiExercise(template, "增肌", getLastWorkoutExerciseMap(muscle));

  if (overrides.sets) personalized.sets = parseInt(overrides.sets, 10) || personalized.sets;
  if (overrides.reps) personalized.reps = overrides.reps;
  if (overrides.weight) personalized.weight = overrides.weight;
  if (overrides.rest) personalized.rest = overrides.rest;
  if (overrides.intensity) personalized.intensity = overrides.intensity;
  if (overrides.progression) personalized.progression = String(overrides.progression).trim();
  return personalized;
}

function buildVoicePlanFromText(rawText) {
  const normalizedText = normalizeVoiceTranscript(rawText);
  const segments = extractVoiceSegments(normalizedText);
  let muscle = parseVoiceMuscle(normalizedText);
  const exercises = [];
  let fallbackMatches;

  segments.forEach(function (segment) {
    const exerciseName = matchVoiceExerciseName(segment);
    if (!exerciseName) return;
    exercises.push({
      name: exerciseName,
      segment: segment,
      overrides: parseVoiceExerciseOverrides(segment)
    });
  });

  if (!muscle && exercises.length) muscle = getVoiceMuscleFromExercise(exercises[0].name);
  muscle = normalizeMuscle(muscle || getCurrentMuscle());

  if (!exercises.length) {
    fallbackMatches = findVoiceExerciseMatches(normalizedText);
    fallbackMatches.forEach(function (match, index) {
      const nextIndex = index + 1 < fallbackMatches.length ? fallbackMatches[index + 1].index : normalizedText.length;
      const segment = normalizedText.slice(match.index, nextIndex);
      exercises.push({
        name: match.name,
        segment: segment,
        overrides: parseVoiceExerciseOverrides(segment)
      });
    });
  }

  if (!exercises.length) {
    return {
      muscle: muscle,
      source: "fallback",
      transcript: normalizedText,
      matchedCount: 0,
      exercises: buildAiPlan(muscle, "增肌", 45).exercises
    };
  }

  return {
    muscle: muscle,
    source: "voice",
    transcript: normalizedText,
    matchedCount: exercises.length,
    exercises: exercises.map(function (item) {
      return buildVoiceExercisePlan(item.name, muscle, item.overrides);
    })
  };
}

function getAllExerciseOptions() {
  const options = [];
  Object.keys(exerciseLibrary).forEach(function (muscle) {
    exerciseLibrary[muscle].forEach(function (exercise) {
      options.push(exercise.name);
    });
  });
  return options;
}

function buildVoiceResultMeta(plan) {
  const meta = [];
  meta.push("识别到 " + plan.exercises.length + " 个动作");
  meta.push("训练部位：" + plan.muscle);
  if (plan.suggestions && plan.suggestions.length) meta.push("已生成 " + plan.suggestions.length + " 条建议");
  if (plan.source === "fallback") meta.push("未命中动作名，已回退到基础模板");
  return meta;
}

function updateVoicePlanExerciseField(index, field, value) {
  const item = appState.voice.plan && appState.voice.plan.exercises ? appState.voice.plan.exercises[index] : null;
  if (!item) return;
  if (field === "name") {
    item.name = normalizeExerciseName(value);
    if (!findExerciseDefinition(item.name)) item.name = value;
    return;
  }
  item[field] = value;
}

function createVoiceExerciseRow(exercise, index) {
  const row = document.createElement("div");
  const top = document.createElement("div");
  const nameInput = document.createElement("input");
  const note = document.createElement("div");
  const controls = document.createElement("div");
  const fields = [
    { key: "weight", label: "KG", type: "number", step: "0.5" },
    { key: "sets", label: "组数", type: "number", step: "1" },
    { key: "reps", label: "次数", type: "text" }
  ];

  row.className = "voice-ex-row";
  top.className = "voice-ex-top";
  nameInput.className = "voice-ex-name-input";
  nameInput.setAttribute("list", "voice-exercise-options");
  nameInput.value = exercise.name;
  nameInput.addEventListener("change", function () {
    updateVoicePlanExerciseField(index, "name", this.value.trim());
    this.value = appState.voice.plan.exercises[index].name;
  });
  note.className = "voice-ex-note";
  note.textContent = [exercise.intensity, "休息 " + exercise.rest + " 秒", exercise.progression].filter(Boolean).join(" · ");

  top.appendChild(nameInput);
  top.appendChild(note);
  row.appendChild(top);

  controls.className = "voice-ex-controls";
  fields.forEach(function (field) {
    const wrap = document.createElement("label");
    const label = document.createElement("span");
    const input = document.createElement("input");
    wrap.className = "voice-ex-control";
    label.textContent = field.label;
    input.type = field.type;
    input.value = exercise[field.key];
    if (field.type === "number") input.step = field.step;
    input.addEventListener("input", function () {
      updateVoicePlanExerciseField(index, field.key, this.value);
    });
    wrap.appendChild(label);
    wrap.appendChild(input);
    controls.appendChild(wrap);
  });

  row.appendChild(controls);
  return row;
}

function ensureVoiceExerciseDatalist() {
  let list = document.getElementById("voice-exercise-options");
  let options;
  if (list) return;
  list = document.createElement("datalist");
  list.id = "voice-exercise-options";
  options = getAllExerciseOptions();
  options.forEach(function (name) {
    const option = document.createElement("option");
    option.value = name;
    list.appendChild(option);
  });
  document.body.appendChild(list);
}

function renderVoicePlan(plan) {
  const title = document.getElementById("voice-result-title");
  const meta = document.getElementById("voice-result-meta");
  const transcript = document.getElementById("voice-transcript");
  const list = document.getElementById("voice-result-list");

  ensureVoiceExerciseDatalist();
  appState.voice.plan = plan;
  title.textContent = plan.source === "fallback"
    ? "未识别到具体动作，已按 " + plan.muscle + " 生成基础计划"
    : plan.muscle + " · 已识别 " + plan.exercises.length + " 个动作";
  meta.innerHTML = "";
  buildVoiceResultMeta(plan).forEach(function (item) {
    const chip = document.createElement("span");
    chip.className = "voice-meta-chip";
    chip.textContent = item;
    meta.appendChild(chip);
  });
  transcript.textContent = plan.transcript || document.getElementById("voice-input").value.trim();
  list.innerHTML = "";

  plan.exercises.forEach(function (exercise, index) {
    list.appendChild(createVoiceExerciseRow(exercise, index));
  });

  document.getElementById("voice-result").style.display = "block";
}

function setVoicePlanLoading(isLoading) {
  ["voice-start-btn", "voice-stop-btn", "voice-parse-btn", "voice-import-btn", "voice-reset-btn"].forEach(function (id) {
    const button = document.getElementById(id);
    if (!button) return;
    button.disabled = isLoading;
  });
}

function buildExerciseLibraryPrompt() {
  return ["胸", "肩", "背", "臀腿"].map(function (muscle) {
    const names = exerciseLibrary[muscle].map(function (exercise) {
      return exercise.name;
    }).join("、");
    return muscle + "：" + names;
  }).join("\n");
}

function extractJsonFromModelResponse(content) {
  const raw = String(content || "").trim();
  const fencedMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const jsonText = fencedMatch ? fencedMatch[1].trim() : raw;

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error("模型返回的不是有效 JSON");
  }
}

function normalizeVoiceModelReps(value) {
  if (value === undefined || value === null || value === "") return "";
  if (Array.isArray(value) && value.length >= 2) {
    return String(parseVoiceNumberToken(value[0])) + "-" + String(parseVoiceNumberToken(value[1]));
  }

  const textValue = String(value).trim();
  if (!textValue) return "";
  if (/^\d+\s*[-~到至]\s*\d+$/.test(textValue)) {
    return textValue.replace(/[~到至]/g, "-").replace(/\s+/g, "");
  }

  const rangeMatch = textValue.match(/([零一二三四五六七八九十两\d]+)\s*[-~到至]\s*([零一二三四五六七八九十两\d]+)/);
  if (rangeMatch) {
    return String(parseVoiceNumberToken(rangeMatch[1])) + "-" + String(parseVoiceNumberToken(rangeMatch[2]));
  }

  return String(parseVoiceNumberToken(textValue) || textValue.replace(/[^\d.]/g, "")).trim();
}

function normalizeVoiceModelWeight(weight, unit) {
  if (weight === undefined || weight === null || weight === "") return "";

  const rawText = String(weight).trim();
  const numeric = typeof weight === "number"
    ? weight
    : parseFloat(rawText.replace(/[^\d.]/g, ""));

  if (!Number.isFinite(numeric)) return "";

  const detectedUnit = String(unit || rawText).toLowerCase();
  const inJin = /斤/.test(rawText) || /斤/.test(detectedUnit);
  const normalized = inJin ? numeric / 2 : numeric;
  return formatWeightValue(normalized);
}

function normalizeVoiceModelExercise(exercise, muscle) {
  const rawName = normalizeExerciseName(exercise && exercise.name ? exercise.name : "");
  if (!rawName || !findExerciseDefinition(rawName)) return null;

  const overrides = {
    sets: exercise && exercise.sets !== undefined && exercise.sets !== null && exercise.sets !== ""
      ? String(parseInt(exercise.sets, 10) || parseVoiceNumberToken(exercise.sets))
      : "",
    reps: normalizeVoiceModelReps(exercise && exercise.reps),
    weight: normalizeVoiceModelWeight(exercise && exercise.weight, exercise && exercise.weight_unit),
    rest: exercise && exercise.rest !== undefined && exercise.rest !== null && exercise.rest !== ""
      ? String(parseInt(exercise.rest, 10) || parseVoiceNumberToken(exercise.rest))
      : "",
    intensity: exercise && exercise.intensity ? String(exercise.intensity).trim() : "",
    progression: exercise && (exercise.progression || exercise.suggestion || exercise.note)
      ? String(exercise.progression || exercise.suggestion || exercise.note).trim()
      : ""
  };

  return buildVoiceExercisePlan(rawName, muscle, overrides);
}

function normalizeVoiceModelSuggestions(payload) {
  const raw = payload && Array.isArray(payload.suggestions)
    ? payload.suggestions
    : (payload && Array.isArray(payload.advice) ? payload.advice : []);

  return raw.map(function (item) {
    return String(item || "").trim();
  }).filter(Boolean).slice(0, 3);
}

function buildRecentWorkoutPrompt(limit) {
  const records = appState.data.records.slice().sort(function (a, b) {
    return parseDateString(b.date).getTime() - parseDateString(a.date).getTime();
  }).slice(0, limit || 4);

  if (!records.length) return "暂无历史训练记录。";

  return records.map(function (record) {
    const exercises = getRecordExercises(record).map(function (exercise) {
      const parts = [exercise.name];
      if (exercise.weight) parts.push(exercise.weight + "kg");
      if (exercise.sets) parts.push(exercise.sets + "组");
      if (exercise.reps) parts.push(exercise.reps + "次");
      return parts.join(" ");
    }).join("；");
    return record.date + " " + record.muscle + "：" + exercises;
  }).join("\n");
}

function normalizeVoiceModelPlan(payload, transcript) {
  if (!payload || typeof payload !== "object") {
    throw new Error("模型没有返回可用的训练计划");
  }

  const fallbackMuscle = getCurrentMuscle();
  const suggestedMuscle = payload.muscle || payload.target_muscle || payload.body_part || fallbackMuscle;
  const muscle = normalizeMuscle(suggestedMuscle);
  const rawExercises = Array.isArray(payload.exercises) ? payload.exercises : [];
  const exercises = rawExercises.map(function (exercise) {
    return normalizeVoiceModelExercise(exercise, muscle);
  }).filter(Boolean);
  const suggestions = normalizeVoiceModelSuggestions(payload);

  if (!exercises.length) {
    throw new Error("没有识别到可导入的动作，请换一种说法再试");
  }

  return {
    muscle: muscle,
    source: "doubao",
    transcript: transcript,
    matchedCount: exercises.length,
    suggestions: suggestions,
    exercises: exercises
  };
}

async function parseVoicePlanInput() {
  const input = document.getElementById("voice-input").value.trim();
  const currentMuscle = getCurrentMuscle();
  const recentWorkouts = buildRecentWorkoutPrompt(4);
  let response;
  let payload;
  let plan;

  if (!input) {
    showToast("先说一句或输入今天的训练计划");
    return;
  }

  setVoicePlanLoading(true);
  setVoiceStatus("正在整理训练描述...");

  try {
    response = await fetch(VOICE_PLAN_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: input,
        currentMuscle: currentMuscle,
        exerciseLibraryPrompt: buildExerciseLibraryPrompt(),
        recentWorkouts: recentWorkouts
      })
    });

    payload = await response.json();
    if (!response.ok) {
      throw new Error(payload && (payload.error || payload.detail) ? (payload.error || payload.detail) : ("解析失败（" + response.status + "）"));
    }

    if (!payload || !payload.content) {
      throw new Error("服务端没有返回可用结果");
    }

    plan = normalizeVoiceModelPlan(extractJsonFromModelResponse(payload.content), input);
    renderVoicePlan(plan);
    setVoiceStatus("已整理训练计划，导入前可以微调每个动作。");
  } catch (error) {
    appState.voice.plan = null;
    resetVoiceResultView();
    setVoiceStatus(error && error.message ? error.message : "解析失败，请换一种说法再试");
    showToast(error && error.message ? error.message : "解析失败，请换一种说法再试");
  } finally {
    setVoicePlanLoading(false);
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(appState.ui.toastTimer);
  appState.ui.toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 1800);
}

function saveDraft() {
  if (!hasWorkoutProgress()) return;
  localStorage.setItem("draft", JSON.stringify({
    date: getTodayStr(),
    muscle: getCurrentMuscle(),
    exercises: appState.workout.exercises,
    exIdx: appState.workout.exIdx,
    setDone: appState.workout.setDone,
    restTotal: appState.workout.restTotal,
    sessionLog: appState.workout.sessionLog,
    startedAt: appState.workout.startedAt,
    finishedAt: appState.workout.finishedAt
  }));
  updateDraftBanner();
}

function clearDraft() {
  localStorage.removeItem("draft");
  updateDraftBanner();
}

function updateDraftBanner() {
  const raw = localStorage.getItem("draft");
  const banner = document.getElementById("draft-banner");

  if (!raw) {
    banner.style.display = "none";
    return;
  }

  try {
    const draft = JSON.parse(raw);
    const doneSets = (draft.sessionLog || []).reduce(function (sum, item) {
      return sum + item.completedSets.length;
    }, 0);
    document.getElementById("draft-banner-text").textContent =
      "草稿：" + draft.date + " · " + normalizeMuscle(draft.muscle) + "（已完成 " + doneSets + " 组）";
    banner.style.display = "flex";
  } catch (err) {
    clearDraft();
  }
}

function resumeDraft() {
  const raw = localStorage.getItem("draft");
  let draft;

  if (!raw) return;

  try {
    draft = JSON.parse(raw);
  } catch (err) {
    clearDraft();
    return;
  }

  appState.workout.exercises = Array.isArray(draft.exercises) ? draft.exercises : [];
  appState.workout.exIdx = draft.exIdx || 0;
  appState.workout.setDone = draft.setDone || 0;
  appState.workout.restTotal = draft.restTotal || 90;
  appState.workout.sessionLog = draft.sessionLog || [];
  appState.workout.startedAt = draft.startedAt || new Date().toISOString();
  appState.workout.finishedAt = draft.finishedAt || "";
  appState.workout.restEndTime = 0;

  clearInterval(appState.workout.restTimer);
  clearTimeout(appState.workout.exDoneTimer);
  clearDraft();
  applyPlanToEditor(normalizeMuscle(draft.muscle), draft.exercises || [], false);
  document.getElementById("workout-overlay").style.display = "flex";
  wmShow("working");
}

function hasWorkoutProgress() {
  return appState.workout.sessionLog.some(function (item) {
    return item.completedSets.length > 0;
  });
}

function startWorkoutSession(plan) {
  clearInterval(appState.workout.restTimer);
  clearTimeout(appState.workout.exDoneTimer);
  appState.workout.exercises = plan;
  appState.workout.exIdx = 0;
  appState.workout.setDone = 0;
  appState.workout.restEndTime = 0;
  appState.workout.restTotal = plan.length ? (parseInt(plan[0].rest, 10) || 90) : 90;
  appState.workout.summary = null;
  appState.workout.startedAt = new Date().toISOString();
  appState.workout.finishedAt = "";
  appState.workout.sessionLog = plan.map(function (exercise) {
    return {
      name: exercise.name,
      targetWeight: exercise.weight,
      targetSets: exercise.sets,
      targetReps: exercise.reps,
      targetRest: exercise.rest || 90,
      intensity: exercise.intensity || "",
      progression: exercise.progression || "",
      completedSets: []
    };
  });

  appState.workout.restTimer = null;
  appState.workout.exDoneTimer = null;
  document.getElementById("workout-overlay").style.display = "flex";
  wmShow("working");
}

function getWorkoutCompletedSetCount() {
  return appState.workout.sessionLog.reduce(function (sum, item) {
    return sum + item.completedSets.length;
  }, 0);
}

function wmAdvanceToNextExercise() {
  clearInterval(appState.workout.restTimer);
  clearTimeout(appState.workout.exDoneTimer);
  appState.workout.restEndTime = 0;

  if (appState.workout.exIdx + 1 < appState.workout.exercises.length) {
    appState.workout.exIdx++;
    appState.workout.setDone = 0;
    appState.workout.restTotal = parseInt(appState.workout.exercises[appState.workout.exIdx].rest, 10) || 90;
    wmShow("working");
    return;
  }

  wmShow("all-done");
}

function wmSkipCurrentExercise() {
  clearInterval(appState.workout.restTimer);
  clearTimeout(appState.workout.exDoneTimer);
  appState.workout.restEndTime = 0;
  wmAdvanceToNextExercise();
}

function wmAutoSave(options) {
  const muscle = getCurrentMuscle();
  const today = getTodayStr();
  const exercises = buildExercisesFromSessionLog(appState.workout.sessionLog);
  const sessionLog = appState.workout.sessionLog.map(normalizeSessionLogItem).filter(Boolean);
  const plannedExercises = appState.workout.exercises.map(normalizeExercise).filter(Boolean);
  let record;
  let existingIndex = -1;
  const isFinal = options && options.isFinal;

  if (!exercises.length) return;

  record = {
    date: today,
    muscle: muscle,
    exercises: exercises,
    plannedExercises: plannedExercises,
    sessionLog: sessionLog,
    totalVolume: getSessionLogVolume(sessionLog),
    startedAt: appState.workout.startedAt || new Date().toISOString(),
    finishedAt: isFinal ? (appState.workout.finishedAt || new Date().toISOString()) : "",
    note: "",
    content: buildContent(muscle, exercises),
    _wmSession: true
  };

  for (let i = 0; i < appState.data.records.length; i++) {
    if (appState.data.records[i].date === today && appState.data.records[i].muscle === muscle && appState.data.records[i]._wmSession) {
      existingIndex = i;
      break;
    }
  }

  if (existingIndex >= 0) appState.data.records[existingIndex] = record;
  else appState.data.records.push(record);

  persistRecords();
  rebuildList();
  updateStats();
  updateLoadLastBtn();
}

function getWorkoutVolume() {
  return appState.workout.sessionLog.reduce(function (sum, item) {
    return sum + item.completedSets.reduce(function (setSum, set) {
      const weight = parseWeightNumber(set.weight);
      const reps = parseInt(set.reps, 10) || 0;
      if (weight === null || !reps) return setSum;
      return setSum + weight * reps;
    }, 0);
  }, 0);
}

function getWeightIncreaseText(weight, exerciseName) {
  const parsedWeight = parseWeightNumber(weight);
  let nextWeight;
  if (parsedWeight === null) return "下次尝试增加 2%-5% 的重量";
  nextWeight = formatWeightValue(bumpWeight(parsedWeight, exerciseName, 1.03));
  return "下次可以尝试 " + nextWeight + "kg";
}

function buildWorkoutSummary() {
  const summary = {
    totalExercises: 0,
    totalSets: getWorkoutCompletedSetCount(),
    totalVolume: formatWeightValue(getWorkoutVolume()),
    improvements: [],
    cautions: [],
    suggestions: []
  };

  appState.workout.sessionLog.forEach(function (item) {
    const completedSets = item.completedSets;
    let lastSet;
    let previous;
    let targetRange;
    let actualWeight;
    let actualReps;
    let targetSets;
    let targetRest;

    if (!completedSets.length) return;

    summary.totalExercises++;
    lastSet = completedSets[completedSets.length - 1];
    previous = getLastExerciseData(item.name, { excludeCurrentSession: true });
    targetRange = parseRepRange(item.targetReps);
    actualWeight = parseWeightNumber(lastSet.weight);
    actualReps = parseInt(lastSet.reps, 10) || 0;
    targetSets = parseInt(item.targetSets, 10) || completedSets.length;
    targetRest = parseInt(item.targetRest, 10) || 90;

    if (previous) {
      if (actualWeight !== null && previous.weightNum !== null && actualWeight > previous.weightNum) {
        summary.improvements.push(item.name + "：重量从 " + formatWeightValue(previous.weightNum) + "kg 提升到 " + formatWeightValue(actualWeight) + "kg");
      } else if (actualWeight !== null && previous.weightNum !== null && Math.abs(actualWeight - previous.weightNum) < 0.001 && actualReps > previous.repsNum) {
        summary.improvements.push(item.name + "：同重量多做了 " + (actualReps - previous.repsNum) + " 次");
      } else if (completedSets.length > previous.setsNum) {
        summary.improvements.push(item.name + "：比上次多完成了 " + (completedSets.length - previous.setsNum) + " 组");
      }
    }

    if (targetRange.low && actualReps < targetRange.low) {
      summary.cautions.push(item.name + "：最后一组只有 " + actualReps + " 次，低于目标下限");
    } else if (completedSets.length < targetSets) {
      summary.cautions.push(item.name + "：只完成了 " + completedSets.length + "/" + targetSets + " 组");
    }

    if (targetRange.high && actualReps >= targetRange.high && completedSets.length >= targetSets) {
      summary.suggestions.push(item.name + "：" + getWeightIncreaseText(lastSet.weight, item.name));
    } else if (targetRange.low && actualReps < targetRange.low) {
      summary.suggestions.push(item.name + "：保持当前重量，休息时间可延长到 " + Math.max(targetRest, 120) + " 秒");
    } else {
      summary.suggestions.push(item.name + "：保持当前重量，先把次数做满");
    }
  });

  if (!summary.improvements.length) summary.improvements.push("今天以稳定完成训练为主，暂无明显进步动作。");
  if (!summary.cautions.length) summary.cautions.push("整体完成度不错，没有明显掉速动作。");

  summary.suggestions = summary.suggestions.filter(function (text, index, arr) {
    return arr.indexOf(text) === index;
  }).slice(0, 3);

  return summary;
}

function clearNode(node) {
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

function appendWorkoutSummaryMetric(container, value, label) {
  const item = document.createElement("div");
  const num = document.createElement("span");
  const text = document.createElement("span");

  item.className = "wm-summary-metric";
  num.className = "wm-summary-num";
  num.textContent = value;
  text.className = "wm-summary-label";
  text.textContent = label;

  item.appendChild(num);
  item.appendChild(text);
  container.appendChild(item);
}

function appendWorkoutSummaryItems(container, items) {
  items.forEach(function (itemText) {
    const item = document.createElement("div");
    item.className = "wm-summary-item";
    item.textContent = itemText;
    container.appendChild(item);
  });
}

function renderWorkoutSummary() {
  const summary = appState.workout.summary || buildWorkoutSummary();
  const metrics = document.getElementById("wm-summary-metrics");
  const progress = document.getElementById("wm-summary-progress");
  const cautions = document.getElementById("wm-summary-cautions");
  const suggestions = document.getElementById("wm-summary-suggestions");

  appState.workout.summary = summary;
  document.getElementById("wm-all-summary").textContent =
    "共完成 " + summary.totalExercises + " 个动作 · " + summary.totalSets + " 组 · 训练量 " + summary.totalVolume;

  clearNode(metrics);
  clearNode(progress);
  clearNode(cautions);
  clearNode(suggestions);

  appendWorkoutSummaryMetric(metrics, summary.totalExercises, "动作");
  appendWorkoutSummaryMetric(metrics, summary.totalSets, "总组数");
  appendWorkoutSummaryMetric(metrics, summary.totalVolume, "训练量");

  appendWorkoutSummaryItems(progress, summary.improvements);
  appendWorkoutSummaryItems(cautions, summary.cautions.slice(0, 3));
  appendWorkoutSummaryItems(suggestions, summary.suggestions);
}

function wmRenderSetsDone() {
  const list = document.getElementById("wm-sets-done");
  const sets = appState.workout.sessionLog[appState.workout.exIdx].completedSets;

  clearNode(list);

  if (!sets.length) {
    const empty = document.createElement("div");
    empty.className = "wm-empty-sets";
    empty.textContent = "当前动作还没有完成组";
    list.appendChild(empty);
    return;
  }

  sets.forEach(function (set) {
    const row = document.createElement("div");
    const num = document.createElement("span");
    const value = document.createElement("span");

    row.className = "wm-set-row";
    num.className = "wm-set-num";
    num.textContent = "第 " + set.setNumber + " 组";
    value.className = "wm-set-val";
    value.textContent = set.weight + " kg × " + set.reps;

    row.appendChild(num);
    row.appendChild(value);
    list.appendChild(row);
  });
}

function wmUpdateHeader() {
  document.getElementById("wm-header-muscle").textContent = getCurrentMuscle();
  document.getElementById("wm-header-ex").textContent = "动作 " + (appState.workout.exIdx + 1) + " / " + appState.workout.exercises.length;
}

function wmShow(state) {
  const exercise = appState.workout.exercises[appState.workout.exIdx];
  const working = document.getElementById("wm-working");
  const resting = document.getElementById("wm-resting");
  const exDone = document.getElementById("wm-ex-done");
  const allDone = document.getElementById("wm-all-done");
  const log = appState.workout.sessionLog[appState.workout.exIdx].completedSets;
  const prev = log.length ? log[log.length - 1] : null;
  const nextExercise = appState.workout.exIdx + 1 < appState.workout.exercises.length ? appState.workout.exercises[appState.workout.exIdx + 1] : null;

  working.style.display = "none";
  resting.style.display = "none";
  exDone.style.display = "none";
  allDone.style.display = "none";
  wmUpdateHeader();

  if (state === "working") {
    working.style.display = "flex";
    document.getElementById("wm-ex-name").textContent = exercise.name;
    document.getElementById("wm-target").textContent =
      exercise.weight + " kg × " + exercise.sets + " 组 × " + exercise.reps + " 次";
    document.getElementById("wm-progress").textContent =
      "第 " + (appState.workout.setDone + 1) + " / " + exercise.sets + " 组";
    document.getElementById("wm-input-weight").value = prev ? prev.weight : exercise.weight;
    document.getElementById("wm-input-reps").value = prev ? prev.reps : getRepInputValue(exercise.reps);
    document.getElementById("wm-input-rest").value = parseInt(exercise.rest, 10) || appState.workout.restTotal;
    wmRenderSetsDone();
    return;
  }

  if (state === "resting") {
    resting.style.display = "flex";
    document.getElementById("wm-rest-ex-name").textContent = exercise.name;
    document.getElementById("wm-rest-next").textContent =
      "下一组 第 " + (appState.workout.setDone + 1) + " / " + exercise.sets + " 组";
    wmStartRest();
    return;
  }

  if (state === "ex-done") {
    exDone.style.display = "flex";
    exDone.style.flexDirection = "column";
    exDone.style.alignItems = "center";
    exDone.style.width = "100%";
    document.getElementById("wm-done-msg").textContent = exercise.name;
    document.getElementById("wm-next-ex-btn").textContent = "进入下一动作";

    if (nextExercise) {
      document.getElementById("wm-next-hint").textContent = "下一动作：" + nextExercise.name;
      document.getElementById("wm-next-ex-btn").style.display = "block";
      appState.workout.exDoneTimer = setTimeout(function () {
        wmAdvanceToNextExercise();
      }, 1500);
    } else {
      document.getElementById("wm-next-hint").textContent = "所有动作都已完成";
      document.getElementById("wm-next-ex-btn").style.display = "block";
      document.getElementById("wm-next-ex-btn").textContent = "查看完成";
      appState.workout.exDoneTimer = setTimeout(function () {
        wmShow("all-done");
      }, 1200);
    }
    return;
  }

  allDone.style.display = "flex";
  allDone.style.flexDirection = "column";
  allDone.style.alignItems = "center";
  allDone.style.width = "100%";
  renderWorkoutSummary();
  document.getElementById("wm-next-ex-btn").textContent = "进入下一动作";
}

function wmStartRest() {
  clearInterval(appState.workout.restTimer);
  appState.workout.restEndTime = Date.now() + appState.workout.restTotal * 1000;
  wmTickRest();
  appState.workout.restTimer = setInterval(wmTickRest, 500);
}

function wmTickRest() {
  let remaining = Math.ceil((appState.workout.restEndTime - Date.now()) / 1000);

  if (remaining < 0) remaining = 0;
  wmUpdateTimerDisplay(remaining);

  if (remaining <= 0) {
    clearInterval(appState.workout.restTimer);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    wmShow("working");
  }
}

function wmUpdateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const text = String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  const timer = document.getElementById("wm-timer");

  timer.textContent = text;
  timer.className = "wm-timer" + (seconds <= 10 ? " urgent" : "");
}

function getPrevRecord(currentIndex, muscle) {
  const currentDate = parseDateString(appState.data.records[currentIndex].date).getTime();
  const candidates = appState.data.records.filter(function (record, index) {
    return index !== currentIndex &&
      record.muscle === muscle &&
      record.exercises &&
      record.exercises.length &&
      parseDateString(record.date).getTime() < currentDate;
  });

  if (!candidates.length) return null;

  candidates.sort(function (a, b) {
    return parseDateString(b.date).getTime() - parseDateString(a.date).getTime();
  });

  return candidates[0];
}

function appendCompareValue(container, current, previous, unit) {
  const hasCurrent = current !== "" && current !== undefined && current !== null;
  const hasPrevious = previous !== "" && previous !== undefined && previous !== null;
  const currentText = document.createTextNode(hasCurrent ? current + unit : "—");
  let currentNum;
  let previousNum;
  let arrow;
  let previousText;

  if (!hasCurrent && !hasPrevious) {
    const empty = document.createElement("span");
    empty.className = "cmp-na";
    empty.textContent = "—";
    container.appendChild(empty);
    return;
  }

  if (!hasPrevious) {
    const onlyCurrent = document.createElement("span");
    onlyCurrent.className = "cmp-na";
    onlyCurrent.textContent = current + unit;
    container.appendChild(onlyCurrent);
    return;
  }

  if (!hasCurrent) {
    const missing = document.createElement("span");
    missing.className = "cmp-na";
    missing.textContent = "—";
    container.appendChild(missing);
    return;
  }

  currentNum = parseFloat(current);
  previousNum = parseFloat(previous);
  arrow = document.createElement("span");
  arrow.className = currentNum > previousNum ? "cmp-up" : currentNum < previousNum ? "cmp-down" : "cmp-eq";
  arrow.textContent = currentNum > previousNum ? "↑" : currentNum < previousNum ? "↓" : "=";
  previousText = document.createElement("span");
  previousText.className = "cmp-prev";
  previousText.textContent = "(" + previous + unit + ")";

  container.appendChild(currentText);
  container.appendChild(document.createTextNode(" "));
  container.appendChild(arrow);
  container.appendChild(document.createTextNode(" "));
  container.appendChild(previousText);
}

function appendCompareMetricLine(container, current, previous, unit) {
  const line = document.createElement("div");
  appendCompareValue(line, current, previous, unit);
  container.appendChild(line);
}

function renderCompareHeader(body, currentDate, previousDate) {
  const row = document.createElement("div");
  const currentLabel = document.createElement("span");
  const currentValue = document.createElement("span");
  const sep = document.createElement("span");
  const previousLabel = document.createElement("span");
  const previousValue = document.createElement("span");
  const divider = document.createElement("div");

  row.className = "cmp-date-row";
  currentLabel.className = "cmp-date-label";
  currentLabel.textContent = "本次";
  currentValue.className = "cmp-date-val";
  currentValue.textContent = currentDate;
  sep.className = "cmp-date-sep";
  sep.textContent = "vs";
  previousLabel.className = "cmp-date-label";
  previousLabel.textContent = "上次";
  previousValue.className = "cmp-date-val";
  previousValue.textContent = previousDate;
  divider.className = "cmp-divider";

  row.appendChild(currentLabel);
  row.appendChild(currentValue);
  row.appendChild(sep);
  row.appendChild(previousLabel);
  row.appendChild(previousValue);
  body.appendChild(row);
  body.appendChild(divider);
}

function renderCompareEmpty(body) {
  const empty = document.createElement("p");
  empty.className = "cmp-empty";
  empty.textContent = "暂无可对比的上次训练记录";
  body.appendChild(empty);
}

function renderCompareRow(body, name, current, prev) {
  const row = document.createElement("div");
  const left = document.createElement("div");
  const nameText = document.createElement("span");
  const right = document.createElement("div");
  let badge;

  row.className = "cmp-row";
  left.className = "cmp-name";
  right.className = "cmp-fields";
  nameText.textContent = name;
  left.appendChild(nameText);

  if (current && !prev) {
    badge = document.createElement("span");
    badge.className = "cmp-badge cmp-badge-new";
    badge.textContent = "新增";
    left.appendChild(badge);
  } else if (!current && prev) {
    badge = document.createElement("span");
    badge.className = "cmp-badge cmp-badge-missing";
    badge.textContent = "本次未做";
    left.appendChild(badge);
  }

  if (!current) {
    const missing = document.createElement("span");
    missing.className = "cmp-na";
    missing.textContent = "—";
    right.appendChild(missing);
  } else {
    appendCompareMetricLine(right, current.weight, prev && prev.weight, "kg");
    appendCompareMetricLine(right, current.sets, prev && prev.sets, "组");
    appendCompareMetricLine(right, current.reps, prev && prev.reps, "次");
  }

  row.appendChild(left);
  row.appendChild(right);
  body.appendChild(row);
}

function showCompare(record, index) {
  const previous = getPrevRecord(index, record.muscle);
  const body = document.getElementById("compare-body");
  const currentMap = {};
  const previousMap = {};
  const allNames = [];
  const currentExercises = getRecordExercises(record);
  const previousExercises = previous ? getRecordExercises(previous) : [];

  document.getElementById("compare-title").textContent = record.muscle + " · 对比上次训练";
  clearNode(body);

  if (!previous) {
    renderCompareEmpty(body);
    document.getElementById("compare-modal").style.display = "flex";
    return;
  }

  currentExercises.forEach(function (exercise) {
    currentMap[exercise.name] = exercise;
    allNames.push(exercise.name);
  });
  previousExercises.forEach(function (exercise) {
    previousMap[exercise.name] = exercise;
    if (!currentMap[exercise.name]) allNames.push(exercise.name);
  });

  renderCompareHeader(body, record.date, previous.date);

  allNames.forEach(function (name) {
    renderCompareRow(body, name, currentMap[name], previousMap[name]);
  });

  document.getElementById("compare-modal").style.display = "flex";
}

function closeCompareModal() {
  document.getElementById("compare-modal").style.display = "none";
}
