"use client"

import { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { C, FOCUS_RING, StickyFooter } from "./shared"

const COUNTRY_CODES = [
  { code: "+1",  label: "🇺🇸 +1"  },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+91", label: "🇮🇳 +91" },
  { code: "+52", label: "🇲🇽 +52" },
  { code: "+61", label: "🇦🇺 +61" },
]

const CITIES = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Antonio, TX",
  "San Diego, CA",
  "Dallas, TX",
  "San Jose, CA",
]

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const DAYS     = Array.from({ length: 31 }, (_, i) => String(i + 1))
const DOB_YEARS = Array.from({ length: 80 }, (_, i) => String(new Date().getFullYear() - 17 - i))

const ETHNIC_OPTIONS = [
  { id: "american_indian",   label: "American Indian or Alaska Native"             },
  { id: "asian",             label: "Asian"                                         },
  { id: "black",             label: "Black or African American"                     },
  { id: "hispanic",          label: "Hispanic or Latino"                            },
  { id: "pacific_islander",  label: "Native Hawaiian or Other Pacific Islander"     },
  { id: "white",             label: "White"                                         },
  { id: "two_or_more",       label: "Two or more races"                             },
  { id: "other",             label: "Other"                                         },
]

function SelectField({ value, onChange, placeholder, ariaLabel, children }: {
  value: string; onChange: (v: string) => void
  placeholder: string; ariaLabel: string; children: React.ReactNode
}) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none appearance-none transition-shadow"
        style={{ background: C.surface, color: value ? C.ink : C.muted, border: `1px solid ${C.border}`, paddingRight: "36px" }}
        onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
        onBlur={e => (e.currentTarget.style.boxShadow = "")}
      >
        <option value="" disabled>{placeholder}</option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: C.muted }} />
    </div>
  )
}

function CheckboxRow({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-xl px-4 py-3 text-sm leading-[1.5] transition-colors min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      style={
        checked
          ? { background: C.accentLight, border: `1.5px solid ${C.accentBorder}`, color: C.ink }
          : { background: C.surface, border: `1px solid ${C.border}`, color: C.ink }
      }
      aria-pressed={checked}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-[3px] h-[18px] w-[18px] shrink-0 rounded-[4px] border-2 flex items-center justify-center transition-colors"
          style={{ borderColor: checked ? C.primary : C.border, background: checked ? C.primary : "transparent" }}
        >
          {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
        </span>
        {label}
      </span>
    </button>
  )
}

function FieldQuestion({ question, helper }: { question: string; helper: string }) {
  return (
    <div className="mb-1.5">
      <p className="text-sm font-medium" style={{ color: C.muted }}>
        {question}<span style={{ color: "#ef4444" }}>*</span>
      </p>
      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{helper}</p>
    </div>
  )
}

interface Props {
  onAdvance: (data: {
    countryCode: string; phone: string; city: string
    dobMonth: string; dobDay: string; dobYear: string
    ethnicGroups: string[]; ethnicOther: string
  }) => void
}

export function Step40({ onAdvance }: Props) {
  const [countryCode, setCountryCode] = useState("+1")
  const [phone, setPhone]             = useState("")
  const [city, setCity]               = useState("")
  const [dobMonth, setDobMonth]       = useState("")
  const [dobDay, setDobDay]           = useState("")
  const [dobYear, setDobYear]         = useState("")
  const [ethnicGroups, setEthnicGroups] = useState<Set<string>>(new Set())
  const [ethnicOther, setEthnicOther]   = useState("")
  const [preferNotToSay, setPreferNotToSay] = useState(false)

  const toggleEthnic = (id: string) => {
    if (id === "prefer_not_to_say") {
      const nowChecked = !preferNotToSay
      setPreferNotToSay(nowChecked)
      if (nowChecked) setEthnicGroups(new Set())
      return
    }
    setPreferNotToSay(false)
    setEthnicGroups(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const otherChecked = ethnicGroups.has("other") && !preferNotToSay
  const hasEthnic    = preferNotToSay || ethnicGroups.size > 0
  const otherValid   = !otherChecked || ethnicOther.trim() !== ""

  const ready =
    phone.trim() !== "" &&
    city !== "" &&
    dobMonth !== "" && dobDay !== "" && dobYear !== "" &&
    hasEthnic && otherValid

  const handleContinue = () => {
    if (!ready) return
    onAdvance({
      countryCode,
      phone: phone.trim(),
      city,
      dobMonth, dobDay, dobYear,
      ethnicGroups: preferNotToSay ? ["prefer_not_to_say"] : Array.from(ethnicGroups),
      ethnicOther: otherChecked ? ethnicOther.trim() : "",
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: C.ink }}>
          Onboarding form
        </h1>
        <p className="text-base mt-2" style={{ color: C.muted }}>
          Just a few final questions before getting started!
        </p>
      </div>

      {/* Phone */}
      <div>
        <FieldQuestion
          question="What is your phone number? "
          helper="Please enter in a valid phone number (+1 111 111 1111)"
        />
        <div className="flex gap-2">
          <div className="relative w-[110px] shrink-0">
            <select
              value={countryCode}
              onChange={e => setCountryCode(e.target.value)}
              aria-label="Country code"
              className="w-full rounded-md px-3 h-10 text-sm leading-normal focus:outline-none appearance-none transition-shadow"
              style={{ background: C.surface, color: C.ink, border: `1px solid ${C.border}`, paddingRight: "32px" }}
              onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
              onBlur={e => (e.currentTarget.style.boxShadow = "")}
            >
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: C.muted }} />
          </div>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="(555) 000-0000"
            className="flex-1 rounded-md px-3 h-10 text-sm leading-normal focus:outline-none transition-shadow"
            style={{ background: C.surface, color: C.ink, border: `1px solid ${C.border}` }}
            onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
            onBlur={e => (e.currentTarget.style.boxShadow = "")}
            aria-label="Phone number"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <FieldQuestion
          question="Where are you located? "
          helper="Please select the location from the dropdown"
        />
        <SelectField value={city} onChange={setCity} placeholder="Select your city" ariaLabel="City">
          {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
        </SelectField>
      </div>

      {/* Date of birth */}
      <div>
        <FieldQuestion
          question="What is your date of birth? "
          helper="Please enter in the correct date of birth format"
        />
        <div className="flex gap-2">
          <SelectField value={dobMonth} onChange={setDobMonth} placeholder="Month" ariaLabel="Birth month">
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </SelectField>
          <SelectField value={dobDay} onChange={setDobDay} placeholder="Day" ariaLabel="Birth day">
            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
          </SelectField>
          <SelectField value={dobYear} onChange={setDobYear} placeholder="Year" ariaLabel="Birth year">
            {DOB_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </SelectField>
        </div>
      </div>

      {/* Ethnic group */}
      <div>
        <FieldQuestion
          question="What ethnic group(s) do you identify with? "
          helper="Check all that apply"
        />
        <div className="space-y-2">
          {ETHNIC_OPTIONS.map(opt => (
            <div key={opt.id}>
              <CheckboxRow
                label={opt.label}
                checked={ethnicGroups.has(opt.id) && !preferNotToSay}
                onClick={() => toggleEthnic(opt.id)}
              />
              {opt.id === "other" && otherChecked && (
                <div className="pl-[44px] pt-2 pb-1 pr-1">
                  <input
                    type="text"
                    value={ethnicOther}
                    onChange={e => setEthnicOther(e.target.value)}
                    placeholder="Please specify"
                    autoFocus
                    className="w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-shadow"
                    style={{ background: C.surface, color: C.ink, border: `1px solid ${C.border}` }}
                    onFocus={e => (e.currentTarget.style.boxShadow = FOCUS_RING)}
                    onBlur={e => (e.currentTarget.style.boxShadow = "none")}
                    aria-label="Please specify"
                  />
                </div>
              )}
            </div>
          ))}
          <CheckboxRow
            label="Prefer not to say"
            checked={preferNotToSay}
            onClick={() => toggleEthnic("prefer_not_to_say")}
          />
        </div>
      </div>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter onClick={handleContinue} disabled={!ready} label="All done" />
    </div>
  )
}
