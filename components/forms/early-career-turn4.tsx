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

const PRIMARY      = "#43089f"
const PRIMARY_RING = "rgba(67,8,159,0.4)"
const BORDER       = "#dad4c8"

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
      <p className="text-[13px] font-medium" style={{ color: "#000000" }}>
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
              className="px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
              style={{
                borderRadius: "1584px",
                background: isSelected ? PRIMARY : "#ffffff",
                color: isSelected ? "#ffffff" : "#000000",
                boxShadow: isSelected
                  ? `0px 0px 0px 1.5px ${PRIMARY_RING}`
                  : `0px 0px 0px 1px ${BORDER}`,
              }}
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
        className="w-full py-2.5 text-[16px] font-medium transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
        style={{
          borderRadius: "1584px",
          background: canSubmit ? PRIMARY : "#e8e7e2",
          color: canSubmit ? "#ffffff" : "#9f9b93",
        }}
      >
        Submit
      </button>
    </div>
  )
}
