"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { C, FOCUS_RING, StickyFooter } from "./shared"

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
const YEARS = Array.from({ length: CURRENT_YEAR - 1980 + 1 }, (_, i) => String(CURRENT_YEAR - i))

function SelectField({ value, onChange, placeholder, ariaLabel, disabled, children }: {
  value: string; onChange: (v: string) => void
  placeholder: string; ariaLabel: string
  disabled?: boolean; children: React.ReactNode
}) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none appearance-none transition-shadow"
        style={{
          background:   disabled ? C.disabledBg : C.surface,
          color:        disabled ? C.disabledText : (value ? C.ink : C.muted),
          border:       `1px solid ${C.border}`,
          paddingRight: "36px",
          cursor:       disabled ? "not-allowed" : "auto",
        }}
        onFocus={e => { if (!disabled) e.currentTarget.style.boxShadow = FOCUS_RING }}
        onBlur={e => { e.currentTarget.style.boxShadow = "" }}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
        style={{ color: disabled ? C.disabledText : C.muted }}
      />
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium mb-1.5" style={{ color: C.muted }}>{children}</p>
  )
}

interface Props {
  onAdvance: (data: {
    educationLevel:      string
    major:               string
    educationStartYear:  string
    educationEndYear:    string
    currentlyStudying:   boolean
  }) => void
}

export function Step23Education({ onAdvance }: Props) {
  const [level,             setLevel]             = useState("")
  const [major,             setMajor]             = useState("")
  const [startYear,         setStartYear]         = useState("")
  const [endYear,           setEndYear]           = useState("")
  const [currentlyStudying, setCurrentlyStudying] = useState(false)

  const endValid = currentlyStudying || endYear !== ""
  const ready    = level !== "" && major.trim() !== "" && startYear !== "" && endValid

  function handleAdvance() {
    if (!ready) return
    onAdvance({
      educationLevel:     level,
      major:              major.trim(),
      educationStartYear: startYear,
      educationEndYear:   currentlyStudying ? "" : endYear,
      currentlyStudying,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: C.ink }}>
          What&apos;s your highest level of education?
        </h1>
        <p className="text-base mt-2" style={{ color: C.muted }}>
          If your education is in progress, select the level you&apos;re currently studying.
        </p>
      </div>

      <div>
        <SelectField value={level} onChange={setLevel} placeholder="Select education level" ariaLabel="Education level">
          {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
        </SelectField>
      </div>

      <div>
        <FieldLabel>Major / field of study</FieldLabel>
        <input
          type="text"
          value={major}
          onChange={e => setMajor(e.target.value)}
          placeholder="e.g. Nursing, Computer Science, Business"
          className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
          style={{ background: C.surface, color: C.ink, border: `1px solid ${C.border}` }}
          onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
          onBlur={e => (e.currentTarget.style.boxShadow = "")}
          aria-label="Major or field of study"
        />
      </div>

      {/* Start date + End date side by side */}
      <div className="flex gap-4">
        <div className="flex-1">
          <FieldLabel>Start date</FieldLabel>
          <SelectField value={startYear} onChange={setStartYear} placeholder="Year" ariaLabel="Start year">
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>
        </div>
        <div className="flex-1">
          <FieldLabel>End date</FieldLabel>
          <SelectField
            value={endYear}
            onChange={setEndYear}
            placeholder="Year"
            ariaLabel="End year"
            disabled={currentlyStudying}
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>
        </div>
      </div>

      <button
        type="button"
        role="checkbox"
        aria-checked={currentlyStudying}
        onClick={() => setCurrentlyStudying(prev => !prev)}
        className="flex items-center gap-3 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      >
        <span
          className="shrink-0 h-[18px] w-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors"
          style={{
            borderColor: currentlyStudying ? C.primary : C.border,
            background:  currentlyStudying ? C.primary : "transparent",
          }}
        >
          {currentlyStudying && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        <span className="text-[15px]" style={{ color: C.ink }}>I currently study here</span>
      </button>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter onClick={handleAdvance} disabled={!ready} label="Next" />
    </div>
  )
}
