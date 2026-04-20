"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Timeline = "ASAP" | "Within 3 months" | "Within 6–12 months" | "No rush"

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
      <label className="block text-[13px] font-medium mb-1.5" style={{ color: "#000000" }}>
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded px-3 py-2.5 text-[14px] focus:outline-none transition-shadow"
        style={{ background: "#fff", color: "#000000", boxShadow: INPUT_REST }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = INPUT_FOCUS)}
        onBlur={(e) => (e.currentTarget.style.boxShadow = INPUT_REST)}
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
        placeholder="Project manager at a logistics company"
      />
      <TextInput
        label="Where you want to go"
        value={targetRole}
        onChange={setTargetRole}
        placeholder="UX designer at a tech company"
      />

      <fieldset>
        <legend className="block text-[13px] font-medium mb-2.5" style={{ color: "#000000" }}>
          How soon?
        </legend>
        <div className="space-y-2">
          {timelineOptions.map((t) => (
            <label
              key={t}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors",
                "focus-within:ring-2 focus-within:ring-[#146ef5]",
              )}
              style={
                timeline === t
                  ? { background: PRIMARY_TINT, boxShadow: `0px 0px 0px 1.5px ${PRIMARY_RING}` }
                  : { background: "#ffffff", boxShadow: CLAY_SHADOW }
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
                  borderColor: timeline === t ? PRIMARY : BORDER,
                  background: timeline === t ? PRIMARY : "transparent",
                }}
              >
                {timeline === t && <span className="block h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span className="text-[14px]" style={{ color: "#000000" }}>{t}</span>
            </label>
          ))}
        </div>
      </fieldset>

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
