"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"

const PRIMARY       = "#43089f"
const BORDER        = "#dad4c8"
const INK           = "#000000"
const SECONDARY     = "#9f9b93"
const CLAY_SHADOW   = `rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px, 0px 0px 0px 1px ${BORDER}`
const FOCUS_STYLE   = "0 0 0 2px #146ef5"

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
        className="w-full rounded-xl px-4 py-3 text-[15px] focus:outline-none appearance-none transition-shadow"
        style={{
          background: "#ffffff",
          color: value ? INK : SECONDARY,
          boxShadow: CLAY_SHADOW,
          paddingRight: "36px",
        }}
        onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_STYLE)}
        onBlur={e => (e.currentTarget.style.boxShadow = CLAY_SHADOW)}
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
    <div className="space-y-5">
      <h2 className="text-[22px] font-semibold leading-snug" style={{ color: INK }}>
        What&apos;s your highest level of education?
      </h2>

      <div className="space-y-1.5">
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

      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SECONDARY }}>Major / field of study</p>
        <input
          type="text"
          value={major}
          onChange={e => setMajor(e.target.value)}
          placeholder="e.g. Nursing"
          className="w-full rounded-xl px-4 py-3 text-[15px] focus:outline-none transition-shadow"
          style={{ background: "#ffffff", color: INK, boxShadow: CLAY_SHADOW }}
          onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.boxShadow = CLAY_SHADOW)}
          aria-label="Major or field of study"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SECONDARY }}>Start date</p>
          <SelectField value={startYear} onChange={setStartYear} placeholder="Year" ariaLabel="Start year">
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>
        </div>
        {!currentlyStudying && (
          <div className="flex-1 space-y-1.5">
            <p className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: SECONDARY }}>End date</p>
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
        className="flex items-center gap-3 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
      >
        <span
          className="shrink-0 h-[18px] w-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors"
          style={{ borderColor: currentlyStudying ? PRIMARY : BORDER, background: currentlyStudying ? PRIMARY : "transparent" }}
        >
          {currentlyStudying && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        <span className="text-[15px]" style={{ color: INK }}>I currently study here</span>
      </button>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => { if (!ready) return; onAdvance({ level, major: major.trim(), startYear, endYear, currentlyStudying }) }}
          aria-disabled={!ready}
          className="min-h-[44px] px-8 text-[16px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
          style={{
            borderRadius: "1584px",
            background: ready ? PRIMARY : "#e8e7e2",
            color: ready ? "#ffffff" : SECONDARY,
            cursor: ready ? "pointer" : "default",
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}
