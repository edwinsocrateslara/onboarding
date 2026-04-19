"use client"

import { useState, useEffect, useRef } from "react"
import type { TimelineValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, OptionCard } from "./shared"

const TIMELINE_OPTIONS: { label: string; value: TimelineValue }[] = [
  { label: "Already in transition — as soon as possible", value: "immediate"              },
  { label: "Within 3 months",                             value: "within_3_months"        },
  { label: "Within 6–12 months",                         value: "within_6_to_12_months"  },
  { label: "No rush — still exploring the right path",   value: "no_timeline"            },
]

interface Props {
  initialFrom: string
  initialTo: string
  initialTimeline: TimelineValue | null
  onAdvance: (data: { currentRoleOrField: string; targetCareer: string; targetTimeline: TimelineValue }) => void
}

const CLAY_SHADOW  = "rgba(0,0,0,0.10) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px"
const FOCUS_SHADOW = `${CLAY_SHADOW}, 0px 0px 0px 2px rgb(20, 110, 245)`

export function Step23({ initialFrom, initialTo, initialTimeline, onAdvance }: Props) {
  const [from, setFrom] = useState(initialFrom)
  const [to, setTo] = useState(initialTo)
  const [timeline, setTimeline] = useState<TimelineValue | null>(initialTimeline)
  const [advancing, setAdvancing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onAdvanceRef = useRef(onAdvance)
  onAdvanceRef.current = onAdvance
  const completionTriggerRef = useRef<"timeline" | "text">("text")
  const fromRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fromRef.current?.focus() }, [])

  const handleTimelineSelect = (val: TimelineValue) => {
    if (advancing) return
    completionTriggerRef.current = "timeline"
    setTimeline(val)
  }

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (advancing) return
    completionTriggerRef.current = "text"
    setFrom(e.target.value)
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (advancing) return
    completionTriggerRef.current = "text"
    setTo(e.target.value)
  }

  useEffect(() => {
    if (advancing) return
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!from.trim() || !to.trim() || !timeline) return

    const delay = completionTriggerRef.current === "timeline" ? 300 : 800
    timerRef.current = setTimeout(() => {
      setAdvancing(true)
      onAdvanceRef.current({ currentRoleOrField: from.trim(), targetCareer: to.trim(), targetTimeline: timeline! })
    }, delay)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [from, to, timeline])

  const inputClass =
    "w-full rounded-xl px-4 py-3.5 text-[15px] focus:outline-none transition-shadow disabled:opacity-50"
  const inputStyle = {
    background: "#ffffff",
    color: "#000000",
    boxShadow: CLAY_SHADOW,
    border: "1px solid #dad4c8",
  }

  return (
    <div className="space-y-7">
      <AssistantQuestion text="Tell me about the change you're making." />

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9f9b93" }}>
          What you&apos;re doing now
        </p>
        <input
          ref={fromRef}
          type="text"
          value={from}
          onChange={handleFromChange}
          disabled={advancing}
          className={inputClass}
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_SHADOW)}
          onBlur={e => (e.currentTarget.style.boxShadow = CLAY_SHADOW)}
          aria-label="What you're doing now"
        />
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9f9b93" }}>
          Where you want to go
        </p>
        <input
          type="text"
          value={to}
          onChange={handleToChange}
          disabled={advancing}
          className={inputClass}
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_SHADOW)}
          onBlur={e => (e.currentTarget.style.boxShadow = CLAY_SHADOW)}
          aria-label="Where you want to go"
        />
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9f9b93" }}>
          How soon do you want to make the switch?
        </p>
        <div className="space-y-2.5">
          {TIMELINE_OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={timeline === opt.value}
              disabled={advancing && timeline !== opt.value}
              onClick={() => handleTimelineSelect(opt.value)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
