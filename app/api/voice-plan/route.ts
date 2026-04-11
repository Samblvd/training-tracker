import { NextResponse } from "next/server";

const OPENAI_RESPONSES_ENDPOINT = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-5.2-chat-latest";
const MAX_INPUT_LENGTH = 800;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 12;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitStore = Map<string, RateLimitEntry>;

type VoicePlanPayload = {
  currentMuscle?: string;
  exerciseLibraryPrompt?: string;
  recentWorkouts?: string;
  input?: string;
};

function getRateLimitStore() {
  const globalStore = globalThis as typeof globalThis & {
    __voicePlanRateLimitStore__?: RateLimitStore;
  };

  if (!globalStore.__voicePlanRateLimitStore__) {
    globalStore.__voicePlanRateLimitStore__ = new Map();
  }

  return globalStore.__voicePlanRateLimitStore__;
}

function cleanupExpiredRateLimits(store: RateLimitStore, now: number) {
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip") || "unknown";
}

function enforceRateLimit(request: Request) {
  const store = getRateLimitStore();
  const now = Date.now();
  cleanupExpiredRateLimits(store, now);

  const clientKey = getClientIp(request);
  const existing = store.get(clientKey);

  if (!existing || existing.resetAt <= now) {
    store.set(clientKey, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return null;
  }

  if (existing.count >= RATE_LIMIT_MAX_REQUESTS) {
    return Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
  }

  existing.count += 1;
  store.set(clientKey, existing);
  return null;
}

function isAllowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  try {
    const requestOrigin = new URL(request.url).origin;
    return origin === requestOrigin;
  } catch {
    return false;
  }
}

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

function buildUserPrompt(payload: VoicePlanPayload) {
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
  const apiKey = process.env.OPENAI_API_KEY;
  const modelId = process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;

  if (!apiKey) {
    return NextResponse.json({ error: "服务端未配置 OpenAI API" }, { status: 500 });
  }

  if (!isAllowedOrigin(request)) {
    return NextResponse.json({ error: "非法请求来源" }, { status: 403 });
  }

  const retryAfter = enforceRateLimit(request);
  if (retryAfter) {
    return NextResponse.json(
      { error: "请求过于频繁，请稍后再试" },
      {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
        },
      },
    );
  }

  const payload = (await request.json()) as VoicePlanPayload;
  const input = String(payload?.input || "").trim();

  if (!input) {
    return NextResponse.json({ error: "缺少训练描述" }, { status: 400 });
  }

  if (input.length > MAX_INPUT_LENGTH) {
    return NextResponse.json(
      { error: `训练描述过长，请控制在 ${MAX_INPUT_LENGTH} 个字符以内` },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(OPENAI_RESPONSES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        temperature: 0.1,
        input: [
          {
            role: "developer",
            content: [{ type: "input_text", text: buildSystemPrompt() }],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: buildUserPrompt({ ...payload, input }) }],
          },
        ],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      console.error("OpenAI voice-plan upstream error", {
        status: upstream.status,
        detail,
      });

      return NextResponse.json({ error: "AI 服务暂时不可用，请稍后再试" }, { status: 502 });
    }

    const result = await upstream.json();
    const content =
      result?.output_text ||
      result?.output
        ?.flatMap((item: { content?: Array<{ type?: string; text?: string }> }) => item.content || [])
        ?.filter((item: { type?: string; text?: string }) => item.type === "output_text")
        ?.map((item: { text?: string }) => item.text || "")
        ?.join("\n") ||
      "";

    if (!content) {
      return NextResponse.json({ error: "AI 没有返回可用内容" }, { status: 502 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Voice plan route failed", error);
    return NextResponse.json({ error: "服务端调用失败，请稍后再试" }, { status: 500 });
  }
}
