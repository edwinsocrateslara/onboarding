import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import type { Persona } from "@/lib/types"

export const maxDuration = 20

const Q1_LABELS: Record<string, string> = {
  a: "I'm a student or recent graduate",
  b: "I'm employed",
  c: "I'm unemployed",
}

const Q2_LABELS: Record<string, string> = {
  a: "I want to find a job as soon as possible",
  b: "I am interested in career exploration",
  c: "I want to switch into a new career or field",
  d: "I want to find training or upskilling opportunities",
}

const VALID_PERSONAS: Persona[] = ["jobseeker", "career_explorer", "career_switcher"]

export async function POST(req: Request): Promise<Response> {
  try {
    const body = await req.json() as {
      q1Answer:   string
      q1FreeText: string
      q2Answer:   string
      q2FreeText: string
    }

    const { q1Answer, q1FreeText, q2Answer, q2FreeText } = body

    if (!q1Answer || !q2Answer) {
      return Response.json({ error: "missing_fields" }, { status: 400 })
    }
    if (!["a","b","c","d"].includes(q1Answer) || !["a","b","c","d","e"].includes(q2Answer)) {
      return Response.json({ error: "invalid_answer_values" }, { status: 400 })
    }
    if (q1Answer !== "d" && q2Answer !== "e") {
      return Response.json({ error: "use_deterministic_matrix" }, { status: 400 })
    }
    if (q1Answer === "d" && !q1FreeText?.trim()) {
      return Response.json({ error: "q1_free_text_required" }, { status: 400 })
    }
    if (q2Answer === "e" && !q2FreeText?.trim()) {
      return Response.json({ error: "q2_free_text_required" }, { status: 400 })
    }

    const q1Description = q1Answer === "d"
      ? `Something else: "${q1FreeText.trim()}"`
      : Q1_LABELS[q1Answer]

    const q2Description = q2Answer === "e"
      ? `Something else: "${q2FreeText.trim()}"`
      : Q2_LABELS[q2Answer]

    const system = `You are a workforce-development classifier. Given a user's responses to two onboarding questions, classify them into one of three personas:

1. jobseeker — wants a job soon, focus on finding work in their existing or adjacent skill set
2. career_explorer — uncertain about direction, exploring possibilities, may not have firm career goals yet
3. career_switcher — has a current career and wants to move into a different field

Respond with ONLY valid JSON in this format:
{
  "persona": "jobseeker" | "career_explorer" | "career_switcher",
  "confidence": "high" | "medium" | "low",
  "reasoning": "<one sentence>"
}`

    const prompt = `The user gave the following responses:

Q1 (current situation): ${q1Description}

Q2 (goal): ${q2Description}

Classify this user.`

    const { text } = await generateText({
      model:           anthropic("claude-haiku-4-5-20251001"),
      system,
      prompt,
      maxOutputTokens: 200,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: "parse_failed" }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0]) as { persona?: Persona; confidence?: string; reasoning?: string }

    if (!result.persona || !VALID_PERSONAS.includes(result.persona) || !result.confidence) {
      return Response.json({ error: "invalid_llm_response" }, { status: 500 })
    }

    console.log("[classify]", result.reasoning)
    return Response.json(result)

  } catch (err) {
    console.error("[classify]", err)
    if (err instanceof SyntaxError) {
      return Response.json({ error: "parse_failed" }, { status: 500 })
    }
    return Response.json({ error: "server_error" }, { status: 500 })
  }
}
