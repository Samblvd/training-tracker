import { NextResponse } from "next/server";

const DOUBAO_API_ENDPOINT = "https://ark.volces.com/api/v3/chat/completions";

function buildSystemPrompt() {
  return [
    "你是健身训练助手，只负责把中文自然语言训练描述解析为训练计划 JSON。",
    "用户输入可能包含口语、省略、错别字、斤/公斤混用、复杂句式，你要做稳健归一化。",
    "只返回 JSON，不要返回解释、Markdown、代码块。",
    '输出格式必须是：{"muscle":"背","suggestions":["宽握下拉可以先保持当前重量"],"exercises":[{"name":"宽握下拉","sets":4,"reps":"8-10","weight":65,"weight_unit":"kg","rest":90,"intensity":"RPE 8","progression":"如果做满，下次+2.5kg"}]}。',
    "动作名称必须严格从给定动作库里选择最接近的标准名称，不要自造名称。",
    "重量统一换算为 kg；如果用户说斤，自动除以 2。",
    "如果用户没说部位，就根据动作推断 muscle。",
    "如果用户没说 rest 或 intensity，可以合理补全常见值。",
    "可以结合提供的历史训练记录，给出最多 3 条简短建议。",
  ].join("\n");
}

function buildUserPrompt(payload: {
  currentMuscle?: string;
  exerciseLibraryPrompt?: string;
  recentWorkouts?: string;
  input?: string;
}) {
  return [
    `当前选中的训练部位：${payload.currentMuscle || ""}`,
    "动作库：",
    payload.exerciseLibraryPrompt || "",
    "最近训练记录：",
    payload.recentWorkouts || "暂无历史训练记录。",
    `用户原始输入：${payload.input || ""}`,
  ].join("\n");
}

export async function POST(request: Request) {
  const apiKey = process.env.DOUBAO_API_KEY;
  const modelId = process.env.DOUBAO_MODEL_ID;

  if (!apiKey || !modelId) {
    return NextResponse.json({ error: "服务端未配置 Doubao API" }, { status: 500 });
  }

  const payload = await request.json();
  if (!payload?.input || !String(payload.input).trim()) {
    return NextResponse.json({ error: "缺少训练描述" }, { status: 400 });
  }

  try {
    const upstream = await fetch(DOUBAO_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        temperature: 0.1,
        messages: [
          { role: "system", content: buildSystemPrompt() },
          { role: "user", content: buildUserPrompt(payload) },
        ],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      return NextResponse.json({ error: "Doubao 请求失败", detail }, { status: upstream.status });
    }

    const result = await upstream.json();
    const content = result?.choices?.[0]?.message?.content || "";

    if (!content) {
      return NextResponse.json({ error: "Doubao 没有返回可用内容" }, { status: 502 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "服务端调用失败" },
      { status: 500 },
    );
  }
}
