export type Persona = "job_seeker" | "career_changer" | "early_career_explorer"
export type GoalClarity = "specific_target" | "general_direction" | "exploring"
export type CareerStageSignal = "student" | "working" | "not_working" | "unknown"

export interface ClassificationResult {
  persona: Persona
  subType: string
  todoFlags: string[]
}

export type ChatMessage =
  | { id: string; role: "user";      type: "text";           content: string }
  | { id: string; role: "assistant"; type: "text";           content: string }
  | { id: string; role: "assistant"; type: "q1-block" }
  | { id: string; role: "assistant"; type: "bridging-block" }
  | { id: string; role: "loading";   type: "loading" }
  | { id: string; role: "error";     type: "error";          content: string }

export type Phase = "q1" | "bridging" | "placeholder"

export interface OnboardingState {
  messages: ChatMessage[]
  phase: Phase
  goalClarity: GoalClarity | null
  goal: string | null
  careerStageSignal: CareerStageSignal | null
  classification: ClassificationResult | null
  lastRawResponse: string | null
  lastCallType: string | null
}

export interface InspectData {
  phase: Phase
  goalClarity: GoalClarity | null
  goal: string | null
  careerStageSignal: CareerStageSignal | null
  classification: ClassificationResult | null
  lastRawResponse: string | null
  lastCallType: string | null
}
