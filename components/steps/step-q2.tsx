"use client"

import { useState, useRef } from "react"
import { C, FOCUS_RING, AssistantQuestion, OptionCard } from "./shared"

type Q2Answer = "a" | "b" | "c" | "d" | "e"

interface Option {
  value:       Q2Answer
  label:       string
  autoAdvance: boolean
}

const OPTIONS: Option[] = [
  { value: "a", label: "I want to find a job as soon as possible",          autoAdvance: true  },
  { value: "b", label: "I am interested in career exploration",             autoAdvance: true  },
  { value: "c", label: "I want to switch into a new career or field",       autoAdvance: true  },
  { value: "d", label: "I want to find training or upskilling opportunities", autoAdvance: true  },
  { value: "e", label: "Something else",                                    autoAdvance: false },
]

interface Props {
  initialQ2Answer:   Q2Answer | null
  initialQ2FreeText: string
  onAdvance: (data: { q2Answer: Q2Answer; q2FreeText: string }) => void
}

export function StepQ2({ initialQ2Answer, initialQ2FreeText, onAdvance }: Props) {
  const [q2Answer,   setQ2Answer]   = useState<Q2Answer | null>(initialQ2Answer)
  const [q2FreeText, setQ2FreeText] = useState(initialQ2FreeText)
  const advancingRef = useRef(false)

  function select(answer: Q2Answer, autoAdvance: boolean) {
    if (advancingRef.current) return
    setQ2Answer(answer)
    if (answer !== "e") setQ2FreeText("")

    if (autoAdvance) {
      advancingRef.current = true
      setTimeout(() => {
        onAdvance({ q2Answer: answer, q2FreeText: "" })
        advancingRef.current = false
      }, 300)
    }
  }

  function submitOther() {
    if (!q2FreeText.trim()) return
    onAdvance({ q2Answer: "e", q2FreeText: q2FreeText.trim() })
  }

  return (
    <div className="space-y-1">
      <AssistantQuestion text="What would you most like help with?" />
      <div className="h-3" />

      <div>
        {OPTIONS.map(opt => (
          <div key={opt.value} className="mb-2">
            <OptionCard
              label={opt.label}
              selected={q2Answer === opt.value}
              onClick={() => select(opt.value, opt.autoAdvance)}
            />
            {opt.value === "e" && (
              <div
                style={{
                  maxHeight:  q2Answer === "e" ? "160px" : "0",
                  overflow:   "hidden",
                  opacity:    q2Answer === "e" ? 1 : 0,
                  transition: "max-height 0.2s ease, opacity 0.15s ease",
                }}
              >
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={q2FreeText}
                    onChange={e => setQ2FreeText(e.target.value)}
                    placeholder="Describe what you'd like help with"
                    className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
                    style={{ background: C.surface, color: C.ink, border: `1px solid ${C.border}` }}
                    onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
                    onBlur={e => (e.currentTarget.style.boxShadow = "")}
                    aria-label="Describe what you'd like help with"
                    onKeyDown={e => { if (e.key === "Enter") submitOther() }}
                  />
                  <button
                    type="button"
                    onClick={submitOther}
                    disabled={!q2FreeText.trim()}
                    className="w-full h-12 rounded-full text-base font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                    style={{
                      background: q2FreeText.trim() ? C.primary  : C.disabledBg,
                      color:      q2FreeText.trim() ? "#ffffff"  : C.disabledText,
                      cursor:     q2FreeText.trim() ? "pointer"  : "not-allowed",
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
