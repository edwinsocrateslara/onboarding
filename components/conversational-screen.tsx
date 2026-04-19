"use client"

import { AssistantQuestion } from "./steps/shared"
import { ExtractionSummary } from "./extraction-summary"
import type { ConvState } from "@/hooks/use-conversation"
import type { ConvSpec } from "@/lib/extraction-specs"

interface ConversationalScreenProps {
  spec:    ConvSpec
  state:   ConvState
  onEdit:  () => void
}

export function ConversationalScreen({ spec, state, onEdit }: ConversationalScreenProps) {
  const showSummary = state.summaryParts.length > 0 &&
    (state.status === "summary" || state.status === "follow_up" || state.status === "advancing")

  return (
    <div className="space-y-5">
      <AssistantQuestion text={spec.question} />

      {/* Extraction summary (tappable → edit modal) */}
      {showSummary && (
        <div className="ml-10">
          <ExtractionSummary
            parts={state.summaryParts}
            advancing={state.status === "advancing"}
            onEdit={onEdit}
          />
        </div>
      )}

      {/* Follow-up question */}
      {state.status === "follow_up" && state.followUpQuestion && (
        <AssistantQuestion text={state.followUpQuestion} />
      )}

      {/* Loading */}
      {state.status === "loading" && (
        <div className="ml-10 flex gap-1.5 items-center" aria-label="Processing…">
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full animate-bounce"
              style={{
                background: "#c96442",
                animationDelay: `${i * 140}ms`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {state.status === "error" && state.error && (
        <p className="ml-10 text-[13px]" style={{ color: "#c96442" }}>
          {state.error}
        </p>
      )}
    </div>
  )
}
