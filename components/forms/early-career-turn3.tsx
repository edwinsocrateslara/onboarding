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
  { id: "student", label: "Currently a student", hasInput: true, inputPlaceholder: "What are you studying?" },
  { id: "working", label: "Currently working", hasInput: true, inputPlaceholder: "What's your job?" },
  { id: "past_job", label: "Past job or internship", hasInput: true, inputPlaceholder: "What was it?" },
  { id: "volunteer", label: "Volunteer work", hasInput: true, inputPlaceholder: "What kind?" },
  { id: "courses", label: "Online courses", hasInput: true, inputPlaceholder: "In what area?" },
  { id: "hobby", label: "Hobby or side project", hasInput: true, inputPlaceholder: "What is it?" },
  { id: "scratch", label: "Starting from scratch", hasInput: false, exclusive: true },
]

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
      <p className="text-[13px] font-medium" style={{ color: "#5e5d59" }}>
        Tell me a bit about what you&apos;ve done so far — check whatever applies
      </p>
      <div className="space-y-2">
        {OPTIONS.map((opt) => {
          const isChecked = checked.has(opt.id)
          return (
            <div key={opt.id}>
              <label
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all",
                )}
                style={
                  isChecked
                    ? { background: "rgba(201,100,66,0.07)", boxShadow: "0px 0px 0px 1.5px rgba(201,100,66,0.4)" }
                    : { background: "#faf9f5", boxShadow: "0px 0px 0px 1px #e8e6dc" }
                }
              >
                <input
                  type={opt.exclusive ? "radio" : "checkbox"}
                  checked={isChecked}
                  onChange={() => toggle(opt.id, opt.exclusive)}
                  className="sr-only"
                />
                <span
                  className="h-4 w-4 flex items-center justify-center shrink-0 transition-all"
                  style={{
                    borderRadius: opt.exclusive ? "50%" : "4px",
                    border: `2px solid ${isChecked ? "#c96442" : "#c2c0b6"}`,
                    background: isChecked ? "#c96442" : "transparent",
                  }}
                >
                  {isChecked && !opt.exclusive && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {isChecked && opt.exclusive && <span className="block h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <span className="text-[14px]" style={{ color: "#3d3d3a" }}>{opt.label}</span>
              </label>
              {isChecked && opt.hasInput && (
                <div className="mt-1.5 pl-11 animate-slide-up">
                  <input
                    type="text"
                    value={inputs[opt.id] ?? ""}
                    onChange={(e) => setInput(opt.id, e.target.value)}
                    placeholder={opt.inputPlaceholder}
                    className="w-full rounded-lg px-3 py-2 text-[13px] focus:outline-none transition-shadow"
                    style={{ background: "#fff", color: "#141413", boxShadow: "0px 0px 0px 1px #e8e6dc" }}
                    onFocus={(e) => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #3898ec, 0px 0px 0px 3px rgba(56,152,236,0.12)")}
                    onBlur={(e) => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #e8e6dc")}
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
        className="w-full rounded-xl py-2.5 text-[14px] font-medium transition-all disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
        style={{
          background: canSubmit ? "#c96442" : "#e8e6dc",
          color: canSubmit ? "#faf9f5" : "#87867f",
        }}
      >
        That&apos;s me
      </button>
    </div>
  )
}
