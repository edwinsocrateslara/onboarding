"use client"

import { useReducer } from "react"
import type { ClassificationResult, Persona } from "@/lib/types"

export type UserType =
  | "student"
  | "recently_graduated"
  | "employed"
  | "unemployed"
  | "returning_to_workforce"

export type EmploymentStatus =
  | "student"
  | "recently_graduated"
  | "employed"
  | "unemployed"
  | "returning_to_workforce"

export type Step =
  | "intro"
  | "starter"
  | "2.2-student"
  | "2.2-recently-graduated"
  | "2.2-employed"
  | "2.2-unemployed"
  | "2.2-returning"
  | "2.3-education"
  | "2.3-resume"
  | "3.classification-pending"
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

const USER_TYPE_Q2: Record<UserType, Step> = {
  student:                "2.2-student",
  recently_graduated:     "2.2-recently-graduated",
  employed:               "2.2-employed",
  unemployed:             "2.2-unemployed",
  returning_to_workforce: "2.2-returning",
}

export interface OnboardingState {
  step:      Step
  direction: "forward" | "back"
  // Stage 1 — intro + starter
  firstName:         string
  lastName:          string
  location:          string
  userType:          UserType | null
  employment_status: EmploymentStatus | null
  // Q2 help question
  helpQuestionAnswer:    string
  helpQuestionOtherText: string
  goal:                  string | null
  goal_clarity:          null  // Phase 4 derives this
  // Education screen (Recently Graduated)
  educationLevel:     string
  major:              string
  educationStartYear: string
  currentlyStudying:  boolean
  // Resume screen (Employed / Unemployed / Returning)
  resumeUploaded: boolean
  resumeSkipped:  boolean
  // Classification (set after Q2 help question — Phase 4)
  classification:  ClassificationResult | null
  hasTenantForm:   boolean
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
  eceExperiences:      { type: ExperienceContextType; detail: string }[]
  eceNoneSelected:     boolean
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
  | { type: "ADVANCE_INTRO"; firstName: string; lastName: string; location: string }
  | { type: "ADVANCE_STARTER"; userType: UserType }
  | { type: "ADVANCE_Q2"; helpQuestionAnswer: string; helpQuestionOtherText: string; goal: string }
  | { type: "ADVANCE_EDUCATION"; educationLevel: string; major: string; educationStartYear: string; currentlyStudying: boolean }
  | { type: "ADVANCE_RESUME"; uploaded: boolean; skipped: boolean }
  | { type: "SET_PERSONA"; persona: Persona }
  | { type: "ADVANCE_2_2"; schedule: ScheduleValue[]; modality: WorkModalityValue; payAmount: string; payUnit: PayUnitValue }
  | { type: "ADVANCE_2_3"; currentRoleOrField: string; targetCareer: string; targetTimeline: TimelineValue }
  | { type: "ADVANCE_2_4"; experiences: { type: ExperienceContextType; detail: string }[]; noneSelected: boolean }
  | { type: "ADVANCE_3_1"; diagnostics: ApplicationDiagnosticsValue }
  | { type: "ADVANCE_3_2"; availability: AvailabilityValue; financialConstraint: FinancialConstraintValue; payMin: string; payMinUnit: PayUnitValue; payTarget: string; payTargetUnit: PayUnitValue }
  | { type: "ADVANCE_3_3"; careerInterests: CareerAreaInterestValue[] }
  | { type: "ADVANCE_4_0"; countryCode: string; phone: string; city: string; dobMonth: string; dobDay: string; dobYear: string; ethnicGroups: string[]; ethnicOther: string }
  | { type: "SET_TENANT_CONFIG"; hasTenantForm: boolean }
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
  eceCareerInterests:    [] as CareerAreaInterestValue[],
}

function initState(): OnboardingState {
  return {
    step:              "intro",
    direction:         "forward",
    firstName:         "",
    lastName:          "",
    location:          "",
    userType:          null,
    employment_status: null,
    helpQuestionAnswer:    "",
    helpQuestionOtherText: "",
    goal:         null,
    goal_clarity: null,
    educationLevel:     "",
    major:              "",
    educationStartYear: "",
    currentlyStudying:  false,
    resumeUploaded: false,
    resumeSkipped:  false,
    classification:    null,
    hasTenantForm:     true,
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
    case "ADVANCE_INTRO": {
      return {
        ...state,
        step:      "starter",
        direction: "forward",
        firstName: action.firstName,
        lastName:  action.lastName,
        location:  action.location,
      }
    }

    case "ADVANCE_STARTER": {
      return {
        ...state,
        step:              USER_TYPE_Q2[action.userType],
        direction:         "forward",
        userType:          action.userType,
        employment_status: action.userType,
        classification:    null,
        ...STAGE_2_CLEAR,
      }
    }

    case "ADVANCE_Q2": {
      const ut = state.userType
      const nextStep: Step =
        ut === "student"                ? "3.classification-pending" :
        ut === "recently_graduated"     ? "2.3-education" :
        "2.3-resume"
      return {
        ...state,
        step:                  nextStep,
        direction:             "forward",
        helpQuestionAnswer:    action.helpQuestionAnswer,
        helpQuestionOtherText: action.helpQuestionOtherText,
        goal:                  action.goal,
        goal_clarity:          null,
      }
    }

    case "ADVANCE_EDUCATION": {
      return {
        ...state,
        step:               "3.classification-pending",
        direction:          "forward",
        educationLevel:     action.educationLevel,
        major:              action.major,
        educationStartYear: action.educationStartYear,
        currentlyStudying:  action.currentlyStudying,
      }
    }

    case "ADVANCE_RESUME": {
      return {
        ...state,
        step:           "3.classification-pending",
        direction:      "forward",
        resumeUploaded: action.uploaded,
        resumeSkipped:  action.skipped,
      }
    }

    case "SET_PERSONA": {
      const step: Step =
        action.persona === "active_jobseeker" ? "2.2" :
        action.persona === "career_changer"   ? "2.3" :
        "2.4"
      return {
        ...state,
        step,
        direction:     "forward",
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
        step:               "3.2",
        direction:          "forward",
        currentRoleOrField: action.currentRoleOrField,
        targetCareer:       action.targetCareer,
        targetTimeline:     action.targetTimeline,
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
        step:                "3.3",
        direction:           "forward",
        eceExperiences:      action.experiences,
        eceNoneSelected:     action.noneSelected,
        eceCareerInterests:  [],
      }
    }

    case "SET_TENANT_CONFIG": {
      return { ...state, hasTenantForm: action.hasTenantForm }
    }

    case "ADVANCE_3_1": {
      return {
        ...state,
        step:                  state.hasTenantForm ? "4.0" : "4.1",
        direction:             "forward",
        applicationDiagnostics: action.diagnostics,
      }
    }

    case "ADVANCE_3_2": {
      return {
        ...state,
        step:                  state.hasTenantForm ? "4.0" : "4.1",
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
        step:               state.hasTenantForm ? "4.0" : "4.1",
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

      // For resume back: return to the Q2 screen that routed into it
      const ut = state.userType
      const resumeBack: Step =
        ut === "employed"               ? "2.2-employed" :
        ut === "unemployed"             ? "2.2-unemployed" :
        ut === "returning_to_workforce" ? "2.2-returning" :
        "starter"

      // For classification-pending back: return to whichever step came before
      const classificationBack: Step =
        ut === "student"            ? "2.2-student" :
        ut === "recently_graduated" ? "2.3-education" :
        "2.3-resume"

      const prev: Partial<Record<Step, Step | null>> = {
        "intro":                  null,
        "starter":                "intro",
        "2.2-student":            "starter",
        "2.2-recently-graduated": "starter",
        "2.2-employed":           "starter",
        "2.2-unemployed":         "starter",
        "2.2-returning":          "starter",
        "2.3-education":          "2.2-recently-graduated",
        "2.3-resume":             resumeBack,
        "3.classification-pending": classificationBack,
        // Back from persona Q3 returns to the user's Q2 help question
        "2.2": ut ? USER_TYPE_Q2[ut] : "starter",
        "2.3": ut ? USER_TYPE_Q2[ut] : "starter",
        "2.4": ut ? USER_TYPE_Q2[ut] : "starter",
        "3.1": "2.2",
        "3.2": "2.3",
        "3.3": "2.4",
        "4.0":
          persona === "career_changer"  ? "3.2" :
          persona === "career_explorer" ? "3.3" :
          "3.1",
        "4.1": state.hasTenantForm ? "4.0" :
          persona === "career_changer"  ? "3.2" :
          persona === "career_explorer" ? "3.3" :
          "3.1",
      }
      const prevStep = prev[state.step]
      if (!prevStep) return state
      return { ...state, step: prevStep, direction: "back" }
    }

    case "JUMP_TO_STAGE": {
      const persona  = state.classification?.persona
      const userType = state.userType

      if (action.stage === 1) return { ...state, step: "intro", direction: "back" }

      if (action.stage === 2) {
        // If userType is known, jump to the appropriate Q2 placeholder
        if (userType) return { ...state, step: USER_TYPE_Q2[userType], direction: "back" }
        return { ...state, step: "starter", direction: "back" }
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
    case "intro":
    case "starter":
    case "2.2-student":
    case "2.2-recently-graduated":
    case "2.2-employed":
    case "2.2-unemployed":
    case "2.2-returning":
    case "2.3-education":
    case "2.3-resume":
    case "3.classification-pending":
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
      const fromTo  = `${state.currentRoleOrField} → ${state.targetCareer}`
      const timeline = TIMELINE_LABEL[state.targetTimeline]
      const full     = `${fromTo} · ${timeline}`
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

export function getStageForStep(step: Step, hasTenantForm: boolean): 1 | 2 | 3 | 4 | 5 {
  if (step === "intro" || step === "starter") return 1
  if (
    step === "2.2-student" || step === "2.2-recently-graduated" ||
    step === "2.2-employed" || step === "2.2-unemployed" || step === "2.2-returning" ||
    step === "2.3-education" || step === "2.3-resume" ||
    step === "2.2" || step === "2.3" || step === "2.4"
  ) return 2
  if (
    step === "3.classification-pending" ||
    step === "3.1" || step === "3.2" || step === "3.3"
  ) return 3
  if (step === "4.0") return 4
  return hasTenantForm ? 5 : 4   // "4.1"
}

export function useOnboarding() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  return {
    state,
    advanceFromIntro: (data: { firstName: string; lastName: string; location: string }) =>
      dispatch({ type: "ADVANCE_INTRO", ...data }),
    advanceFromStarter: (userType: UserType) =>
      dispatch({ type: "ADVANCE_STARTER", userType }),
    advanceFromQ2: (data: { helpQuestionAnswer: string; helpQuestionOtherText: string; goal: string }) =>
      dispatch({ type: "ADVANCE_Q2", ...data }),
    advanceFromEducation: (data: { educationLevel: string; major: string; educationStartYear: string; currentlyStudying: boolean }) =>
      dispatch({ type: "ADVANCE_EDUCATION", ...data }),
    advanceFromResume: (data: { uploaded: boolean; skipped: boolean }) =>
      dispatch({ type: "ADVANCE_RESUME", ...data }),
    setPersona: (persona: Persona) => dispatch({ type: "SET_PERSONA", persona }),
    advanceFrom22: (data: { schedule: ScheduleValue[]; modality: WorkModalityValue; payAmount: string; payUnit: PayUnitValue }) =>
      dispatch({ type: "ADVANCE_2_2", ...data }),
    advanceFrom23: (data: { currentRoleOrField: string; targetCareer: string; targetTimeline: TimelineValue }) =>
      dispatch({ type: "ADVANCE_2_3", ...data }),
    advanceFrom24: (data: { experiences: { type: ExperienceContextType; detail: string }[]; noneSelected: boolean }) =>
      dispatch({ type: "ADVANCE_2_4", ...data }),
    advanceFrom31: (diagnostics: ApplicationDiagnosticsValue) => dispatch({ type: "ADVANCE_3_1", diagnostics }),
    advanceFrom32: (data: { availability: AvailabilityValue; financialConstraint: FinancialConstraintValue; payMin: string; payMinUnit: PayUnitValue; payTarget: string; payTargetUnit: PayUnitValue }) =>
      dispatch({ type: "ADVANCE_3_2", ...data }),
    advanceFrom33: (careerInterests: CareerAreaInterestValue[]) => dispatch({ type: "ADVANCE_3_3", careerInterests }),
    advanceFrom40: (data: { countryCode: string; phone: string; city: string; dobMonth: string; dobDay: string; dobYear: string; ethnicGroups: string[]; ethnicOther: string }) =>
      dispatch({ type: "ADVANCE_4_0", ...data }),
    setTenantConfig: (hasTenantForm: boolean) => dispatch({ type: "SET_TENANT_CONFIG", hasTenantForm }),
    back:        () => dispatch({ type: "BACK" }),
    jumpToStage: (stage: 1 | 2 | 3 | 4) => dispatch({ type: "JUMP_TO_STAGE", stage }),
  }
}
