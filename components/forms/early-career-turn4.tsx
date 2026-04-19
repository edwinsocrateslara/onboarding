"use client"

import { useState } from "react"

const INTERESTS = [
  "Building/fixing things",
  "Numbers or data",
  "Helping people",
  "Creating content",
  "Solving technical problems",
  "Running or organizing",
  "Selling or persuading",
  "Working outdoors or with hands",
  "Not sure — want a career quiz",
]

interface Props {
  onSubmit: (data: Record<string, unknown>, formatted: string) => void
}

export function EarlyCareerTurn4({ onSubmit }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (item: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(item) ? next.delete(item) : next.add(item)
      return next
    })
  }

  const canSubmit = selected.size > 0

  const handleSubmit = () => {
    if (!canSubmit) return
    const items = Array.from(selected)
    onSubmit({ interests: items }, items.join(", "))
  }

  return (
    <div className="space-y-4">
      <p className="text-[13px] font-medium" style={{ color: "#5e5d59" }}>
        Which of these sound interesting?
      </p>
      <div className="flex flex-wrap gap-2">
        {INTERESTS.map((item) => {
          const isSelected = selected.has(item)
          return (
            <button
              key={item}
              type="button"
              onClick={() => toggle(item)}
              aria-pressed={isSelected}
              className="rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec] hover:opacity-80"
              style={
                isSelected
                  ? { background: "#c96442", color: "#faf9f5", boxShadow: "0px 0px 0px 1px rgba(201,100,66,0.5)" }
                  : { background: "rgba(201,100,66,0.07)", color: "#4d4c48", boxShadow: "0px 0px 0px 1px rgba(201,100,66,0.18)" }
              }
            >
              {item}
            </button>
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
        Submit
      </button>
    </div>
  )
}
