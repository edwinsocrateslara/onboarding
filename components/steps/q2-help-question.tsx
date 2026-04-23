"use client"

import { useState } from "react"
import { OptionCard, FOCUS_RING } from "./shared"

const INK       = "#111827"
const BORDER    = "#e5e7eb"
const SECONDARY = "#6b7280"

export interface Q2Option {
  key:   string   // "a", "b", "c", etc.
  label: string
}

interface Props {
  options:   Q2Option[]
  onAdvance: (data: {
    helpQuestionAnswer:    string
    helpQuestionOtherText: string
    goal:                  string
  }) => void
}

export function Q2HelpQuestion({ options, onAdvance }: Props) {
  const [selected,   setSelected]   = useState<string | null>(null)
  const [pending,    setPending]     = useState(false)
  const [otherText,  setOtherText]   = useState("")

  const handleSelect = (key: string) => {
    if (pending) return
    setSelected(key)

    if (key === "other") {
      // Don't auto-advance — wait for user to type and click Next
      return
    }

    // Clear any other text on switching away
    setOtherText("")
    setPending(true)
    const option = options.find(o => o.key === key)!
    setTimeout(() => onAdvance({
      helpQuestionAnswer:    key,
      helpQuestionOtherText: "",
      goal:                  option.label,
    }), 300)
  }

  const handleOtherNext = () => {
    if (!otherText.trim()) return
    onAdvance({
      helpQuestionAnswer:    "other",
      helpQuestionOtherText: otherText.trim(),
      goal:                  otherText.trim(),
    })
  }

  return (
    <div className="space-y-2.5">
      {options.map(opt => (
        <OptionCard
          key={opt.key}
          label={opt.label}
          selected={selected === opt.key}
          disabled={pending && selected !== opt.key}
          onClick={() => handleSelect(opt.key)}
        />
      ))}

      {/* Other option */}
      <OptionCard
        label="Other"
        selected={selected === "other"}
        disabled={pending}
        onClick={() => handleSelect("other")}
      />

      {selected === "other" && (
        <div className="pt-1 space-y-2">
          <input
            type="text"
            value={otherText}
            onChange={e => setOtherText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleOtherNext() }}
            placeholder="Tell us more..."
            autoFocus
            className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
            style={{ background: "#ffffff", color: INK, border: `1px solid ${BORDER}` }}
            onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={e => (e.currentTarget.style.boxShadow = "none")}
            aria-label="Describe what you'd like help with"
          />
          <button
            type="button"
            onClick={handleOtherNext}
            disabled={!otherText.trim()}
            className="w-full h-11 rounded-full text-[15px] font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
            style={{
              background: "#6366f1",
              color:   "#ffffff",
              opacity: otherText.trim() ? 1 : 0.5,
              cursor:  otherText.trim() ? "pointer" : "not-allowed",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
