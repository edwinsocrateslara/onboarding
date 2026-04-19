import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"

export const maxDuration = 20

type SystemPromptFn = (prior?: Record<string, unknown>) => string

const SYSTEM_PROMPTS: Record<string, SystemPromptFn> = {
  "1.1": () => `You are a JSON extraction assistant for a career onboarding flow.
The user was asked: "Tell me where you are right now — do you know what job you want, have a general direction, or still exploring?"

Return ONLY valid JSON (no markdown, no code fences, no prose):
{
  "goalClarity": "specific_target" | "general_direction" | "exploring",
  "goal": string | null,
  "careerStageSignal": "student" | "working" | "not_working" | "unknown"
}

Rules:
- goalClarity "specific_target": user wants a specific job/role (e.g. "software engineer", "nurse")
- goalClarity "general_direction": user has a field/domain but not a specific role (e.g. "something in tech", "healthcare")
- goalClarity "exploring": user doesn't know what they want yet
- goal: what they said they want or are pursuing; null if unclear
- careerStageSignal: "student" if they mention school/studying; "working" if they mention current job; "not_working" if unemployed/between jobs; "unknown" if not clear`,

  "1.3": () => `You are a JSON extraction assistant for a career onboarding flow.
The user was asked: "Are you currently working, in school, or between things?"

Return ONLY valid JSON (no markdown, no code fences, no prose):
{
  "careerStageSignal": "student" | "working" | "not_working"
}

Rules:
- "student": in school, studying, enrolled in a program, taking classes
- "working": currently employed, has a job, working full-time or part-time
- "not_working": unemployed, between jobs, laid off, not working, gap year (non-student)
- If ambiguous, pick the closest match`,

  "2.2": (prior) => `You are a JSON extraction assistant for a job seeker onboarding flow.
The user was asked about their job preferences — schedule, work setting, and minimum pay.
${prior && Object.keys(prior).length > 0 ? `\nAlready extracted from earlier in this conversation: ${JSON.stringify(prior)}\nFocus on extracting the missing fields from this new response.` : ""}

Return ONLY valid JSON (no markdown, no code fences, no prose):
{
  "schedulePreference": ["full_time" | "part_time" | "flexible" | "shift_work"],
  "workModality": "on_site" | "remote" | "hybrid" | "no_preference" | null,
  "payAmount": string | null,
  "payUnit": "hourly" | "yearly" | null
}

Rules:
- schedulePreference: array; "full_time" for 40hr/week, "part_time" for reduced hours, "flexible" for any hours, "shift_work" for shift-based work; empty array if not mentioned
- workModality: "on_site" if in-person/commute; "remote" if work from home; "hybrid" if mixed; "no_preference" if they don't care; null if not mentioned
- payAmount: digits only, no symbols or commas (e.g. "20" not "$20/hr"); null if not mentioned
- payUnit: "hourly" if per-hour rate; "yearly" if annual salary; null if not mentioned`,

  "2.3": (prior) => `You are a JSON extraction assistant for a career changer onboarding flow.
The user was asked about the career change they're making.
${prior && Object.keys(prior).length > 0 ? `\nAlready extracted: ${JSON.stringify(prior)}\nFocus on extracting missing fields.` : ""}

Return ONLY valid JSON (no markdown, no code fences, no prose):
{
  "currentRoleOrField": string | null,
  "targetCareer": string | null,
  "targetTimeline": "immediate" | "within_3_months" | "within_6_to_12_months" | "no_timeline" | null
}

Rules:
- currentRoleOrField: their current job, role, or field (e.g. "teacher", "marketing manager"); null if not mentioned
- targetCareer: what they want to move into (e.g. "UX designer", "software developer"); null if not mentioned
- targetTimeline: "immediate" = ASAP/right away; "within_3_months" = soon/few months; "within_6_to_12_months" = 6-12 months; "no_timeline" = no rush/flexible; null if not mentioned`,

  "2.4": (prior) => `You are a JSON extraction assistant for an early career explorer onboarding flow.
The user was asked about their background — school, work, hobbies, volunteering, anything they've spent real time on.
${prior && Object.keys(prior).length > 0 ? `\nAlready extracted: ${JSON.stringify(prior)}\nExtract additional or missing information.` : ""}

Return ONLY valid JSON (no markdown, no code fences, no prose):
{
  "employmentStatus": "student" | "employed" | "unemployed",
  "noneSelected": boolean,
  "experiences": [{ "type": "student" | "working" | "past_job" | "volunteer" | "courses" | "hobby", "detail": string }]
}

Rules:
- employmentStatus: current status ("student" if studying, "employed" if working, "unemployed" otherwise)
- noneSelected: true ONLY if user says they have nothing/no experience/starting from scratch; false otherwise
- experiences: extract each distinct experience; type "student"=school/studying, "working"=current job, "past_job"=previous job/internship, "volunteer"=volunteer work, "courses"=online courses/certs, "hobby"=personal projects/hobbies; detail is 1-5 words
- If noneSelected is true, experiences can be empty array`,

  "3.1": () => `You are a JSON extraction assistant for a job seeker onboarding flow.
The user was asked about their job application status.

Return ONLY valid JSON (no markdown, no code fences, no prose):
{
  "applicationDiagnostics": "not_started" | "low_volume_no_response" | "high_volume_few_interviews" | "interviews_no_offers"
}

Rules:
- "not_started": hasn't started applying, just beginning their search
- "low_volume_no_response": applied to some jobs but getting no responses
- "high_volume_few_interviews": applied to many jobs, some responses but very few interviews
- "interviews_no_offers": getting interviews but not receiving offers
- Pick the closest match`,

  "3.2": (prior) => `You are a JSON extraction assistant for a career changer onboarding flow.
The user was asked about their availability, financial situation, and pay expectations for a career transition.
${prior && Object.keys(prior).length > 0 ? `\nAlready extracted: ${JSON.stringify(prior)}\nFocus on extracting missing fields.` : ""}

Return ONLY valid JSON (no markdown, no code fences, no prose):
{
  "availability": "less_than_10" | "10_to_20" | "20_to_30" | "30_plus" | null,
  "financialConstraint": "needs_income" | "some_savings" | "has_runway" | null,
  "payMin": string | null,
  "payMinUnit": "hourly" | "yearly" | null,
  "payTarget": string | null,
  "payTargetUnit": "hourly" | "yearly" | null
}

Rules:
- availability: hours/week available ("less_than_10"=under 10, "10_to_20"=10-20, "20_to_30"=20-30, "30_plus"=30+ or full-time); null if not mentioned
- financialConstraint: "needs_income"=can't afford unpaid training; "some_savings"=can handle short gap (1-3 months); "has_runway"=can invest in longer training; null if not mentioned
- payMin/payMinUnit: minimum acceptable pay right now; digits only for amounts (strip $, commas)
- payTarget/payTargetUnit: longer-term pay target; digits only`,

  "3.3": () => `You are a JSON extraction assistant for an early career explorer onboarding flow.
The user was asked what kinds of work sound interesting to them.

Return ONLY valid JSON (no markdown, no code fences, no prose):
{
  "careerInterests": ["building_fixing" | "numbers_data" | "helping_people" | "creating_content" | "technical_problems" | "running_organizing" | "selling_persuading" | "outdoors_hands" | "needs_assessment"]
}

Rules:
- "building_fixing": construction, manufacturing, IT support, repair, hardware
- "numbers_data": accounting, finance, analytics, statistics, data science
- "helping_people": healthcare, education, social work, counseling, customer service
- "creating_content": design, writing, video, photography, art, creative work
- "technical_problems": software engineering, IT, cybersecurity, engineering
- "running_organizing": project management, operations, logistics, admin, planning
- "selling_persuading": sales, marketing, business development, recruiting
- "outdoors_hands": landscaping, trades, agriculture, physical labor, outdoor work
- "needs_assessment": user is unsure, can't decide, or explicitly says they don't know
- Extract ALL relevant interests; can be multiple values
- If truly unsure, return ["needs_assessment"]`,
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      step: string
      persona?: string
      userText: string
      priorExtraction?: Record<string, unknown>
    }

    const { step, userText, priorExtraction } = body
    const promptFn = SYSTEM_PROMPTS[step]

    if (!promptFn) {
      return Response.json({ error: "unknown_step" }, { status: 400 })
    }

    const { text } = await generateText({
      model: anthropic("claude-haiku-4-5-20251001"),
      system: promptFn(priorExtraction),
      prompt: userText,
      maxOutputTokens: 500,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: "parse_failed" }, { status: 422 })
    }

    const extracted = JSON.parse(jsonMatch[0])
    return Response.json({ extracted })

  } catch (err) {
    console.error("[extract]", err)
    if (err instanceof SyntaxError) {
      return Response.json({ error: "parse_failed" }, { status: 422 })
    }
    return Response.json({ error: "server_error" }, { status: 500 })
  }
}
