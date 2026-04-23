export type Persona = "active_jobseeker" | "career_changer" | "career_explorer"

export interface ClassificationResult {
  persona: Persona
  subType: string
  todoFlags: string[]
}
