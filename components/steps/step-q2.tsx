"use client"

import { useState } from "react"
import { C, FOCUS_RING, AssistantQuestion, OptionCard, StickyFooter } from "./shared"

type Q2Answer = "a" | "b" | "c" | "d" | "e"

const OPTIONS: { value: Q2Answer; label: string }[] = [
  { value: "a", label: "I want to find a job as soon as possible"            },
  { value: "b", label: "I am interested in career exploration"               },
  { value: "c", label: "I want to switch into a new career or field"         },
  { value: "d", label: "I want to find training or upskilling opportunities" },
  { value: "e", label: "Something else"                                      },
]

interface Props {
  initialQ2Answer:   Q2Answer | null
  initialQ2FreeText: string
  onAdvance: (data: { q2Answer: Q2Answer; q2FreeText: string }) => void
}

export function StepQ2({ initialQ2Answer, initialQ2FreeText, onAdvance }: Props) {
  const [q2Answer,   setQ2Answer]   = useState<Q2Answer | null>(initialQ2Answer)
  const [q2FreeText, setQ2FreeText] = useState(initialQ2FreeText)

  function select(answer: Q2Answer) {
    setQ2Answer(answer)
    if (answer !== "e") setQ2FreeText("")
  }

  const ready =
    q2Answer !== null &&
    (q2Answer !== "e" || q2FreeText.trim() !== "")

  function handleAdvance() {
    if (!ready || !q2Answer) return
    onAdvance({ q2Answer, q2FreeText: q2Answer === "e" ? q2FreeText.trim() : "" })
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
              onClick={() => select(opt.value)}
            />
            {opt.value === "e" && (
              <div
                style={{
                  maxHeight:  q2Answer === "e" ? "120px" : "0",
                  overflow:   q2Answer === "e" ? "visible" : "hidden",
                  opacity:    q2Answer === "e" ? 1 : 0,
                  transition: "max-height 0.2s ease, opacity 0.15s ease",
                }}
              >
                <div className="mt-2">
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
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter onClick={handleAdvance} disabled={!ready} label="Next" />
    </div>
  )
}
