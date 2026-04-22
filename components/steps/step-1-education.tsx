"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { StickyFooter } from "./shared"

const PRIMARY       = "#6366f1"
const BORDER        = "#e5e7eb"
const INK           = "#111827"
const SECONDARY     = "#6b7280"
const FOCUS_STYLE   = "0 0 0 2px #ffffff, 0 0 0 4px #6366f1"

const EDUCATION_LEVELS = [
  "Less than High School",
  "High School Diploma (or equivalent)",
  "Some College (no degree)",
  "College or Polytechnic Diploma (or equivalent)",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate or Professional Degree",
]

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1970 + 6 }, (_, i) => String(CURRENT_YEAR + 5 - i))

function SelectField({ value, onChange, placeholder, ariaLabel, fullWidth, children }: {
  value: string; onChange: (v: string) => void
  placeholder: string; ariaLabel: string; fullWidth?: boolean; children: React.ReactNode
}) {
  return (
    <div className={`relative ${fullWidth ? "w-full" : "flex-1"}`}>
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
    level: string; major: string; startYear: string; endYear: string; currentlyStudying: boolean
  }) => void
}

export function Step1Education({ onAdvance }: Props) {
  const [level, setLevel]                           = useState("College or Polytechnic Diploma (or equivalent)")
  const [major, setMajor]                           = useState("Computer Science")
  const [startYear, setStartYear]                   = useState("2022")
  const [endYear, setEndYear]                       = useState("2026")
  const [currentlyStudying, setCurrentlyStudying]   = useState(true)

  const ready =
    level !== "" && major.trim() !== "" && startYear !== "" &&
    (currentlyStudying || endYear !== "")

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: INK }}>
        What&apos;s your highest level of education?
      </h2>

      <div className="space-y-2">
        <SelectField
          value={level}
          onChange={setLevel}
          placeholder="Select education level"
          ariaLabel="Education level"
          fullWidth
        >
          {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </SelectField>
        <p className="text-[13px] leading-relaxed" style={{ color: SECONDARY }}>
          If your education is in progress, select the level you&apos;re currently studying.
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium" style={{ color: SECONDARY }}>Major / field of study</p>
        <input
          type="text"
          value={major}
          onChange={e => setMajor(e.target.value)}
          placeholder="e.g. Nursing"
          className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
          style={{ background: "#ffffff", color: INK, border: "1px solid #e5e7eb" }}
          onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.boxShadow = "")}
          aria-label="Major or field of study"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-1.5">
          <p className="text-sm font-medium" style={{ color: SECONDARY }}>Start date</p>
          <SelectField value={startYear} onChange={setStartYear} placeholder="Year" ariaLabel="Start year">
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>
        </div>
        {!currentlyStudying && (
          <div className="flex-1 space-y-1.5">
            <p className="text-sm font-medium" style={{ color: SECONDARY }}>End date</p>
            <SelectField value={endYear} onChange={setEndYear} placeholder="Year" ariaLabel="End year">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </SelectField>
          </div>
        )}
      </div>

      <button
        type="button"
        role="checkbox"
        aria-checked={currentlyStudying}
        onClick={() => setCurrentlyStudying(prev => { if (!prev) setEndYear(""); return !prev })}
        className="flex items-center gap-3 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      >
        <span
          className="shrink-0 h-[18px] w-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors"
          style={{ borderColor: currentlyStudying ? PRIMARY : BORDER, background: currentlyStudying ? PRIMARY : "transparent" }}
        >
          {currentlyStudying && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        <span className="text-[15px]" style={{ color: INK }}>I currently study here</span>
      </button>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter
        onClick={() => onAdvance({ level, major: major.trim(), startYear, endYear, currentlyStudying })}
        disabled={!ready}
      />
    </div>
  )
}
