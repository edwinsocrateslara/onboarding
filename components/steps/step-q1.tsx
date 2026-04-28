"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { C, FOCUS_RING, AssistantQuestion, StickyFooter } from "./shared"

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
    const idx = OPTIONS.findIndex((o, i) => {
      if (initialQ1Answer === "a") {
        if (initialQ1FreeText === "recently_graduated") return i === 1
        return i === 0
      }
      return o.value === initialQ1Answer
    })
    return idx === -1 ? null : idx
  })
  const [q1FreeText, setQ1FreeText] = useState(
    initialQ1FreeText === "recently_graduated" ? "" : initialQ1FreeText
  )

  const selectedOption = selectedIndex !== null ? OPTIONS[selectedIndex] : null
  const q1Answer       = selectedOption?.value ?? null
  const showFreeText   = selectedIndex !== null

  return (
    <div className="space-y-1">
      <AssistantQuestion text="Which best describes your current situation?" />
      <div className="h-3" />

      <div className="space-y-4">
        {/* Dropdown */}
        <div className="relative">
          <select
            value={selectedIndex !== null ? String(selectedIndex) : ""}
            onChange={e => {
              const val = e.target.value
              setSelectedIndex(val === "" ? null : Number(val))
              setQ1FreeText("")
            }}
            aria-label="Current situation"
            className="w-full rounded-md px-3 h-10 text-base leading-normal focus:outline-none appearance-none transition-shadow"
            style={{
              background:   C.surface,
              color:        selectedIndex !== null ? C.ink : C.muted,
              border:       `1px solid ${C.border}`,
              paddingRight: "36px",
            }}
            onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={e => (e.currentTarget.style.boxShadow = "")}
          >
            <option value="" disabled>Select an option</option>
            {OPTIONS.map((opt, i) => (
              <option key={i} value={String(i)}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: C.muted }}
          />
        </div>

        {/* Optional free-text */}
        <div
          style={{
            maxHeight:  showFreeText ? "80px" : "0",
            overflow:   showFreeText ? "visible" : "hidden",
            opacity:    showFreeText ? 1 : 0,
            transition: "max-height 0.2s ease, opacity 0.15s ease",
          }}
        >
          <input
            type="text"
            value={q1FreeText}
            onChange={e => setQ1FreeText(e.target.value)}
            placeholder="In a few words, tell us a bit more about your situation."
            className="w-full rounded-md px-3 h-10 text-base leading-normal focus:outline-none transition-shadow"
            style={{ background: C.surface, color: C.ink, border: `1px solid ${C.border}` }}
            onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={e => (e.currentTarget.style.boxShadow = "")}
            aria-label="Tell us more about your situation"
          />
        </div>
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
