"use client"

import { useState } from "react"
import { C, FOCUS_RING, AssistantQuestion, OptionCard, StickyFooter } from "./shared"

type Q1Answer = "a" | "b" | "c" | "d"

const OPTIONS: { value: Q1Answer; label: string }[] = [
  { value: "a", label: "I'm a student"        },
  { value: "a", label: "I recently graduated" },
  { value: "b", label: "I'm employed"         },
  { value: "c", label: "I'm unemployed"       },
  { value: "d", label: "Something else"       },
]

interface Props {
  initialQ1Answer:    Q1Answer | null
  initialQ1SubOption: string | null
  initialQ1FreeText:  string
  onAdvance: (data: { q1Answer: Q1Answer; q1SubOption: string | null; q1FreeText: string }) => void
}

export function StepQ1({ initialQ1Answer, initialQ1SubOption, initialQ1FreeText, onAdvance }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    if (initialQ1Answer === null) return null
    const idx = OPTIONS.findIndex(o => o.value === initialQ1Answer)
    return idx === -1 ? null : idx
  })
  const [q1FreeText, setQ1FreeText] = useState(initialQ1FreeText)

  const q1Answer = selectedIndex !== null ? OPTIONS[selectedIndex].value : null

  return (
    <div className="space-y-1">
      <AssistantQuestion text="Which best describes your current situation?" />
      <div className="h-3" />

      <div className="space-y-2">
        {OPTIONS.map((opt, i) => {
          const isSelected = selectedIndex === i
          return (
            <div key={i}>
              <OptionCard
                label={opt.label}
                selected={isSelected}
                onClick={() => setSelectedIndex(i)}
              />
              {/* Inline free-text — slides in below the selected card */}
              <div
                style={{
                  maxHeight:  isSelected ? "72px" : "0",
                  overflow:   isSelected ? "visible" : "hidden",
                  opacity:    isSelected ? 1 : 0,
                  transition: "max-height 0.2s ease, opacity 0.15s ease",
                }}
              >
                <div className="mt-2 mb-1">
                  <input
                    type="text"
                    value={q1FreeText}
                    onChange={e => setQ1FreeText(e.target.value)}
                    placeholder="In a few words, tell us about your situation."
                    className="w-full rounded-md px-3 h-10 text-base leading-normal focus:outline-none transition-shadow"
                    style={{ background: C.surface, color: C.ink, border: `1px solid ${C.border}` }}
                    onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
                    onBlur={e => (e.currentTarget.style.boxShadow = "")}
                    aria-label="Tell us about your situation"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter
        onClick={() => onAdvance({ q1Answer: q1Answer!, q1SubOption: null, q1FreeText: q1FreeText.trim() })}
        disabled={q1Answer === null}
        label="Next"
      />
    </div>
  )
}
