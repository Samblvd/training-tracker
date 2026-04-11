const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const STATIC_FILES = {
  "/": "index.html",
  "/index.html": "index.html",
  "/script.js": "script.js",
  "/style.css": "style.css"
};
const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8"
};
const DOUBAO_API_ENDPOINT = "https://ark.volces.com/api/v3/chat/completions";

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function serveStatic(res, pathname) {
  const fileName = STATIC_FILES[pathname];
  if (!fileName) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not Found");
    return;
  }

  const filePath = path.join(ROOT, fileName);
  const ext = path.extname(filePath);
  res.writeHead(200, {
    "Content-Type": CONTENT_TYPES[ext] || "text/plain; charset=utf-8"
  });
  fs.createReadStream(filePath).pipe(res);
}

function readRequestBody(req) {
  return new Promise(function (resolve, reject) {
    let body = "";
    req.on("data", function (chunk) {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error("请求体过大"));
      }
    });
    req.on("end", function () {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("请求体不是有效 JSON"));
      }
    });
    req.on("error", reject);
  });
}

function buildSystemPrompt() {
  return [
    "你是健身训练助手，只负责把中文自然语言训练描述解析为训练计划 JSON。",
    "用户输入可能包含口语、省略、错别字、斤/公斤混用、复杂句式，你要做稳健归一化。",
    "只返回 JSON，不要返回解释、Markdown、代码块。",    "输出格式必须是：{\"muscle\": \"背\", \"suggestions\": [\"宽握下拉可以先保持当前重量\"], \"exercises\": [{\"name\": \"宽握下拉\", \"sets\": 4, \"reps\": \"8-10\", \"weight\": 65, \"weight_unit\": \"kg\", \"rest\": 90, \"intensity\": \"RPE 8\", \"progression\": \"如果做满，下次+2.5kg\"}]}。",
    "动作名称必须严格从给定动作库里选择最接近的标准名称，不要自造名称。",
    "重量统一换算为 kg；如果用户说斤，自动除以 2。",
    "如果用户没说部位，就根据动作推断 muscle。",
    "如果用户没说 rest 或 intensity，可以合理补全常见值。",
    "可以结合提供的历史训练记录，给出最多 3 条简短建议。"
  ].join("\n");
}

function buildUserPrompt(payload) {
  return [
    "当前选中的训练部位：" + (payload.currentMuscle || ""),
    "动作库：",
    payload.exerciseLibraryPrompt || "",
    "最近训练记录：",
    payload.recentWorkouts || "暂无历史训练记录。",
    "用户原始输入：" + (payload.input || "")
  ].join("\n");
}

async function handleVoicePlan(req, res) {
  const apiKey = process.env.DOUBAO_API_KEY;
  const modelId = process.env.DOUBAO_MODEL_ID;

  if (!apiKey || !modelId) {
    sendJson(res, 500, { error: "服务端未配置 Doubao API" });
    return;
  }

  let payload;
  try {
    payload = await readRequestBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error.message || "请求无效" });
    return;
  }

  if (!payload.input || !String(payload.input).trim()) {
    sendJson(res, 400, { error: "缺少训练描述" });
    return;
  }

  try {
    const upstream = await fetch(DOUBAO_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: modelId,
        temperature: 0.1,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(payload) }
        ]
      })
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      sendJson(res, upstream.status, { error: "Doubao 请求失败", detail: detail });
      return;
    }

    const result = await upstream.json();
    const content = result && result.choices && result.choices[0] && result.choices[0].message
      ? result.choices[0].message.content
      : "";

    if (!content) {
      sendJson(res, 502, { error: "Doubao 没有返回可用内容" });
      return;
    }

    sendJson(res, 200, { content: content });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "服务端调用失败" });
  }
}

const server = http.createServer(function (req, res) {
  const url = new URL(req.url, "http://localhost");

  if (req.method === "POST" && url.pathname === "/api/voice-plan") {
    handleVoicePlan(req, res);
    return;
  }

  if (req.method === "GET") {
    serveStatic(res, url.pathname);
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Method Not Allowed");
});

server.listen(PORT, function () {
  console.log("Training app server running at http://localhost:" + PORT);
});
