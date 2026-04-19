"use client"

import { useState } from "react"
import type { Q1Option, CareerStageValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, PillButton } from "./shared"

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
  onAdvanceCareerStage: (stage: CareerStageValue) => void
}

export function Step12({
  q1Selection,
  initialCareerStage,
  onAdvanceCareerStage,
}: Props) {
  const [selectedStage, setSelectedStage] = useState<CareerStageValue | null>(initialCareerStage)
  const [pending, setPending] = useState(false)

  const handleStageSelect = (stage: CareerStageValue) => {
    if (pending) return
    setSelectedStage(stage)
    setPending(true)
    setTimeout(() => onAdvanceCareerStage(stage), 300)
  }

  return (
    <div className="space-y-5">
      <AssistantQuestion text={QUESTION[q1Selection]} />

      {q1Selection === "c" && (
        <div className="flex flex-wrap gap-2.5 pt-1">
          {CAREER_STAGE_OPTIONS.map((opt) => (
            <PillButton
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
