// ── 动作数据 ──────────────────────────────────────────
var exercises = {
  胸: [
    { name: "平板卧推",     type: "主力" },
    { name: "上斜哑铃卧推", type: "主力" },
    { name: "上斜器械推胸", type: "主力" },
    { name: "蝴蝶机夹胸",   type: "孤立" },
    { name: "双杠臂屈伸",   type: "辅助" }
  ],
  肩: [
    { name: "哑铃侧平举", type: "主力" },
    { name: "绳索侧平举", type: "孤立" },
    { name: "反向飞鸟",   type: "辅助" },
    { name: "器械推肩",   type: "主力" }
  ],
  背: [
    { name: "引体向上",     type: "主力" },
    { name: "宽握高位下拉", type: "主力" },
    { name: "对握高位下拉", type: "主力" },
    { name: "坐姿划船",     type: "主力" },
    { name: "绳索面拉",     type: "辅助" }
  ],
  臀: [
    { name: "杠铃臀推",       type: "主力" },
    { name: "罗马尼亚硬拉",   type: "主力" },
    { name: "保加利亚分腿蹲", type: "单侧" },
    { name: "山羊挺身",       type: "辅助" },
    { name: "坐姿髋外展",     type: "孤立" }
  ]
};

// ── 状态 ──────────────────────────────────────────────
var records = JSON.parse(localStorage.getItem("records") || "[]");
var editingIndex = -1;

// ── 初始化 ────────────────────────────────────────────
rebuildList();
updateStats();
renderExercises();
updateLoadLastBtn();

// 获取今日日期字符串（YYYY-MM-DD），统一来源
function getTodayStr() {
  var d = new Date();
  var yyyy = d.getFullYear();
  var mm   = String(d.getMonth() + 1).padStart(2, "0");
  var dd   = String(d.getDate()).padStart(2, "0");
  return yyyy + "-" + mm + "-" + dd;
}

// 初始化：显示今日日期，隐藏日期字段填今天
(function () {
  var today = getTodayStr();
  document.getElementById("today-date").textContent = today.replace(/-/g, " / ");
  document.getElementById("date").value = today;
  // 补录日期默认填昨天
  var d = new Date(); d.setDate(d.getDate() - 1);
  var y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,"0"), dd = String(d.getDate()).padStart(2,"0");
  document.getElementById("supplement-date").value = y + "-" + m + "-" + dd;
})();

// ── 辅助：设置训练类型（更新隐藏字段 + pill 高亮 + 显示区域）
function setType(value) {
  document.getElementById("type").value = value;
  document.querySelectorAll("#type-pills .pill").forEach(function (b) {
    b.classList.toggle("active", b.dataset.value === value);
  });
  var isGym = value === "健身";
  document.getElementById("gym-section").style.display    = isGym ? "flex" : "none";
  document.getElementById("non-gym-note").style.display   = isGym ? "none"  : "block";
  document.getElementById("start-workout-btn").style.display = isGym ? "block" : "none";
  document.getElementById("btn").style.display            = isGym ? "none"  : "block";
}

// ── 辅助：设置训练部位（更新隐藏字段 + pill 高亮 + 重新渲染动作）
function setMuscle(value) {
  document.getElementById("muscle").value = value;
  document.querySelectorAll("#muscle-pills .pill").forEach(function (b) {
    b.classList.toggle("active", b.dataset.value === value);
  });
  renderExercises();
  updateLoadLastBtn();
}

// ── Pill 点击：训练类型 ───────────────────────────────
document.getElementById("type-pills").addEventListener("click", function (e) {
  var btn = e.target.closest(".pill");
  if (btn) setType(btn.dataset.value);
});

// ── Pill 点击：训练部位 ───────────────────────────────
document.getElementById("muscle-pills").addEventListener("click", function (e) {
  var btn = e.target.closest(".pill");
  if (btn) setMuscle(btn.dataset.value);
});

// ── 带入上次训练 ──────────────────────────────────────
document.getElementById("load-last-btn").onclick = function () {
  var muscle = document.getElementById("muscle").value;
  var last = getLastRecord(muscle);
  if (!last) return;

  var lastMap = {};
  last.exercises.forEach(function (ex) { lastMap[ex.name] = ex; });

  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    var cb = row.querySelector("input[type='checkbox']");
    var ex = lastMap[cb.value];
    if (ex) {
      cb.checked = true;
      row.classList.add('is-checked');
      row.querySelector(".input-weight").value = ex.weight || "";
      row.querySelector(".input-sets").value   = ex.sets   || "";
      row.querySelector(".input-reps").value   = ex.reps   || "";
    } else {
      cb.checked = false;
      row.classList.remove('is-checked');
    }
  });
};

// ── 渲染动作列表（横向单行）─────────────────────────
function renderExercises() {
  var muscle = document.getElementById("muscle").value;
  var list = document.getElementById("exercise-list");
  list.innerHTML = "";

  exercises[muscle].forEach(function (ex) {
    var name = ex.name;
    var row = document.createElement("div");
    row.className = "exercise-row";

    // 左：checkbox + 动作名
    var label = document.createElement("label");
    label.className = "ex-label";
    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = name;
    cb.addEventListener('change', function () {
      row.classList.toggle('is-checked', this.checked);
    });
    label.appendChild(cb);
    label.appendChild(document.createTextNode(name));

    // 右：重量 / 组数 / 次数（带标签）
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

// ── 添加 / 保存修改 ───────────────────────────────────
document.getElementById("btn").onclick = function () {
  var date = document.getElementById("date").value;
  var type = document.getElementById("type").value;
  var note = document.getElementById("note").value;

  if (!date) { alert("请填写日期"); return; }

  var record = { date: date, type: type };

  if (type === "健身") {
    var muscle = document.getElementById("muscle").value;
    var checkedExercises = [];

    document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
      var cb = row.querySelector("input[type='checkbox']");
      if (cb.checked) {
        checkedExercises.push({
          name:   cb.value,
          weight: row.querySelector(".input-weight").value,
          sets:   row.querySelector(".input-sets").value,
          reps:   row.querySelector(".input-reps").value
        });
      }
    });

    if (checkedExercises.length === 0) { alert("请至少选择一个动作"); return; }

    record.muscle    = muscle;
    record.exercises = checkedExercises;
    record.note      = note;
    // 备用文字（兼容旧显示逻辑）
    record.content   = muscle + "：" + checkedExercises.map(function (ex) {
      var d = [];
      if (ex.weight) d.push(ex.weight + "kg");
      if (ex.sets)   d.push(ex.sets + "组");
      if (ex.reps)   d.push(ex.reps + "次");
      return ex.name + (d.length ? "（" + d.join(" ") + "）" : "");
    }).join("、");
    if (note) record.content += " · " + note;

  } else {
    if (!note) { alert("请填写备注内容"); return; }
    record.content = note;
  }

  if (editingIndex >= 0) {
    records[editingIndex] = record;
    editingIndex = -1;
    document.getElementById("btn").textContent = "添加记录";
  } else {
    records.push(record);
  }

  localStorage.setItem("records", JSON.stringify(records));
  rebuildList();
  updateStats();
  updateLoadLastBtn();
  clearForm();
  showToast("已记录训练 ✓");
};

// ── 把记录填回表单（编辑用）──────────────────────────
function loadRecordToForm(record) {
  document.getElementById("date").value = record.date;
  setType(record.type);

  if (record.type === "健身") {
    setMuscle(record.muscle || "胸");

    var exMap = {};
    (record.exercises || []).forEach(function (ex) { exMap[ex.name] = ex; });

    document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
      var cb = row.querySelector("input[type='checkbox']");
      var ex = exMap[cb.value];
      if (ex) {
        cb.checked = true;
        row.classList.add('is-checked');
        row.querySelector(".input-weight").value = ex.weight || "";
        row.querySelector(".input-sets").value   = ex.sets   || "";
        row.querySelector(".input-reps").value   = ex.reps   || "";
      }
    });
    document.getElementById("note").value = record.note || "";
  } else {
    document.getElementById("note").value = record.content || "";
  }
}

// ── 清空表单 ──────────────────────────────────────────
// ── Toast 提示 ────────────────────────────────────────
var toastTimer = null;
function showToast(msg) {
  var toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 1800);
}

function clearForm() {
  document.getElementById("date").value = getTodayStr();
  var noteEl = document.getElementById("note");
  if (noteEl) noteEl.value = "";
  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    row.classList.remove('is-checked');
    row.querySelectorAll("input").forEach(function (input) {
      if (input.type === "checkbox") input.checked = false;
      else input.value = "";
    });
  });
}

// ── 重建整个记录列表 ──────────────────────────────────
function rebuildList() {
  var list = document.getElementById("list");
  list.innerHTML = "";
  // 按日期倒序展示（最新在上），但 data-index 保持原数组位置不变
  var sorted = records.map(function (r, i) { return { r: r, i: i }; });
  sorted.sort(function (a, b) {
    return new Date(b.r.date).getTime() - new Date(a.r.date).getTime();
  });
  sorted.forEach(function (item) { addToList(item.r, item.i); });
}

// ── 把一条记录渲染成结构化卡片 ───────────────────────
function addToList(record, index) {
  var li = document.createElement("li");
  li.className = "record-card";
  li.setAttribute("data-index", index);

  // ── 卡片顶部：标签 + 日期 + 按钮 ──
  var header = document.createElement("div");
  header.className = "card-header";

  var tag = document.createElement("span");
  tag.className = "card-tag tag-" + record.type;
  // 健身记录显示部位，其他显示类型
  tag.textContent = (record.type === "健身" && record.muscle) ? record.muscle : record.type;

  var dateSpan = document.createElement("span");
  dateSpan.className = "card-date";
  dateSpan.textContent = record.date;

  var headerLeft = document.createElement("div");
  headerLeft.className = "card-header-left";
  headerLeft.appendChild(tag);
  headerLeft.appendChild(dateSpan);

  // 编辑按钮
  var editBtn = document.createElement("button");
  editBtn.textContent = "编辑";
  editBtn.className = "edit-btn";
  editBtn.onclick = function () {
    editingIndex = parseInt(li.getAttribute("data-index"));
    loadRecordToForm(records[editingIndex]);
    document.getElementById("btn").textContent = "保存修改";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 删除按钮
  var delBtn = document.createElement("button");
  delBtn.textContent = "删除";
  delBtn.className = "del-btn";
  delBtn.onclick = function () {
    var i = parseInt(li.getAttribute("data-index"));
    if (editingIndex === i) {
      editingIndex = -1;
      document.getElementById("btn").textContent = "添加记录";
      clearForm();
    } else if (editingIndex > i) {
      editingIndex--;
    }
    records.splice(i, 1);
    localStorage.setItem("records", JSON.stringify(records));
    rebuildList();
    updateStats();
    updateLoadLastBtn();
  };

  // "对比上次"按钮（仅健身记录）
  var btnGroup = document.createElement("div");
  btnGroup.className = "btn-group";

  if (record.type === "健身" && record.exercises && record.exercises.length > 0) {
    var cmpBtn = document.createElement("button");
    cmpBtn.textContent = "对比上次";
    cmpBtn.className = "cmp-btn";
    cmpBtn.onclick = function () {
      var i = parseInt(li.getAttribute("data-index"));
      showCompare(records[i], i);
    };
    btnGroup.appendChild(cmpBtn);
  }

  btnGroup.appendChild(editBtn);
  btnGroup.appendChild(delBtn);

  header.appendChild(headerLeft);
  header.appendChild(btnGroup);
  li.appendChild(header);

  // ── 卡片内容区 ──
  var body = document.createElement("div");
  body.className = "card-body";

  if (record.type === "健身" && record.exercises && record.exercises.length > 0) {
    // 每个动作独占一行
    record.exercises.forEach(function (ex) {
      var row = document.createElement("div");
      row.className = "card-ex-row";

      var nameSpan = document.createElement("span");
      nameSpan.className = "card-ex-name";
      nameSpan.textContent = ex.name;

      var detailSpan = document.createElement("span");
      detailSpan.className = "card-ex-detail";
      var parts = [];
      if (ex.weight) parts.push(ex.weight + " kg");
      if (ex.sets)   parts.push(ex.sets + " 组");
      if (ex.reps)   parts.push(ex.reps + " 次");
      detailSpan.textContent = parts.length ? parts.join(" × ") : "";

      row.appendChild(nameSpan);
      row.appendChild(detailSpan);
      body.appendChild(row);
    });

    if (record.note) {
      var noteDiv = document.createElement("div");
      noteDiv.className = "card-note";
      noteDiv.textContent = "备注：" + record.note;
      body.appendChild(noteDiv);
    }

  } else {
    // 旧记录 / 非健身记录
    var contentDiv = document.createElement("div");
    contentDiv.className = "card-content";
    contentDiv.textContent = record.content || "";
    body.appendChild(contentDiv);
  }

  li.appendChild(body);
  document.getElementById("list").appendChild(li);
}

// ── 工具函数 ──────────────────────────────────────────
function getLastRecord(muscle) {
  for (var i = records.length - 1; i >= 0; i--) {
    if (records[i].type === "健身" && records[i].muscle === muscle && records[i].exercises) {
      return records[i];
    }
  }
  return null;
}

function updateLoadLastBtn() {
  var muscle = document.getElementById("muscle").value;
  document.getElementById("load-last-btn").style.display =
    getLastRecord(muscle) ? "flex" : "none";
}

// ── AI Modal ──────────────────────────────────────────

// Mock 训练计划数据（按部位 × 目标）
var mockPlans = {
  胸: {
    增肌: [
      { name: "上斜哑铃卧推",   weight: "60", sets: "4", reps: "10", note: "控制离心，顶峰停顿" },
      { name: "上斜器械推胸",   weight: "55", sets: "3", reps: "12", note: "全程保持背部收紧" },
      { name: "蝴蝶机夹胸",     weight: "35", sets: "3", reps: "15", note: "顶峰收缩 1 秒" },
      { name: "双杠臂屈伸",     weight: "—",  sets: "3", reps: "12", note: "上身前倾，感受胸部发力" }
    ],
    保持: [
      { name: "上斜哑铃卧推",   weight: "55", sets: "3", reps: "10", note: "" },
      { name: "蝴蝶机夹胸",     weight: "30", sets: "3", reps: "12", note: "" },
      { name: "双杠臂屈伸",     weight: "—",  sets: "3", reps: "10", note: "" }
    ],
    恢复: [
      { name: "上斜器械推胸",   weight: "40", sets: "3", reps: "15", note: "轻重量，感受肌肉" },
      { name: "蝴蝶机夹胸",     weight: "25", sets: "3", reps: "15", note: "充分拉伸" }
    ]
  },
  肩: {
    增肌: [
      { name: "器械推肩",       weight: "50", sets: "4", reps: "10", note: "不要耸肩" },
      { name: "哑铃侧平举",     weight: "12", sets: "4", reps: "15", note: "小臂略低于大臂" },
      { name: "绳索侧平举",     weight: "8",  sets: "3", reps: "15", note: "单侧交替" },
      { name: "反向飞鸟",       weight: "10", sets: "3", reps: "15", note: "感受后束收缩" }
    ],
    保持: [
      { name: "哑铃侧平举",     weight: "10", sets: "3", reps: "12", note: "" },
      { name: "器械推肩",       weight: "45", sets: "3", reps: "10", note: "" },
      { name: "反向飞鸟",       weight: "8",  sets: "3", reps: "12", note: "" }
    ],
    恢复: [
      { name: "哑铃侧平举",     weight: "8",  sets: "3", reps: "15", note: "轻重量，高次数" },
      { name: "绳索侧平举",     weight: "5",  sets: "3", reps: "15", note: "" }
    ]
  },
  背: {
    增肌: [
      { name: "宽握高位下拉",   weight: "65", sets: "4", reps: "10", note: "下拉至锁骨，挺胸" },
      { name: "对握高位下拉",   weight: "60", sets: "3", reps: "12", note: "" },
      { name: "坐姿划船",       weight: "60", sets: "4", reps: "10", note: "顶峰收缩，背部发力" },
      { name: "绳索面拉",       weight: "20", sets: "3", reps: "15", note: "手肘与肩同高" }
    ],
    保持: [
      { name: "宽握高位下拉",   weight: "60", sets: "3", reps: "10", note: "" },
      { name: "坐姿划船",       weight: "55", sets: "3", reps: "10", note: "" },
      { name: "绳索面拉",       weight: "18", sets: "3", reps: "12", note: "" }
    ],
    恢复: [
      { name: "对握高位下拉",   weight: "45", sets: "3", reps: "15", note: "轻重量，感受背部" },
      { name: "绳索面拉",       weight: "15", sets: "3", reps: "15", note: "" }
    ]
  },
  臀: {
    增肌: [
      { name: "杠铃臀推",       weight: "80", sets: "4", reps: "10", note: "顶峰收缩，挤压臀部" },
      { name: "罗马尼亚硬拉",   weight: "60", sets: "4", reps: "10", note: "髋关节主导，背部挺直" },
      { name: "保加利亚分腿蹲", weight: "20", sets: "3", reps: "10", note: "单侧，控制下降速度" },
      { name: "绳索后踢",       weight: "15", sets: "3", reps: "15", note: "单腿交替，感受臀部收缩" },
      { name: "坐姿髋外展",     weight: "50", sets: "3", reps: "15", note: "全程保持核心收紧" }
    ],
    保持: [
      { name: "杠铃臀推",       weight: "70", sets: "3", reps: "10", note: "" },
      { name: "罗马尼亚硬拉",   weight: "50", sets: "3", reps: "10", note: "" },
      { name: "坐姿髋外展",     weight: "45", sets: "3", reps: "15", note: "" }
    ],
    恢复: [
      { name: "绳索后踢",       weight: "10", sets: "3", reps: "15", note: "轻重量，感受发力" },
      { name: "坐姿髋外展",     weight: "35", sets: "3", reps: "15", note: "慢速，充分拉伸" }
    ]
  }
};

// 当前 AI 选项状态
var aiSelection = { muscle: "胸", goal: "增肌", duration: "45", equipment: "健身房" };

// 打开 Modal
document.getElementById("ai-open-btn").onclick = function () {
  document.getElementById("ai-modal").style.display = "flex";
  document.getElementById("ai-result").style.display = "none";
};

// 关闭 Modal（× 按钮 或 点遮罩）
document.getElementById("ai-modal-close").onclick = closeAiModal;
document.getElementById("ai-modal").onclick = function (e) {
  if (e.target === this) closeAiModal();
};

function closeAiModal() {
  document.getElementById("ai-modal").style.display = "none";
}

// 选项按钮单选切换
["ai-muscle", "ai-goal", "ai-duration", "ai-equipment"].forEach(function (groupId) {
  document.getElementById(groupId).addEventListener("click", function (e) {
    var btn = e.target.closest(".opt-btn");
    if (!btn) return;
    this.querySelectorAll(".opt-btn").forEach(function (b) { b.classList.remove("active"); });
    btn.classList.add("active");
    // 同步到 aiSelection
    var keyMap = { "ai-muscle": "muscle", "ai-goal": "goal", "ai-duration": "duration", "ai-equipment": "equipment" };
    aiSelection[keyMap[groupId]] = btn.dataset.value;
  });
});

// 生成计划（渲染 mock 数据）
document.getElementById("ai-generate-btn").onclick = function () {
  renderAiResult();
};

// 重新生成
document.getElementById("ai-regen-btn").onclick = function () {
  renderAiResult();
};

// 渲染 AI 结果
function renderAiResult() {
  var muscle = aiSelection.muscle;
  var goal   = aiSelection.goal;
  var plan   = (mockPlans[muscle] && mockPlans[muscle][goal]) || [];

  // 标题
  document.getElementById("ai-result-title").textContent =
    muscle + " · " + goal + " · " + aiSelection.duration + " 分钟（" + aiSelection.equipment + "）";

  // 动作列表
  var listEl = document.getElementById("ai-result-list");
  listEl.innerHTML = "";

  plan.forEach(function (ex) {
    var row = document.createElement("div");
    row.className = "ai-ex-row";

    var left = document.createElement("div");
    left.className = "ai-ex-left";

    var name = document.createElement("span");
    name.className = "ai-ex-name";
    name.textContent = ex.name;

    left.appendChild(name);

    if (ex.note) {
      var note = document.createElement("span");
      note.className = "ai-ex-note";
      note.textContent = ex.note;
      left.appendChild(note);
    }

    var detail = document.createElement("span");
    detail.className = "ai-ex-detail";
    var parts = [];
    if (ex.weight && ex.weight !== "—") parts.push(ex.weight + " kg");
    if (ex.sets)   parts.push(ex.sets + " 组");
    if (ex.reps)   parts.push(ex.reps + " 次");
    detail.textContent = parts.join(" × ");

    row.appendChild(left);
    row.appendChild(detail);
    listEl.appendChild(row);
  });

  document.getElementById("ai-result").style.display = "block";
}

// 导入到今日训练
document.getElementById("ai-import-btn").onclick = function () {
  var muscle = aiSelection.muscle;
  var goal   = aiSelection.goal;
  var plan   = (mockPlans[muscle] && mockPlans[muscle][goal]) || [];

  // 切换左栏到健身模式
  setType("健身");
  setMuscle(muscle);

  // 勾选动作并填入数据
  var planMap = {};
  plan.forEach(function (ex) { planMap[ex.name] = ex; });

  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    var cb = row.querySelector("input[type='checkbox']");
    var ex = planMap[cb.value];
    if (ex) {
      cb.checked = true;
      row.classList.add('is-checked');
      row.querySelector(".input-weight").value = (ex.weight === "—") ? "" : (ex.weight || "");
      row.querySelector(".input-sets").value   = ex.sets   || "";
      row.querySelector(".input-reps").value   = ex.reps   || "";
    } else {
      cb.checked = false;
      row.classList.remove('is-checked');
    }
  });

  closeAiModal();
};

// ══════════════════════════════════════════════════════
// 训练中模式
// ══════════════════════════════════════════════════════

var wm = {
  exercises:   [],   // [{name, weight, sets, reps}, ...]
  exIdx:       0,    // 当前动作下标
  setDone:     0,    // 当前动作已完成组数
  restTimer:   null, // setInterval 句柄
  restSecs:    0,    // 当前剩余秒数
  restTotal:   90,   // 本次休息时长（秒，可由输入框修改）
  sessionLog:  []    // 本次训练记录
  /*
    sessionLog[i] = {
      name, targetWeight, targetSets, targetReps,
      completedSets: [{ setNumber, weight, reps, restSeconds }, ...]
    }
  */
};

// ── 入口：读取已勾选动作，进入训练模式 ──────────────
document.getElementById("start-workout-btn").onclick = function () {
  var list = [];
  document.querySelectorAll("#exercise-list .exercise-row").forEach(function (row) {
    var cb = row.querySelector("input[type='checkbox']");
    if (!cb.checked) return;
    list.push({
      name:   cb.value,
      weight: row.querySelector(".input-weight").value || "—",
      sets:   parseInt(row.querySelector(".input-sets").value)  || 3,
      reps:   row.querySelector(".input-reps").value  || "—"
    });
  });

  if (list.length === 0) {
    showToast("请先勾选动作");
    return;
  }

  wm.exercises  = list;
  wm.exIdx      = 0;
  wm.setDone    = 0;
  wm.restTotal  = 90;
  wm.sessionLog = list.map(function (ex) {
    return {
      name:          ex.name,
      targetWeight:  ex.weight,
      targetSets:    ex.sets,
      targetReps:    ex.reps,
      completedSets: []
    };
  });
  clearInterval(wm.restTimer);

  document.getElementById("workout-overlay").style.display = "flex";
  wmShow("working");
};

// ── 退出训练 ─────────────────────────────────────────
document.getElementById("wm-exit-btn").onclick = function () {
  clearInterval(wm.restTimer);
  document.getElementById("workout-overlay").style.display = "none";
};

// ── 完成本组 ─────────────────────────────────────────
document.getElementById("wm-done-btn").onclick = function () {
  var ex = wm.exercises[wm.exIdx];

  // 读取本组实际数据
  var actualWeight = document.getElementById("wm-input-weight").value || ex.weight;
  var actualReps   = document.getElementById("wm-input-reps").value   || ex.reps;
  var restSecs     = parseInt(document.getElementById("wm-input-rest").value) || 90;

  // 更新休息时长
  wm.restTotal = restSecs;

  // 记录本组数据
  wm.sessionLog[wm.exIdx].completedSets.push({
    setNumber:   wm.setDone + 1,
    weight:      actualWeight,
    reps:        actualReps,
    restSeconds: restSecs
  });

  wm.setDone++;

  if (wm.setDone >= ex.sets) {
    clearInterval(wm.restTimer);
    wmShow("ex-done");
  } else {
    wmShow("resting");
  }
};

// ── 跳过休息 ─────────────────────────────────────────
document.getElementById("wm-skip-btn").onclick = function () {
  clearInterval(wm.restTimer);
  wmShow("working");
};

// ── 进入下一动作 ─────────────────────────────────────
document.getElementById("wm-next-ex-btn").onclick = function () {
  wm.exIdx++;
  wm.setDone = 0;
  wmShow("working");
};

// ── 训练完成：自动记录 + 返回 ────────────────────────
document.getElementById("wm-finish-btn").onclick = function () {
  clearInterval(wm.restTimer);
  wmAutoSave();
  document.getElementById("workout-overlay").style.display = "none";
  showToast("训练已记录 ✓");
};

// ── 自动保存本次训练到历史记录 ───────────────────────
function wmAutoSave() {
  if (wm.sessionLog.length === 0) return;

  var muscle = document.getElementById("muscle").value;
  var exList = wm.sessionLog
    .filter(function (log) { return log.completedSets.length > 0; })
    .map(function (log) {
      var last = log.completedSets[log.completedSets.length - 1];
      return {
        name:   log.name,
        weight: last.weight,
        sets:   String(log.completedSets.length),
        reps:   last.reps
      };
    });

  if (exList.length === 0) return;

  var record = {
    date:      getTodayStr(),
    type:      "健身",
    muscle:    muscle,
    exercises: exList,
    note:      "",
    content:   muscle + "：" + exList.map(function (ex) {
      return ex.name + "（" + ex.weight + "kg " + ex.sets + "组 " + ex.reps + "次）";
    }).join("、")
  };

  records.push(record);
  localStorage.setItem("records", JSON.stringify(records));
  rebuildList();
  updateStats();
  updateLoadLastBtn();
}

// ══════════════════════════════════════════════════════
// 补录过去训练 Modal
// ══════════════════════════════════════════════════════

document.getElementById("supplement-open-btn").onclick = function () {
  document.getElementById("supplement-modal").style.display = "flex";
};

document.getElementById("supplement-modal-close").onclick = function () {
  document.getElementById("supplement-modal").style.display = "none";
};

document.getElementById("supplement-modal").onclick = function (e) {
  if (e.target === this) this.style.display = "none";
};

// 补录类型切换：健身显示部位选择
document.getElementById("supplement-type").onchange = function () {
  document.getElementById("supplement-muscle-field").style.display =
    this.value === "健身" ? "block" : "none";
};

// 保存补录记录
document.getElementById("supplement-save-btn").onclick = function () {
  var date = document.getElementById("supplement-date").value;
  var type = document.getElementById("supplement-type").value;
  var note = document.getElementById("supplement-note").value;

  if (!date) { showToast("请填写日期"); return; }

  var record = { date: date, type: type };

  if (type === "健身") {
    var muscle = document.getElementById("supplement-muscle").value;
    record.muscle    = muscle;
    record.exercises = [];
    record.note      = note;
    record.content   = muscle + " 训练" + (note ? " · " + note : "");
  } else {
    if (!note) { showToast("请填写备注内容"); return; }
    record.content = note;
  }

  records.push(record);
  localStorage.setItem("records", JSON.stringify(records));
  rebuildList();
  updateStats();

  document.getElementById("supplement-modal").style.display = "none";
  document.getElementById("supplement-note").value = "";
  showToast("记录已补录 ✓");
};

// ── 核心渲染：根据状态更新面板 ───────────────────────
function wmShow(state) {
  var ex = wm.exercises[wm.exIdx];

  // 隐藏所有子区块
  document.getElementById("wm-main").style.display    = "none";
  document.getElementById("wm-ex-done").style.display = "none";
  document.getElementById("wm-all-done").style.display = "none";

  if (state === "working") {
    document.getElementById("wm-main").style.display = "flex";
    document.getElementById("wm-main").style.flexDirection = "column";
    document.getElementById("wm-main").style.alignItems = "center";
    document.getElementById("wm-rest-area").style.display = "none";
    document.getElementById("wm-set-inputs").style.display = "flex";
    document.getElementById("wm-done-btn").style.display = "block";

    document.getElementById("wm-ex-name").textContent  = ex.name;
    document.getElementById("wm-target").textContent   =
      ex.weight + " kg  ×  " + ex.sets + " 组  ×  " + ex.reps + " 次";
    document.getElementById("wm-progress").textContent =
      "第 " + (wm.setDone + 1) + " / " + ex.sets + " 组";

    // 预填输入框：首组用目标值，后续组用上一组实际值
    var log = wm.sessionLog[wm.exIdx].completedSets;
    var prev = log.length > 0 ? log[log.length - 1] : null;
    document.getElementById("wm-input-weight").value = prev ? prev.weight : ex.weight;
    document.getElementById("wm-input-reps").value   = prev ? prev.reps   : ex.reps;
    document.getElementById("wm-input-rest").value   = wm.restTotal;

  } else if (state === "resting") {
    document.getElementById("wm-main").style.display = "flex";
    document.getElementById("wm-main").style.flexDirection = "column";
    document.getElementById("wm-main").style.alignItems = "center";
    document.getElementById("wm-rest-area").style.display = "flex";
    document.getElementById("wm-set-inputs").style.display = "none";
    document.getElementById("wm-done-btn").style.display = "none";

    document.getElementById("wm-ex-name").textContent  = ex.name;
    document.getElementById("wm-target").textContent   =
      ex.weight + " kg  ×  " + ex.sets + " 组  ×  " + ex.reps + " 次";
    document.getElementById("wm-progress").textContent =
      "已完成 " + wm.setDone + " / " + ex.sets + " 组";

    wmStartRest();

  } else if (state === "ex-done") {
    document.getElementById("wm-ex-done").style.display = "flex";
    document.getElementById("wm-ex-done").style.flexDirection = "column";
    document.getElementById("wm-ex-done").style.alignItems = "center";

    document.getElementById("wm-done-msg").textContent = ex.name + " 完成！";

    if (wm.exIdx + 1 < wm.exercises.length) {
      var next = wm.exercises[wm.exIdx + 1];
      document.getElementById("wm-next-hint").textContent = "下一个：" + next.name;
      document.getElementById("wm-next-ex-btn").style.display = "block";
      document.getElementById("wm-finish-btn").style.display  = "none";
    } else {
      document.getElementById("wm-next-hint").textContent = "所有动作已完成";
      document.getElementById("wm-next-ex-btn").style.display = "none";
      // 短暂延迟后自动跳到 all-done
      setTimeout(function () { wmShow("all-done"); }, 1200);
    }

  } else if (state === "all-done") {
    document.getElementById("wm-all-done").style.display = "flex";
    document.getElementById("wm-all-done").style.flexDirection = "column";
    document.getElementById("wm-all-done").style.alignItems = "center";
  }
}

// ── 组间倒计时 ────────────────────────────────────────
function wmStartRest() {
  clearInterval(wm.restTimer);
  wm.restSecs = wm.restTotal;
  wmUpdateTimerDisplay();

  wm.restTimer = setInterval(function () {
    wm.restSecs--;
    wmUpdateTimerDisplay();

    if (wm.restSecs <= 0) {
      clearInterval(wm.restTimer);
      // 尝试震动提醒（移动端）
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      document.getElementById("wm-rest-label").textContent = "开始下一组！";
      document.getElementById("wm-done-btn").style.display = "block";
    }
  }, 1000);
}

function wmUpdateTimerDisplay() {
  var m = Math.floor(wm.restSecs / 60);
  var s = wm.restSecs % 60;
  var text = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
  var el = document.getElementById("wm-timer");
  el.textContent = text;
  el.className = "wm-timer" + (wm.restSecs <= 10 ? " urgent" : "");
}

function updateStats() {
  var counts = { 健身: 0, 足球: 0, 网球: 0 };
  records.forEach(function (r) {
    if (counts[r.type] !== undefined) counts[r.type]++;
  });
  document.getElementById("total").textContent      = records.length;
  document.getElementById("count-健身").textContent = counts["健身"];
  document.getElementById("count-足球").textContent = counts["足球"];
  document.getElementById("count-网球").textContent = counts["网球"];
  var countEl = document.getElementById("record-count");
  if (countEl) countEl.textContent = records.length + " 条";
}

// ── 对比上次训练 ──────────────────────────────────────

// 找到 currentIndex 之前最近的同部位健身记录
function getPrevRecord(currentIndex, muscle) {
  var currentDate = new Date(records[currentIndex].date).getTime();

  // 筛选：同部位、有动作数据、日期严格早于当前记录
  var candidates = records.filter(function (r, i) {
    return i !== currentIndex &&
           r.type === "健身" &&
           r.muscle === muscle &&
           r.exercises &&
           new Date(r.date).getTime() < currentDate;
  });

  if (candidates.length === 0) return null;

  // 按日期降序排列，取最近的一条
  candidates.sort(function (a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return candidates[0];
}

// 生成单个数值的对比 HTML（带 ↑↓= 箭头）
function diffVal(cur, pre, unit) {
  var hasCur = cur !== "" && cur !== undefined && cur !== null;
  var hasPre = pre !== "" && pre !== undefined && pre !== null;
  if (!hasCur && !hasPre) return '<span class="cmp-na">—</span>';
  if (!hasPre) return '<span class="cmp-na">' + cur + unit + '</span>';
  if (!hasCur) return '<span class="cmp-na">—</span>';
  var c = parseFloat(cur), p = parseFloat(pre);
  var arrow = c > p ? ' <span class="cmp-up">↑</span>'
            : c < p ? ' <span class="cmp-down">↓</span>'
            : ' <span class="cmp-eq">=</span>';
  return cur + unit + arrow + ' <span class="cmp-prev">(' + pre + unit + ')</span>';
}

// 打开对比弹窗
function showCompare(record, index) {
  var prev = getPrevRecord(index, record.muscle);
  var body = document.getElementById("compare-body");
  body.innerHTML = "";

  // 更新弹窗标题
  document.getElementById("compare-title").textContent =
    record.muscle + " · 对比上次训练";

  // 无上次记录
  if (!prev) {
    body.innerHTML = '<p class="cmp-empty">暂无可对比的上次训练记录</p>';
    document.getElementById("compare-modal").style.display = "flex";
    return;
  }

  // 日期对比行
  var dateRow = document.createElement("div");
  dateRow.className = "cmp-date-row";
  dateRow.innerHTML =
    '<span class="cmp-date-label">本次</span><span class="cmp-date-val">' + record.date + '</span>' +
    '<span class="cmp-date-sep">vs</span>' +
    '<span class="cmp-date-label">上次</span><span class="cmp-date-val">' + prev.date + '</span>';
  body.appendChild(dateRow);

  // 分隔线
  var hr = document.createElement("div");
  hr.className = "cmp-divider";
  body.appendChild(hr);

  // 建立动作 map
  var curMap = {}, preMap = {};
  record.exercises.forEach(function (ex) { curMap[ex.name] = ex; });
  prev.exercises.forEach(function (ex) { preMap[ex.name] = ex; });

  // 合并所有动作名（本次顺序优先，再追加上次有本次没有的）
  var allNames = [];
  record.exercises.forEach(function (ex) { allNames.push(ex.name); });
  prev.exercises.forEach(function (ex) {
    if (!curMap[ex.name]) allNames.push(ex.name);
  });

  // 渲染每个动作的对比行
  allNames.forEach(function (name) {
    var cur = curMap[name];
    var pre = preMap[name];

    var row = document.createElement("div");
    row.className = "cmp-row";

    // 左：动作名 + 状态标签
    var left = document.createElement("div");
    left.className = "cmp-name";
    var nameSpan = document.createElement("span");
    nameSpan.textContent = name;
    left.appendChild(nameSpan);

    if (cur && !pre) {
      var badge = document.createElement("span");
      badge.className = "cmp-badge cmp-badge-new";
      badge.textContent = "新增";
      left.appendChild(badge);
    } else if (!cur && pre) {
      var badge = document.createElement("span");
      badge.className = "cmp-badge cmp-badge-missing";
      badge.textContent = "本次未做";
      left.appendChild(badge);
    }

    // 右：重量 / 组数 / 次数对比
    var right = document.createElement("div");
    right.className = "cmp-fields";

    if (!cur) {
      right.innerHTML = '<span class="cmp-na">—</span>';
    } else {
      right.innerHTML =
        diffVal(cur.weight, pre && pre.weight, "kg") + ' &nbsp;·&nbsp; ' +
        diffVal(cur.sets,   pre && pre.sets,   "组") + ' &nbsp;·&nbsp; ' +
        diffVal(cur.reps,   pre && pre.reps,   "次");
    }

    row.appendChild(left);
    row.appendChild(right);
    body.appendChild(row);
  });

  document.getElementById("compare-modal").style.display = "flex";
}

// 关闭对比弹窗
document.getElementById("compare-modal-close").onclick = closeCompareModal;
document.getElementById("compare-modal").onclick = function (e) {
  if (e.target === this) closeCompareModal();
};
function closeCompareModal() {
  document.getElementById("compare-modal").style.display = "none";
}
