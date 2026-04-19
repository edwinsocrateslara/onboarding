"use client"

import { useState } from "react"
import type { ApplicationDiagnosticsValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, OptionCard } from "./shared"

const OPTIONS: { label: string; value: ApplicationDiagnosticsValue }[] = [
  { label: "No, I'm just getting started",                          value: "not_started"                  },
  { label: "Yes, a few applications — no responses yet",            value: "low_volume_no_response"       },
  { label: "Yes, I've applied to many jobs — very few interviews",  value: "high_volume_few_interviews"   },
  { label: "Yes, I'm getting interviews but no offers",             value: "interviews_no_offers"         },
]

interface Props {
  initialValue: ApplicationDiagnosticsValue | null
  onAdvance: (value: ApplicationDiagnosticsValue) => void
}

export function Step31({ initialValue, onAdvance }: Props) {
  const [selected, setSelected] = useState<ApplicationDiagnosticsValue | null>(initialValue)
  const [pending, setPending] = useState(false)

  const handleSelect = (val: ApplicationDiagnosticsValue) => {
    if (pending) return
    setSelected(val)
    setPending(true)
    setTimeout(() => onAdvance(val), 300)
  }

  return (
    <div className="space-y-5">
      <AssistantQuestion text="Have you already been applying for jobs?" />
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
