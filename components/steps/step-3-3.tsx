"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import type { CareerAreaInterestValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, StickyFooter, FOCUS_RING } from "./shared"

const CARDS: { value: CareerAreaInterestValue; main: string; sub: string }[] = [
  { value: "building_fixing",    main: "Building or fixing things",    sub: "engineering, trades, manufacturing"          },
  { value: "numbers_data",       main: "Working with numbers or data", sub: "finance, analytics, accounting"              },
  { value: "helping_people",     main: "Helping people directly",      sub: "healthcare, education, social work"          },
  { value: "creating_content",   main: "Creating content or designs",  sub: "marketing, media, art, UX"                  },
  { value: "technical_problems", main: "Solving technical problems",   sub: "IT, software, cybersecurity"                 },
  { value: "running_organizing", main: "Running or organizing things", sub: "operations, logistics, project management"   },
  { value: "selling_persuading", main: "Selling or persuading",        sub: "sales, business development, consulting"     },
  { value: "outdoors_hands",     main: "Working outdoors or with your hands", sub: "agriculture, construction, environment" },
  { value: "needs_assessment",   main: "I'm honestly not sure",        sub: "I'd like to try a career quiz or assessment"      },
]

const MUTUAL_EXCLUSION = "needs_assessment"

function TwoLineCard({
  main,
  sub,
  selected,
  onClick,
}: {
  main: string
  sub: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg px-4 py-3.5 text-[15px] leading-[1.5] transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      style={
        selected
          ? { background: "#eef2ff", border: "1.5px solid rgba(99,102,241,0.6)", color: "#111827" }
          : { background: "#ffffff", color: "#111827", border: "1px solid #e5e7eb" }
      }
      aria-pressed={selected}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-[3px] h-[18px] w-[18px] shrink-0 rounded-[4px] border-2 flex items-center justify-center transition-colors"
          style={{
            borderColor: selected ? "#6366f1" : "#e5e7eb",
            background:  selected ? "#6366f1" : "transparent",
          }}
        >
          {selected && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </span>
        <span>
          <span className="block font-medium">{main}</span>
          <span className="block text-[13px] mt-0.5" style={{ color: selected ? "#374151" : "#9ca3af" }}>{sub}</span>
        </span>
      </span>
    </button>
  )
}

interface Props {
  initialInterests: CareerAreaInterestValue[]
  onAdvance: (careerInterests: CareerAreaInterestValue[]) => void
}

export function Step33({ initialInterests, onAdvance }: Props) {
  const [selected, setSelected] = useState<Set<CareerAreaInterestValue>>(
    () => new Set(initialInterests)
  )

  const toggle = (value: CareerAreaInterestValue) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (value === MUTUAL_EXCLUSION) {
        if (next.has(MUTUAL_EXCLUSION)) {
          next.delete(MUTUAL_EXCLUSION)
        } else {
          next.clear()
          next.add(MUTUAL_EXCLUSION)
        }
      } else {
        next.delete(MUTUAL_EXCLUSION)
        if (next.has(value)) {
          next.delete(value)
        } else {
          next.add(value)
        }
      }
      return next
    })
  }

  const ready = selected.size > 0

  const handleContinue = () => {
    if (!ready) return
    onAdvance(Array.from(selected))
  }

  return (
    <div className="space-y-5">
      <div>
        <AssistantQuestion text="Which of these sound interesting to you?" />
        <p className="text-[13px] text-center mt-1" style={{ color: "#9ca3af" }}>pick as many as you like — there's no wrong answer</p>
      </div>

      <div className="space-y-2">
        {CARDS.map(card => (
          <TwoLineCard
            key={card.value}
            main={card.main}
            sub={card.sub}
            selected={selected.has(card.value)}
            onClick={() => toggle(card.value)}
          />
        ))}
      </div>

      <div className="h-[84px]" aria-hidden="true" />
      <StickyFooter onClick={handleContinue} disabled={!ready} />
    </div>
  )
}
