"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

type Schedule = "Full-time" | "Part-time" | "Flexible" | "Shift work"
type Setting = "On-site" | "Remote" | "Hybrid" | "No preference"
type PayPeriod = "per hour" | "per year"

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
        "rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]",
        selected
          ? "text-[#faf9f5]"
          : "hover:opacity-80",
      )}
      style={
        selected
          ? { background: "#c96442", boxShadow: "0px 0px 0px 1px rgba(201,100,66,0.5)" }
          : { background: "rgba(201,100,66,0.07)", color: "#4d4c48", boxShadow: "0px 0px 0px 1px rgba(201,100,66,0.18)" }
      }
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
        <legend className="text-[13px] font-medium mb-2.5" style={{ color: "#5e5d59" }}>Schedule</legend>
        <div className="flex flex-wrap gap-2">
          {scheduleOptions.map((s) => (
            <Chip key={s} label={s} selected={schedule.has(s)} onClick={() => toggleSchedule(s)} />
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[13px] font-medium mb-2.5" style={{ color: "#5e5d59" }}>Work setting</legend>
        <div className="flex flex-wrap gap-2">
          {settingOptions.map((s) => (
            <Chip key={s} label={s} selected={setting === s} onClick={() => setSetting(s)} />
          ))}
        </div>
      </fieldset>

      <div>
        <label className="block text-[13px] font-medium mb-2.5" style={{ color: "#5e5d59" }}>
          Minimum pay <span className="font-normal" style={{ color: "#87867f" }}>(optional)</span>
        </label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px]" style={{ color: "#87867f" }}>$</span>
            <input
              type="number"
              value={pay}
              onChange={(e) => setPay(e.target.value)}
              placeholder="0"
              min={0}
              className="rounded-lg pl-7 pr-3 py-2 text-[14px] w-28 focus:outline-none transition-shadow"
              style={{
                background: "#fff",
                color: "#141413",
                boxShadow: "0px 0px 0px 1px #e8e6dc",
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #3898ec, 0px 0px 0px 3px rgba(56,152,236,0.12)")}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #e8e6dc")}
              aria-label="Minimum pay amount"
            />
          </div>
          <div
            className="flex rounded-lg overflow-hidden text-[13px]"
            style={{ boxShadow: "0px 0px 0px 1px #e8e6dc" }}
          >
            {(["per hour", "per year"] as PayPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPayPeriod(p)}
                className="px-3 py-2 transition-colors focus-visible:outline-none"
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
        That&apos;s me
      </button>
    </div>
  )
}
