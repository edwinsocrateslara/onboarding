"use client"

import { useState } from "react"
import type { ScheduleValue, WorkModalityValue, PayUnitValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, PillButton, OptionCard, SegmentedControl, StickyFooter, FieldLabel, FOCUS_RING } from "./shared"

const SCHEDULE_OPTIONS: { label: string; value: ScheduleValue }[] = [
  { label: "Full-time",  value: "full_time"  },
  { label: "Part-time",  value: "part_time"  },
  { label: "Flexible",   value: "flexible"   },
  { label: "Shift work", value: "shift_work" },
]

const MODALITY_OPTIONS: { label: string; value: WorkModalityValue }[] = [
  { label: "On-site",       value: "on_site"       },
  { label: "Remote",        value: "remote"        },
  { label: "Hybrid",        value: "hybrid"        },
  { label: "No preference", value: "no_preference" },
]

const PAY_UNIT_OPTIONS: { label: string; value: PayUnitValue }[] = [
  { label: "Hourly", value: "hourly" },
  { label: "Yearly", value: "yearly" },
]

interface Props {
  initialSchedule: ScheduleValue[]
  initialModality: WorkModalityValue | null
  initialPayAmount: string
  initialPayUnit: PayUnitValue | null
  onAdvance: (data: { schedule: ScheduleValue[]; modality: WorkModalityValue; payAmount: string; payUnit: PayUnitValue }) => void
}

function isComplete(
  schedule: ScheduleValue[],
  modality: WorkModalityValue | null,
  pay: string,
  payUnit: PayUnitValue | null,
) {
  return schedule.length > 0 && modality !== null && pay.trim() !== "" && Number(pay) > 0 && payUnit !== null
}

function formatWithCommas(value: string): string {
  if (!value) return ""
  const [intPart, decPart] = value.split(".")
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted
}

function normalizeRaw(raw: string): string {
  if (!raw) return ""
  const parts = raw.split(".")
  const intVal = parseInt(parts[0] || "0", 10)
  if (isNaN(intVal)) return ""
  return parts.length > 1 ? `${intVal}.${parts[1]}` : String(intVal)
}

export function Step22({ initialSchedule, initialModality, initialPayAmount, initialPayUnit, onAdvance }: Props) {
  const [schedule, setSchedule] = useState<ScheduleValue[]>(initialSchedule)
  const [modality, setModality] = useState<WorkModalityValue | null>(initialModality)
  const [payRaw, setPayRaw] = useState(initialPayAmount)
  const [payFocused, setPayFocused] = useState(false)
  const [payUnit, setPayUnit] = useState<PayUnitValue | null>(initialPayUnit)
  const [advancing, setAdvancing] = useState(false)

  const payDisplay = payFocused ? payRaw : formatWithCommas(payRaw)

  const toggleSchedule = (val: ScheduleValue) => {
    if (advancing) return
    setSchedule(prev => prev.includes(val) ? prev.filter(s => s !== val) : [...prev, val])
  }

  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (advancing) return
    const raw = e.target.value.replace(/[^0-9.,]/g, "").replace(/,/g, "")
    const parts = raw.split(".")
    const cleaned = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : raw
    setPayRaw(cleaned)
  }

  const ready = isComplete(schedule, modality, payRaw, payUnit)

  return (
    <div className="space-y-7">
      <AssistantQuestion text="To find jobs that actually work for you, I need a few quick details." />

      <div className="space-y-2">
        <FieldLabel>Schedule</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {SCHEDULE_OPTIONS.map(opt => (
            <PillButton
              key={opt.value}
              label={opt.label}
              selected={schedule.includes(opt.value)}
              disabled={advancing}
              onClick={() => toggleSchedule(opt.value)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>Work setting</FieldLabel>
        <div className="space-y-2">
          {MODALITY_OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={modality === opt.value}
              disabled={advancing && modality !== opt.value}
              onClick={() => { if (!advancing) setModality(opt.value) }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <FieldLabel>Minimum pay you&apos;d accept</FieldLabel>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-medium shrink-0" style={{ color: "#374151" }}>$</span>
          <input
            type="text"
            inputMode="decimal"
            value={payDisplay}
            onChange={handlePayChange}
            onFocus={e => { setPayFocused(true); e.currentTarget.style.boxShadow = FOCUS_RING }}
            onBlur={e => { setPayFocused(false); e.currentTarget.style.boxShadow = "none"; setPayRaw(normalizeRaw(payRaw)) }}
            disabled={advancing}
            placeholder="0"
            className="shrink-0 rounded-lg px-3 py-3 text-[15px] focus:outline-none transition-shadow disabled:opacity-50"
            style={{ width: "160px", background: "#ffffff", color: "#111827", border: "1px solid #e5e7eb" }}
            aria-label="Minimum pay amount"
          />
          <SegmentedControl
            options={PAY_UNIT_OPTIONS}
            value={payUnit}
            onChange={setPayUnit}
            disabled={advancing}
          />
        </div>
      </div>

      <div className="h-[84px]" aria-hidden="true" />
      <StickyFooter onClick={() => {
        if (!ready || advancing) return
        setAdvancing(true)
        onAdvance({ schedule, modality: modality!, payAmount: normalizeRaw(payRaw), payUnit: payUnit! })
      }} disabled={!ready || advancing} />
    </div>
  )
}
