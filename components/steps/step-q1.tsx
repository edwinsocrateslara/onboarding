"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { C, StickyFooter } from "./shared"

type Q1Answer = "a" | "b" | "c" | "d"

const OPTIONS: { value: Q1Answer; label: string }[] = [
  { value: "a", label: "I'm a student"        },
  { value: "a", label: "I recently graduated" },
  { value: "b", label: "I'm employed"         },
  { value: "c", label: "I'm unemployed"       },
  { value: "d", label: "Something else"       },
]

interface Props {
  initialQ1Answer:    Q1Answer | null
  initialQ1SubOption: string | null
  initialQ1FreeText:  string
  onAdvance: (data: { q1Answer: Q1Answer; q1SubOption: string | null; q1FreeText: string }) => void
}

export function StepQ1({ initialQ1Answer, initialQ1SubOption, initialQ1FreeText, onAdvance }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    if (initialQ1Answer === null) return null
    const idx = OPTIONS.findIndex((o, i) => {
      if (initialQ1Answer === "a") return i === 0
      return o.value === initialQ1Answer
    })
    return idx === -1 ? null : idx
  })
  const [q1FreeText,       setQ1FreeText]       = useState(initialQ1FreeText)
  const [dropdownOpen,     setDropdownOpen]     = useState(false)
  const [containerFocused, setContainerFocused] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setDropdownOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const selectedOption = selectedIndex !== null ? OPTIONS[selectedIndex] : null
  const q1Answer       = selectedOption?.value ?? null
  const inputEnabled   = selectedIndex !== null
  const showAccent     = containerFocused || dropdownOpen

  return (
    <div className="flex flex-col items-center w-full">
      {/* Heading — single line, no wrap */}
      <h1
        className="text-3xl font-semibold leading-normal"
        style={{ color: C.ink, whiteSpace: "nowrap" }}
      >
        Which best describes your current situation?
      </h1>

      <div className="h-10" />

      {/* Pill container */}
      <div ref={containerRef} className="relative w-full max-w-2xl">
        <div
          className="flex items-center h-14 rounded-full transition-all"
          style={{
            background: C.surface,
            border: showAccent
              ? `1.5px solid ${C.accentBorder}`
              : `1px solid ${C.border}`,
          }}
        >
          {/* Free-text input */}
          <input
            ref={inputRef}
            type="text"
            value={q1FreeText}
            onChange={e => setQ1FreeText(e.target.value)}
            disabled={!inputEnabled}
            placeholder="In a few words, tell us about your situation..."
            onFocus={() => setContainerFocused(true)}
            onBlur={() => setContainerFocused(false)}
            className="flex-1 pl-5 pr-3 h-full text-base bg-transparent focus:outline-none min-w-0"
            style={{
              color:  inputEnabled ? C.ink : C.placeholder,
              cursor: inputEnabled ? "text" : "default",
            }}
            aria-label="Tell us more about your situation"
          />

          {/* Vertical divider */}
          <div className="w-px h-6 shrink-0" style={{ background: C.border }} />

          {/* Dropdown trigger — min-width sized to longest option */}
          <button
            type="button"
            onClick={() => setDropdownOpen(prev => !prev)}
            onFocus={() => setContainerFocused(true)}
            onBlur={() => setContainerFocused(false)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            aria-label="Select your current situation"
            className="flex items-center gap-1.5 pl-4 pr-5 h-full shrink-0 focus:outline-none"
            style={{ minWidth: "230px" }}
          >
            <span
              className="text-base flex-1 text-left"
              style={{ color: selectedOption ? C.ink : C.placeholder }}
            >
              {selectedOption ? selectedOption.label : "Select an option"}
            </span>
            <ChevronDown
              className="h-4 w-4 shrink-0 transition-transform duration-150"
              style={{
                color: C.muted,
                transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </button>
        </div>

        {/* Dropdown menu — full pill width */}
        {dropdownOpen && (
          <div
            className="absolute z-20 right-0 mt-2 rounded-xl overflow-hidden"
            style={{
              background: C.surface,
              border:     `1px solid ${C.border}`,
              boxShadow:  "0 4px 16px rgba(0,0,0,0.08)",
              top:        "100%",
              minWidth:   "230px",
            }}
            role="listbox"
          >
            {OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                role="option"
                aria-selected={selectedIndex === i}
                onMouseDown={e => e.preventDefault()}
                onClick={() => {
                  setSelectedIndex(i)
                  setDropdownOpen(false)
                  inputRef.current?.focus()
                }}
                className="w-full flex items-center justify-between px-4 py-3 text-base text-left transition-colors hover:bg-[#f9fafb] focus:outline-none"
                style={{ color: C.ink }}
              >
                {opt.label}
                {selectedIndex === i && (
                  <Check className="h-4 w-4 shrink-0" style={{ color: C.primary }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter
        onClick={() => onAdvance({ q1Answer: q1Answer!, q1SubOption: null, q1FreeText: q1FreeText.trim() })}
        disabled={q1Answer === null}
        label="Next"
      />
    </div>
  )
}
