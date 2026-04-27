"use client"

import { useState, useRef } from "react"
import { FileText, Briefcase, GraduationCap, ChevronRight } from "lucide-react"
import { C, AssistantQuestion } from "./shared"

type BackgroundChoice = "has_resume" | "manual_entry" | "no_experience"

interface CardOption {
  value:     BackgroundChoice
  label:     string
  Icon:      React.ElementType
  iconBg:    string
  iconColor: string
}

const OPTIONS: CardOption[] = [
  {
    value:     "has_resume",
    label:     "I have a resume I can provide",
    Icon:      FileText,
    iconBg:    "#eef2ff",
    iconColor: "#6366f1",
  },
  {
    value:     "manual_entry",
    label:     "I don't have a resume — I'll add my experience manually",
    Icon:      Briefcase,
    iconBg:    "#fff7ed",
    iconColor: "#f97316",
  },
  {
    value:     "no_experience",
    label:     "I don't have work experience yet",
    Icon:      GraduationCap,
    iconBg:    "#f0fdf4",
    iconColor: "#22c55e",
  },
]

interface Props {
  initialChoice: BackgroundChoice | null
  onAdvance: (backgroundChoice: BackgroundChoice) => void
}

export function StepBackground({ initialChoice, onAdvance }: Props) {
  const [selected, setSelected] = useState<BackgroundChoice | null>(initialChoice)
  const advancingRef = useRef(false)

  function select(choice: BackgroundChoice) {
    if (advancingRef.current) return
    setSelected(choice)
    advancingRef.current = true
    setTimeout(() => {
      onAdvance(choice)
      advancingRef.current = false
    }, 300)
  }

  return (
    <div>
      <AssistantQuestion text="Tell us about your background" />
      <p className="text-base leading-normal mt-2 mb-8" style={{ color: C.muted }}>
        We&apos;ll use this to personalize your job matches, career suggestions, and learning opportunities.
      </p>

      <div className="space-y-3">
        {OPTIONS.map(({ value, label, Icon, iconBg, iconColor }) => {
          const isSelected = selected === value
          return (
            <button
              key={value}
              type="button"
              onClick={() => select(value)}
              aria-pressed={isSelected}
              className="w-full flex items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
              style={
                isSelected
                  ? { background: C.accentLight, border: `1.5px solid ${C.accentBorder}` }
                  : { background: C.surface, border: `1px solid ${C.border}` }
              }
            >
              {/* Icon container */}
              <div
                className="shrink-0 h-11 w-11 rounded-xl flex items-center justify-center"
                style={{ background: iconBg }}
              >
                <Icon className="h-5 w-5" style={{ color: iconColor }} />
              </div>

              {/* Label */}
              <span
                className="flex-1 text-base leading-snug"
                style={{ color: isSelected ? C.primary : C.ink }}
              >
                {label}
              </span>

              {/* Chevron */}
              <ChevronRight
                className="shrink-0 h-4 w-4"
                style={{ color: isSelected ? C.primary : C.placeholder }}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
