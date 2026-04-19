"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import type { CareerAreaInterestValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, ContinueButton } from "./shared"

const CARDS: { value: CareerAreaInterestValue; main: string; sub: string }[] = [
  { value: "building_fixing",    main: "Building or fixing things",              sub: "e.g. construction, manufacturing, IT support, repair"       },
  { value: "numbers_data",       main: "Working with numbers or data",            sub: "e.g. accounting, finance, analytics, research"              },
  { value: "helping_people",     main: "Helping or caring for people",            sub: "e.g. healthcare, education, social work, customer service"  },
  { value: "creating_content",   main: "Creating things — writing, design, media",sub: "e.g. graphic design, copywriting, video, photography"       },
  { value: "technical_problems", main: "Solving technical problems",              sub: "e.g. software, engineering, IT, cybersecurity"              },
  { value: "running_organizing", main: "Running or organizing operations",        sub: "e.g. project management, logistics, admin, event planning"  },
  { value: "selling_persuading", main: "Selling or persuading",                   sub: "e.g. sales, marketing, recruiting, fundraising"             },
  { value: "outdoors_hands",     main: "Working outdoors or with your hands",     sub: "e.g. landscaping, trades, agriculture, physical labor"      },
  { value: "needs_assessment",   main: "I'm honestly not sure",                   sub: "That's okay — I'll help you figure it out"                  },
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
      className="w-full text-left rounded-xl px-4 py-3.5 text-[15px] leading-[1.5] transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
      style={
        selected
          ? { background: "rgba(201,100,66,0.08)", boxShadow: "0px 0px 0px 1.5px rgba(201,100,66,0.5)", color: "#141413" }
          : { background: "#faf9f5", boxShadow: "0px 0px 0px 1px #e8e6dc", color: "#3d3d3a" }
      }
      aria-pressed={selected}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-[3px] h-4 w-4 shrink-0 rounded-sm border-2 flex items-center justify-center"
          style={{
            borderColor: selected ? "#c96442" : "#c2c0b6",
            background: selected ? "#c96442" : "transparent",
          }}
        >
          {selected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        <span>
          <span className="block font-medium">{main}</span>
          <span className="block text-[13px] mt-0.5" style={{ color: selected ? "#6b6860" : "#87867f" }}>{sub}</span>
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
        <AssistantQuestion text="What kinds of work feel most interesting or natural to you?" />
        <p className="mt-3 ml-10 text-[13px] italic" style={{ color: "#87867f" }}>Check all that apply</p>
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

      <div className="pt-2">
        <ContinueButton onClick={handleContinue} disabled={!ready} />
      </div>
    </div>
  )
}
