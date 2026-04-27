"use client"

import { useState } from "react"
import { C, FOCUS_RING, AssistantQuestion, OptionCard, StickyFooter } from "./shared"

type Q1Answer = "a" | "b" | "c" | "d"

const STUDENT_SUB_OPTIONS = [
  { value: "i",   label: "High school" },
  { value: "ii",  label: "College or University" },
  { value: "iii", label: "Bootcamp or training program" },
]

const UNEMPLOYED_SUB_OPTIONS = [
  { value: "i",   label: "I was recently laid off" },
  { value: "ii",  label: "I just relocated to a new country" },
  { value: "iii", label: "I'm returning from a career break" },
  { value: "iv",  label: "I'm a veteran" },
]

interface Props {
  initialQ1Answer:    Q1Answer | null
  initialQ1SubOption: string | null
  initialQ1FreeText:  string
  onAdvance: (data: { q1Answer: Q1Answer; q1SubOption: string | null; q1FreeText: string }) => void
}

function RadioGroup({
  name,
  options,
  value,
  onChange,
}: {
  name:    string
  options: { value: string; label: string }[]
  value:   string | null
  onChange: (v: string) => void
}) {
  return (
    <div role="radiogroup" className="flex flex-col">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-3 py-2 cursor-pointer select-none">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          <span
            className="shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors"
            style={{
              borderColor: value === opt.value ? C.primary : C.border,
              background:  "transparent",
            }}
          >
            {value === opt.value && (
              <span
                className="block h-2 w-2 rounded-full"
                style={{ background: C.primary }}
              />
            )}
          </span>
          <span className="text-[15px] leading-normal" style={{ color: C.subtle }}>
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  )
}

function SubOptionBlock({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <div
      style={{
        maxHeight:  visible ? "280px" : "0",
        overflow:   "hidden",
        opacity:    visible ? 1 : 0,
        transition: "max-height 0.2s ease, opacity 0.15s ease",
      }}
    >
      <div
        className="mt-1 mb-2 ml-7 pl-4 py-1"
        style={{ borderLeft: `2px solid ${C.border}` }}
      >
        {children}
      </div>
    </div>
  )
}

export function StepQ1({ initialQ1Answer, initialQ1SubOption, initialQ1FreeText, onAdvance }: Props) {
  const [q1Answer,    setQ1Answer]    = useState<Q1Answer | null>(initialQ1Answer)
  const [q1SubOption, setQ1SubOption] = useState<string | null>(initialQ1SubOption)
  const [q1FreeText,  setQ1FreeText]  = useState(initialQ1FreeText)

  function select(answer: Q1Answer) {
    setQ1Answer(answer)
    if (answer !== "a" && answer !== "c") setQ1SubOption(null)
    if (answer !== "d") setQ1FreeText("")
  }

  return (
    <div className="space-y-1">
      <AssistantQuestion text="Which best describes your current situation?" />
      <div className="h-3" />

      <div>
        <div className="mb-2">
          <OptionCard
            label="I'm a student or recent graduate"
            selected={q1Answer === "a"}
            onClick={() => select("a")}
          />
        </div>
        <SubOptionBlock visible={q1Answer === "a"}>
          <RadioGroup
            name="q1-student-sub"
            options={STUDENT_SUB_OPTIONS}
            value={q1SubOption}
            onChange={setQ1SubOption}
          />
        </SubOptionBlock>

        <div className="mb-2">
          <OptionCard
            label="I'm employed"
            selected={q1Answer === "b"}
            onClick={() => select("b")}
          />
        </div>

        <div className="mb-2">
          <OptionCard
            label="I'm unemployed"
            selected={q1Answer === "c"}
            onClick={() => select("c")}
          />
        </div>
        <SubOptionBlock visible={q1Answer === "c"}>
          <RadioGroup
            name="q1-unemployed-sub"
            options={UNEMPLOYED_SUB_OPTIONS}
            value={q1SubOption}
            onChange={setQ1SubOption}
          />
        </SubOptionBlock>

        <div className="mb-2">
          <OptionCard
            label="Something else"
            selected={q1Answer === "d"}
            onClick={() => select("d")}
          />
        </div>
        <SubOptionBlock visible={q1Answer === "d"}>
          <input
            type="text"
            value={q1FreeText}
            onChange={e => setQ1FreeText(e.target.value)}
            placeholder="Tell us a bit about your situation"
            className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
            style={{ background: C.surface, color: C.ink, border: `1px solid ${C.border}` }}
            onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={e => (e.currentTarget.style.boxShadow = "")}
            aria-label="Tell us a bit about your situation"
          />
        </SubOptionBlock>
      </div>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter
        onClick={() => onAdvance({ q1Answer: q1Answer!, q1SubOption, q1FreeText: q1FreeText.trim() })}
        disabled={q1Answer === null}
        label="Next"
      />
    </div>
  )
}
