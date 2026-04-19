"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Timeline = "ASAP" | "Within 3 months" | "Within 6–12 months" | "No rush"

interface Props {
  onSubmit: (data: Record<string, unknown>, formatted: string) => void
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium mb-1.5" style={{ color: "#5e5d59" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-3 py-2.5 text-[14px] focus:outline-none transition-shadow"
        style={{
          background: "#fff",
          color: "#141413",
          boxShadow: "0px 0px 0px 1px #e8e6dc",
        }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #3898ec, 0px 0px 0px 3px rgba(56,152,236,0.12)")}
        onBlur={(e) => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #e8e6dc")}
      />
    </div>
  )
}

export function CareerChangerTurn3({ onSubmit }: Props) {
  const [currentRole, setCurrentRole] = useState("")
  const [targetRole, setTargetRole] = useState("")
  const [timeline, setTimeline] = useState<Timeline | null>(null)

  const canSubmit = currentRole.trim().length > 0 && targetRole.trim().length > 0 && timeline !== null

  const handleSubmit = () => {
    if (!canSubmit) return
    const data: Record<string, unknown> = {
      current_role: currentRole.trim(),
      target_role: targetRole.trim(),
      timeline,
    }
    const formatted = `Currently: ${currentRole.trim()}. Want to move into: ${targetRole.trim()}. Timeline: ${timeline}`
    onSubmit(data, formatted)
  }

  const timelineOptions: Timeline[] = ["ASAP", "Within 3 months", "Within 6–12 months", "No rush"]

  return (
    <div className="space-y-4">
      <TextInput
        label="What you're doing now"
        value={currentRole}
        onChange={setCurrentRole}
        placeholder="e.g. Project manager at a logistics company"
      />
      <TextInput
        label="Where you want to go"
        value={targetRole}
        onChange={setTargetRole}
        placeholder="e.g. UX designer at a tech company"
      />

      <fieldset>
        <legend className="block text-[13px] font-medium mb-2.5" style={{ color: "#5e5d59" }}>
          How soon?
        </legend>
        <div className="space-y-2">
          {timelineOptions.map((t) => (
            <label
              key={t}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all",
                "focus-within:ring-2 focus-within:ring-[#3898ec]",
              )}
              style={
                timeline === t
                  ? { background: "rgba(201,100,66,0.07)", boxShadow: "0px 0px 0px 1.5px rgba(201,100,66,0.4)" }
                  : { background: "#faf9f5", boxShadow: "0px 0px 0px 1px #e8e6dc" }
              }
            >
              <input
                type="radio"
                name="timeline"
                value={t}
                checked={timeline === t}
                onChange={() => setTimeline(t)}
                className="sr-only"
              />
              <span
                className="h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0"
                style={{
                  borderColor: timeline === t ? "#c96442" : "#c2c0b6",
                  background: timeline === t ? "#c96442" : "transparent",
                }}
              >
                {timeline === t && <span className="block h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="text-[14px]" style={{ color: "#3d3d3a" }}>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

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
