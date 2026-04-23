"use client"

import { useState } from "react"
import type { UserType } from "@/hooks/use-onboarding"
import { AssistantQuestion, OptionCard } from "./shared"

const OPTIONS: { label: string; value: UserType }[] = [
  { label: "I'm a student",                    value: "student"                },
  { label: "I recently graduated",             value: "recently_graduated"     },
  { label: "I'm employed",                     value: "employed"               },
  { label: "I'm unemployed",                   value: "unemployed"             },
  { label: "I'm returning to the workforce",   value: "returning_to_workforce" },
]

interface Props {
  initialValue: UserType | null
  onAdvance:    (userType: UserType) => void
}

export function StepStarter({ initialValue, onAdvance }: Props) {
  const [selected, setSelected] = useState<UserType | null>(initialValue)
  const [pending,  setPending]  = useState(false)

  const handleSelect = (val: UserType) => {
    if (pending) return
    setSelected(val)
    setPending(true)
    setTimeout(() => onAdvance(val), 300)
  }

  return (
    <div className="space-y-5">
      <AssistantQuestion text="Which of these best describes you right now?" />
      <div className="space-y-2.5">
        {OPTIONS.map(opt => (
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
