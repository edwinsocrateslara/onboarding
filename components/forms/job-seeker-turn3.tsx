"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Schedule = "Full-time" | "Part-time" | "Flexible" | "Shift work"
type Setting = "On-site" | "Remote" | "Hybrid" | "No preference"
type PayPeriod = "per hour" | "per year"

const PRIMARY      = "#43089f"
const PRIMARY_RING = "rgba(67,8,159,0.4)"
const BORDER       = "#dad4c8"
const INPUT_REST   = `0px 0px 0px 1px ${BORDER}`
const INPUT_FOCUS  = "0px 0px 0px 2px #146ef5"

interface Props {
  onSubmit: (data: Record<string, unknown>, formatted: string) => void
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]",
      )}
      style={{
        borderRadius: "1584px",
        background: selected ? PRIMARY : "#ffffff",
        color: selected ? "#ffffff" : "#000000",
        boxShadow: selected ? `0px 0px 0px 1.5px ${PRIMARY_RING}` : INPUT_REST,
      }}
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}

export function JobSeekerTurn3({ onSubmit }: Props) {
  const [schedule, setSchedule] = useState<Set<Schedule>>(new Set())
  const [setting, setSetting] = useState<Setting | null>(null)
  const [pay, setPay] = useState("")
  const [payPeriod, setPayPeriod] = useState<PayPeriod>("per hour")

  const toggleSchedule = (s: Schedule) => {
    setSchedule((prev) => {
      const next = new Set(prev)
      next.has(s) ? next.delete(s) : next.add(s)
      return next
    })
  }

  const canSubmit = schedule.size > 0 && setting !== null

  const handleSubmit = () => {
    if (!canSubmit) return
    const data: Record<string, unknown> = {
      schedule: Array.from(schedule),
      setting,
      min_pay: pay ? Number(pay) : null,
      pay_period: payPeriod,
    }

    const payStr = pay ? `, $${Number(pay).toLocaleString()}${payPeriod === "per hour" ? "/hr" : "/yr"} minimum` : ""
    const formatted = `${Array.from(schedule).join(", ")}, ${setting}${payStr}`
    onSubmit(data, formatted)
  }

  const scheduleOptions: Schedule[] = ["Full-time", "Part-time", "Flexible", "Shift work"]
  const settingOptions: Setting[] = ["On-site", "Remote", "Hybrid", "No preference"]

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-[13px] font-medium mb-2.5" style={{ color: "#000000" }}>Schedule</legend>
        <div className="flex flex-wrap gap-2">
          {scheduleOptions.map((s) => (
            <Chip key={s} label={s} selected={schedule.has(s)} onClick={() => toggleSchedule(s)} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[13px] font-medium mb-2.5" style={{ color: "#000000" }}>Work setting</legend>
        <div className="flex flex-wrap gap-2">
          {settingOptions.map((s) => (
            <Chip key={s} label={s} selected={setting === s} onClick={() => setSetting(s)} />
          ))}
        </div>
      </fieldset>

      <div>
        <label className="block text-[13px] font-medium mb-2.5" style={{ color: "#000000" }}>
          Minimum pay <span className="font-normal" style={{ color: "#9f9b93" }}>(optional)</span>
        </label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px]" style={{ color: "#9f9b93" }}>$</span>
            <input
              type="number"
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              placeholder="0"
              min={0}
              className="rounded pl-7 pr-3 py-2 text-[14px] w-28 focus:outline-none transition-shadow"
              style={{ background: "#fff", color: "#000000", boxShadow: INPUT_REST }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = INPUT_FOCUS)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = INPUT_REST)}
              aria-label="Minimum pay amount"
            />
          </div>
          <div
            className="flex overflow-hidden text-[13px]"
            style={{ borderRadius: "1584px", boxShadow: INPUT_REST }}
          >
            {(["per hour", "per year"] as PayPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPayPeriod(p)}
                className="px-3 py-2 transition-colors focus-visible:outline-none"
                style={
                  payPeriod === p
                    ? { background: PRIMARY, color: "#ffffff" }
                    : { background: "#ffffff", color: "#000000" }
                }
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

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
