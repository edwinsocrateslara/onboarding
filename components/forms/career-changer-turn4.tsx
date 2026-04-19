"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Hours = "<10" | "10–20" | "20–30" | "30+"
type Finance = "Need to keep earning" | "Some savings (1–3 mo)" | "Have runway"
type PayPeriod = "per hour" | "per year"

interface Props {
  onSubmit: (data: Record<string, unknown>, formatted: string) => void
}

function RadioGroup<T extends string>({
  legend,
  options,
  selected,
  onChange,
}: {
  legend: string
  options: T[]
  selected: T | null
  onChange: (v: T) => void
}) {
  return (
    <fieldset>
      <legend className="text-[13px] font-medium mb-2.5" style={{ color: "#5e5d59" }}>
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer">
            <input
              type="radio"
              name={legend}
              value={opt}
              checked={selected === opt}
              onChange={() => onChange(opt)}
              className="sr-only"
            />
            <span
              className={cn(
                "inline-block rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all",
                "focus-within:ring-2 focus-within:ring-[#3898ec]",
              )}
              style={
                selected === opt
                  ? { background: "#c96442", color: "#faf9f5", boxShadow: "0px 0px 0px 1px rgba(201,100,66,0.5)" }
                  : { background: "rgba(201,100,66,0.07)", color: "#4d4c48", boxShadow: "0px 0px 0px 1px rgba(201,100,66,0.18)" }
              }
            >
              {opt}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function CareerChangerTurn4({ onSubmit }: Props) {
  const [hours, setHours] = useState<Hours | null>(null)
  const [finance, setFinance] = useState<Finance | null>(null)
  const [minPay, setMinPay] = useState("")
  const [targetPay, setTargetPay] = useState("")
  const [payPeriod, setPayPeriod] = useState<PayPeriod>("per year")

  const canSubmit = hours !== null && finance !== null

  const handleSubmit = () => {
    if (!canSubmit) return
    const data: Record<string, unknown> = {
      hours_per_week: hours,
      financial_situation: finance,
      min_pay: minPay ? Number(minPay) : null,
      target_pay: targetPay ? Number(targetPay) : null,
      pay_period: payPeriod,
    }
    const payPart = minPay || targetPay
      ? `, pay range: ${minPay ? `$${Number(minPay).toLocaleString()}` : "—"}–${targetPay ? `$${Number(targetPay).toLocaleString()}` : "—"} ${payPeriod}`
      : ""
    const formatted = `${hours} hrs/week, ${finance}${payPart}`
    onSubmit(data, formatted)
  }

  return (
    <div className="space-y-5">
      <RadioGroup<Hours>
        legend="Hours/week for transition"
        options={["<10", "10–20", "20–30", "30+"]}
        selected={hours}
        onChange={setHours}
      />
      <RadioGroup<Finance>
        legend="Financial situation"
        options={["Need to keep earning", "Some savings (1–3 mo)", "Have runway"]}
        selected={finance}
        onChange={setFinance}
      />

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[13px] font-medium" style={{ color: "#5e5d59" }}>
            Pay range <span className="font-normal" style={{ color: "#87867f" }}>(optional)</span>
          </span>
          <div
            className="flex rounded-lg overflow-hidden text-[12px]"
            style={{ boxShadow: "0px 0px 0px 1px #e8e6dc" }}
          >
            {(["per hour", "per year"] as PayPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPayPeriod(p)}
                className="px-2.5 py-1 transition-colors"
                style={
                  payPeriod === p
                    ? { background: "#c96442", color: "#faf9f5" }
                    : { background: "#faf9f5", color: "#5e5d59" }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {[{ label: "Minimum now", val: minPay, set: setMinPay }, { label: "Target longer-term", val: targetPay, set: setTargetPay }].map(({ label, val, set }) => (
            <div key={label} className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px]" style={{ color: "#87867f" }}>$</span>
              <input
                type="number"
                value={val}
                onChange={(e) => set(e.target.value)}
                placeholder={label}
                min={0}
                className="w-full rounded-lg pl-6 pr-2 py-2 text-[13px] focus:outline-none transition-shadow"
                style={{ background: "#fff", color: "#141413", boxShadow: "0px 0px 0px 1px #e8e6dc" }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #3898ec, 0px 0px 0px 3px rgba(56,152,236,0.12)")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #e8e6dc")}
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </div>

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
        Submit
      </button>
    </div>
  )
}
