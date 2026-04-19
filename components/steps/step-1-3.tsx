"use client"

import { useState } from "react"
import type { CareerStageValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, OptionCard } from "./shared"

const OPTIONS: { label: string; value: CareerStageValue }[] = [
  { label: "Working",        value: "working"     },
  { label: "In school",      value: "student"     },
  { label: "Between things", value: "not_working" },
]

interface Props {
  initialValue: CareerStageValue | null
  onAdvance: (stage: CareerStageValue) => void
}

export function Step13({ initialValue, onAdvance }: Props) {
  const [selected, setSelected] = useState<CareerStageValue | null>(initialValue)
  const [pending, setPending] = useState(false)

  const handleSelect = (stage: CareerStageValue) => {
    if (pending) return
    setSelected(stage)
    setPending(true)
    setTimeout(() => onAdvance(stage), 300)
  }

  return (
    <div className="space-y-5">
      <AssistantQuestion text="One more thing — are you currently working, in school, or between things?" />
      <div className="space-y-2">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={selected === opt.value}
            disabled={pending && selected !== opt.value}
            onClick={() => handleSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}
