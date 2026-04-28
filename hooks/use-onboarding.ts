"use client"

import { useReducer } from "react"

export type Step = "q1" | "done"

export interface OnboardingState {
  step:      Step
  direction: "forward" | "back"
  q1Answer:    "a" | "b" | "c" | "d" | null
  q1SubOption: string | null
  q1FreeText:  string
}

type Action =
  | { type: "ADVANCE_Q1"; q1Answer: "a" | "b" | "c" | "d"; q1SubOption: string | null; q1FreeText: string }
  | { type: "BACK" }

function initState(): OnboardingState {
  return {
    step:        "q1",
    direction:   "forward",
    q1Answer:    null,
    q1SubOption: null,
    q1FreeText:  "",
  }
}

function reducer(state: OnboardingState, action: Action): OnboardingState {
  switch (action.type) {
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
        q1:   null,
        done: "q1",
      }
      const prevStep = prev[state.step]
      if (!prevStep) return state
      return { ...state, step: prevStep, direction: "back" }
    }
  }
}

export function useOnboarding() {
  const [state, dispatch] = useReducer(reducer, undefined, initState)
  return {
    state,
    advanceFromQ1: (data: { q1Answer: "a" | "b" | "c" | "d"; q1SubOption: string | null; q1FreeText: string }) =>
      dispatch({ type: "ADVANCE_Q1", ...data }),
    back: () => dispatch({ type: "BACK" }),
  }
}
