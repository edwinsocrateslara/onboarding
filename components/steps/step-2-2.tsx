"use client"

import { useState, useEffect, useRef } from "react"
import type { ScheduleValue, WorkModalityValue, PayUnitValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, PillButton } from "./shared"

const SCHEDULE_OPTIONS: { label: string; value: ScheduleValue }[] = [
  { label: "Full-time",  value: "full_time"  },
  { label: "Part-time",  value: "part_time"  },
  { label: "Flexible",   value: "flexible"   },
  { label: "Shift work", value: "shift_work" },
]

const MODALITY_OPTIONS: { label: string; value: WorkModalityValue }[] = [
  { label: "On-site",      value: "on_site"       },
  { label: "Remote",       value: "remote"        },
  { label: "Hybrid",       value: "hybrid"        },
  { label: "No preference",value: "no_preference" },
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

const FOCUS_RING = "0px 0px 0px 2px rgb(67, 8, 159)"

export function Step22({ initialSchedule, initialModality, initialPayAmount, initialPayUnit, onAdvance }: Props) {
  const [schedule, setSchedule] = useState<ScheduleValue[]>(initialSchedule)
  const [modality, setModality] = useState<WorkModalityValue | null>(initialModality)
  const [payRaw, setPayRaw] = useState(initialPayAmount)
  const [payFocused, setPayFocused] = useState(false)
  const [payUnit, setPayUnit] = useState<PayUnitValue | null>(initialPayUnit)
  const [advancing, setAdvancing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onAdvanceRef = useRef(onAdvance)
  onAdvanceRef.current = onAdvance

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

  const handlePayFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setPayFocused(true)
    e.currentTarget.style.boxShadow = FOCUS_RING
  }

  const handlePayBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const normalized = normalizeRaw(payRaw)
    setPayRaw(normalized)
    setPayFocused(false)
    e.currentTarget.style.boxShadow = "none"
  }

  useEffect(() => {
    if (advancing) return
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!isComplete(schedule, modality, payRaw, payUnit)) return

    timerRef.current = setTimeout(() => {
      setAdvancing(true)
      onAdvanceRef.current({ schedule, modality: modality!, payAmount: normalizeRaw(payRaw), payUnit: payUnit! })
    }, 800)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [schedule, modality, payRaw, payUnit])

  return (
    <div className="space-y-7">
      <AssistantQuestion text="To find jobs that actually work for you, I need a few quick details." />

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9f9b93" }}>
          Schedule
        </p>
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
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9f9b93" }}>
          Work setting
        </p>
        <div className="flex flex-wrap gap-2">
          {MODALITY_OPTIONS.map(opt => (
            <PillButton
              key={opt.value}
              label={opt.label}
              selected={modality === opt.value}
              disabled={advancing}
              onClick={() => { if (!advancing) setModality(opt.value) }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: "#9f9b93" }}>
          Minimum pay you&apos;d accept
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-medium shrink-0" style={{ color: "#55534e" }}>$</span>
          <input
            type="text"
            inputMode="decimal"
            value={payDisplay}
            onChange={handlePayChange}
            onFocus={handlePayFocus}
            onBlur={handlePayBlur}
            disabled={advancing}
            placeholder="0"
            className="shrink-0 rounded-lg px-3 py-3 text-[15px] focus:outline-none transition-shadow disabled:opacity-50"
            style={{
              width: "160px",
              background: "#ffffff",
              color: "#000000",
              border: "1px solid #dad4c8",
            }}
            aria-label="Minimum pay amount"
          />
          {PAY_UNIT_OPTIONS.map(opt => (
            <PillButton
              key={opt.value}
              label={opt.label}
              selected={payUnit === opt.value}
              disabled={advancing}
              onClick={() => { if (!advancing) setPayUnit(opt.value) }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
