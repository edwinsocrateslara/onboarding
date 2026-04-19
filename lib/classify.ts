import type { GoalClarity, CareerStageSignal, ClassificationResult } from "./types"

export function classify(
  goalClarity: GoalClarity,
  careerStage: CareerStageSignal,
): ClassificationResult {
  const todoFlags: string[] = []

  if (goalClarity === "exploring") {
    if (careerStage === "student") {
      return { persona: "early_career_explorer", subType: "Need 1: figure out what to pursue", todoFlags }
    }
    if (careerStage === "not_working") {
      todoFlags.push(
        "Defaulted to Early Career Explorer (not working + exploring). Profile data or an additional bridging question is needed to distinguish early vs mid career.",
      )
      return { persona: "early_career_explorer", subType: "Need 1: figure out what to pursue", todoFlags }
    }
    if (careerStage === "working") {
      todoFlags.push(
        "Defaulted to Career Changer (working + exploring). Profile data needed to confirm mid-career vs early career.",
      )
      return { persona: "career_changer", subType: "Need 3: stuck", todoFlags }
    }
  }

  if (goalClarity === "specific_target") {
    if (careerStage === "student") {
      return { persona: "early_career_explorer", subType: "Need 2: have direction, help me start", todoFlags }
    }
    if (careerStage === "not_working") {
      return { persona: "job_seeker", subType: "Need 1: help me get it fast", todoFlags }
    }
    if (careerStage === "working") {
      todoFlags.push(
        "Assumed career change (employed + specific target). Could be same-field if seeking a new role while currently employed — profile data needed to confirm.",
      )
      return { persona: "career_changer", subType: "Need 4: help me translate", todoFlags }
    }
  }

  if (goalClarity === "general_direction") {
    if (careerStage === "student") {
      return { persona: "early_career_explorer", subType: "Need 2: have direction, help me start", todoFlags }
    }
    if (careerStage === "not_working") {
      return { persona: "job_seeker", subType: "Need 3: need direction", todoFlags }
    }
    if (careerStage === "working") {
      todoFlags.push(
        "Assumed career change (working + general direction). Could be same-field job search — profile data needed to confirm different field.",
      )
      return { persona: "career_changer", subType: "Need 1: fastest realistic path", todoFlags }
    }
  }

  return {
    persona: "job_seeker",
    subType: "unknown",
    todoFlags: ["Classification fallback — unexpected state combination."],
  }
}
