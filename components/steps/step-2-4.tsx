"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import type { ExperienceContextType } from "@/hooks/use-onboarding"
import { AssistantQuestion, ContinueButton } from "./shared"

const REGULAR_OPTIONS = [
  { id: "student",   type: "student"   as ExperienceContextType, label: "I'm currently a student",                         placeholder: "What are you studying?" },
  { id: "working",   type: "working"   as ExperienceContextType, label: "I'm currently working",                           placeholder: "What's your job?" },
  { id: "past_job",  type: "past_job"  as ExperienceContextType, label: "I've had a past job or internship",               placeholder: "What was it?" },
  { id: "volunteer", type: "volunteer" as ExperienceContextType, label: "I've done volunteer work",                        placeholder: "What kind?" },
  { id: "courses",   type: "courses"   as ExperienceContextType, label: "I've taken online courses or certifications",     placeholder: "In what area?" },
  { id: "hobby",     type: "hobby"     as ExperienceContextType, label: "I have a hobby or side project I'm serious about",placeholder: "What is it?" },
]

type SelectionMap = Record<string, { checked: boolean; text: string }>

function initSelections(
  initialExperiences: { type: ExperienceContextType; detail: string }[],
  initialNoneSelected: boolean,
): SelectionMap {
  const map: SelectionMap = {}
  for (const opt of REGULAR_OPTIONS) {
    const exp = initialExperiences.find(e => e.type === opt.type)
    map[opt.id] = { checked: !!exp, text: exp?.detail ?? "" }
  }
  map.none = { checked: initialNoneSelected, text: "" }
  return map
}

function isReady(selections: SelectionMap): boolean {
  if (selections.none?.checked) return true
  const checked = REGULAR_OPTIONS.filter(opt => selections[opt.id]?.checked)
  if (checked.length === 0) return false
  return checked.every(opt => selections[opt.id]?.text.trim() !== "")
}

function deriveEmploymentStatus(selections: SelectionMap): "student" | "employed" | "unemployed" {
  if (selections.student?.checked) return "student"
  if (selections.working?.checked) return "employed"
  return "unemployed"
}

function buildExperiences(selections: SelectionMap): { type: ExperienceContextType; detail: string }[] {
  return REGULAR_OPTIONS
    .filter(opt => selections[opt.id]?.checked)
    .map(opt => ({ type: opt.type, detail: selections[opt.id].text.trim() }))
}

interface Props {
  initialExperiences: { type: ExperienceContextType; detail: string }[]
  initialNoneSelected: boolean
  onAdvance: (data: {
    experiences: { type: ExperienceContextType; detail: string }[]
    noneSelected: boolean
    employmentStatus: "student" | "employed" | "unemployed"
  }) => void
}

function CheckboxRow({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl px-4 py-3.5 text-[15px] leading-[1.5] transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
      style={
        checked
          ? { background: "rgba(201,100,66,0.08)", boxShadow: "0px 0px 0px 1.5px rgba(201,100,66,0.5)", color: "#141413" }
          : { background: "#faf9f5", boxShadow: "0px 0px 0px 1px #e8e6dc", color: "#3d3d3a" }
      }
      aria-pressed={checked}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-[3px] h-4 w-4 shrink-0 rounded-sm border-2 flex items-center justify-center"
          style={{
            borderColor: checked ? "#c96442" : "#c2c0b6",
            background: checked ? "#c96442" : "transparent",
          }}
        >
          {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        {label}
      </span>
    </button>
  )
}

export function Step24({ initialExperiences, initialNoneSelected, onAdvance }: Props) {
  const [selections, setSelections] = useState<SelectionMap>(() =>
    initSelections(initialExperiences, initialNoneSelected)
  )

  const toggleOption = (id: string) => {
    setSelections(prev => {
      if (id === "none") {
        const nowChecked = !prev.none.checked
        const next: SelectionMap = { none: { checked: nowChecked, text: "" } }
        for (const opt of REGULAR_OPTIONS) {
          next[opt.id] = { checked: false, text: "" }
        }
        return next
      }
      return {
        ...prev,
        [id]: { ...prev[id], checked: !prev[id].checked },
        none: { checked: false, text: "" },
      }
    })
  }

  const updateText = (id: string, text: string) => {
    setSelections(prev => ({ ...prev, [id]: { ...prev[id], text } }))
  }

  const handleContinue = () => {
    if (!isReady(selections)) return
    onAdvance({
      experiences: buildExperiences(selections),
      noneSelected: selections.none?.checked ?? false,
      employmentStatus: deriveEmploymentStatus(selections),
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <AssistantQuestion text="To help me suggest directions that fit you, tell me a bit about what you've done so far." />
        <p className="mt-3 ml-10 text-[13px] italic" style={{ color: "#87867f" }}>Check all that apply</p>
      </div>

      <div className="space-y-2">
        {REGULAR_OPTIONS.map(opt => (
          <div key={opt.id}>
            <CheckboxRow
              label={opt.label}
              checked={selections[opt.id]?.checked ?? false}
              onClick={() => toggleOption(opt.id)}
            />
            {selections[opt.id]?.checked && (
              <div className="pl-[44px] pt-2 pb-1 pr-1">
                <input
                  type="text"
                  value={selections[opt.id].text}
                  onChange={e => updateText(opt.id, e.target.value)}
                  placeholder={opt.placeholder}
                  autoFocus
                  className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none transition-shadow"
                  style={{
                    background: "#ffffff",
                    color: "#141413",
                    boxShadow: "0px 0px 0px 1px #e8e6dc",
                  }}
                  onFocus={e => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #3898ec, 0px 0px 0px 3px rgba(56,152,236,0.12)")}
                  onBlur={e => (e.currentTarget.style.boxShadow = "0px 0px 0px 1px #e8e6dc")}
                  aria-label={opt.placeholder}
                />
              </div>
            )}
          </div>
        ))}

        <CheckboxRow
          label="None of the above — I'm starting from scratch"
          checked={selections.none?.checked ?? false}
          onClick={() => toggleOption("none")}
        />
      </div>

      <div className="pt-2">
        <ContinueButton onClick={handleContinue} disabled={!isReady(selections)} />
      </div>
    </div>
  )
}
