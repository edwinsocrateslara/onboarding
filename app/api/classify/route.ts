import { generateText } from "ai"
import { anthropic } from "@ai-sdk/anthropic"
import type { Persona } from "@/lib/types"

export const maxDuration = 20

const VALID_PERSONAS: Record<string, Persona[]> = {
  student:                ["active_jobseeker", "career_explorer"],
  recently_graduated:     ["active_jobseeker", "career_explorer"],
  employed:               ["active_jobseeker", "career_changer"],
  unemployed:             ["active_jobseeker", "career_explorer", "career_changer"],
  returning_to_workforce: ["active_jobseeker", "career_changer"],
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      userType:     string
      otherText:    string
      namedOptions: { letter: string; label: string }[]
    }

    const { userType, otherText, namedOptions } = body

    if (!userType || !otherText || !Array.isArray(namedOptions)) {
      return Response.json({ error: "missing_fields" }, { status: 400 })
    }

    const validPersonas = VALID_PERSONAS[userType]
    if (!validPersonas) {
      return Response.json({ error: "unknown_user_type" }, { status: 400 })
    }

    const optionsText = namedOptions
      .map(o => `  (${o.letter}) ${o.label}`)
      .join("\n")

    const validList  = validPersonas.join(" or ")
    const constraint = validPersonas.length < 3
      ? `IMPORTANT: For a ${userType} user, the ONLY valid personas are ${validList}. Do not return any other persona.`
      : `All three personas are valid for this user type.`

    const system = `You are classifying a user's onboarding response into a career persona.

The user is in the ${userType} flow. Their normal options would have been:
${optionsText}

Instead, they wrote their own response.

${constraint}

Persona definitions:
- active_jobseeker: wants to find or apply for jobs now or soon, or has a specific role in mind
- career_explorer: unsure what they want, wants to explore options, or wants to build skills without a specific job target
- career_changer: wants to switch to a significantly different field or career

Classification rules:
- If the user mentions a specific role or wanting to apply for jobs soon → active_jobseeker
- If the user is unsure, wants to explore, or has no clear direction → career_explorer
- If the user wants to switch fields or make a significant career change (even if not immediate) → career_changer

Return ONLY valid JSON (no markdown fences, no preamble):
{
  "persona": ${validPersonas.map(p => `"${p}"`).join(" | ")},
  "confidence": "high" | "medium" | "low",
  "reasoning": "one sentence explaining your choice"
}`

    const { text } = await generateText({
      model:           anthropic("claude-haiku-4-5-20251001"),
      system,
      prompt:          `User's response: "${otherText}"`,
      maxOutputTokens: 200,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return Response.json({ error: "parse_failed" }, { status: 422 })
    }

    const result = JSON.parse(jsonMatch[0])
    return Response.json(result)

  } catch (err) {
    console.error("[classify]", err)
    if (err instanceof SyntaxError) {
      return Response.json({ error: "parse_failed" }, { status: 422 })
    }
    return Response.json({ error: "server_error" }, { status: 500 })
  }
}
