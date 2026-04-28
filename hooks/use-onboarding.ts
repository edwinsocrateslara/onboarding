"use client"

import { useReducer } from "react"

export type Step = "intro" | "q1" | "done"

export interface OnboardingState {
  step:      Step
  direction: "forward" | "back"
  firstName: string
  lastName:  string
  location:  string
  q1Answer:    "a" | "b" | "c" | "d" | null
  q1SubOption: string | null
  q1FreeText:  string
}

type Action =
  | { type: "ADVANCE_INTRO"; firstName: string; lastName: string; location: string }
  | { type: "ADVANCE_Q1";    q1Answer: "a" | "b" | "c" | "d"; q1SubOption: string | null; q1FreeText: string }
  | { type: "BACK" }

function initState(): OnboardingState {
  return {
    step:        "intro",
    direction:   "forward",
    firstName:   "",
    lastName:    "",
    location:    "",
    q1Answer:    null,
    q1SubOption: null,
    q1FreeText:  "",
  }
}

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
    case "ADVANCE_INTRO":
      return {
        ...state,
        step:      "q1",
        direction: "forward",
        firstName: action.firstName,
        lastName:  action.lastName,
        location:  action.location,
      }
    case "ADVANCE_Q1":
      return {
        ...state,
        step:        "done",
        direction:   "forward",
        q1Answer:    action.q1Answer,
        q1SubOption: action.q1SubOption,
        q1FreeText:  action.q1FreeText,
      }
    case "BACK": {
      const prev: Record<Step, Step | null> = {
        intro: null,
        q1:    "intro",
        done:  "q1",
      }
      const prevStep = prev[state.step]
      if (!prevStep) return state
      return { ...state, step: prevStep, direction: "back" }
    }
  }
}

export function getStageForStep(step: Step): 1 | 2 | 3 {
  if (step === "intro") return 1
  if (step === "q1")    return 2
  return 3
}

export function useOnboarding() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  return {
    state,
    advanceFromIntro: (data: { firstName: string; lastName: string; location: string }) =>
      dispatch({ type: "ADVANCE_INTRO", ...data }),
    advanceFromQ1: (data: { q1Answer: "a" | "b" | "c" | "d"; q1SubOption: string | null; q1FreeText: string }) =>
      dispatch({ type: "ADVANCE_Q1", ...data }),
    back: () => dispatch({ type: "BACK" }),
  }
}
