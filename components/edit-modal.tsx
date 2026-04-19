"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { OptionCard, PillButton } from "./steps/shared"
import type {
  ScheduleValue, WorkModalityValue, PayUnitValue,
  ApplicationDiagnosticsValue, TimelineValue, AvailabilityValue,
  FinancialConstraintValue, ExperienceContextType, CareerAreaInterestValue,
} from "@/hooks/use-onboarding"

// ─── helpers ────────────────────────────────────────────────────────────────

function arr<T>(v: unknown): T[] { return Array.isArray(v) ? (v as T[]) : [] }
function str(v: unknown): string { return typeof v === "string" ? v : "" }

const INPUT_SHADOW = "0px 0px 0px 1px #e8e6dc"
const FOCUS_SHADOW = "0px 0px 0px 1px #3898ec, 0px 0px 0px 3px rgba(56,152,236,0.12)"

function TextInput({ value, onChange, placeholder, label }: {
  value: string; onChange: (v: string) => void; placeholder: string; label: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label}
      className="w-full rounded-xl px-4 py-3 text-[14px] focus:outline-none transition-shadow"
      style={{ background: "#fff", color: "#141413", boxShadow: INPUT_SHADOW }}
      onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_SHADOW)}
      onBlur={e => (e.currentTarget.style.boxShadow = INPUT_SHADOW)}
    />
  )
}

function NumberInput({ value, onChange, placeholder, label }: {
  value: string; onChange: (v: string) => void; placeholder: string; label: string
}) {
  return (
    <input
      type="text"
      inputMode="decimal"
      value={value}
      onChange={e => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
      placeholder={placeholder}
      aria-label={label}
      className="rounded-xl px-3 py-3 text-[14px] focus:outline-none transition-shadow"
      style={{ width: "140px", background: "#fff", color: "#141413", boxShadow: INPUT_SHADOW }}
      onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_SHADOW)}
      onBlur={e => (e.currentTarget.style.boxShadow = INPUT_SHADOW)}
    />
  )
}

function SectionLabel({ text }: { text: string }) {
  return <p className="text-[12px] font-medium" style={{ color: "#87867f" }}>{text}</p>
}

function MultiChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
      style={
        selected
          ? { background: "#c96442", color: "#fff" }
          : { background: "rgba(201,100,66,0.07)", color: "#4d4c48" }
      }
      aria-pressed={selected}
    >
      {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      {label}
    </button>
  )
}

// ─── per-step edit panels ────────────────────────────────────────────────────

function Edit11({ extracted, onChange }: { extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const OPTIONS: { value: string; label: string }[] = [
    { value: "specific_target",   label: "I know exactly what job I want" },
    { value: "general_direction", label: "I have a general direction" },
    { value: "exploring",         label: "I'm still exploring" },
  ]
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <SectionLabel text="Where are you right now?" />
        <div className="space-y-2">
          {OPTIONS.map(opt => (
            <OptionCard
              key={opt.value}
              label={opt.label}
              selected={extracted.goalClarity === opt.value}
              onClick={() => onChange("goalClarity", opt.value)}
            />
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <SectionLabel text="What's the job or direction? (optional)" />
        <TextInput
          value={str(extracted.goal)}
          onChange={v => onChange("goal", v)}
          placeholder="e.g. software engineer, something in healthcare"
          label="Goal or direction"
        />
      </div>
    </div>
  )
}

function Edit13({ extracted, onChange }: { extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const OPTIONS: { value: string; label: string }[] = [
    { value: "student",     label: "I'm currently in school" },
    { value: "working",     label: "I'm currently working" },
    { value: "not_working", label: "I'm between things" },
  ]
  return (
    <div className="space-y-2">
      <SectionLabel text="Your current situation" />
      <div className="space-y-2">
        {OPTIONS.map(opt => (
          <OptionCard
            key={opt.value}
            label={opt.label}
            selected={extracted.careerStageSignal === opt.value}
            onClick={() => onChange("careerStageSignal", opt.value)}
          />
        ))}
      </div>
    </div>
  )
}

function Edit22({ extracted, onChange }: { extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const SCHEDULES: { value: ScheduleValue; label: string }[] = [
    { value: "full_time",  label: "Full-time"  },
    { value: "part_time",  label: "Part-time"  },
    { value: "flexible",   label: "Flexible"   },
    { value: "shift_work", label: "Shift work" },
  ]
  const MODALITIES: { value: WorkModalityValue; label: string }[] = [
    { value: "on_site",       label: "On-site"       },
    { value: "remote",        label: "Remote"         },
    { value: "hybrid",        label: "Hybrid"         },
    { value: "no_preference", label: "No preference" },
  ]
  const schedule = arr<ScheduleValue>(extracted.schedulePreference)
  const toggleSchedule = (v: ScheduleValue) => {
    const next = schedule.includes(v) ? schedule.filter(s => s !== v) : [...schedule, v]
    onChange("schedulePreference", next)
  }
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <SectionLabel text="Schedule" />
        <div className="flex flex-wrap gap-2">
          {SCHEDULES.map(opt => (
            <MultiChip key={opt.value} label={opt.label} selected={schedule.includes(opt.value)} onClick={() => toggleSchedule(opt.value)} />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <SectionLabel text="Work setting" />
        <div className="space-y-2">
          {MODALITIES.map(opt => (
            <OptionCard key={opt.value} label={opt.label} selected={extracted.workModality === opt.value} onClick={() => onChange("workModality", opt.value)} />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <SectionLabel text="Minimum pay" />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-medium shrink-0" style={{ color: "#5e5d59" }}>$</span>
          <NumberInput value={str(extracted.payAmount)} onChange={v => onChange("payAmount", v)} placeholder="0" label="Pay amount" />
          {(["hourly", "yearly"] as PayUnitValue[]).map(u => (
            <PillButton key={u} label={u === "hourly" ? "Hourly" : "Yearly"} selected={extracted.payUnit === u} onClick={() => onChange("payUnit", u)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Edit23({ extracted, onChange }: { extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const TIMELINES: { value: TimelineValue; label: string }[] = [
    { value: "immediate",             label: "As soon as possible"   },
    { value: "within_3_months",       label: "Within 3 months"       },
    { value: "within_6_to_12_months", label: "Within 6–12 months"    },
    { value: "no_timeline",           label: "No rush / flexible"    },
  ]
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <SectionLabel text="Where you're coming from" />
        <TextInput value={str(extracted.currentRoleOrField)} onChange={v => onChange("currentRoleOrField", v)} placeholder="e.g. teacher, marketing manager" label="Current role or field" />
      </div>
      <div className="space-y-1.5">
        <SectionLabel text="Where you want to go" />
        <TextInput value={str(extracted.targetCareer)} onChange={v => onChange("targetCareer", v)} placeholder="e.g. UX designer, software developer" label="Target career" />
      </div>
      <div className="space-y-2">
        <SectionLabel text="How soon" />
        <div className="space-y-2">
          {TIMELINES.map(opt => (
            <OptionCard key={opt.value} label={opt.label} selected={extracted.targetTimeline === opt.value} onClick={() => onChange("targetTimeline", opt.value)} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Edit24({ extracted, onChange }: { extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const EXP_TYPES: { value: ExperienceContextType; label: string; placeholder: string }[] = [
    { value: "student",   label: "I'm currently a student",          placeholder: "What are you studying?" },
    { value: "working",   label: "I'm currently working",            placeholder: "What's your job?"       },
    { value: "past_job",  label: "I've had a past job or internship", placeholder: "What was it?"           },
    { value: "volunteer", label: "I've done volunteer work",          placeholder: "What kind?"             },
    { value: "courses",   label: "I've taken online courses",         placeholder: "In what area?"          },
    { value: "hobby",     label: "I have a hobby or side project",    placeholder: "What is it?"            },
  ]
  const experiences = arr<{ type: ExperienceContextType; detail: string }>(extracted.experiences)
  const noneSelected = extracted.noneSelected === true

  const toggle = (type: ExperienceContextType) => {
    if (noneSelected) onChange("noneSelected", false)
    const existing = experiences.find(e => e.type === type)
    if (existing) {
      onChange("experiences", experiences.filter(e => e.type !== type))
    } else {
      onChange("experiences", [...experiences, { type, detail: "" }])
    }
  }
  const setDetail = (type: ExperienceContextType, detail: string) => {
    onChange("experiences", experiences.map(e => e.type === type ? { ...e, detail } : e))
  }
  const toggleNone = () => {
    if (noneSelected) {
      onChange("noneSelected", false)
    } else {
      onChange("noneSelected", true)
      onChange("experiences", [])
    }
  }

  return (
    <div className="space-y-2">
      {EXP_TYPES.map(opt => {
        const exp = experiences.find(e => e.type === opt.value)
        const checked = !!exp
        return (
          <div key={opt.value}>
            <button
              type="button"
              onClick={() => toggle(opt.value)}
              className="w-full text-left rounded-xl px-4 py-3.5 text-[14px] leading-[1.5] transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
              style={
                checked
                  ? { background: "rgba(201,100,66,0.08)", boxShadow: "0px 0px 0px 1.5px rgba(201,100,66,0.5)", color: "#141413" }
                  : { background: "#faf9f5", boxShadow: "0px 0px 0px 1px #e8e6dc", color: "#3d3d3a" }
              }
              aria-pressed={checked}
            >
              <span className="flex items-start gap-3">
                <span className="mt-[3px] h-4 w-4 shrink-0 rounded-sm border-2 flex items-center justify-center"
                  style={{ borderColor: checked ? "#c96442" : "#c2c0b6", background: checked ? "#c96442" : "transparent" }}>
                  {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                </span>
                {opt.label}
              </span>
            </button>
            {checked && (
              <div className="pl-[44px] pt-1.5 pb-1 pr-1">
                <TextInput value={exp?.detail ?? ""} onChange={v => setDetail(opt.value, v)} placeholder={opt.placeholder} label={opt.placeholder} />
              </div>
            )}
          </div>
        )
      })}
      <button
        type="button"
        onClick={toggleNone}
        className="w-full text-left rounded-xl px-4 py-3.5 text-[14px] leading-[1.5] transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
        style={
          noneSelected
            ? { background: "rgba(201,100,66,0.08)", boxShadow: "0px 0px 0px 1.5px rgba(201,100,66,0.5)", color: "#141413" }
            : { background: "#faf9f5", boxShadow: "0px 0px 0px 1px #e8e6dc", color: "#3d3d3a" }
        }
        aria-pressed={noneSelected}
      >
        <span className="flex items-start gap-3">
          <span className="mt-[3px] h-4 w-4 shrink-0 rounded-sm border-2 flex items-center justify-center"
            style={{ borderColor: noneSelected ? "#c96442" : "#c2c0b6", background: noneSelected ? "#c96442" : "transparent" }}>
            {noneSelected && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
          </span>
          None of the above — I'm starting from scratch
        </span>
      </button>
    </div>
  )
}

function Edit31({ extracted, onChange }: { extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const OPTIONS: { value: ApplicationDiagnosticsValue; label: string }[] = [
    { value: "not_started",               label: "Just getting started — haven't applied yet"          },
    { value: "low_volume_no_response",    label: "Applied to some, but no responses"                   },
    { value: "high_volume_few_interviews",label: "Lots of applications, very few interviews"           },
    { value: "interviews_no_offers",      label: "Getting interviews but no offers"                    },
  ]
  return (
    <div className="space-y-2">
      <SectionLabel text="Where are you with your job search?" />
      <div className="space-y-2">
        {OPTIONS.map(opt => (
          <OptionCard key={opt.value} label={opt.label} selected={extracted.applicationDiagnostics === opt.value} onClick={() => onChange("applicationDiagnostics", opt.value)} />
        ))}
      </div>
    </div>
  )
}

function PayRow({ caption, amountKey, unitKey, extracted, onChange }: {
  caption: string; amountKey: string; unitKey: string
  extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px]" style={{ color: "#a8a69e" }}>{caption}</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[15px] font-medium shrink-0" style={{ color: "#5e5d59" }}>$</span>
        <NumberInput value={str(extracted[amountKey])} onChange={v => onChange(amountKey, v)} placeholder="0" label={caption} />
        {(["hourly", "yearly"] as PayUnitValue[]).map(u => (
          <PillButton key={u} label={u === "hourly" ? "Hourly" : "Yearly"} selected={extracted[unitKey] === u} onClick={() => onChange(unitKey, u)} />
        ))}
      </div>
    </div>
  )
}

function Edit32({ extracted, onChange }: { extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const AVAIL: { value: AvailabilityValue; label: string }[] = [
    { value: "less_than_10", label: "Less than 10 hours"                       },
    { value: "10_to_20",     label: "10–20 hours"                              },
    { value: "20_to_30",     label: "20–30 hours"                              },
    { value: "30_plus",      label: "30+ hours / I'm doing this full-time"     },
  ]
  const FIN: { value: FinancialConstraintValue; label: string }[] = [
    { value: "needs_income", label: "I need to keep earning — can't afford unpaid training"      },
    { value: "some_savings", label: "I have some savings — can handle a short gap (1–3 months)" },
    { value: "has_runway",   label: "I have runway — can invest in longer training if needed"   },
  ]
  const DIVIDER = <div className="w-full h-px" style={{ background: "#e8e6dc" }} />
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <SectionLabel text="Hours per week available" />
        <div className="space-y-2">
          {AVAIL.map(opt => (
            <OptionCard key={opt.value} label={opt.label} selected={extracted.availability === opt.value} onClick={() => onChange("availability", opt.value)} />
          ))}
        </div>
      </div>
      {DIVIDER}
      <div className="space-y-2">
        <SectionLabel text="Financial situation" />
        <div className="space-y-2">
          {FIN.map(opt => (
            <OptionCard key={opt.value} label={opt.label} selected={extracted.financialConstraint === opt.value} onClick={() => onChange("financialConstraint", opt.value)} />
          ))}
        </div>
      </div>
      {DIVIDER}
      <div className="space-y-3">
        <SectionLabel text="Pay range" />
        <PayRow caption="Minimum you need now"   amountKey="payMin"    unitKey="payMinUnit"    extracted={extracted} onChange={onChange} />
        <PayRow caption="Targeting longer-term"  amountKey="payTarget" unitKey="payTargetUnit" extracted={extracted} onChange={onChange} />
      </div>
    </div>
  )
}

function Edit33({ extracted, onChange }: { extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void }) {
  const OPTIONS: { value: CareerAreaInterestValue; main: string }[] = [
    { value: "building_fixing",    main: "Building or fixing things"              },
    { value: "numbers_data",       main: "Working with numbers or data"           },
    { value: "helping_people",     main: "Helping or caring for people"           },
    { value: "creating_content",   main: "Creating things — writing, design, media" },
    { value: "technical_problems", main: "Solving technical problems"             },
    { value: "running_organizing", main: "Running or organizing operations"       },
    { value: "selling_persuading", main: "Selling or persuading"                  },
    { value: "outdoors_hands",     main: "Working outdoors or with your hands"    },
    { value: "needs_assessment",   main: "I'm honestly not sure"                  },
  ]
  const interests = arr<CareerAreaInterestValue>(extracted.careerInterests)
  const toggle = (v: CareerAreaInterestValue) => {
    if (v === "needs_assessment") {
      onChange("careerInterests", interests.includes(v) ? [] : ["needs_assessment"])
    } else {
      const withoutNeeds = interests.filter(i => i !== "needs_assessment")
      const next = withoutNeeds.includes(v) ? withoutNeeds.filter(i => i !== v) : [...withoutNeeds, v]
      onChange("careerInterests", next)
    }
  }
  return (
    <div className="space-y-2">
      {OPTIONS.map(opt => {
        const checked = interests.includes(opt.value)
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className="w-full text-left rounded-xl px-4 py-3.5 text-[14px] leading-[1.5] transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
            style={
              checked
                ? { background: "rgba(201,100,66,0.08)", boxShadow: "0px 0px 0px 1.5px rgba(201,100,66,0.5)", color: "#141413" }
                : { background: "#faf9f5", boxShadow: "0px 0px 0px 1px #e8e6dc", color: "#3d3d3a" }
            }
            aria-pressed={checked}
          >
            <span className="flex items-start gap-3">
              <span className="mt-[3px] h-4 w-4 shrink-0 rounded-sm border-2 flex items-center justify-center"
                style={{ borderColor: checked ? "#c96442" : "#c2c0b6", background: checked ? "#c96442" : "transparent" }}>
                {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
              </span>
              {opt.main}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── panel router ────────────────────────────────────────────────────────────

function EditPanel({ step, extracted, onChange }: {
  step: string; extracted: Record<string, unknown>; onChange: (k: string, v: unknown) => void
}) {
  switch (step) {
    case "1.1": return <Edit11 extracted={extracted} onChange={onChange} />
    case "1.3": return <Edit13 extracted={extracted} onChange={onChange} />
    case "2.2": return <Edit22 extracted={extracted} onChange={onChange} />
    case "2.3": return <Edit23 extracted={extracted} onChange={onChange} />
    case "2.4": return <Edit24 extracted={extracted} onChange={onChange} />
    case "3.1": return <Edit31 extracted={extracted} onChange={onChange} />
    case "3.2": return <Edit32 extracted={extracted} onChange={onChange} />
    case "3.3": return <Edit33 extracted={extracted} onChange={onChange} />
    default:    return null
  }
}

// ─── modal shell ─────────────────────────────────────────────────────────────

interface EditModalProps {
  step:      string
  extracted: Record<string, unknown>
  onSave:    (updated: Record<string, unknown>) => void
  onClose:   () => void
}

export function EditModal({ step, extracted, onSave, onClose }: EditModalProps) {
  const [local, setLocal] = useState<Record<string, unknown>>({ ...extracted })

  const handleChange = (key: string, value: unknown) => {
    setLocal(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.3)" }}
        onClick={onClose}
      />

      {/* sheet */}
      <div
        className="relative rounded-t-2xl max-h-[85vh] flex flex-col"
        style={{ background: "#faf9f5" }}
      >
        {/* header */}
        <div
          className="shrink-0 px-4 sm:px-6 py-4 flex items-center justify-between border-b"
          style={{ borderColor: "#e8e6dc" }}
        >
          <h2 className="text-[15px] font-semibold" style={{ color: "#141413" }}>Edit your answer</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
            style={{ color: "#87867f" }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* scrollable body */}
        <div className="overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
          <EditPanel step={step} extracted={local} onChange={handleChange} />
        </div>

        {/* footer */}
        <div
          className="shrink-0 px-4 sm:px-6 py-4 border-t"
          style={{ borderColor: "#e8e6dc" }}
        >
          <button
            type="button"
            onClick={() => { onSave(local); onClose() }}
            className="min-h-[44px] px-6 rounded-full text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
            style={{ background: "#c96442", color: "#fff", cursor: "pointer" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
