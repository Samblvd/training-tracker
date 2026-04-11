"use client";

import { Mic, Square, WandSparkles } from "lucide-react";
import { useRef, useState } from "react";

import { PanelCard } from "@/components/panel-card";
import { buildExerciseLibraryPrompt, buildRecentWorkoutPrompt, buildVoiceSummary, extractJsonFromModelResponse, normalizeVoiceModelPlan } from "@/lib/voice";
import { useTrainingStore } from "@/store/training-store";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

interface SpeechRecognitionLike extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<{
    0: {
      transcript: string;
    };
  }>;
}

export function VoicePlanPanel() {
  const selectedMuscle = useTrainingStore((state) => state.selectedMuscle);
  const records = useTrainingStore((state) => state.records);
  const voicePlan = useTrainingStore((state) => state.voicePlan);
  const setVoicePlan = useTrainingStore((state) => state.setVoicePlan);
  const applyPlanToPlanner = useTrainingStore((state) => state.applyPlanToPlanner);
  const parseVoicePlanFallback = useTrainingStore((state) => state.parseVoicePlanFallback);

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const getRecognition = () => {
    if (recognitionRef.current || typeof window === "undefined") return recognitionRef.current;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return null;
    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "zh-CN";
    recognition.onstart = () => {
      setListening(true);
      setStatus("听写中");
    };
    recognition.onend = () => {
      setListening(false);
    };
    recognition.onerror = () => {
      setListening(false);
      setStatus("识别失败");
    };
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || "")
        .join("");
      setInput(transcript.trim());
    };
    recognitionRef.current = recognition;
    return recognition;
  };

  const startListening = () => {
    const recognition = getRecognition();
    if (!recognition) {
      setStatus("不支持语音");
      return;
    }
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const parsePlan = async () => {
    if (!input.trim()) {
      setStatus("请输入内容");
      return;
    }

    setLoading(true);
    setStatus("识别中");

    try {
      const response = await fetch("/api/voice-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          currentMuscle: selectedMuscle,
          exerciseLibraryPrompt: buildExerciseLibraryPrompt(),
          recentWorkouts: buildRecentWorkoutPrompt(records),
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.content) {
        throw new Error(payload?.error || payload?.detail || "AI 解析失败");
      }
      const plan = normalizeVoiceModelPlan(extractJsonFromModelResponse(payload.content), input, selectedMuscle, records);
      setVoicePlan(plan);
      setStatus("已识别");
    } catch {
      const fallbackPlan = parseVoicePlanFallback(input);
      setVoicePlan(fallbackPlan);
      setStatus("已识别");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PanelCard title="语音 / 文本">
      <div className="grid gap-4">
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="今天练背，宽握下拉四组十次..."
          className="min-h-32 rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition focus:border-[var(--accent-strong)]"
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startListening}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            <Mic className="h-4 w-4" />
            开始听写
          </button>
          <button
            type="button"
            onClick={stopListening}
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
          >
            <Square className="h-4 w-4" />
            停止
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={parsePlan}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-strong)] px-4 py-2.5 text-sm font-medium text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <WandSparkles className="h-4 w-4" />
            {loading ? "识别中..." : "识别训练计划"}
          </button>
        </div>

        <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
          {listening ? "听写中" : status || " "}
        </div>

        {voicePlan ? (
          <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_20px_40px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-lg font-semibold tracking-[-0.03em] text-slate-950">{voicePlan.muscle}</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {buildVoiceSummary(voicePlan).map((item) => (
                    <span key={item} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => applyPlanToPlanner(voicePlan.muscle, voicePlan.exercises)}
                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                导入到当前计划
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {voicePlan.exercises.map((exercise) => (
                <div key={exercise.name} className="rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3">
                  <div className="text-sm font-semibold text-slate-950">{exercise.name}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {exercise.weight || "0"}kg · {exercise.sets || "3"} 组 · {exercise.reps || "8"} 次 · {exercise.rest || "90"} 秒
                  </div>
                  {exercise.progression ? <div className="mt-2 text-xs leading-5 text-slate-500">{exercise.progression}</div> : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </PanelCard>
  );
}
