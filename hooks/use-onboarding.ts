"use client"

import { useReducer } from "react"
import { classify } from "@/lib/classify"
import type { GoalClarity, CareerStageSignal, ClassificationResult } from "@/lib/types"

export type Step =
  | "1.1" | "1.2" | "1.3"
  | "2.1" | "2.2" | "2.3" | "2.4"
  | "3.1" | "3.2" | "3.3"
  | "4.1"

export type Q1Option = "a" | "b" | "c"
export type CareerStageValue = "student" | "working" | "not_working"
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

const Q1_SHORT: Record<Q1Option, string> = {
  a: "I know what job I want",
  b: "I have a general direction",
  c: "I'm not sure yet",
}

const CAREER_STAGE_LABEL: Record<CareerStageValue, string> = {
  student: "Student",
  working: "Working",
  not_working: "Not working",
}

const BRIDGING_LABEL: Record<CareerStageValue, string> = {
  working: "Working",
  student: "In school",
  not_working: "Between things",
}

export const SCHEDULE_LABEL: Record<ScheduleValue, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  flexible: "Flexible",
  shift_work: "Shift work",
}

export const MODALITY_LABEL: Record<WorkModalityValue, string> = {
  on_site: "On-site",
  remote: "Remote",
  hybrid: "Hybrid",
  no_preference: "No preference",
}

export const TIMELINE_LABEL: Record<TimelineValue, string> = {
  immediate: "As soon as possible",
  within_3_months: "Within 3 months",
  within_6_to_12_months: "Within 6–12 months",
  no_timeline: "No rush",
}

const ECE_EXPERIENCE_RECAP: Record<ExperienceContextType, string> = {
  student: "Student",
  working: "Working",
  past_job: "Past job",
  volunteer: "Volunteer work",
  courses: "Courses",
  hobby: "Side project",
}

export interface OnboardingState {
  step: Step
  direction: "forward" | "back"
  // Stage 1
  q1Selection: Q1Option | null
  followUpText: string
  followUpCareerStage: CareerStageValue | null
  bridgingAnswer: CareerStageValue | null
  usedBridging: boolean
  goalClarity: GoalClarity | null
  goal: string | null
  careerStageSignal: CareerStageSignal | null
  classification: ClassificationResult | null
  // Job Seeker Stage 2 (Q2)
  schedulePreference: ScheduleValue[]
  workModality: WorkModalityValue | null
  payAmount: string
  payUnit: PayUnitValue | null
  // Job Seeker Stage 3 (Q3)
  applicationDiagnostics: ApplicationDiagnosticsValue | null
  // Career Changer Stage 2 (Q2)
  currentRoleOrField: string
  targetCareer: string
  targetTimeline: TimelineValue | null
  // Career Changer Stage 3 (Q3)
  ccAvailability: AvailabilityValue | null
  ccFinancialConstraint: FinancialConstraintValue | null
  ccPayMin: string
  ccPayMinUnit: PayUnitValue | null
  ccPayTarget: string
  ccPayTargetUnit: PayUnitValue | null
  // Early Career Explorer Stage 2 (Q2)
  eceExperiences: { type: ExperienceContextType; detail: string }[]
  eceNoneSelected: boolean
  eceEmploymentStatus: "student" | "employed" | "unemployed" | null
  // Early Career Explorer Stage 3 (Q3)
  eceCareerInterests: CareerAreaInterestValue[]
}

type Action =
  | { type: "ADVANCE_1_1"; q1: Q1Option }
  | { type: "ADVANCE_1_2_TEXT"; text: string }
  | { type: "ADVANCE_1_2_STAGE"; stage: CareerStageValue }
  | { type: "ADVANCE_1_3"; stage: CareerStageValue }
  | { type: "ADVANCE_1_CONV"; goalClarity: GoalClarity; goal: string | null; careerStageSignal: CareerStageSignal; followUpText: string }
  | { type: "ADVANCE_2_2"; schedule: ScheduleValue[]; modality: WorkModalityValue; payAmount: string; payUnit: PayUnitValue }
  | { type: "ADVANCE_2_3"; currentRoleOrField: string; targetCareer: string; targetTimeline: TimelineValue }
  | { type: "ADVANCE_2_4"; experiences: { type: ExperienceContextType; detail: string }[]; noneSelected: boolean; employmentStatus: "student" | "employed" | "unemployed" }
  | { type: "ADVANCE_3_1"; diagnostics: ApplicationDiagnosticsValue }
  | { type: "ADVANCE_3_2"; availability: AvailabilityValue; financialConstraint: FinancialConstraintValue; payMin: string; payMinUnit: PayUnitValue; payTarget: string; payTargetUnit: PayUnitValue }
  | { type: "ADVANCE_3_3"; careerInterests: CareerAreaInterestValue[] }
  | { type: "BACK" }
  | { type: "JUMP_TO_STAGE"; stage: 1 | 2 | 3 }

const STAGE_2_CLEAR = {
  schedulePreference: [] as ScheduleValue[],
  workModality: null as WorkModalityValue | null,
  payAmount: "",
  payUnit: null as PayUnitValue | null,
  applicationDiagnostics: null as ApplicationDiagnosticsValue | null,
  currentRoleOrField: "",
  targetCareer: "",
  targetTimeline: null as TimelineValue | null,
  ccAvailability: null as AvailabilityValue | null,
  ccFinancialConstraint: null as FinancialConstraintValue | null,
  ccPayMin: "",
  ccPayMinUnit: null as PayUnitValue | null,
  ccPayTarget: "",
  ccPayTargetUnit: null as PayUnitValue | null,
  eceExperiences: [] as { type: ExperienceContextType; detail: string }[],
  eceNoneSelected: false,
  eceEmploymentStatus: null as "student" | "employed" | "unemployed" | null,
  eceCareerInterests: [] as CareerAreaInterestValue[],
}

function nextStep2(persona: string): Step {
  if (persona === "job_seeker") return "2.2"
  if (persona === "career_changer") return "2.3"
  if (persona === "early_career_explorer") return "2.4"
  return "2.1"
}

function initState(): OnboardingState {
  return {
    step: "1.1",
    direction: "forward",
    q1Selection: null,
    followUpText: "",
    followUpCareerStage: null,
    bridgingAnswer: null,
    usedBridging: false,
    goalClarity: null,
    goal: null,
    careerStageSignal: null,
    classification: null,
    ...STAGE_2_CLEAR,
  }
}

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case "ADVANCE_1_1": {
      const changed = state.q1Selection !== action.q1
      return {
        ...state,
        step: "1.2",
        direction: "forward",
        q1Selection: action.q1,
        ...(changed && {
          followUpText: "",
          followUpCareerStage: null,
          bridgingAnswer: null,
          usedBridging: false,
          goalClarity: null,
          goal: null,
          careerStageSignal: null,
          classification: null,
          ...STAGE_2_CLEAR,
        }),
      }
    }

    case "ADVANCE_1_2_TEXT": {
      const goalClarity: GoalClarity =
        state.q1Selection === "a" ? "specific_target" : "general_direction"
      return {
        ...state,
        step: "1.3",
        direction: "forward",
        followUpText: action.text,
        goalClarity,
        goal: action.text,
        careerStageSignal: null,
        bridgingAnswer: null,
        classification: null,
        usedBridging: false,
        ...STAGE_2_CLEAR,
      }
    }

    case "ADVANCE_1_2_STAGE": {
      const classification = classify("exploring", action.stage)
      return {
        ...state,
        step: nextStep2(classification.persona),
        direction: "forward",
        followUpCareerStage: action.stage,
        goalClarity: "exploring",
        goal: CAREER_STAGE_LABEL[action.stage],
        careerStageSignal: action.stage,
        classification,
        usedBridging: false,
        ...STAGE_2_CLEAR,
      }
    }

    case "ADVANCE_1_3": {
      const classification = classify(state.goalClarity!, action.stage)
      return {
        ...state,
        step: nextStep2(classification.persona),
        direction: "forward",
        bridgingAnswer: action.stage,
        careerStageSignal: action.stage,
        classification,
        usedBridging: true,
        ...STAGE_2_CLEAR,
      }
    }

    case "ADVANCE_1_CONV": {
      const { goalClarity, goal, careerStageSignal, followUpText } = action
      if (careerStageSignal && careerStageSignal !== "unknown") {
        const classification = classify(goalClarity, careerStageSignal)
        return {
          ...state,
          step: nextStep2(classification.persona),
          direction: "forward",
          goalClarity,
          goal,
          careerStageSignal,
          followUpText,
          classification,
          usedBridging: false,
          ...STAGE_2_CLEAR,
        }
      }
      return {
        ...state,
        step: "1.3",
        direction: "forward",
        goalClarity,
        goal,
        careerStageSignal: null,
        followUpText,
        classification: null,
        usedBridging: false,
        ...STAGE_2_CLEAR,
      }
    }

    case "ADVANCE_2_2": {
      return {
        ...state,
        step: "3.1",
        direction: "forward",
        schedulePreference: action.schedule,
        workModality: action.modality,
        payAmount: action.payAmount,
        payUnit: action.payUnit,
        applicationDiagnostics: null,
      }
    }

    case "ADVANCE_2_3": {
      return {
        ...state,
        step: "3.2",
        direction: "forward",
        currentRoleOrField: action.currentRoleOrField,
        targetCareer: action.targetCareer,
        targetTimeline: action.targetTimeline,
        goal: action.targetCareer,
        ccAvailability: null,
        ccFinancialConstraint: null,
        ccPayMin: "",
        ccPayMinUnit: null,
        ccPayTarget: "",
        ccPayTargetUnit: null,
      }
    }

    case "ADVANCE_2_4": {
      return {
        ...state,
        step: "3.3",
        direction: "forward",
        eceExperiences: action.experiences,
        eceNoneSelected: action.noneSelected,
        eceEmploymentStatus: action.employmentStatus,
        eceCareerInterests: [],
      }
    }

    case "ADVANCE_3_1": {
      return {
        ...state,
        step: "4.1",
        direction: "forward",
        applicationDiagnostics: action.diagnostics,
      }
    }

    case "ADVANCE_3_2": {
      return {
        ...state,
        step: "4.1",
        direction: "forward",
        ccAvailability: action.availability,
        ccFinancialConstraint: action.financialConstraint,
        ccPayMin: action.payMin,
        ccPayMinUnit: action.payMinUnit,
        ccPayTarget: action.payTarget,
        ccPayTargetUnit: action.payTargetUnit,
      }
    }

    case "ADVANCE_3_3": {
      return {
        ...state,
        step: "4.1",
        direction: "forward",
        eceCareerInterests: action.careerInterests,
      }
    }

    case "BACK": {
      const persona = state.classification?.persona
      const stage2Back: Step = state.usedBridging ? "1.3" : "1.1"
      const prev: Record<Step, Step | null> = {
        "1.1": null,
        "1.2": "1.1",
        "1.3": "1.1",
        "2.1": stage2Back,
        "2.2": stage2Back,
        "2.3": stage2Back,
        "2.4": stage2Back,
        "3.1": "2.2",
        "3.2": "2.3",
        "3.3": "2.4",
        "4.1":
          persona === "career_changer" ? "3.2" :
          persona === "early_career_explorer" ? "3.3" :
          "3.1",
      }
      const prevStep = prev[state.step]
      if (!prevStep) return state
      return { ...state, step: prevStep, direction: "back" }
    }

    case "JUMP_TO_STAGE": {
      const persona = state.classification?.persona
      if (action.stage === 1) return { ...state, step: "1.1", direction: "back" }
      if (action.stage === 2) {
        const step2: Step =
          persona === "job_seeker" ? "2.2" :
          persona === "career_changer" ? "2.3" :
          persona === "early_career_explorer" ? "2.4" :
          "2.1"
        return { ...state, step: step2, direction: "back" }
      }
      if (action.stage === 3) {
        const step3: Step =
          persona === "career_changer" ? "3.2" :
          persona === "early_career_explorer" ? "3.3" :
          "3.1"
        return { ...state, step: step3, direction: "back" }
      }
      return state
    }
  }
}

export function getPreviousAnswer(state: OnboardingState): string | null {
  switch (state.step) {
    case "1.1": return null
    case "1.2": return state.q1Selection ? Q1_SHORT[state.q1Selection] : null
    case "1.3": return state.followUpText || null

    case "2.1":
    case "2.2":
    case "2.3":
    case "2.4": {
      const parts: string[] = []
      if (state.followUpText) parts.push(state.followUpText)
      else if (state.followUpCareerStage) parts.push(CAREER_STAGE_LABEL[state.followUpCareerStage])
      if (state.usedBridging && state.bridgingAnswer) parts.push(BRIDGING_LABEL[state.bridgingAnswer])
      return parts.length ? parts.join(" · ") : null
    }

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

    case "4.1": return null
  }
}

export function getStageForStep(step: Step): 1 | 2 | 3 | 4 {
  if (step === "1.1" || step === "1.2" || step === "1.3") return 1
  if (step === "2.1" || step === "2.2" || step === "2.3" || step === "2.4") return 2
  if (step === "3.1" || step === "3.2" || step === "3.3") return 3
  return 4
}

export function useOnboarding() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  return {
    state,
    advanceFrom11: (q1: Q1Option) => dispatch({ type: "ADVANCE_1_1", q1 }),
    advanceFrom11Conv: (data: { goalClarity: GoalClarity; goal: string | null; careerStageSignal: CareerStageSignal; followUpText: string }) =>
      dispatch({ type: "ADVANCE_1_CONV", ...data }),
    advanceFrom12Text: (text: string) => dispatch({ type: "ADVANCE_1_2_TEXT", text }),
    advanceFrom12Stage: (stage: CareerStageValue) => dispatch({ type: "ADVANCE_1_2_STAGE", stage }),
    advanceFrom13: (stage: CareerStageValue) => dispatch({ type: "ADVANCE_1_3", stage }),
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
    back: () => dispatch({ type: "BACK" }),
    jumpToStage: (stage: 1 | 2 | 3) => dispatch({ type: "JUMP_TO_STAGE", stage }),
  }
}
