"use client"

import { useState } from "react"
import type { Q1Option, CareerStageValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, OptionCard, StickyFooter, FOCUS_RING } from "./shared"

const QUESTION: Record<Q1Option, string> = {
  a: "What role are you looking for?",
  b: "What field or area are you interested in?",
  c: "That's completely fine. Are you currently a student, working, or not working right now?",
}

const CAREER_STAGE_OPTIONS: { label: string; value: CareerStageValue }[] = [
  { label: "Student",     value: "student"     },
  { label: "Working",     value: "working"     },
  { label: "Not working", value: "not_working" },
]

interface Props {
  q1Selection: Q1Option
  initialCareerStage: CareerStageValue | null
  initialText: string
  onAdvanceCareerStage: (stage: CareerStageValue) => void
  onAdvanceText: (text: string) => void
}

export function Step12({
  q1Selection,
  initialCareerStage,
  initialText,
  onAdvanceCareerStage,
  onAdvanceText,
}: Props) {
  const [selectedStage, setSelectedStage] = useState<CareerStageValue | null>(initialCareerStage)
  const [text, setText] = useState(initialText)
  const [pending, setPending] = useState(false)

  const handleStageSelect = (stage: CareerStageValue) => {
    if (pending) return
    setSelectedStage(stage)
    setPending(true)
    setTimeout(() => onAdvanceCareerStage(stage), 300)
  }

  const handleTextSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdvanceText(trimmed)
  }

  return (
    <div className="space-y-6">
      <AssistantQuestion text={QUESTION[q1Selection]} />

      {(q1Selection === "a" || q1Selection === "b") && (
        <div className="space-y-4">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleTextSubmit() }}
            onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={e => (e.currentTarget.style.boxShadow = "none")}
            placeholder={
              q1Selection === "a"
                ? "Software Engineer, Nurse, Teacher…"
                : "Healthcare, Technology, Finance…"
            }
            autoFocus
            className="w-full rounded-lg px-4 py-3.5 text-[15px] focus:outline-none transition-shadow"
            style={{
              background: "#ffffff",
              color: "#111827",
              border: "1px solid #e5e7eb",
            }}
            aria-label={QUESTION[q1Selection]}
          />
          <div className="h-[84px]" aria-hidden="true" />
          <StickyFooter onClick={handleTextSubmit} disabled={!text.trim()} />
        </div>
      )}

      {q1Selection === "c" && (
        <div className="space-y-2">
          {CAREER_STAGE_OPTIONS.map((opt) => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={selectedStage === opt.value}
              disabled={pending && selectedStage !== opt.value}
              onClick={() => handleStageSelect(opt.value)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
