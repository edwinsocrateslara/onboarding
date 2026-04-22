"use client"

import { AssistantQuestion } from "./steps/shared"
import { ExtractionSummary } from "./extraction-summary"
import type { ConvState } from "@/hooks/use-conversation"
import type { ConvSpec } from "@/lib/extraction-specs"

const HINT = { color: "#000000", fontWeight: 500 } as const

const HINTED_QUESTIONS: Record<string, React.ReactNode> = {
  "1.1": (
    <>
      Tell me where you are right now —{" "}
      <span style={HINT}>do you know what job you want</span>,{" "}
      <span style={HINT}>have a general direction</span>, or{" "}
      <span style={HINT}>still exploring</span>?
    </>
  ),
  "1.3": (
    <>
      Are you currently{" "}
      <span style={HINT}>a student</span>,{" "}
      <span style={HINT}>working</span>, or{" "}
      <span style={HINT}>not working right now</span>?
    </>
  ),
  "3.1": (
    <>
      Have you been applying already?{" "}
      <span style={HINT}>Just getting started</span>,{" "}
      <span style={HINT}>a few applications with no responses</span>,{" "}
      <span style={HINT}>many applications with few interviews</span>, or{" "}
      <span style={HINT}>getting interviews but no offers</span>?
    </>
  ),
}

interface ConversationalScreenProps {
  stepKey:      string
  spec:         ConvSpec
  state:        ConvState
  onEdit:       () => void
  questionNode?: React.ReactNode
}

export function ConversationalScreen({ stepKey, spec, state, onEdit, questionNode }: ConversationalScreenProps) {
  const showSummary = state.summaryParts.length > 0 &&
    (state.status === "summary" || state.status === "follow_up" || state.status === "advancing")

  const questionContent = questionNode ?? HINTED_QUESTIONS[stepKey]

  return (
    <div className="space-y-5">
      {questionContent
        ? <AssistantQuestion muted>{questionContent}</AssistantQuestion>
        : <AssistantQuestion text={spec.question} />
      }

      {showSummary && (
        <div className="ml-10">
          <ExtractionSummary
            parts={state.summaryParts}
            advancing={state.status === "advancing"}
            onEdit={onEdit}
          />
        </div>
      )}

      {state.status === "follow_up" && state.followUpQuestion && (
        <AssistantQuestion text={state.followUpQuestion} />
      )}

      {state.status === "loading" && (
        <div className="ml-10 flex gap-1.5 items-center" aria-label="Processing…">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full animate-bounce"
              style={{
                background: "#43089f",
                animationDelay: `${i * 140}ms`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {state.status === "error" && state.error && (
        <p className="ml-10 text-[13px]" style={{ color: "#c0392b" }}>
          {state.error}
        </p>
      )}
    </div>
  )
}
