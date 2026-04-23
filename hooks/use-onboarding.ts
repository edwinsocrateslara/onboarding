"use client"

import { useReducer } from "react"
import type { ClassificationResult, Persona } from "@/lib/types"

export type Step =
  | "2.2" | "2.3" | "2.4"
  | "3.1" | "3.2" | "3.3"
  | "4.0" | "4.1"

export type ScheduleValue = "full_time" | "part_time" | "flexible" | "shift_work"
export type WorkModalityValue = "on_site" | "remote" | "hybrid" | "no_preference"
export type PayUnitValue = "hourly" | "yearly"
export type ApplicationDiagnosticsValue =
  | "not_started"
  | "low_volume_no_response"
  | "high_volume_few_interviews"
  | "interviews_no_offers"
export type TimelineValue =
  | "immediate"
  | "within_3_months"
  | "within_6_to_12_months"
  | "no_timeline"
export type AvailabilityValue = "less_than_10" | "10_to_20" | "20_to_30" | "30_plus"
export type FinancialConstraintValue = "needs_income" | "some_savings" | "has_runway"
export type ExperienceContextType = "student" | "working" | "past_job" | "volunteer" | "courses" | "hobby"
export type CareerAreaInterestValue =
  | "building_fixing"
  | "numbers_data"
  | "helping_people"
  | "creating_content"
  | "technical_problems"
  | "running_organizing"
  | "selling_persuading"
  | "outdoors_hands"
  | "needs_assessment"

export const SCHEDULE_LABEL: Record<ScheduleValue, string> = {
  full_time:  "Full-time",
  part_time:  "Part-time",
  flexible:   "Flexible",
  shift_work: "Shift work",
}

export const MODALITY_LABEL: Record<WorkModalityValue, string> = {
  on_site:       "On-site",
  remote:        "Remote",
  hybrid:        "Hybrid",
  no_preference: "No preference",
}

export const TIMELINE_LABEL: Record<TimelineValue, string> = {
  immediate:             "As soon as possible",
  within_3_months:       "Within 3 months",
  within_6_to_12_months: "Within 6–12 months",
  no_timeline:           "No rush",
}

const ECE_EXPERIENCE_RECAP: Record<ExperienceContextType, string> = {
  student:   "Student",
  working:   "Working",
  past_job:  "Past job",
  volunteer: "Volunteer work",
  courses:   "Courses",
  hobby:     "Side project",
}

export interface OnboardingState {
  step:      Step
  direction: "forward" | "back"
  // Classification
  classification: ClassificationResult | null
  // Active Jobseeker Stage 2 (Q2)
  schedulePreference: ScheduleValue[]
  workModality:       WorkModalityValue | null
  payAmount:          string
  payUnit:            PayUnitValue | null
  // Active Jobseeker Stage 3 (Q3)
  applicationDiagnostics: ApplicationDiagnosticsValue | null
  // Career Changer Stage 2 (Q2)
  currentRoleOrField: string
  targetCareer:       string
  targetTimeline:     TimelineValue | null
  // Career Changer Stage 3 (Q3)
  ccAvailability:        AvailabilityValue | null
  ccFinancialConstraint: FinancialConstraintValue | null
  ccPayMin:              string
  ccPayMinUnit:          PayUnitValue | null
  ccPayTarget:           string
  ccPayTargetUnit:       PayUnitValue | null
  // Career Explorer Stage 2 (Q2)
  eceExperiences:     { type: ExperienceContextType; detail: string }[]
  eceNoneSelected:    boolean
  eceEmploymentStatus: "student" | "employed" | "unemployed" | null
  // Career Explorer Stage 3 (Q3)
  eceCareerInterests: CareerAreaInterestValue[]
  // Stage 4 tenant form
  tenantCountryCode:  string
  tenantPhone:        string
  tenantCity:         string
  tenantDobMonth:     string
  tenantDobDay:       string
  tenantDobYear:      string
  tenantEthnicGroups: string[]
  tenantEthnicOther:  string
}

type Action =
  | { type: "SET_PERSONA"; persona: Persona }
  | { type: "ADVANCE_2_2"; schedule: ScheduleValue[]; modality: WorkModalityValue; payAmount: string; payUnit: PayUnitValue }
  | { type: "ADVANCE_2_3"; currentRoleOrField: string; targetCareer: string; targetTimeline: TimelineValue }
  | { type: "ADVANCE_2_4"; experiences: { type: ExperienceContextType; detail: string }[]; noneSelected: boolean; employmentStatus: "student" | "employed" | "unemployed" }
  | { type: "ADVANCE_3_1"; diagnostics: ApplicationDiagnosticsValue }
  | { type: "ADVANCE_3_2"; availability: AvailabilityValue; financialConstraint: FinancialConstraintValue; payMin: string; payMinUnit: PayUnitValue; payTarget: string; payTargetUnit: PayUnitValue }
  | { type: "ADVANCE_3_3"; careerInterests: CareerAreaInterestValue[] }
  | { type: "ADVANCE_4_0"; countryCode: string; phone: string; city: string; dobMonth: string; dobDay: string; dobYear: string; ethnicGroups: string[]; ethnicOther: string }
  | { type: "BACK" }
  | { type: "JUMP_TO_STAGE"; stage: 1 | 2 | 3 | 4 }

const STAGE_2_CLEAR = {
  schedulePreference:    [] as ScheduleValue[],
  workModality:          null as WorkModalityValue | null,
  payAmount:             "",
  payUnit:               null as PayUnitValue | null,
  applicationDiagnostics: null as ApplicationDiagnosticsValue | null,
  currentRoleOrField:    "",
  targetCareer:          "",
  targetTimeline:        null as TimelineValue | null,
  ccAvailability:        null as AvailabilityValue | null,
  ccFinancialConstraint: null as FinancialConstraintValue | null,
  ccPayMin:              "",
  ccPayMinUnit:          null as PayUnitValue | null,
  ccPayTarget:           "",
  ccPayTargetUnit:       null as PayUnitValue | null,
  eceExperiences:        [] as { type: ExperienceContextType; detail: string }[],
  eceNoneSelected:       false,
  eceEmploymentStatus:   null as "student" | "employed" | "unemployed" | null,
  eceCareerInterests:    [] as CareerAreaInterestValue[],
}

function initState(): OnboardingState {
  return {
    // Phase 2 will replace "2.2" with the new intro step
    step:      "2.2",
    direction: "forward",
    classification: null,
    ...STAGE_2_CLEAR,
    tenantCountryCode:  "",
    tenantPhone:        "",
    tenantCity:         "",
    tenantDobMonth:     "",
    tenantDobDay:       "",
    tenantDobYear:      "",
    tenantEthnicGroups: [],
    tenantEthnicOther:  "",
  }
}

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case "SET_PERSONA": {
      const step: Step =
        action.persona === "active_jobseeker"  ? "2.2" :
        action.persona === "career_changer"    ? "2.3" :
        "2.4"
      return {
        ...state,
        step,
        direction: "forward",
        classification: { persona: action.persona, subType: "", todoFlags: [] },
        ...STAGE_2_CLEAR,
      }
    }

    case "ADVANCE_2_2": {
      return {
        ...state,
        step:                  "3.1",
        direction:             "forward",
        schedulePreference:    action.schedule,
        workModality:          action.modality,
        payAmount:             action.payAmount,
        payUnit:               action.payUnit,
        applicationDiagnostics: null,
      }
    }

    case "ADVANCE_2_3": {
      return {
        ...state,
        step:              "3.2",
        direction:         "forward",
        currentRoleOrField: action.currentRoleOrField,
        targetCareer:      action.targetCareer,
        targetTimeline:    action.targetTimeline,
        ccAvailability:        null,
        ccFinancialConstraint: null,
        ccPayMin:              "",
        ccPayMinUnit:          null,
        ccPayTarget:           "",
        ccPayTargetUnit:       null,
      }
    }

    case "ADVANCE_2_4": {
      return {
        ...state,
        step:               "3.3",
        direction:          "forward",
        eceExperiences:     action.experiences,
        eceNoneSelected:    action.noneSelected,
        eceEmploymentStatus: action.employmentStatus,
        eceCareerInterests: [],
      }
    }

    case "ADVANCE_3_1": {
      return {
        ...state,
        step:                  "4.0",
        direction:             "forward",
        applicationDiagnostics: action.diagnostics,
      }
    }

    case "ADVANCE_3_2": {
      return {
        ...state,
        step:                  "4.0",
        direction:             "forward",
        ccAvailability:        action.availability,
        ccFinancialConstraint: action.financialConstraint,
        ccPayMin:              action.payMin,
        ccPayMinUnit:          action.payMinUnit,
        ccPayTarget:           action.payTarget,
        ccPayTargetUnit:       action.payTargetUnit,
      }
    }

    case "ADVANCE_3_3": {
      return {
        ...state,
        step:               "4.0",
        direction:          "forward",
        eceCareerInterests: action.careerInterests,
      }
    }

    case "ADVANCE_4_0": {
      return {
        ...state,
        step:               "4.1",
        direction:          "forward",
        tenantCountryCode:  action.countryCode,
        tenantPhone:        action.phone,
        tenantCity:         action.city,
        tenantDobMonth:     action.dobMonth,
        tenantDobDay:       action.dobDay,
        tenantDobYear:      action.dobYear,
        tenantEthnicGroups: action.ethnicGroups,
        tenantEthnicOther:  action.ethnicOther,
      }
    }

    case "BACK": {
      const persona = state.classification?.persona

      const prev: Partial<Record<Step, Step | null>> = {
        // Stage 2 back targets — Phase 2 will wire these to the new starter Q
        "2.2": null,
        "2.3": null,
        "2.4": null,
        "3.1": "2.2",
        "3.2": "2.3",
        "3.3": "2.4",
        "4.0":
          persona === "career_changer"  ? "3.2" :
          persona === "career_explorer" ? "3.3" :
          "3.1",
        "4.1": "4.0",
      }
      const prevStep = prev[state.step]
      if (!prevStep) return state
      return { ...state, step: prevStep, direction: "back" }
    }

    case "JUMP_TO_STAGE": {
      const persona = state.classification?.persona
      // Stage 1 has no step yet — Phase 2 will add it
      if (action.stage === 1) return state
      if (action.stage === 2) {
        const step2: Step =
          persona === "active_jobseeker" ? "2.2" :
          persona === "career_changer"   ? "2.3" :
          persona === "career_explorer"  ? "2.4" :
          "2.2"
        return { ...state, step: step2, direction: "back" }
      }
      if (action.stage === 3) {
        const step3: Step =
          persona === "career_changer"  ? "3.2" :
          persona === "career_explorer" ? "3.3" :
          "3.1"
        return { ...state, step: step3, direction: "back" }
      }
      return { ...state, step: "4.0", direction: "back" }
    }
  }
}

export function getPreviousAnswer(state: OnboardingState): string | null {
  switch (state.step) {
    case "2.2":
    case "2.3":
    case "2.4":
      return null

    case "3.1": {
      if (!state.schedulePreference.length || !state.workModality || !state.payAmount || !state.payUnit) return null
      const scheduleSummary = state.schedulePreference.map(s => SCHEDULE_LABEL[s]).join(", ")
      const payUnit = state.payUnit === "hourly" ? "hr" : "yr"
      return [scheduleSummary, MODALITY_LABEL[state.workModality], `$${state.payAmount}/${payUnit}`].join(" · ")
    }

    case "3.2": {
      if (!state.currentRoleOrField || !state.targetCareer || !state.targetTimeline) return null
      const fromTo = `${state.currentRoleOrField} → ${state.targetCareer}`
      const timeline = TIMELINE_LABEL[state.targetTimeline]
      const full = `${fromTo} · ${timeline}`
      if (full.length <= 80) return full
      const maxFromTo = 80 - 3 - timeline.length
      return `${fromTo.slice(0, maxFromTo)}… · ${timeline}`
    }

    case "3.3": {
      if (state.eceNoneSelected) return "Starting from scratch"
      if (!state.eceExperiences.length) return null
      const summary = state.eceExperiences.map(e => ECE_EXPERIENCE_RECAP[e.type]).join(", ")
      return summary.length <= 80 ? summary : summary.slice(0, 77) + "…"
    }

    case "4.0": return null
    case "4.1": return null
  }
}

export function getStageForStep(step: Step): 1 | 2 | 3 | 4 | 5 {
  if (step === "2.2" || step === "2.3" || step === "2.4") return 2
  if (step === "3.1" || step === "3.2" || step === "3.3") return 3
  if (step === "4.0") return 4
  return 5
}

export function useOnboarding() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  return {
    state,
    setPersona: (persona: Persona) => dispatch({ type: "SET_PERSONA", persona }),
    advanceFrom22: (data: { schedule: ScheduleValue[]; modality: WorkModalityValue; payAmount: string; payUnit: PayUnitValue }) =>
      dispatch({ type: "ADVANCE_2_2", ...data }),
    advanceFrom23: (data: { currentRoleOrField: string; targetCareer: string; targetTimeline: TimelineValue }) =>
      dispatch({ type: "ADVANCE_2_3", ...data }),
    advanceFrom24: (data: { experiences: { type: ExperienceContextType; detail: string }[]; noneSelected: boolean; employmentStatus: "student" | "employed" | "unemployed" }) =>
      dispatch({ type: "ADVANCE_2_4", ...data }),
    advanceFrom31: (diagnostics: ApplicationDiagnosticsValue) => dispatch({ type: "ADVANCE_3_1", diagnostics }),
    advanceFrom32: (data: { availability: AvailabilityValue; financialConstraint: FinancialConstraintValue; payMin: string; payMinUnit: PayUnitValue; payTarget: string; payTargetUnit: PayUnitValue }) =>
      dispatch({ type: "ADVANCE_3_2", ...data }),
    advanceFrom33: (careerInterests: CareerAreaInterestValue[]) => dispatch({ type: "ADVANCE_3_3", careerInterests }),
    advanceFrom40: (data: { countryCode: string; phone: string; city: string; dobMonth: string; dobDay: string; dobYear: string; ethnicGroups: string[]; ethnicOther: string }) =>
      dispatch({ type: "ADVANCE_4_0", ...data }),
    back:        () => dispatch({ type: "BACK" }),
    jumpToStage: (stage: 1 | 2 | 3 | 4) => dispatch({ type: "JUMP_TO_STAGE", stage }),
  }
}
