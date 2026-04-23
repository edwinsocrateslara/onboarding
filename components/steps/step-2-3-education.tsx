"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { StickyFooter } from "./shared"

const INK          = "#111827"
const SECONDARY    = "#6b7280"
const PRIMARY      = "#6366f1"
const BORDER       = "#e5e7eb"
const FOCUS_STYLE  = "0 0 0 2px #ffffff, 0 0 0 4px #6366f1"

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

function SelectField({ value, onChange, placeholder, ariaLabel, children }: {
  value: string; onChange: (v: string) => void
  placeholder: string; ariaLabel: string; children: React.ReactNode
}) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none appearance-none transition-shadow"
        style={{
          background: "#ffffff",
          color: value ? INK : SECONDARY,
          border: `1px solid ${BORDER}`,
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium mb-1.5" style={{ color: SECONDARY }}>{children}</p>
  )
}

interface Props {
  onAdvance: (data: {
    educationLevel:    string
    major:             string
    educationStartYear: string
    currentlyStudying: boolean
  }) => void
}

export function Step23Education({ onAdvance }: Props) {
  const [level,             setLevel]             = useState("")
  const [major,             setMajor]             = useState("")
  const [startYear,         setStartYear]         = useState("")
  const [currentlyStudying, setCurrentlyStudying] = useState(false)

  const ready = level !== "" && major.trim() !== "" && startYear !== ""

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: INK }}>
          What&apos;s your highest level of education?
        </h2>
        <p className="text-sm mt-2" style={{ color: SECONDARY }}>
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
          className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
          style={{ background: "#ffffff", color: INK, border: `1px solid ${BORDER}` }}
          onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_STYLE)}
          onBlur={e => (e.currentTarget.style.boxShadow = "")}
          aria-label="Major or field of study"
        />
      </div>

      <div>
        <FieldLabel>Start date</FieldLabel>
        <SelectField value={startYear} onChange={setStartYear} placeholder="Year" ariaLabel="Start year">
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </SelectField>
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
            borderColor: currentlyStudying ? PRIMARY : BORDER,
            background:  currentlyStudying ? PRIMARY : "transparent",
          }}
        >
          {currentlyStudying && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        <span className="text-[15px]" style={{ color: INK }}>I currently study here</span>
      </button>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter
        onClick={() => onAdvance({ educationLevel: level, major: major.trim(), educationStartYear: startYear, currentlyStudying })}
        disabled={!ready}
        label="Next"
      />
    </div>
  )
}
