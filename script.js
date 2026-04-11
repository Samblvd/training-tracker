var EXERCISE_NAME_ALIASES = {
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

var exerciseLibrary = {
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

var defaultPlans = {
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

var mockPlans = {
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

var muscleTagClass = {
  胸: "muscle-chest",
  肩: "muscle-shoulder",
  背: "muscle-back",
  臀腿: "muscle-legs"
};

var editingIndex = -1;
var toastTimer = null;
var voicePlan = null;
var voiceRecognition = null;
var voiceIsListening = false;
var editorPlanMeta = {};
var records = sanitizeRecords(JSON.parse(localStorage.getItem("records") || "[]"));

var voiceExerciseAliases = {
  "绳索引拉": "宽握下拉",
  "引拉": "宽握下拉",
  "绳索下拉": "宽握下拉",
  "下拉": "宽握下拉",
  "卧推": "平板杠铃卧推",
  "上斜卧推": "上斜杠铃卧推",
  "推肩": "哑铃推肩",
  "推举": "杠铃推举",
  "深蹲": "杠铃深蹲",
  "硬拉": "罗马尼亚硬拉",
  "划船": "坐姿划船",
  "腿弯举": "坐姿腿弯举",
  "腿屈伸": "坐姿腿屈伸",
  "分腿蹲": "保加利亚分腿蹲",
  "夹胸": "绳索夹胸"
};

var voiceMuscleKeywords = [
  { muscle: "胸", keywords: ["胸部", "胸肌", "练胸", "胸"] },
  { muscle: "肩", keywords: ["肩部", "肩膀", "练肩", "肩"] },
  { muscle: "背", keywords: ["背部", "背阔", "练背", "背"] },
  { muscle: "臀腿", keywords: ["臀腿", "腿部", "下肢", "练腿", "臀", "腿"] }
];

var voiceExerciseKeywordIndex = buildVoiceExerciseKeywordIndex();

var wm = {
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
};

persistRecords();
renderExercises();
setTodayHeader();
rebuildList();
updateStats();
updateLoadLastBtn();
updateDraftBanner();

document.getElementById("muscle-pills").addEventListener("click", function (e) {
  var btn = e.target.closest(".pill");
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

  var plan = collectExercisesForWorkout();
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
  if (!voicePlan || !voicePlan.exercises || !voicePlan.exercises.length) {
    showToast("请先识别训练计划");
    return;
  }
  applyPlanToEditor(voicePlan.muscle, voicePlan.exercises, true);
  closeVoiceModal();
  showToast("训练计划已导入");
};
document.getElementById("voice-reset-btn").onclick = function () {
  voicePlan = null;
  document.getElementById("voice-result").style.display = "none";
  document.getElementById("voice-result-title").textContent = "";
  document.getElementById("voice-result-list").innerHTML = "";
  setVoiceStatus(getVoiceSupportMessage());
};

document.getElementById("progress-exercise-select").addEventListener("change", function () {
  renderProgressPanel();
});

document.getElementById("export-btn").onclick = function () {
  var data = {
    version: 2,
    exportedAt: new Date().toISOString(),
    records: records
  };
  var blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = "training-" + getTodayStr() + ".json";
  a.click();
  URL.revokeObjectURL(url);
};

document.getElementById("import-file").onchange = function (e) {
  var file = e.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function (ev) {
    try {
      var parsed = JSON.parse(ev.target.result);
      var incoming = Array.isArray(parsed) ? parsed : parsed.records;
      var normalized = sanitizeRecords(incoming || []);
      var existing = {};
      var added = 0;

      records.forEach(function (record) {
        existing[getRecordKey(record)] = true;
      });

      normalized.forEach(function (record) {
        var key = getRecordKey(record);
        if (existing[key]) return;
        records.push(record);
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
  clearInterval(wm.restTimer);
  clearTimeout(wm.exDoneTimer);
  wm.restEndTime = 0;

  if (hasWorkoutProgress()) {
    saveDraft();
    showToast("已保存草稿");
  }

  document.getElementById("workout-overlay").style.display = "none";
};

document.getElementById("wm-done-btn").onclick = function () {
  var exercise = wm.exercises[wm.exIdx];
  var actualWeight = document.getElementById("wm-input-weight").value || exercise.weight;
  var actualReps = document.getElementById("wm-input-reps").value || getRepInputValue(exercise.reps);
  var restSecs = parseInt(document.getElementById("wm-input-rest").value, 10) || parseInt(exercise.rest, 10) || 90;

  wm.restTotal = restSecs;
  wm.sessionLog[wm.exIdx].completedSets.push({
    setNumber: wm.setDone + 1,
    weight: actualWeight,
    reps: actualReps,
    restSeconds: restSecs
  });

  wm.setDone++;
  wmAutoSave();

  if (wm.setDone >= exercise.sets) {
    clearInterval(wm.restTimer);
    wmShow("ex-done");
  } else {
    wmShow("resting");
  }
};

document.getElementById("wm-skip-btn").onclick = function () {
  clearInterval(wm.restTimer);
  wm.restEndTime = 0;
  wmShow("working");
};

document.getElementById("wm-extend-rest-btn").onclick = function () {
  wm.restEndTime += 30000;
  wm.restTotal += 30;
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
  clearInterval(wm.restTimer);
  clearTimeout(wm.exDoneTimer);
  wm.restEndTime = 0;
  wm.finishedAt = new Date().toISOString();
  wmAutoSave({ isFinal: true });
  clearDraft();
  document.getElementById("workout-overlay").style.display = "none";
  showToast("训练已记录");
};

document.addEventListener("visibilitychange", function () {
  if (!document.hidden && wm.restEndTime > 0 && wm.restTimer) {
    wmTickRest();
  }
});

function setTodayHeader() {
  var today = getTodayStr();
  document.getElementById("today-date").textContent = today.replace(/-/g, " / ");
}

function getTodayStr() {
  var now = new Date();
  var yyyy = now.getFullYear();
  var mm = String(now.getMonth() + 1).padStart(2, "0");
  var dd = String(now.getDate()).padStart(2, "0");
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

  var date = typeof record.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.date)
    ? record.date
    : getTodayStr();
  var muscle = normalizeMuscle(record.muscle);
  var plannedExercises = Array.isArray(record.plannedExercises)
    ? record.plannedExercises.map(normalizeExercise).filter(Boolean)
    : [];
  var sessionLog = Array.isArray(record.sessionLog)
    ? record.sessionLog.map(normalizeSessionLogItem).filter(Boolean)
    : [];
  var exercises = Array.isArray(record.exercises)
    ? record.exercises.map(normalizeExercise).filter(Boolean)
    : buildExercisesFromSessionLog(sessionLog);
  var totalVolume = record.totalVolume === undefined || record.totalVolume === null || record.totalVolume === ""
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
    var lastSet = item.completedSets[item.completedSets.length - 1];
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
      var weight = parseWeightNumber(set.weight);
      var reps = parseInt(set.reps, 10) || 0;
      if (weight === null || !reps) return setSum;
      return setSum + weight * reps;
    }, 0);
  }, 0);
}

function persistRecords() {
  localStorage.setItem("records", JSON.stringify(records));
}

function getRecordExercises(record) {
  if (record && record.exercises && record.exercises.length) return record.exercises;
  return buildExercisesFromSessionLog(record && record.sessionLog ? record.sessionLog : []);
}

function getRecordKey(record) {
  var exerciseNames = getRecordExercises(record).map(function (exercise) {
    return exercise.name;
  }).join("/");
  return [record.date, record.muscle, exerciseNames].join("|");
}

function buildContent(muscle, exercises) {
  if (!exercises || !exercises.length) return muscle + "训练";
  return muscle + "：" + exercises.map(function (exercise) {
    var parts = [];
    if (exercise.weight) parts.push(exercise.weight + "kg");
    if (exercise.sets) parts.push(exercise.sets + "组");
    if (exercise.reps) parts.push(exercise.reps + "次");
    return exercise.name + (parts.length ? "（" + parts.join(" ") + "）" : "");
  }).join("、");
}

function setMuscle(value) {
  var muscle = normalizeMuscle(value);
  document.getElementById("muscle").value = muscle;
  document.querySelectorAll("#muscle-pills .pill").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.value === muscle);
  });
  renderExercises();
  updateLoadLastBtn();
}

function renderExercises() {
  var muscle = getCurrentMuscle();
  var list = document.getElementById("exercise-list");
  list.innerHTML = "";

  exerciseLibrary[muscle].forEach(function (exercise) {
    var row = document.createElement("div");
    row.className = "exercise-row";

    var label = document.createElement("label");
    label.className = "ex-label";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = exercise.name;
    checkbox.addEventListener("change", function () {
      row.classList.toggle("is-checked", this.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(exercise.name));

    var details = document.createElement("div");
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
  var btn = document.getElementById("load-last-btn");
  var last = getLastRecord(getCurrentMuscle());
  if (!btn) return;
  btn.style.display = last ? "inline-flex" : "none";
}

function getLastRecord(muscle) {
  for (var i = records.length - 1; i >= 0; i--) {
    if (records[i].muscle === muscle && getRecordExercises(records[i]).length) {
      return records[i];
    }
  }
  return null;
}

function applyPlanToEditor(muscle, plan, shouldShowSection) {
  setMuscle(muscle);

  var planMap = {};
  editorPlanMeta = {};
  (plan || []).forEach(function (exercise) {
    var normalized = normalizeExercise(exercise);
    if (normalized) {
      planMap[normalized.name] = normalized;
      editorPlanMeta[normalized.name] = {
        rest: exercise.rest || "",
        intensity: exercise.intensity || "",
        progression: exercise.progression || "",
        reps: exercise.reps !== undefined ? String(exercise.reps) : normalized.reps
      };
    }
  });

  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    var checkbox = row.querySelector("input[type='checkbox']");
    var selected = planMap[checkbox.value];

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
  var selected = [];
  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    var checkbox = row.querySelector("input[type='checkbox']");
    if (!checkbox.checked) return;
    var meta = editorPlanMeta[checkbox.value] || {};
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
  document.getElementById("backfill-save-btn").textContent = editingIndex >= 0 ? "保存修改" : "保存补录";
  showExerciseSection();
}

function getYesterdayStr() {
  var date = new Date();
  date.setDate(date.getDate() - 1);
  var yyyy = date.getFullYear();
  var mm = String(date.getMonth() + 1).padStart(2, "0");
  var dd = String(date.getDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

function resetComposer() {
  editingIndex = -1;
  document.getElementById("backfill-section").style.display = "none";
  document.getElementById("backfill-open-btn").style.display = "inline-block";
  document.getElementById("backfill-save-btn").textContent = "保存补录";
  clearExerciseInputs();
  hideExerciseSection();
}

function clearExerciseInputs() {
  editorPlanMeta = {};
  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    row.classList.remove("is-checked");
    row.querySelectorAll("input").forEach(function (input) {
      if (input.type === "checkbox") input.checked = false;
      else input.value = "";
    });
  });
}

function saveBackfillRecord() {
  var date = document.getElementById("backfill-date").value;
  var exercises = collectSelectedExercises();
  var muscle = getCurrentMuscle();
  var isEditing = editingIndex >= 0;
  var record;

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
    records[editingIndex] = record;
  } else {
    records.push(record);
  }

  persistRecords();
  rebuildList();
  updateStats();
  updateLoadLastBtn();
  resetComposer();
  showToast(isEditing ? "已保存修改" : "已保存补录");
}

function rebuildList() {
  var list = document.getElementById("list");
  var sorted = records.map(function (record, index) {
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
  var recordExercises = getRecordExercises(record);
  var li = document.createElement("li");
  li.className = "record-card";
  li.setAttribute("data-index", index);

  var header = document.createElement("div");
  header.className = "card-header";

  var headerLeft = document.createElement("div");
  headerLeft.className = "card-header-left";

  var tag = document.createElement("span");
  tag.className = "card-tag " + (muscleTagClass[record.muscle] || "muscle-chest");
  tag.textContent = record.muscle;

  var date = document.createElement("span");
  date.className = "card-date";
  date.textContent = record.date;

  var buttonGroup = document.createElement("div");
  buttonGroup.className = "btn-group";

  if (recordExercises.length) {
    var compareBtn = document.createElement("button");
    compareBtn.className = "cmp-btn";
    compareBtn.textContent = "对比上次";
    compareBtn.onclick = function () {
      showCompare(records[index], index);
    };
    buttonGroup.appendChild(compareBtn);
  }

  var editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.textContent = "编辑";
  editBtn.onclick = function () {
    loadRecordToComposer(index);
  };

  var deleteBtn = document.createElement("button");
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

  var body = document.createElement("div");
  body.className = "card-body";

  if (recordExercises.length) {
    recordExercises.forEach(function (exercise) {
      var row = document.createElement("div");
      row.className = "card-ex-row";

      var name = document.createElement("span");
      name.className = "card-ex-name";
      name.textContent = exercise.name;

      var detail = document.createElement("span");
      detail.className = "card-ex-detail";
      var parts = [];
      if (exercise.weight) parts.push(exercise.weight + " kg");
      if (exercise.sets) parts.push(exercise.sets + " 组");
      if (exercise.reps) parts.push(exercise.reps + " 次");
      detail.textContent = parts.join(" × ");

      row.appendChild(name);
      row.appendChild(detail);
      body.appendChild(row);
    });
  } else {
    var content = document.createElement("div");
    content.className = "card-content";
    content.textContent = record.content || "";
    body.appendChild(content);
  }

  li.appendChild(header);
  li.appendChild(body);
  document.getElementById("list").appendChild(li);
}

function loadRecordToComposer(index) {
  var record = records[index];
  editingIndex = index;
  setMuscle(record.muscle);
  openBackfill(record.date);
  applyPlanToEditor(record.muscle, record.plannedExercises && record.plannedExercises.length ? record.plannedExercises : getRecordExercises(record), true);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteRecord(index) {
  if (editingIndex === index) {
    resetComposer();
  } else if (editingIndex > index) {
    editingIndex--;
  }

  records.splice(index, 1);
  persistRecords();
  rebuildList();
  updateStats();
  updateLoadLastBtn();
}

function updateStats() {
  var today = parseDateString(getTodayStr());
  var weekStart = new Date(today);
  var monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  var day = weekStart.getDay();

  if (day === 0) day = 7;
  weekStart.setDate(weekStart.getDate() - day + 1);
  weekStart.setHours(0, 0, 0, 0);

  var weekCount = 0;
  var monthCount = 0;

  records.forEach(function (record) {
    var date = parseDateString(record.date);
    if (date >= weekStart) weekCount++;
    if (date >= monthStart) monthCount++;
  });

  document.getElementById("total").textContent = records.length;
  document.getElementById("count-week").textContent = weekCount;
  document.getElementById("count-month").textContent = monthCount;
  document.getElementById("record-count").textContent = records.length + " 条";
  renderProgressPanel();
}

function formatShortDate(dateStr) {
  if (!dateStr) return "";
  return dateStr.slice(5).replace("-", "/");
}

function getExerciseSessionData(record, exerciseName) {
  var normalizedName = normalizeExerciseName(exerciseName);
  var sessionLog = record.sessionLog || [];

  for (var i = 0; i < sessionLog.length; i++) {
    var item = sessionLog[i];
    if (normalizeExerciseName(item.name) !== normalizedName) continue;
    if (!item.completedSets || !item.completedSets.length) return null;

    return {
      date: record.date,
      weight: item.completedSets.reduce(function (maxWeight, set) {
        var weight = parseWeightNumber(set.weight);
        if (weight === null) return maxWeight;
        return Math.max(maxWeight, weight);
      }, 0),
      volume: item.completedSets.reduce(function (sum, set) {
        var weight = parseWeightNumber(set.weight);
        var reps = parseInt(set.reps, 10) || 0;
        if (weight === null || !reps) return sum;
        return sum + weight * reps;
      }, 0),
      sets: item.completedSets.length
    };
  }

  return null;
}

function getExerciseSummaryData(record, exerciseName) {
  var normalizedName = normalizeExerciseName(exerciseName);
  var exercises = getRecordExercises(record);

  for (var i = 0; i < exercises.length; i++) {
    var exercise = exercises[i];
    if (normalizeExerciseName(exercise.name) !== normalizedName) continue;

    var weight = parseWeightNumber(exercise.weight);
    var sets = parseInt(exercise.sets, 10) || 0;
    var reps = parseInt(getRepInputValue(exercise.reps), 10) || 0;

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
  var data = [];
  var sorted = records.slice().sort(function (a, b) {
    return parseDateString(a.date).getTime() - parseDateString(b.date).getTime();
  });

  sorted.forEach(function (record) {
    var point = getExerciseSessionData(record, exerciseName) || getExerciseSummaryData(record, exerciseName);
    if (point) data.push(point);
  });

  return limit ? data.slice(-limit) : data;
}

function getTrackedExerciseNames() {
  var seen = {};
  var names = [];

  for (var i = records.length - 1; i >= 0; i--) {
    getRecordExercises(records[i]).forEach(function (exercise) {
      var name = normalizeExerciseName(exercise.name);
      if (seen[name]) return;
      seen[name] = true;
      names.push(name);
    });
  }

  return names;
}

function renderTrendChart(containerId, data, metric, variant) {
  var container = document.getElementById(containerId);
  var max = data.reduce(function (currentMax, item) {
    return Math.max(currentMax, item[metric] || 0);
  }, 0);

  if (!data.length) {
    container.innerHTML = '<div class="trend-empty">还没有足够的训练数据</div>';
    return;
  }

  container.innerHTML = '<div class="trend-bars">' + data.map(function (item) {
    var height = max ? Math.max(14, Math.round((item[metric] || 0) / max * 120)) : 14;
    var valueText = metric === "weight"
      ? formatWeightValue(item.weight) + "kg"
      : formatWeightValue(item.volume) + "kg";

    return '' +
      '<div class="trend-col">' +
        '<div class="trend-value">' + valueText + '</div>' +
        '<div class="trend-bar-wrap"><div class="trend-bar ' + variant + '" style="height:' + height + 'px"></div></div>' +
        '<div class="trend-label">' + formatShortDate(item.date) + '</div>' +
      '</div>';
  }).join("") + '</div>';
}

function getMuscleFrequencyData(days) {
  var cutoff = parseDateString(getTodayStr());
  var counts = { 胸: 0, 肩: 0, 背: 0, 臀腿: 0 };
  cutoff.setDate(cutoff.getDate() - (days - 1));

  records.forEach(function (record) {
    if (parseDateString(record.date) < cutoff) return;
    if (!getRecordExercises(record).length) return;
    counts[normalizeMuscle(record.muscle)]++;
  });

  return ["胸", "肩", "背", "臀腿"].map(function (muscle) {
    return { muscle: muscle, count: counts[muscle] || 0 };
  });
}

function renderFrequencyList() {
  var list = document.getElementById("progress-frequency-list");
  var data = getMuscleFrequencyData(28);
  var max = data.reduce(function (currentMax, item) {
    return Math.max(currentMax, item.count);
  }, 0);

  list.innerHTML = data.map(function (item) {
    var width = max ? Math.max(8, Math.round(item.count / max * 100)) : 0;
    return '' +
      '<div class="frequency-row">' +
        '<span class="frequency-name">' + item.muscle + '</span>' +
        '<div class="frequency-track"><div class="frequency-fill" style="width:' + width + '%"></div></div>' +
        '<span class="frequency-count">' + item.count + ' 次</span>' +
      '</div>';
  }).join("");
}

function renderProgressPanel() {
  var select = document.getElementById("progress-exercise-select");
  var names = getTrackedExerciseNames();
  var currentValue;
  var data;
  var latest;
  var bestWeight;

  if (!select) return;
  currentValue = select.value;

  if (!names.length) {
    select.innerHTML = '<option value="">暂无动作数据</option>';
    document.getElementById("progress-latest-weight").textContent = "-";
    document.getElementById("progress-best-weight").textContent = "-";
    document.getElementById("progress-latest-volume").textContent = "-";
    renderTrendChart("progress-weight-chart", [], "weight", "");
    renderTrendChart("progress-volume-chart", [], "volume", "volume");
    renderFrequencyList();
    return;
  }

  select.innerHTML = names.map(function (name) {
    return '<option value="' + name + '">' + name + '</option>';
  }).join("");

  select.value = names.indexOf(currentValue) >= 0 ? currentValue : names[0];
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
  var normalizedName = normalizeExerciseName(name);
  var muscles = Object.keys(exerciseLibrary);

  for (var i = 0; i < muscles.length; i++) {
    var match = exerciseLibrary[muscles[i]].find(function (exercise) {
      return exercise.name === normalizedName;
    });
    if (match) return match;
  }

  return null;
}

function parseWeightNumber(value) {
  if (value === undefined || value === null || value === "") return null;
  var parsed = parseFloat(value);
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
  var reps = parseInt(value, 10);
  if (!reps) return "";
  if (reps <= 10) return reps + "-" + (reps + 2);
  if (reps <= 12) return reps + "-" + (reps + 3);
  return reps + "-" + (reps + 5);
}

function getRepInputValue(repsRange) {
  if (repsRange === undefined || repsRange === null) return "";
  var range = String(repsRange);
  if (range.indexOf("-") === -1) return range;
  return range.split("-")[0];
}

function parseRepRange(value) {
  var range = String(value || "");
  var parts;
  var low;
  var high;

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
  var targetMuscle = normalizeMuscle(muscle);
  var shouldExcludeCurrentSession = options && options.excludeCurrentSession;
  var today = getTodayStr();

  for (var i = records.length - 1; i >= 0; i--) {
    var record = records[i];
    if (record.muscle !== targetMuscle || !getRecordExercises(record).length) continue;
    if (shouldExcludeCurrentSession && record._wmSession && record.date === today && record.muscle === targetMuscle) continue;
    return record;
  }

  return null;
}

function getExerciseHistory(exerciseName, limit, options) {
  var history = [];
  var normalizedName = normalizeExerciseName(exerciseName);
  var targetMuscle = options && options.muscle ? normalizeMuscle(options.muscle) : "";
  var shouldExcludeCurrentSession = options && options.excludeCurrentSession;
  var today = getTodayStr();

  for (var i = records.length - 1; i >= 0; i--) {
    var record = records[i];
    var exercises = getRecordExercises(record);

    if (targetMuscle && record.muscle !== targetMuscle) continue;
    if (shouldExcludeCurrentSession && record._wmSession && record.date === today && (!targetMuscle || record.muscle === targetMuscle)) continue;

    for (var j = 0; j < exercises.length; j++) {
      var exercise = exercises[j];
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
  var history = getExerciseHistory(exerciseName, 1, options);
  return history.length ? history[0] : null;
}

function getHistoryWeight(name) {
  var last = getLastExerciseData(name);
  return last ? last.weightNum : null;
}

function getDefaultInitialWeight(template) {
  var baseWeight = parseWeightNumber(template.weight);
  return baseWeight === null ? "" : formatWeightValue(baseWeight);
}

function getAiIntensity(goal, status) {
  if (goal === "恢复") return "RPE 6-7，动作质量优先";
  if (status === "push") return "RPE 8，最后 1 组保留 1 次余力";
  if (status === "hold") return "RPE 7-8，稳定完成所有组";
  return "RPE 7，先把动作和次数做稳";
}

function getAiRestSeconds(exerciseName, goal, status) {
  var exercise = findExerciseDefinition(exerciseName);
  if (!exercise) return goal === "增肌" ? 90 : 75;
  if (exercise.type === "复合") {
    if (status === "reduce") return 120;
    return goal === "增肌" ? 120 : 90;
  }
  return goal === "恢复" ? 60 : 75;
}

function getWeightStep(exerciseName) {
  var exercise = findExerciseDefinition(exerciseName);
  if (!exercise) return 2.5;
  if (exercise.equipment === "杠铃") return 2.5;
  if (exercise.equipment === "哑铃") return 2;
  if (exercise.equipment === "器械" || exercise.equipment === "绳索") return 5;
  return 0;
}

function bumpWeight(weight, exerciseName, factor) {
  var step = getWeightStep(exerciseName);
  var next = weight * factor;
  var rounded;
  if (!step) return next;
  rounded = Math.round(next / step) * step;
  if (factor > 1 && rounded <= weight) return weight + step;
  if (factor < 1 && rounded >= weight) return Math.max(0, weight - step);
  return rounded;
}

function getProgressionHint(exerciseName, status, baseWeight) {
  var exercise = findExerciseDefinition(exerciseName);
  var nextWeight;
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
  var baseWeight = lastExercise && lastExercise.weightNum !== null
    ? lastExercise.weightNum
    : parseWeightNumber(template.weight);
  var outcome = getExerciseOutcome(lastExercise, repRange, targetSets);
  var allStableRecent = recentHistory.length >= 4 && recentHistory.slice(0, 4).every(function (item) {
    return item.setsNum >= targetSets && item.repsNum >= repRange.low;
  });
  var nextWeight = baseWeight;

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
  var normalizedName = normalizeExerciseName(template.name);
  var lastWorkoutExercise = lastWorkoutMap[normalizedName] || null;
  var lastExercise = getLastExerciseData(normalizedName) || lastWorkoutExercise;
  var targetSets = parseInt(template.sets, 10) || (lastWorkoutExercise ? parseInt(lastWorkoutExercise.sets, 10) : 0) || 3;
  var repRange = parseRepRange(toRepRange(template.reps || (lastWorkoutExercise ? lastWorkoutExercise.reps : "")));
  var recentHistory = getExerciseHistory(normalizedName, 4);
  var weightSuggestion = getAiWeightSuggestion(template, goal, lastExercise, recentHistory, repRange, targetSets);

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
  var normalizedMuscle = normalizeMuscle(muscle);
  var basePlan = (mockPlans[normalizedMuscle] && mockPlans[normalizedMuscle][goal]) || defaultPlans[normalizedMuscle] || [];
  var lastWorkout = getLastWorkoutByMuscle(normalizedMuscle);
  var lastWorkoutMap = {};

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
  var keywordMap = {};

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

function openVoiceModal() {
  voicePlan = null;
  document.getElementById("voice-result").style.display = "none";
  document.getElementById("voice-result-title").textContent = "";
  document.getElementById("voice-result-list").innerHTML = "";
  setVoiceStatus(getVoiceSupportMessage());
  document.getElementById("voice-modal").style.display = "flex";
}

function closeVoiceModal() {
  stopVoiceRecognition();
  document.getElementById("voice-modal").style.display = "none";
}

function ensureVoiceRecognition() {
  var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) return null;
  if (voiceRecognition) return voiceRecognition;

  voiceRecognition = new Recognition();
  voiceRecognition.lang = "zh-CN";
  voiceRecognition.continuous = true;
  voiceRecognition.interimResults = true;

  voiceRecognition.onstart = function () {
    voiceIsListening = true;
    setVoiceStatus("正在听写，请继续说完整的训练计划。");
  };

  voiceRecognition.onresult = function (event) {
    var finalText = "";
    var interimText = "";
    var input = document.getElementById("voice-input");

    for (var i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
      else interimText += event.results[i][0].transcript;
    }

    if (finalText) {
      input.value = (input.value + " " + finalText).replace(/\s+/g, " ").trim();
      setVoiceStatus("已转成文字，可以继续说，也可以直接识别训练计划。");
    } else if (interimText) {
      setVoiceStatus("正在识别：" + interimText);
    }
  };

  voiceRecognition.onerror = function (event) {
    voiceIsListening = false;
    setVoiceStatus("语音识别失败：" + (event.error || "请改用手动输入"));
  };

  voiceRecognition.onend = function () {
    voiceIsListening = false;
    if (document.getElementById("voice-modal").style.display === "flex") {
      setVoiceStatus(document.getElementById("voice-input").value.trim() ? "听写结束，可以识别训练计划了。" : getVoiceSupportMessage());
    }
  };

  return voiceRecognition;
}

function startVoiceRecognition() {
  var recognition = ensureVoiceRecognition();
  if (!recognition) {
    showToast("当前浏览器不支持语音识别");
    setVoiceStatus(getVoiceSupportMessage());
    return;
  }
  if (voiceIsListening) return;
  try {
    recognition.start();
  } catch (err) {
    setVoiceStatus("请稍等一下，再次点击开始听写。");
  }
}

function stopVoiceRecognition() {
  if (!voiceRecognition || !voiceIsListening) return;
  voiceRecognition.stop();
}

function parseVoiceNumberToken(token) {
  var digitMap = { "零": 0, "一": 1, "二": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9 };
  var parts;
  var left;
  var right;

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
  var exercise = findExerciseDefinition(name);
  if (!exercise) return "";
  if (exercise.muscle_primary === "肩后束") return "肩";
  if (exercise.muscle_primary === "二头") return "背";
  if (exercise.muscle_primary === "三头") return "胸";
  if (["股四头", "腿后侧", "臀", "小腿"].indexOf(exercise.muscle_primary) > -1) return "臀腿";
  return normalizeMuscle(exercise.muscle_primary);
}

function parseVoiceMuscle(text) {
  for (var i = 0; i < voiceMuscleKeywords.length; i++) {
    for (var j = 0; j < voiceMuscleKeywords[i].keywords.length; j++) {
      if (text.indexOf(voiceMuscleKeywords[i].keywords[j]) > -1) return voiceMuscleKeywords[i].muscle;
    }
  }
  return "";
}

function getLastWorkoutExerciseMap(muscle) {
  var lastWorkout = getLastWorkoutByMuscle(muscle);
  var map = {};

  if (!lastWorkout || !lastWorkout.exercises) return map;
  lastWorkout.exercises.forEach(function (exercise) {
    map[normalizeExerciseName(exercise.name)] = exercise;
  });
  return map;
}

function getVoiceDefaultRepRange(name) {
  var exercise = findExerciseDefinition(name);
  if (!exercise) return "8-12";
  if (exercise.type === "复合") return "6-10";
  return "10-15";
}

function getVoiceDefaultSets(name) {
  var exercise = findExerciseDefinition(name);
  return exercise && exercise.type === "复合" ? "4" : "3";
}

function getVoiceDefaultWeight(name) {
  var exercise = findExerciseDefinition(name);
  if (!exercise) return "";
  if (exercise.equipment === "徒手") return "0";
  if (exercise.equipment === "杠铃") return exercise.type === "复合" ? "40" : "20";
  if (exercise.equipment === "哑铃") return exercise.type === "复合" ? "16" : "8";
  if (exercise.equipment === "器械") return exercise.type === "复合" ? "40" : "20";
  if (exercise.equipment === "绳索") return "15";
  return "";
}

function getVoiceTemplateForExercise(name, muscle) {
  var normalizedName = normalizeExerciseName(name);
  var plan = defaultPlans[muscle] || [];
  var last = getLastExerciseData(normalizedName, { muscle: muscle });

  for (var i = 0; i < plan.length; i++) {
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

function findVoiceExerciseMatches(text) {
  var rawMatches = [];
  var pickedRanges = [];
  var pickedNames = {};

  voiceExerciseKeywordIndex.forEach(function (entry) {
    var index = text.indexOf(entry.keyword);
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
    var overlaps = pickedRanges.some(function (range) {
      return match.index < range.end && match.end > range.start;
    });
    if (overlaps || pickedNames[match.name]) return false;
    pickedRanges.push({ start: match.index, end: match.end });
    pickedNames[match.name] = true;
    return true;
  });
}

function parseVoiceExerciseOverrides(segment) {
  var setsMatch = segment.match(/([零一二三四五六七八九十两\d]+)\s*组/);
  var repsRangeMatch = segment.match(/([零一二三四五六七八九十两\d]+)\s*(?:到|至|-|~)\s*([零一二三四五六七八九十两\d]+)\s*次/);
  var repsMatch = segment.match(/([零一二三四五六七八九十两\d]+)\s*次/);
  var weightMatch = segment.match(/(\d+(?:\.\d+)?)\s*(?:kg|KG|公斤|千克)/);
  var restMatch = segment.match(/休息\s*([零一二三四五六七八九十两\d]+)\s*(秒|分钟|分)/);
  var intensityMatch = segment.match(/RPE\s*([\d.]+)/i);
  var restValue = 0;
  var intensity = "";

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
  var template = getVoiceTemplateForExercise(name, muscle);
  var personalized = buildAiExercise(template, "增肌", getLastWorkoutExerciseMap(muscle));

  if (overrides.sets) personalized.sets = parseInt(overrides.sets, 10) || personalized.sets;
  if (overrides.reps) personalized.reps = overrides.reps;
  if (overrides.weight) personalized.weight = overrides.weight;
  if (overrides.rest) personalized.rest = overrides.rest;
  if (overrides.intensity) personalized.intensity = overrides.intensity;
  return personalized;
}

function buildVoicePlanFromText(rawText) {
  var text = String(rawText || "").replace(/(?:[，。；、]|\n)/g, " ").replace(/\s+/g, " ").trim();
  var matches = findVoiceExerciseMatches(text);
  var muscle = parseVoiceMuscle(text);
  var exercises = [];
  var i;
  var segment;
  var nextIndex;

  if (!muscle && matches.length) muscle = getVoiceMuscleFromExercise(matches[0].name);
  muscle = normalizeMuscle(muscle || getCurrentMuscle());

  if (!matches.length) {
    return {
      muscle: muscle,
      source: "fallback",
      exercises: buildAiPlan(muscle, "增肌", 45).exercises
    };
  }

  for (i = 0; i < matches.length; i++) {
    nextIndex = i + 1 < matches.length ? matches[i + 1].index : text.length;
    segment = text.slice(matches[i].index, nextIndex);
    exercises.push(buildVoiceExercisePlan(matches[i].name, muscle, parseVoiceExerciseOverrides(segment)));
  }

  return {
    muscle: muscle,
    source: "voice",
    exercises: exercises
  };
}

function renderVoicePlan(plan) {
  var title = document.getElementById("voice-result-title");
  var list = document.getElementById("voice-result-list");

  voicePlan = plan;
  title.textContent = plan.source === "fallback"
    ? "未识别到具体动作，已按 " + plan.muscle + " 生成基础计划"
    : plan.muscle + " · 已识别 " + plan.exercises.length + " 个动作";
  list.innerHTML = "";

  plan.exercises.forEach(function (exercise) {
    var row = document.createElement("div");
    row.className = "ai-ex-row";

    var left = document.createElement("div");
    left.className = "ai-ex-left";

    var name = document.createElement("span");
    name.className = "ai-ex-name";
    name.textContent = exercise.name;
    left.appendChild(name);

    var note = document.createElement("span");
    note.className = "ai-ex-note";
    note.textContent = exercise.intensity + " · 休息 " + exercise.rest + " 秒";
    left.appendChild(note);

    var progression = document.createElement("span");
    progression.className = "ai-ex-note";
    progression.textContent = exercise.progression;
    left.appendChild(progression);

    var detail = document.createElement("span");
    detail.className = "ai-ex-detail";
    detail.textContent = [exercise.weight + " kg", exercise.sets + " 组", exercise.reps + " 次"].join(" × ");

    row.appendChild(left);
    row.appendChild(detail);
    list.appendChild(row);
  });

  document.getElementById("voice-result").style.display = "block";
}

function parseVoicePlanInput() {
  var input = document.getElementById("voice-input").value.trim();
  var plan;

  if (!input) {
    showToast("先说一句或输入今天的训练计划");
    return;
  }

  plan = buildVoicePlanFromText(input);
  renderVoicePlan(plan);
  setVoiceStatus(plan.source === "fallback" ? "没有识别到具体动作，已按当前部位生成基础计划。" : "已识别训练计划，可以直接导入。");
}

function showToast(message) {
  var toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 1800);
}

function saveDraft() {
  if (!hasWorkoutProgress()) return;
  localStorage.setItem("draft", JSON.stringify({
    date: getTodayStr(),
    muscle: getCurrentMuscle(),
    exercises: wm.exercises,
    exIdx: wm.exIdx,
    setDone: wm.setDone,
    restTotal: wm.restTotal,
    sessionLog: wm.sessionLog,
    startedAt: wm.startedAt,
    finishedAt: wm.finishedAt
  }));
  updateDraftBanner();
}

function clearDraft() {
  localStorage.removeItem("draft");
  updateDraftBanner();
}

function updateDraftBanner() {
  var raw = localStorage.getItem("draft");
  var banner = document.getElementById("draft-banner");

  if (!raw) {
    banner.style.display = "none";
    return;
  }

  try {
    var draft = JSON.parse(raw);
    var doneSets = (draft.sessionLog || []).reduce(function (sum, item) {
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
  var raw = localStorage.getItem("draft");
  var draft;

  if (!raw) return;

  try {
    draft = JSON.parse(raw);
  } catch (err) {
    clearDraft();
    return;
  }

  wm.exercises = Array.isArray(draft.exercises) ? draft.exercises : [];
  wm.exIdx = draft.exIdx || 0;
  wm.setDone = draft.setDone || 0;
  wm.restTotal = draft.restTotal || 90;
  wm.sessionLog = draft.sessionLog || [];
  wm.startedAt = draft.startedAt || new Date().toISOString();
  wm.finishedAt = draft.finishedAt || "";
  wm.restEndTime = 0;

  clearInterval(wm.restTimer);
  clearTimeout(wm.exDoneTimer);
  clearDraft();
  applyPlanToEditor(normalizeMuscle(draft.muscle), draft.exercises || [], false);
  document.getElementById("workout-overlay").style.display = "flex";
  wmShow("working");
}

function hasWorkoutProgress() {
  return wm.sessionLog.some(function (item) {
    return item.completedSets.length > 0;
  });
}

function startWorkoutSession(plan) {
  clearInterval(wm.restTimer);
  clearTimeout(wm.exDoneTimer);
  wm.exercises = plan;
  wm.exIdx = 0;
  wm.setDone = 0;
  wm.restEndTime = 0;
  wm.restTotal = plan.length ? (parseInt(plan[0].rest, 10) || 90) : 90;
  wm.summary = null;
  wm.startedAt = new Date().toISOString();
  wm.finishedAt = "";
  wm.sessionLog = plan.map(function (exercise) {
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

  wm.restTimer = null;
  wm.exDoneTimer = null;
  document.getElementById("workout-overlay").style.display = "flex";
  wmShow("working");
}

function getWorkoutCompletedSetCount() {
  return wm.sessionLog.reduce(function (sum, item) {
    return sum + item.completedSets.length;
  }, 0);
}

function wmAdvanceToNextExercise() {
  clearInterval(wm.restTimer);
  clearTimeout(wm.exDoneTimer);
  wm.restEndTime = 0;

  if (wm.exIdx + 1 < wm.exercises.length) {
    wm.exIdx++;
    wm.setDone = 0;
    wm.restTotal = parseInt(wm.exercises[wm.exIdx].rest, 10) || 90;
    wmShow("working");
    return;
  }

  wmShow("all-done");
}

function wmSkipCurrentExercise() {
  clearInterval(wm.restTimer);
  clearTimeout(wm.exDoneTimer);
  wm.restEndTime = 0;
  wmAdvanceToNextExercise();
}

function wmAutoSave(options) {
  var muscle = getCurrentMuscle();
  var today = getTodayStr();
  var exercises = buildExercisesFromSessionLog(wm.sessionLog);
  var sessionLog = wm.sessionLog.map(normalizeSessionLogItem).filter(Boolean);
  var plannedExercises = wm.exercises.map(normalizeExercise).filter(Boolean);
  var record;
  var existingIndex = -1;
  var isFinal = options && options.isFinal;

  if (!exercises.length) return;

  record = {
    date: today,
    muscle: muscle,
    exercises: exercises,
    plannedExercises: plannedExercises,
    sessionLog: sessionLog,
    totalVolume: getSessionLogVolume(sessionLog),
    startedAt: wm.startedAt || new Date().toISOString(),
    finishedAt: isFinal ? (wm.finishedAt || new Date().toISOString()) : "",
    note: "",
    content: buildContent(muscle, exercises),
    _wmSession: true
  };

  for (var i = 0; i < records.length; i++) {
    if (records[i].date === today && records[i].muscle === muscle && records[i]._wmSession) {
      existingIndex = i;
      break;
    }
  }

  if (existingIndex >= 0) records[existingIndex] = record;
  else records.push(record);

  persistRecords();
  rebuildList();
  updateStats();
  updateLoadLastBtn();
}

function getWorkoutVolume() {
  return wm.sessionLog.reduce(function (sum, item) {
    return sum + item.completedSets.reduce(function (setSum, set) {
      var weight = parseWeightNumber(set.weight);
      var reps = parseInt(set.reps, 10) || 0;
      if (weight === null || !reps) return setSum;
      return setSum + weight * reps;
    }, 0);
  }, 0);
}

function getWeightIncreaseText(weight, exerciseName) {
  var parsedWeight = parseWeightNumber(weight);
  var nextWeight;
  if (parsedWeight === null) return "下次尝试增加 2%-5% 的重量";
  nextWeight = formatWeightValue(bumpWeight(parsedWeight, exerciseName, 1.03));
  return "下次可以尝试 " + nextWeight + "kg";
}

function buildWorkoutSummary() {
  var summary = {
    totalExercises: 0,
    totalSets: getWorkoutCompletedSetCount(),
    totalVolume: formatWeightValue(getWorkoutVolume()),
    improvements: [],
    cautions: [],
    suggestions: []
  };

  wm.sessionLog.forEach(function (item) {
    var completedSets = item.completedSets;
    var lastSet;
    var previous;
    var targetRange;
    var actualWeight;
    var actualReps;
    var targetSets;
    var targetRest;

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

function renderWorkoutSummary() {
  var summary = wm.summary || buildWorkoutSummary();
  var metrics = document.getElementById("wm-summary-metrics");
  var progress = document.getElementById("wm-summary-progress");
  var cautions = document.getElementById("wm-summary-cautions");
  var suggestions = document.getElementById("wm-summary-suggestions");

  wm.summary = summary;
  document.getElementById("wm-all-summary").textContent =
    "共完成 " + summary.totalExercises + " 个动作 · " + summary.totalSets + " 组 · 训练量 " + summary.totalVolume;

  metrics.innerHTML = [
    '<div class="wm-summary-metric"><span class="wm-summary-num">' + summary.totalExercises + '</span><span class="wm-summary-label">动作</span></div>',
    '<div class="wm-summary-metric"><span class="wm-summary-num">' + summary.totalSets + '</span><span class="wm-summary-label">总组数</span></div>',
    '<div class="wm-summary-metric"><span class="wm-summary-num">' + summary.totalVolume + '</span><span class="wm-summary-label">训练量</span></div>'
  ].join("");

  progress.innerHTML = summary.improvements.map(function (item) {
    return '<div class="wm-summary-item">' + item + '</div>';
  }).join("");

  cautions.innerHTML = summary.cautions.slice(0, 3).map(function (item) {
    return '<div class="wm-summary-item">' + item + '</div>';
  }).join("");

  suggestions.innerHTML = summary.suggestions.map(function (item) {
    return '<div class="wm-summary-item">' + item + '</div>';
  }).join("");
}

function wmRenderSetsDone() {
  var list = document.getElementById("wm-sets-done");
  var sets = wm.sessionLog[wm.exIdx].completedSets;

  if (!sets.length) {
    list.innerHTML = '<div class="wm-empty-sets">当前动作还没有完成组</div>';
    return;
  }

  list.innerHTML = sets.map(function (set) {
    return '<div class="wm-set-row"><span class="wm-set-num">第 ' + set.setNumber + ' 组</span><span class="wm-set-val">' + set.weight + ' kg × ' + set.reps + '</span></div>';
  }).join("");
}

function wmUpdateHeader() {
  document.getElementById("wm-header-muscle").textContent = getCurrentMuscle();
  document.getElementById("wm-header-ex").textContent = "动作 " + (wm.exIdx + 1) + " / " + wm.exercises.length;
}

function wmShow(state) {
  var exercise = wm.exercises[wm.exIdx];
  var working = document.getElementById("wm-working");
  var resting = document.getElementById("wm-resting");
  var exDone = document.getElementById("wm-ex-done");
  var allDone = document.getElementById("wm-all-done");
  var log = wm.sessionLog[wm.exIdx].completedSets;
  var prev = log.length ? log[log.length - 1] : null;
  var nextExercise = wm.exIdx + 1 < wm.exercises.length ? wm.exercises[wm.exIdx + 1] : null;

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
      "第 " + (wm.setDone + 1) + " / " + exercise.sets + " 组";
    document.getElementById("wm-input-weight").value = prev ? prev.weight : exercise.weight;
    document.getElementById("wm-input-reps").value = prev ? prev.reps : getRepInputValue(exercise.reps);
    document.getElementById("wm-input-rest").value = parseInt(exercise.rest, 10) || wm.restTotal;
    wmRenderSetsDone();
    return;
  }

  if (state === "resting") {
    resting.style.display = "flex";
    document.getElementById("wm-rest-ex-name").textContent = exercise.name;
    document.getElementById("wm-rest-next").textContent =
      "下一组 第 " + (wm.setDone + 1) + " / " + exercise.sets + " 组";
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
      wm.exDoneTimer = setTimeout(function () {
        wmAdvanceToNextExercise();
      }, 1500);
    } else {
      document.getElementById("wm-next-hint").textContent = "所有动作都已完成";
      document.getElementById("wm-next-ex-btn").style.display = "block";
      document.getElementById("wm-next-ex-btn").textContent = "查看完成";
      wm.exDoneTimer = setTimeout(function () {
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
  clearInterval(wm.restTimer);
  wm.restEndTime = Date.now() + wm.restTotal * 1000;
  wmTickRest();
  wm.restTimer = setInterval(wmTickRest, 500);
}

function wmTickRest() {
  var remaining = Math.ceil((wm.restEndTime - Date.now()) / 1000);

  if (remaining < 0) remaining = 0;
  wmUpdateTimerDisplay(remaining);

  if (remaining <= 0) {
    clearInterval(wm.restTimer);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    wmShow("working");
  }
}

function wmUpdateTimerDisplay(seconds) {
  var minutes = Math.floor(seconds / 60);
  var secs = seconds % 60;
  var text = String(minutes).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  var timer = document.getElementById("wm-timer");

  timer.textContent = text;
  timer.className = "wm-timer" + (seconds <= 10 ? " urgent" : "");
}

function getPrevRecord(currentIndex, muscle) {
  var currentDate = parseDateString(records[currentIndex].date).getTime();
  var candidates = records.filter(function (record, index) {
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

function diffVal(current, previous, unit) {
  var hasCurrent = current !== "" && current !== undefined && current !== null;
  var hasPrevious = previous !== "" && previous !== undefined && previous !== null;
  var c;
  var p;
  var arrow;

  if (!hasCurrent && !hasPrevious) return '<span class="cmp-na">—</span>';
  if (!hasPrevious) return '<span class="cmp-na">' + current + unit + '</span>';
  if (!hasCurrent) return '<span class="cmp-na">—</span>';

  c = parseFloat(current);
  p = parseFloat(previous);
  arrow = c > p ? ' <span class="cmp-up">↑</span>' : c < p ? ' <span class="cmp-down">↓</span>' : ' <span class="cmp-eq">=</span>';
  return current + unit + arrow + ' <span class="cmp-prev">(' + previous + unit + ')</span>';
}

function showCompare(record, index) {
  var previous = getPrevRecord(index, record.muscle);
  var body = document.getElementById("compare-body");
  var currentMap = {};
  var previousMap = {};
  var allNames = [];

  document.getElementById("compare-title").textContent = record.muscle + " · 对比上次训练";
  body.innerHTML = "";

  if (!previous) {
    body.innerHTML = '<p class="cmp-empty">暂无可对比的上次训练记录</p>';
    document.getElementById("compare-modal").style.display = "flex";
    return;
  }

  record.exercises.forEach(function (exercise) {
    currentMap[exercise.name] = exercise;
    allNames.push(exercise.name);
  });
  previous.exercises.forEach(function (exercise) {
    previousMap[exercise.name] = exercise;
    if (!currentMap[exercise.name]) allNames.push(exercise.name);
  });

  body.innerHTML =
    '<div class="cmp-date-row"><span class="cmp-date-label">本次</span><span class="cmp-date-val">' + record.date +
    '</span><span class="cmp-date-sep">vs</span><span class="cmp-date-label">上次</span><span class="cmp-date-val">' +
    previous.date + '</span></div><div class="cmp-divider"></div>';

  allNames.forEach(function (name) {
    var current = currentMap[name];
    var prev = previousMap[name];
    var row = document.createElement("div");
    var left = document.createElement("div");
    var right = document.createElement("div");

    row.className = "cmp-row";
    left.className = "cmp-name";
    right.className = "cmp-fields";
    left.innerHTML = "<span>" + name + "</span>";

    if (current && !prev) {
      left.innerHTML += '<span class="cmp-badge cmp-badge-new">新增</span>';
    } else if (!current && prev) {
      left.innerHTML += '<span class="cmp-badge cmp-badge-missing">本次未做</span>';
    }

    if (!current) {
      right.innerHTML = '<span class="cmp-na">—</span>';
    } else {
      right.innerHTML =
        diffVal(current.weight, prev && prev.weight, "kg") + ' &nbsp;·&nbsp; ' +
        diffVal(current.sets, prev && prev.sets, "组") + ' &nbsp;·&nbsp; ' +
        diffVal(current.reps, prev && prev.reps, "次");
    }

    row.appendChild(left);
    row.appendChild(right);
    body.appendChild(row);
  });

  document.getElementById("compare-modal").style.display = "flex";
}

function closeCompareModal() {
  document.getElementById("compare-modal").style.display = "none";
}
