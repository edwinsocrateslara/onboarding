"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Option {
  id: string
  label: string
  hasInput: boolean
  inputPlaceholder?: string
  exclusive?: boolean
}

const OPTIONS: Option[] = [
  { id: "student",  label: "Currently a student",    hasInput: true,  inputPlaceholder: "What are you studying?" },
  { id: "working",  label: "Currently working",      hasInput: true,  inputPlaceholder: "What's your job?" },
  { id: "past_job", label: "Past job or internship", hasInput: true,  inputPlaceholder: "What was it?" },
  { id: "volunteer",label: "Volunteer work",         hasInput: true,  inputPlaceholder: "What kind?" },
  { id: "courses",  label: "Online courses",         hasInput: true,  inputPlaceholder: "In what area?" },
  { id: "hobby",    label: "Hobby or side project",  hasInput: true,  inputPlaceholder: "What is it?" },
  { id: "scratch",  label: "Starting from scratch",  hasInput: false, exclusive: true },
]

const PRIMARY      = "#43089f"
const PRIMARY_TINT = "rgba(67,8,159,0.06)"
const PRIMARY_RING = "rgba(67,8,159,0.4)"
const BORDER       = "#dad4c8"
const CLAY_SHADOW  = `rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px, 0px 0px 0px 1px ${BORDER}`
const INPUT_REST   = `0px 0px 0px 1px ${BORDER}`
const INPUT_FOCUS  = "0px 0px 0px 2px #146ef5"

interface Props {
  onSubmit: (data: Record<string, unknown>, formatted: string) => void
}

export function EarlyCareerTurn3({ onSubmit }: Props) {
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [inputs, setInputs] = useState<Record<string, string>>({})

  const toggle = (id: string, exclusive?: boolean) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (exclusive) {
        return next.has(id) ? new Set() : new Set([id])
      }
      if (next.has("scratch")) next.delete("scratch")
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const setInput = (id: string, val: string) => {
    setInputs((prev) => ({ ...prev, [id]: val }))
  }

  const canSubmit = checked.size > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    const data: Record<string, unknown> = { selections: Object.fromEntries(Array.from(checked).map((id) => [id, inputs[id] ?? true])) }
    const parts = Array.from(checked).map((id) => {
      const opt = OPTIONS.find((o) => o.id === id)!
      return inputs[id] ? `${opt.label} (${inputs[id]})` : opt.label
    })
    onSubmit(data, parts.join(", "))
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] font-medium" style={{ color: "#000000" }}>
        Tell me a bit about what you&apos;ve done so far — check whatever applies
      </p>
      <div className="space-y-2">
        {OPTIONS.map((opt) => {
          const isChecked = checked.has(opt.id)
          return (
            <div key={opt.id}>
              <label
                className={cn("flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors")}
                style={
                  isChecked
                    ? { background: PRIMARY_TINT, boxShadow: `0px 0px 0px 1.5px ${PRIMARY_RING}` }
                    : { background: "#ffffff", boxShadow: CLAY_SHADOW }
                }
              >
                <input
                  type={opt.exclusive ? "radio" : "checkbox"}
                  checked={isChecked}
                  onChange={() => toggle(opt.id, opt.exclusive)}
                  className="sr-only"
                />
                <span
                  className="h-4 w-4 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    borderRadius: opt.exclusive ? "50%" : "4px",
                    border: `2px solid ${isChecked ? PRIMARY : BORDER}`,
                    background: isChecked ? PRIMARY : "transparent",
                  }}
                >
                  {isChecked && !opt.exclusive && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {isChecked && opt.exclusive && <span className="block h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <span className="text-[14px]" style={{ color: "#000000" }}>{opt.label}</span>
              </label>
              {isChecked && opt.hasInput && (
                <div className="mt-1.5 pl-11 animate-slide-up">
                  <input
                    type="text"
                    value={inputs[opt.id] ?? ""}
                    onChange={(e) => setInput(opt.id, e.target.value)}
                    placeholder={opt.inputPlaceholder}
                    className="w-full rounded px-3 py-2 text-[13px] focus:outline-none transition-shadow"
                    style={{ background: "#fff", color: "#000000", boxShadow: INPUT_REST }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = INPUT_FOCUS)}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = INPUT_REST)}
                    aria-label={opt.inputPlaceholder}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-2.5 text-[16px] font-medium transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
        style={{
          borderRadius: "1584px",
          background: canSubmit ? PRIMARY : "#e8e7e2",
          color: canSubmit ? "#ffffff" : "#9f9b93",
        }}
      >
        That&apos;s me
      </button>
    </div>
  )
}
