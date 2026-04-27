"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Check, X } from "lucide-react"
import { C, FOCUS_RING, StickyFooter } from "./shared"
import { JOB_TITLES } from "@/lib/job-ontology"

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1980 + 1 }, (_, i) => String(CURRENT_YEAR - i))

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium mb-1.5" style={{ color: C.muted }}>{children}</p>
  )
}

function SelectField({
  value, onChange, placeholder, ariaLabel, disabled, children,
}: {
  value:       string
  onChange:    (v: string) => void
  placeholder: string
  ariaLabel:   string
  disabled?:   boolean
  children:    React.ReactNode
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

function TitleAutocomplete({
  value,
  onChange,
}: {
  value:    string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)

  const suggestions = useMemo(() => {
    if (!value.trim()) return []
    const q = value.toLowerCase()
    return JOB_TITLES.filter(t => t.toLowerCase().includes(q)).slice(0, 8)
  }, [value])

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={e => {
          setOpen(true)
          e.currentTarget.style.boxShadow = FOCUS_RING
        }}
        onBlur={e => {
          setTimeout(() => setOpen(false), 150)
          e.currentTarget.style.boxShadow = ""
        }}
        placeholder="Start typing..."
        autoFocus
        className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
        style={{ background: C.surface, color: C.ink, border: `1px solid ${C.border}`, paddingRight: value ? "36px" : "12px" }}
        aria-label="Job title"
        aria-autocomplete="list"
        aria-expanded={open && suggestions.length > 0}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear job title"
          onMouseDown={e => e.preventDefault()}
          onClick={() => { onChange(""); setOpen(false) }}
          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full hover:bg-[#f3f4f6] transition-colors"
          style={{ color: C.muted }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {open && value.trim() && (
        <div
          className="absolute z-20 w-full mt-1 rounded-xl overflow-hidden"
          style={{
            background: C.surface,
            border:     `1px solid ${C.border}`,
            boxShadow:  "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map(title => (
              <button
                key={title}
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => { onChange(title); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#f9fafb] transition-colors"
                style={{ color: C.ink }}
              >
                {title}
              </button>
            ))
          ) : (
            <p className="px-4 py-3 text-sm" style={{ color: C.muted }}>
              No matches — type to use your own title
            </p>
          )}
        </div>
      )}
    </div>
  )
}

interface Props {
  initialLastJobTitle:            string
  initialLastJobStartMonth:       string
  initialLastJobStartYear:        string
  initialLastJobEndMonth:         string
  initialLastJobEndYear:          string
  initialLastJobCurrentlyWorking: boolean
  onAdvance: (data: {
    lastJobTitle:            string
    lastJobStartMonth:       string
    lastJobStartYear:        string
    lastJobEndMonth:         string
    lastJobEndYear:          string
    lastJobCurrentlyWorking: boolean
  }) => void
}

export function StepLastJob({
  initialLastJobTitle,
  initialLastJobStartMonth,
  initialLastJobStartYear,
  initialLastJobEndMonth,
  initialLastJobEndYear,
  initialLastJobCurrentlyWorking,
  onAdvance,
}: Props) {
  const [title,            setTitle]            = useState(initialLastJobTitle)
  const [startMonth,       setStartMonth]       = useState(initialLastJobStartMonth)
  const [startYear,        setStartYear]        = useState(initialLastJobStartYear)
  const [endMonth,         setEndMonth]         = useState(initialLastJobEndMonth)
  const [endYear,          setEndYear]          = useState(initialLastJobEndYear)
  const [currentlyWorking, setCurrentlyWorking] = useState(initialLastJobCurrentlyWorking)

  const endValid = currentlyWorking || (endMonth !== "" && endYear !== "")
  const ready    = title.trim() !== "" && startMonth !== "" && startYear !== "" && endValid

  function handleAdvance() {
    if (!ready) return
    onAdvance({
      lastJobTitle:            title.trim(),
      lastJobStartMonth:       startMonth,
      lastJobStartYear:        startYear,
      lastJobEndMonth:         currentlyWorking ? "" : endMonth,
      lastJobEndYear:          currentlyWorking ? "" : endYear,
      lastJobCurrentlyWorking: currentlyWorking,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: C.ink }}>
          What was your last job title?
        </h1>
        <p className="text-base mt-2" style={{ color: C.muted }}>
          Enter your current or most recent work experience, including internships.
        </p>
      </div>

      {/* Job title */}
      <div>
        <FieldLabel>Job title</FieldLabel>
        <TitleAutocomplete value={title} onChange={setTitle} />
      </div>

      {/* Start date */}
      <div>
        <FieldLabel>Start date</FieldLabel>
        <div className="flex gap-2">
          <SelectField
            value={startMonth}
            onChange={setStartMonth}
            placeholder="Month"
            ariaLabel="Start month"
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </SelectField>
          <SelectField
            value={startYear}
            onChange={setStartYear}
            placeholder="Year"
            ariaLabel="Start year"
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>
        </div>
      </div>

      {/* End date */}
      <div>
        <FieldLabel>End date</FieldLabel>
        <div className="flex gap-2">
          <SelectField
            value={endMonth}
            onChange={setEndMonth}
            placeholder="Month"
            ariaLabel="End month"
            disabled={currentlyWorking}
          >
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </SelectField>
          <SelectField
            value={endYear}
            onChange={setEndYear}
            placeholder="Year"
            ariaLabel="End year"
            disabled={currentlyWorking}
          >
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>
        </div>
      </div>

      {/* Currently work here */}
      <button
        type="button"
        role="checkbox"
        aria-checked={currentlyWorking}
        onClick={() => setCurrentlyWorking(prev => !prev)}
        className="flex items-center gap-3 text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      >
        <span
          className="shrink-0 h-[18px] w-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors"
          style={{
            borderColor: currentlyWorking ? C.primary : C.border,
            background:  currentlyWorking ? C.primary : "transparent",
          }}
        >
          {currentlyWorking && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        <span className="text-[15px]" style={{ color: C.ink }}>I currently work here</span>
      </button>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter onClick={handleAdvance} disabled={!ready} label="Next" />
    </div>
  )
}
