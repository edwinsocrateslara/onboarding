"use client"

import { useReducer } from "react"
import type { ClassificationResult, Persona } from "@/lib/types"

export type Step =
  | "intro"
  | "q1"
  | "q2"
  | "background"
  | "2.3-education"
  | "2.3-resume"
  | "last-job"
  | "3.classification-pending"
  | "4.0" | "4.1"

export interface OnboardingState {
  step:      Step
  direction: "forward" | "back"
  // Intro
  firstName: string
  lastName:  string
  location:  string
  // Q1
  q1Answer:    "a" | "b" | "c" | "d" | null
  q1SubOption: string | null
  q1FreeText:  string
  // Q2
  q2Answer:   "a" | "b" | "c" | "d" | "e" | null
  q2FreeText: string
  // Background
  backgroundChoice: "has_resume" | "manual_entry" | "no_experience" | null
  // Info gathering
  lastJobTitle:            string
  lastJobStartMonth:       string
  lastJobStartYear:        string
  lastJobEndMonth:         string
  lastJobEndYear:          string
  lastJobCurrentlyWorking: boolean
  educationLevel:     string
  major:              string
  educationStartYear: string
  educationEndYear:   string
  currentlyStudying:  boolean
  resumeUploaded:     boolean
  // Classification
  classification: ClassificationResult | null
  // Tenant form
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
  | { type: "ADVANCE_INTRO";       firstName: string; lastName: string; location: string }
  | { type: "ADVANCE_Q1";          q1Answer: "a" | "b" | "c" | "d"; q1SubOption: string | null; q1FreeText: string }
  | { type: "ADVANCE_Q2_V6";       q2Answer: "a" | "b" | "c" | "d" | "e"; q2FreeText: string }
  | { type: "ADVANCE_BACKGROUND";  backgroundChoice: "has_resume" | "manual_entry" | "no_experience" }
  | { type: "ADVANCE_LAST_JOB";    lastJobTitle: string; lastJobStartMonth: string; lastJobStartYear: string; lastJobEndMonth: string; lastJobEndYear: string; lastJobCurrentlyWorking: boolean }
  | { type: "ADVANCE_EDUCATION";   educationLevel: string; major: string; educationStartYear: string; educationEndYear: string; currentlyStudying: boolean }
  | { type: "ADVANCE_RESUME";      uploaded: boolean }
  | { type: "SET_PERSONA";         persona: Persona }
  | { type: "ADVANCE_4_0";         countryCode: string; phone: string; city: string; dobMonth: string; dobDay: string; dobYear: string; ethnicGroups: string[]; ethnicOther: string }
  | { type: "BACK" }

function initState(): OnboardingState {
  return {
    step:      "intro",
    direction: "forward",
    firstName: "",
    lastName:  "",
    location:  "",
    q1Answer:    null,
    q1SubOption: null,
    q1FreeText:  "",
    q2Answer:   null,
    q2FreeText: "",
    backgroundChoice: null,
    lastJobTitle:            "",
    lastJobStartMonth:       "",
    lastJobStartYear:        "",
    lastJobEndMonth:         "",
    lastJobEndYear:          "",
    lastJobCurrentlyWorking: false,
    educationLevel:     "",
    major:              "",
    educationStartYear: "",
    educationEndYear:   "",
    currentlyStudying:  false,
    resumeUploaded:     false,
    classification:     null,
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
        step:      "q1",
        direction: "forward",
        firstName: action.firstName,
        lastName:  action.lastName,
        location:  action.location,
      }
    }

    case "ADVANCE_Q1": {
      return {
        ...state,
        step:        "q2",
        direction:   "forward",
        q1Answer:    action.q1Answer,
        q1SubOption: action.q1SubOption,
        q1FreeText:  action.q1FreeText,
      }
    }

    case "ADVANCE_Q2_V6": {
      return {
        ...state,
        step:       "background",
        direction:  "forward",
        q2Answer:   action.q2Answer,
        q2FreeText: action.q2FreeText,
      }
    }

    case "ADVANCE_BACKGROUND": {
      const nextStep: Step =
        action.backgroundChoice === "has_resume"    ? "2.3-resume"     :
        action.backgroundChoice === "manual_entry"  ? "last-job"       :
        "2.3-education"
      return {
        ...state,
        step:             nextStep,
        direction:        "forward",
        backgroundChoice: action.backgroundChoice,
      }
    }

    case "ADVANCE_LAST_JOB": {
      return {
        ...state,
        step:                    "3.classification-pending",
        direction:               "forward",
        lastJobTitle:            action.lastJobTitle,
        lastJobStartMonth:       action.lastJobStartMonth,
        lastJobStartYear:        action.lastJobStartYear,
        lastJobEndMonth:         action.lastJobEndMonth,
        lastJobEndYear:          action.lastJobEndYear,
        lastJobCurrentlyWorking: action.lastJobCurrentlyWorking,
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
        educationEndYear:   action.educationEndYear,
        currentlyStudying:  action.currentlyStudying,
      }
    }

    case "ADVANCE_RESUME": {
      return {
        ...state,
        step:           "3.classification-pending",
        direction:      "forward",
        resumeUploaded: action.uploaded,
      }
    }

    case "SET_PERSONA": {
      return {
        ...state,
        step:           "4.0",
        direction:      "forward",
        classification: { persona: action.persona, subType: "", todoFlags: [] },
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
      const bc = state.backgroundChoice
      const classificationBack: Step =
        bc === "has_resume"    ? "2.3-resume"  :
        bc === "manual_entry"  ? "last-job"    :
        bc === "no_experience" ? "2.3-education" :
        "background"

      const prev: Partial<Record<Step, Step | null>> = {
        "intro":                    null,
        "q1":                       "intro",
        "q2":                       "q1",
        "background":               "q2",
        "2.3-resume":               "background",
        "last-job":                 "background",
        "2.3-education":            "background",
        "3.classification-pending": classificationBack,
        "4.0":                      "3.classification-pending",
        "4.1":                      "4.0",
      }
      const prevStep = prev[state.step]
      if (!prevStep) return state
      return { ...state, step: prevStep, direction: "back" }
    }
  }
}

export function getStageForStep(step: Step): 1 | 2 | 3 | 4 | 5 {
  if (step === "intro") return 1
  if (step === "q1") return 2
  if (
    step === "q2"                     ||
    step === "background"             ||
    step === "2.3-resume"             ||
    step === "last-job"               ||
    step === "2.3-education"          ||
    step === "3.classification-pending"
  ) return 3
  if (step === "4.0") return 4
  return 5
}

export function useOnboarding() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  return {
    state,
    advanceFromIntro: (data: { firstName: string; lastName: string; location: string }) =>
      dispatch({ type: "ADVANCE_INTRO", ...data }),
    advanceFromQ1: (data: { q1Answer: "a" | "b" | "c" | "d"; q1SubOption: string | null; q1FreeText: string }) =>
      dispatch({ type: "ADVANCE_Q1", ...data }),
    advanceFromQ2: (data: { q2Answer: "a" | "b" | "c" | "d" | "e"; q2FreeText: string }) =>
      dispatch({ type: "ADVANCE_Q2_V6", ...data }),
    advanceFromBackground: (backgroundChoice: "has_resume" | "manual_entry" | "no_experience") =>
      dispatch({ type: "ADVANCE_BACKGROUND", backgroundChoice }),
    advanceFromLastJob: (data: { lastJobTitle: string; lastJobStartMonth: string; lastJobStartYear: string; lastJobEndMonth: string; lastJobEndYear: string; lastJobCurrentlyWorking: boolean }) =>
      dispatch({ type: "ADVANCE_LAST_JOB", ...data }),
    advanceFromEducation: (data: { educationLevel: string; major: string; educationStartYear: string; educationEndYear: string; currentlyStudying: boolean }) =>
      dispatch({ type: "ADVANCE_EDUCATION", ...data }),
    advanceFromResume: (data: { uploaded: boolean }) =>
      dispatch({ type: "ADVANCE_RESUME", ...data }),
    setPersona: (persona: Persona) =>
      dispatch({ type: "SET_PERSONA", persona }),
    advanceFrom40: (data: { countryCode: string; phone: string; city: string; dobMonth: string; dobDay: string; dobYear: string; ethnicGroups: string[]; ethnicOther: string }) =>
      dispatch({ type: "ADVANCE_4_0", ...data }),
    back: () => dispatch({ type: "BACK" }),
  }
}
