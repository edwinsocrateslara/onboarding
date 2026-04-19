"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Status =
  | "no_applications"
  | "few_no_responses"
  | "many_few_interviews"
  | "interviews_no_offers"

const OPTIONS: { value: Status; label: string }[] = [
  { value: "no_applications", label: "No, just getting started" },
  { value: "few_no_responses", label: "Yes, a few applications — no responses" },
  { value: "many_few_interviews", label: "Yes, many applications — few interviews" },
  { value: "interviews_no_offers", label: "Yes, getting interviews but no offers" },
]

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
        <legend className="text-[13px] font-medium mb-3" style={{ color: "#5e5d59" }}>
          Have you already been applying for jobs?
        </legend>
        <div className="space-y-2">
          {OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all",
                "focus-within:ring-2 focus-within:ring-[#3898ec]",
              )}
              style={
                selected === opt.value
                  ? { background: "rgba(201,100,66,0.07)", boxShadow: "0px 0px 0px 1.5px rgba(201,100,66,0.4)" }
                  : { background: "#faf9f5", boxShadow: "0px 0px 0px 1px #e8e6dc" }
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
                  borderColor: selected === opt.value ? "#c96442" : "#c2c0b6",
                  background: selected === opt.value ? "#c96442" : "transparent",
                }}
              >
                {selected === opt.value && (
                  <span className="block h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span className="text-[14px]" style={{ color: "#3d3d3a" }}>
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
        className="w-full rounded-xl py-2.5 text-[14px] font-medium transition-all disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
        style={{
          background: selected ? "#c96442" : "#e8e6dc",
          color: selected ? "#faf9f5" : "#87867f",
        }}
      >
        Submit
      </button>
    </div>
  )
}
