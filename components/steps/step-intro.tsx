"use client"

import { useState, useEffect, useRef } from "react"
import { StickyFooter } from "./shared"

const INK          = "#111827"
const SECONDARY    = "#6b7280"
const BORDER       = "#e5e7eb"
const FOCUS_STYLE  = "0 0 0 2px #ffffff, 0 0 0 4px #6366f1"

const CITIES = [
  "Toronto ON Canada",
  "Montreal QC Canada",
  "Vancouver BC Canada",
  "Boston MA USA",
  "New York NY USA",
  "Chicago IL USA",
  "Los Angeles CA USA",
  "Seattle WA USA",
  "Austin TX USA",
  "Miami FL USA",
  "Edinburgh UK",
  "London UK",
]

// Display-only: "Seattle WA USA" → "Seattle, WA, USA" / "London UK" → "London, UK"
function formatCity(raw: string): string {
  const parts   = raw.trim().split(/\s+/)
  const country = parts[parts.length - 1]
  const mid     = parts[parts.length - 2]
  if (mid && /^[A-Z]{2}$/.test(mid)) {
    const city = parts.slice(0, parts.length - 2).join(" ")
    return `${city}, ${mid}, ${country}`
  }
  const city = parts.slice(0, parts.length - 1).join(" ")
  return `${city}, ${country}`
}

function LocationField({
  initialValue,
  onCommit,
}: {
  initialValue: string
  onCommit: (v: string) => void
}) {
  const [query, setQuery]   = useState(initialValue)
  const [open, setOpen]     = useState(false)
  const containerRef        = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? CITIES.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : CITIES

  const select = (city: string) => {
    setQuery(city)
    onCommit(city)
    setOpen(false)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={CITIES.includes(query) ? formatCity(query) : query}
        onChange={e => { setQuery(e.target.value); onCommit(""); setOpen(true) }}
        onFocus={e => { setOpen(true); e.currentTarget.style.boxShadow = FOCUS_STYLE }}
        onBlur={e => { e.currentTarget.style.boxShadow = "" }}
        placeholder="Start typing..."
        autoComplete="off"
        className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
        style={{ background: "#ffffff", color: INK, border: `1px solid ${BORDER}` }}
        aria-label="Location"
        aria-expanded={open}
        aria-autocomplete="list"
      />
      {open && filtered.length > 0 && (
        <ul
          className="absolute z-30 mt-1 w-full rounded-md overflow-auto shadow-md"
          style={{ background: "#ffffff", border: `1px solid ${BORDER}`, maxHeight: "192px" }}
          role="listbox"
        >
          {filtered.map(city => (
            <li key={city} role="option" aria-selected={city === query}>
              <button
                type="button"
                onMouseDown={() => select(city)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-[#f9fafb] transition-colors"
                style={{ color: city === query ? "#6366f1" : INK, fontWeight: city === query ? 500 : 400 }}
              >
                {formatCity(city)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium mb-1.5" style={{ color: SECONDARY }}>
      {children}
    </p>
  )
}

interface Props {
  initialFirstName: string
  initialLastName:  string
  initialLocation:  string
  onAdvance: (data: { firstName: string; lastName: string; location: string }) => void
}

export function StepIntro({ initialFirstName, initialLastName, initialLocation, onAdvance }: Props) {
  const [firstName, setFirstName] = useState(initialFirstName)
  const [lastName,  setLastName]  = useState(initialLastName)
  const [location,  setLocation]  = useState(initialLocation)
  const firstRef = useRef<HTMLInputElement>(null)

  useEffect(() => { firstRef.current?.focus() }, [])

  const ready = firstName.trim() !== "" && lastName.trim() !== "" && location !== ""

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: INK }}>
          Let&apos;s get started
        </h2>
        <p className="text-base mt-1" style={{ color: SECONDARY }}>
          Tell us a bit about yourself.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <FieldLabel>First name</FieldLabel>
          <input
            ref={firstRef}
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
            style={{ background: "#ffffff", color: INK, border: `1px solid ${BORDER}` }}
            onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.boxShadow = "")}
            aria-label="First name"
          />
        </div>

        <div>
          <FieldLabel>Last name</FieldLabel>
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
            style={{ background: "#ffffff", color: INK, border: `1px solid ${BORDER}` }}
            onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_STYLE)}
            onBlur={e => (e.currentTarget.style.boxShadow = "")}
            aria-label="Last name"
          />
        </div>

        <div>
          <FieldLabel>Where are you currently located?</FieldLabel>
          <LocationField initialValue={initialLocation} onCommit={setLocation} />
        </div>
      </div>

      <div
        className="rounded-lg px-4 py-3 text-[13px] leading-[1.55]"
        style={{ background: "#f9fafb", border: `1px solid ${BORDER}`, color: SECONDARY }}
      >
        We never sell your data, and you can opt out from having your information used for internal research at any time in your settings.
      </div>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter
        onClick={() => onAdvance({ firstName: firstName.trim(), lastName: lastName.trim(), location })}
        disabled={!ready}
        label="Next"
      />
    </div>
  )
}
