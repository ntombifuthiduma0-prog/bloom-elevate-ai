import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";
import {
  BLOOM_MODEL,
  createLovableAiGatewayProvider,
  gatewayErrorMessage,
  requireApiKey,
} from "./ai-gateway.server";
import {
  EMAIL_SYSTEM_PROMPT,
  PLANNER_SYSTEM_PROMPT,
  buildEmailPrompt,
  buildPlannerPrompt,
} from "./prompts";

const EmailInput = z.object({
  purpose: z.string().min(3),
  clientName: z.string().optional(),
  situation: z.string().optional(),
  details: z.string().optional(),
  outcome: z.string().optional(),
  tone: z.string().min(1),
});

const TaskInput = z.object({
  name: z.string(),
  deadline: z.string(),
  duration: z.string(),
  priority: z.string(),
  status: z.string(),
});

const PlannerInput = z.object({
  eventDate: z.string(),
  eventType: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  eventCount: z.string(),
  notes: z.string(),
  tasks: z.array(TaskInput).min(1),
});

export type GeneratedEmail = {
  subject: string;
  greeting: string;
  body: string;
  closing: string;
  clarifications: string[];
};

export type ScheduleBlock = {
  time: string;
  task: string;
  priority: "high" | "medium" | "low";
  duration: string;
  note: string;
};

export type GeneratedSchedule = {
  summary: string;
  blocks: ScheduleBlock[];
  beforeEvent: string[];
  conflicts: string[];
};

function parseJson<T>(text: string): T | null {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1)) as T;
  } catch {
    return null;
  }
}

async function runModel(system: string, prompt: string) {
  const gateway = createLovableAiGatewayProvider(requireApiKey());
  const { text } = await generateText({
    model: gateway(BLOOM_MODEL),
    system,
    prompt,
  });
  return text;
}

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }): Promise<GeneratedEmail> => {
    let text: string;
    try {
      text = await runModel(EMAIL_SYSTEM_PROMPT, buildEmailPrompt(data));
    } catch (error) {
      throw new Error(gatewayErrorMessage(error));
    }

    const parsed = parseJson<Partial<GeneratedEmail>>(text);
    if (!parsed?.body) {
      throw new Error("The AI returned an unexpected draft. Please regenerate.");
    }

    return {
      subject: parsed.subject ?? "Bloom & Elevate",
      greeting: parsed.greeting ?? "Hello,",
      body: parsed.body,
      closing: parsed.closing ?? "Warmly,\nBloom & Elevate",
      clarifications: Array.isArray(parsed.clarifications) ? parsed.clarifications : [],
    };
  });

export const generateSchedule = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }): Promise<GeneratedSchedule> => {
    let text: string;
    try {
      text = await runModel(PLANNER_SYSTEM_PROMPT, buildPlannerPrompt(data));
    } catch (error) {
      throw new Error(gatewayErrorMessage(error));
    }

    const parsed = parseJson<Partial<GeneratedSchedule>>(text);
    if (!parsed?.blocks?.length) {
      throw new Error("The AI returned an unexpected schedule. Please regenerate.");
    }

    return {
      summary: parsed.summary ?? "",
      blocks: parsed.blocks.map((block) => ({
        time: block.time ?? "",
        task: block.task ?? "",
        priority: (["high", "medium", "low"].includes(block.priority)
          ? block.priority
          : "medium") as ScheduleBlock["priority"],
        duration: block.duration ?? "",
        note: block.note ?? "",
      })),
      beforeEvent: Array.isArray(parsed.beforeEvent) ? parsed.beforeEvent : [],
      conflicts: Array.isArray(parsed.conflicts) ? parsed.conflicts : [],
    };
  });