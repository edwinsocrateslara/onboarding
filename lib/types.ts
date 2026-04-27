export type Persona = "jobseeker" | "career_switcher" | "career_explorer"

export interface ClassificationResult {
  persona: Persona
  subType: string
  todoFlags: string[]
}
