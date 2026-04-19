"use client"

import { useState } from "react"
import type { Q1Option } from "@/hooks/use-onboarding"
import { AssistantQuestion, OptionCard } from "./shared"

const OPTIONS: { key: Q1Option; label: string }[] = [
  { key: "a", label: "I know what job I want, I need help finding it" },
  { key: "b", label: "I have a general direction, I need help narrowing it down" },
  { key: "c", label: "I'm not sure yet — I need help exploring my options" },
]

interface Props {
  initialValue: Q1Option | null
  onAdvance: (q1: Q1Option) => void
}

export function Step11({ initialValue, onAdvance }: Props) {
  const [selected, setSelected] = useState<Q1Option | null>(initialValue)
  const [pending, setPending] = useState(false)

  const handleSelect = (key: Q1Option) => {
    if (pending) return
    setSelected(key)
    setPending(true)
    setTimeout(() => onAdvance(key), 300)
  }

  return (
    <div className="space-y-5">
      <AssistantQuestion text="Which best describes where you are right now?" />
      <div className="space-y-2.5">
        {OPTIONS.map((opt) => (
          <OptionCard
            key={opt.key}
            label={opt.label}
            selected={selected === opt.key}
            disabled={pending && selected !== opt.key}
            onClick={() => handleSelect(opt.key)}
          />
        ))}
      </div>
    </div>
  )
}
