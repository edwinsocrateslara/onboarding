"use client"

import { useState, useEffect, useRef } from "react"
import type { TimelineValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, OptionCard, ContinueButton, FieldLabel, FOCUS_RING } from "./shared"

const TIMELINE_OPTIONS: { label: string; value: TimelineValue }[] = [
  { label: "Already in transition — as soon as possible", value: "immediate"             },
  { label: "Within 3 months",                             value: "within_3_months"       },
  { label: "Within 6–12 months",                         value: "within_6_to_12_months" },
  { label: "No rush — still exploring the right path",   value: "no_timeline"           },
]

interface Props {
  initialFrom: string
  initialTo: string
  initialTimeline: TimelineValue | null
  onAdvance: (data: { currentRoleOrField: string; targetCareer: string; targetTimeline: TimelineValue }) => void
}

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

  const inputClass = "w-full rounded-lg px-4 py-3.5 text-[15px] focus:outline-none transition-shadow disabled:opacity-50"
  const inputStyle = { background: "#ffffff", color: "#111827", border: "1px solid #e5e7eb" }

  const ready = !!(from.trim() && to.trim() && timeline)

  return (
    <div className="space-y-7">
      <AssistantQuestion text="Tell me about the change you're making." />

      <div className="space-y-2">
        <FieldLabel>What you&apos;re doing now</FieldLabel>
        <input
          ref={fromRef}
          type="text"
          value={from}
          onChange={e => { if (!advancing) { completionTriggerRef.current = "text"; setFrom(e.target.value) } }}
          disabled={advancing}
          className={inputClass}
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
          onBlur={e => (e.currentTarget.style.boxShadow = "none")}
          aria-label="What you're doing now"
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>Where you want to go</FieldLabel>
        <input
          type="text"
          value={to}
          onChange={e => { if (!advancing) { completionTriggerRef.current = "text"; setTo(e.target.value) } }}
          disabled={advancing}
          className={inputClass}
          style={inputStyle}
          onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
          onBlur={e => (e.currentTarget.style.boxShadow = "none")}
          aria-label="Where you want to go"
        />
      </div>

      <div className="space-y-2">
        <FieldLabel>How soon do you want to make the switch?</FieldLabel>
        <div className="space-y-2">
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

      <ContinueButton onClick={() => {
        if (!ready || advancing) return
        if (timerRef.current) clearTimeout(timerRef.current)
        setAdvancing(true)
        onAdvance({ currentRoleOrField: from.trim(), targetCareer: to.trim(), targetTimeline: timeline! })
      }} disabled={!ready || advancing} />
    </div>
  )
}
