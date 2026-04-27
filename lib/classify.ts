import type { Persona } from "@/lib/types"

export type Q1Answer = "a" | "b" | "c" | "d"
export type Q2Answer = "a" | "b" | "c" | "d" | "e"

type DeterministicQ1 = "a" | "b" | "c"
type DeterministicQ2 = "a" | "b" | "c" | "d"
type MatrixKey = `${DeterministicQ1}|${DeterministicQ2}`

const MATRIX: Record<MatrixKey, Persona> = {
  "a|a": "jobseeker",
  "a|b": "career_explorer",
  "a|c": "career_explorer",  // students haven't started a career to switch from
  "a|d": "jobseeker",
  "b|a": "jobseeker",
  "b|b": "career_explorer",
  "b|c": "career_switcher",
  "b|d": "jobseeker",
  "c|a": "jobseeker",
  "c|b": "career_explorer",
  "c|c": "career_switcher",
  "c|d": "jobseeker",
}

export function classifyDeterministic(q1Answer: DeterministicQ1, q2Answer: DeterministicQ2): Persona {
  return MATRIX[`${q1Answer}|${q2Answer}`] ?? "jobseeker"
}

export interface ClassificationResponse {
  persona:    Persona
  confidence: "high" | "medium" | "low"
  reasoning:  string
}

const VALID_PERSONAS: Persona[] = ["jobseeker", "career_explorer", "career_switcher"]

const FALLBACK: ClassificationResponse = {
  persona:    "jobseeker",
  confidence: "low",
  reasoning:  "Fallback due to classification error",
}

export async function classifyOther(
  q1Answer:   Q1Answer,
  q1FreeText: string,
  q2Answer:   Q2Answer,
  q2FreeText: string,
): Promise<ClassificationResponse> {
  try {
    const controller = new AbortController()
    const timeoutId  = setTimeout(() => controller.abort(), 5_000)

    const res = await fetch("/api/classify", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ q1Answer, q1FreeText, q2Answer, q2FreeText }),
      signal:  controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) return FALLBACK

    const data = await res.json() as ClassificationResponse

    if (!data.persona || !VALID_PERSONAS.includes(data.persona)) return FALLBACK

    return data
  } catch {
    return FALLBACK
  }
}
