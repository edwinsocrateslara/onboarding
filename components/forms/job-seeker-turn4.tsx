"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Status =
  | "no_applications"
  | "few_no_responses"
  | "many_few_interviews"
  | "interviews_no_offers"

const OPTIONS: { value: Status; label: string }[] = [
  { value: "no_applications",      label: "No, just getting started" },
  { value: "few_no_responses",     label: "Yes, a few applications — no responses" },
  { value: "many_few_interviews",  label: "Yes, many applications — few interviews" },
  { value: "interviews_no_offers", label: "Yes, getting interviews but no offers" },
]

const PRIMARY      = "#43089f"
const PRIMARY_TINT = "rgba(67,8,159,0.06)"
const PRIMARY_RING = "rgba(67,8,159,0.4)"
const BORDER       = "#dad4c8"
const CLAY_SHADOW  = `rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px, 0px 0px 0px 1px ${BORDER}`

interface Props {
  onSubmit: (data: Record<string, unknown>, formatted: string) => void
}

export function JobSeekerTurn4({ onSubmit }: Props) {
  const [selected, setSelected] = useState<Status | null>(null)

  const handleSubmit = () => {
    if (!selected) return
    const label = OPTIONS.find((o) => o.value === selected)!.label
    onSubmit({ application_status: selected }, label)
  }

  return (
    <div className="space-y-4">
      <fieldset>
        <legend className="text-[13px] font-medium mb-3" style={{ color: "#000000" }}>
          Have you already been applying for jobs?
        </legend>
        <div className="space-y-2">
          {OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors",
                "focus-within:ring-2 focus-within:ring-[#146ef5]",
              )}
              style={
                selected === opt.value
                  ? { background: PRIMARY_TINT, boxShadow: `0px 0px 0px 1.5px ${PRIMARY_RING}` }
                  : { background: "#ffffff", boxShadow: CLAY_SHADOW }
              }
            >
              <input
                type="radio"
                name="application_status"
                value={opt.value}
                checked={selected === opt.value}
                onChange={() => setSelected(opt.value)}
                className="sr-only"
              />
              <span
                className="h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{
                  borderColor: selected === opt.value ? PRIMARY : BORDER,
                  background: selected === opt.value ? PRIMARY : "transparent",
                }}
              >
                {selected === opt.value && (
                  <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span className="text-[14px]" style={{ color: "#000000" }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!selected}
        className="w-full py-2.5 text-[16px] font-medium transition-colors disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
        style={{
          borderRadius: "1584px",
          background: selected ? PRIMARY : "#e8e7e2",
          color: selected ? "#ffffff" : "#9f9b93",
        }}
      >
        Submit
      </button>
    </div>
  )
}
