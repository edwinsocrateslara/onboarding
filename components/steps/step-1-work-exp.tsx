"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { StickyFooter } from "./shared"

const PRIMARY       = "#6366f1"
const BORDER        = "#e5e7eb"
const INK           = "#111827"
const SECONDARY     = "#6b7280"
const FOCUS_STYLE   = "0 0 0 2px #ffffff, 0 0 0 4px #6366f1"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1970 + 6 }, (_, i) => String(CURRENT_YEAR + 5 - i))

function SelectField({ value, onChange, placeholder, ariaLabel, children }: {
  value: string; onChange: (v: string) => void
  placeholder: string; ariaLabel: string; children: React.ReactNode
}) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none appearance-none transition-shadow"
        style={{
          background: "#ffffff",
          color: value ? INK : SECONDARY,
          border: "1px solid #e5e7eb",
          paddingRight: "36px",
        }}
        onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_STYLE)}
        onBlur={e => (e.currentTarget.style.boxShadow = "")}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: SECONDARY }} />
    </div>
  )
}

interface Props {
  onAdvance: (data: {
    jobTitle: string; startMonth: string; startYear: string
    endMonth: string; endYear: string; currentlyWorking: boolean
  }) => void
}

export function Step1WorkExp({ onAdvance }: Props) {
  const [jobTitle, setJobTitle]               = useState("Warehouse Associate")
  const [startMonth, setStartMonth]           = useState("March")
  const [startYear, setStartYear]             = useState("2022")
  const [endMonth, setEndMonth]               = useState("November")
  const [endYear, setEndYear]                 = useState("2025")
  const [currentlyWorking, setCurrentlyWorking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const ready =
    jobTitle.trim() !== "" &&
    startMonth !== "" && startYear !== "" &&
    (currentlyWorking || (endMonth !== "" && endYear !== ""))

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: INK }}>
        Add your work experience
      </h2>

      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: SECONDARY }}>Job title</p>
        <input
          ref={inputRef}
          type="text"
          value={jobTitle}
          onChange={e => setJobTitle(e.target.value)}
          placeholder="e.g. Warehouse Associate"
          className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
          style={{ background: "#ffffff", color: INK, border: "1px solid #e5e7eb" }}
          onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.boxShadow = "")}
          aria-label="Job title"
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: SECONDARY }}>Start date</p>
        <div className="flex gap-2">
          <SelectField value={startMonth} onChange={setStartMonth} placeholder="Month" ariaLabel="Start month">
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </SelectField>
          <SelectField value={startYear} onChange={setStartYear} placeholder="Year" ariaLabel="Start year">
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>
        </div>
      </div>

      {!currentlyWorking && (
        <div className="space-y-2">
          <p className="text-sm font-medium" style={{ color: SECONDARY }}>End date</p>
          <div className="flex gap-2">
            <SelectField value={endMonth} onChange={setEndMonth} placeholder="Month" ariaLabel="End month">
              {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </SelectField>
            <SelectField value={endYear} onChange={setEndYear} placeholder="Year" ariaLabel="End year">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </SelectField>
          </div>
        </div>
      )}

      <button
        type="button"
        role="checkbox"
        aria-checked={currentlyWorking}
        onClick={() => setCurrentlyWorking(prev => { if (!prev) { setEndMonth(""); setEndYear("") }; return !prev })}
        className="flex items-center gap-3 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      >
        <span
          className="shrink-0 h-[18px] w-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors"
          style={{ borderColor: currentlyWorking ? PRIMARY : BORDER, background: currentlyWorking ? PRIMARY : "transparent" }}
        >
          {currentlyWorking && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        <span className="text-[15px]" style={{ color: INK }}>I currently work here</span>
      </button>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter
        onClick={() => onAdvance({ jobTitle: jobTitle.trim(), startMonth, startYear, endMonth, endYear, currentlyWorking })}
        disabled={!ready}
      />
    </div>
  )
}
