import type { UserType } from "@/hooks/use-onboarding"
import type { Persona } from "@/lib/types"

export const Q2_NAMED_OPTIONS: Record<UserType, { letter: string; label: string }[]> = {
  student: [
    { letter: "a", label: "I want to find an internship or part-time job" },
    { letter: "b", label: "I want to build skills for my future career" },
    { letter: "c", label: "I'm not sure yet — I'd like to explore what careers are out there for me" },
  ],
  recently_graduated: [
    { letter: "a", label: "I want to find a job as soon as possible" },
    { letter: "b", label: "I'm not sure yet — I'd like to explore what careers are out there for me" },
    { letter: "c", label: "I want to build skills to become more competitive" },
  ],
  employed: [
    { letter: "a", label: "I want to find a better job in my current field" },
    { letter: "b", label: "I want to switch into a different career" },
  ],
  unemployed: [
    { letter: "a", label: "I want to find a job as soon as possible" },
    { letter: "b", label: "I want to figure out what kind of job is right for me" },
    { letter: "c", label: "I want to switch into a new career" },
    { letter: "d", label: "I want to build skills before I start applying" },
  ],
  returning_to_workforce: [
    { letter: "a", label: "I want to find a job in my previous field" },
    { letter: "b", label: "I want to try something new — I'm open to a change" },
    { letter: "c", label: "I want to update my skills before jumping back in" },
  ],
}

export const VALID_PERSONAS: Record<UserType, Persona[]> = {
  student:                ["active_jobseeker", "career_explorer"],
  recently_graduated:     ["active_jobseeker", "career_explorer"],
  employed:               ["active_jobseeker", "career_changer"],
  unemployed:             ["active_jobseeker", "career_explorer", "career_changer"],
  returning_to_workforce: ["active_jobseeker", "career_changer"],
}

export const FALLBACK_PERSONA: Record<UserType, Persona> = {
  student:                "career_explorer",
  recently_graduated:     "career_explorer",
  employed:               "active_jobseeker",
  unemployed:             "active_jobseeker",
  returning_to_workforce: "active_jobseeker",
}

type MatrixKey = `${UserType}|${string}`

const MATRIX: Record<MatrixKey, Persona> = {
  "student|a":                "active_jobseeker",
  "student|b":                "career_explorer",
  "student|c":                "career_explorer",
  "recently_graduated|a":     "active_jobseeker",
  "recently_graduated|b":     "career_explorer",
  "recently_graduated|c":     "active_jobseeker",
  "employed|a":               "active_jobseeker",
  "employed|b":               "career_changer",
  "unemployed|a":             "active_jobseeker",
  "unemployed|b":             "career_explorer",
  "unemployed|c":             "career_changer",
  "unemployed|d":             "active_jobseeker",
  "returning_to_workforce|a": "active_jobseeker",
  "returning_to_workforce|b": "career_changer",
  "returning_to_workforce|c": "active_jobseeker",
}

export function classifyDeterministic(userType: UserType, helpQuestionAnswer: string): Persona {
  const key: MatrixKey = `${userType}|${helpQuestionAnswer}`
  const persona = MATRIX[key]
  if (!persona) throw new Error(`No matrix entry for ${key}`)
  return persona
}

export async function classifyOther(userType: UserType, otherText: string): Promise<Persona> {
  const namedOptions = Q2_NAMED_OPTIONS[userType]
  const fallback     = FALLBACK_PERSONA[userType]

  try {
    const controller = new AbortController()
    const timeoutId  = setTimeout(() => controller.abort(), 10_000)

    const res = await fetch("/api/classify", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ userType, otherText, namedOptions }),
      signal:  controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) return fallback

    const data = await res.json() as { persona?: Persona; confidence?: string; reasoning?: string }

    if (!data.persona) return fallback

    console.log("[classify]", data.reasoning)

    if (data.confidence === "low") return fallback

    if (!VALID_PERSONAS[userType].includes(data.persona)) return fallback

    return data.persona
  } catch {
    return fallback
  }
}
