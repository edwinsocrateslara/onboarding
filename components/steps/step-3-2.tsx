"use client"

import { useState, useEffect, useRef } from "react"
import type { AvailabilityValue, FinancialConstraintValue, PayUnitValue } from "@/hooks/use-onboarding"
import { AssistantQuestion, OptionCard, PillButton } from "./shared"

const AVAILABILITY_OPTIONS: { label: string; value: AvailabilityValue }[] = [
  { label: "Less than 10 hours",                    value: "less_than_10" },
  { label: "10–20 hours",                            value: "10_to_20"    },
  { label: "20–30 hours",                            value: "20_to_30"    },
  { label: "30+ hours / I'm doing this full-time",  value: "30_plus"     },
]

const FINANCIAL_OPTIONS: { label: string; value: FinancialConstraintValue }[] = [
  { label: "I need to keep earning — can't afford unpaid training",       value: "needs_income"  },
  { label: "I have some savings — can handle a short gap (1–3 months)",  value: "some_savings"  },
  { label: "I have runway — can invest in longer training if needed",     value: "has_runway"    },
]

const PAY_UNIT_OPTIONS: { label: string; value: PayUnitValue }[] = [
  { label: "Hourly", value: "hourly" },
  { label: "Yearly", value: "yearly" },
]

const INPUT_REST  = "0px 0px 0px 1px #dad4c8"
const INPUT_FOCUS = "0px 0px 0px 2px #146ef5"

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

function filterPayInput(value: string): string {
  const stripped = value.replace(/[^0-9.,]/g, "").replace(/,/g, "")
  const parts = stripped.split(".")
  return parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : stripped
}

interface PayRowProps {
  caption: string
  value: string
  unit: PayUnitValue | null
  advancing: boolean
  onChange: (v: string) => void
  onUnit: (u: PayUnitValue) => void
  onBlurNormalize: (normalized: string) => void
  ariaLabel: string
}

function PayRow({ caption, value, unit, advancing, onChange, onUnit, onBlurNormalize, ariaLabel }: PayRowProps) {
  const [focused, setFocused] = useState(false)
  const display = focused ? value : formatWithCommas(value)

  return (
    <div className="space-y-1.5">
      <p className="text-[11px]" style={{ color: "#9f9b93" }}>{caption}</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[15px] font-medium shrink-0" style={{ color: "#9f9b93" }}>$</span>
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onChange={e => { if (!advancing) onChange(filterPayInput(e.target.value)) }}
          onFocus={e => { setFocused(true); e.currentTarget.style.boxShadow = INPUT_FOCUS }}
          onBlur={e => { onBlurNormalize(normalizeRaw(value)); setFocused(false); e.currentTarget.style.boxShadow = INPUT_REST }}
          disabled={advancing}
          placeholder="0"
          className="shrink-0 rounded px-3 py-3 text-[15px] focus:outline-none transition-shadow disabled:opacity-50"
          style={{ width: "160px", background: "#ffffff", color: "#000000", boxShadow: INPUT_REST }}
          aria-label={ariaLabel}
        />
        {PAY_UNIT_OPTIONS.map(opt => (
          <PillButton
            key={opt.value}
            label={opt.label}
            selected={unit === opt.value}
            disabled={advancing}
            onClick={() => { if (!advancing) onUnit(opt.value) }}
          />
        ))}
      </div>
    </div>
  )
}

function isComplete(
  availability: AvailabilityValue | null,
  financial: FinancialConstraintValue | null,
  payMin: string,
  payMinUnit: PayUnitValue | null,
  payTarget: string,
  payTargetUnit: PayUnitValue | null,
): boolean {
  return (
    availability !== null &&
    financial !== null &&
    payMin.trim() !== "" && Number(payMin) > 0 && payMinUnit !== null &&
    payTarget.trim() !== "" && Number(payTarget) > 0 && payTargetUnit !== null
  )
}

const DIVIDER = <div className="w-full h-px" style={{ background: "#dad4c8" }} />

interface Props {
  initialAvailability: AvailabilityValue | null
  initialFinancial: FinancialConstraintValue | null
  initialPayMin: string
  initialPayMinUnit: PayUnitValue | null
  initialPayTarget: string
  initialPayTargetUnit: PayUnitValue | null
  onAdvance: (data: {
    availability: AvailabilityValue
    financialConstraint: FinancialConstraintValue
    payMin: string
    payMinUnit: PayUnitValue
    payTarget: string
    payTargetUnit: PayUnitValue
  }) => void
}

export function Step32({
  initialAvailability,
  initialFinancial,
  initialPayMin,
  initialPayMinUnit,
  initialPayTarget,
  initialPayTargetUnit,
  onAdvance,
}: Props) {
  const [availability, setAvailability] = useState<AvailabilityValue | null>(initialAvailability)
  const [financial, setFinancial] = useState<FinancialConstraintValue | null>(initialFinancial)
  const [payMin, setPayMin] = useState(initialPayMin)
  const [payMinUnit, setPayMinUnit] = useState<PayUnitValue | null>(initialPayMinUnit)
  const [payTarget, setPayTarget] = useState(initialPayTarget)
  const [payTargetUnit, setPayTargetUnit] = useState<PayUnitValue | null>(initialPayTargetUnit)
  const [advancing, setAdvancing] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onAdvanceRef = useRef(onAdvance)
  onAdvanceRef.current = onAdvance

  useEffect(() => {
    if (advancing) return
    if (timerRef.current) clearTimeout(timerRef.current)
    if (!isComplete(availability, financial, payMin, payMinUnit, payTarget, payTargetUnit)) return

    timerRef.current = setTimeout(() => {
      setAdvancing(true)
      onAdvanceRef.current({
        availability: availability!,
        financialConstraint: financial!,
        payMin: normalizeRaw(payMin),
        payMinUnit: payMinUnit!,
        payTarget: normalizeRaw(payTarget),
        payTargetUnit: payTargetUnit!,
      })
    }, 800)

    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [availability, financial, payMin, payMinUnit, payTarget, payTargetUnit])

  return (
    <div className="space-y-5">
      <AssistantQuestion text="Let's make sure any plan I suggest is realistic for your situation." />

      <div className="space-y-2">
        <p className="text-[12px] font-medium" style={{ color: "#9f9b93" }}>
          How many hours per week can you put toward this transition?
        </p>
        <div className="space-y-2.5">
          {AVAILABILITY_OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={availability === opt.value}
              disabled={advancing && availability !== opt.value}
              onClick={() => { if (!advancing) setAvailability(opt.value) }}
            />
          ))}
        </div>
      </div>

      {DIVIDER}

      <div className="space-y-2">
        <p className="text-[12px] font-medium" style={{ color: "#9f9b93" }}>
          What&apos;s your financial situation for this change?
        </p>
        <div className="space-y-2.5">
          {FINANCIAL_OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={financial === opt.value}
              disabled={advancing && financial !== opt.value}
              onClick={() => { if (!advancing) setFinancial(opt.value) }}
            />
          ))}
        </div>
      </div>

      {DIVIDER}

      <div className="space-y-3">
        <p className="text-[12px] font-medium" style={{ color: "#9f9b93" }}>
          What pay range works?
        </p>
        <PayRow
          caption="Minimum you need now"
          value={payMin}
          unit={payMinUnit}
          advancing={advancing}
          onChange={setPayMin}
          onUnit={setPayMinUnit}
          onBlurNormalize={setPayMin}
          ariaLabel="Minimum pay you need now"
        />
        <PayRow
          caption="Targeting longer-term"
          value={payTarget}
          unit={payTargetUnit}
          advancing={advancing}
          onChange={setPayTarget}
          onUnit={setPayTargetUnit}
          onBlurNormalize={setPayTarget}
          ariaLabel="Target pay amount"
        />
      </div>
    </div>
  )
}
