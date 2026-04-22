import type {
  ScheduleValue,
  WorkModalityValue,
  PayUnitValue,
  ApplicationDiagnosticsValue,
  TimelineValue,
  AvailabilityValue,
  FinancialConstraintValue,
  ExperienceContextType,
  CareerAreaInterestValue,
} from "@/hooks/use-onboarding"

export interface ConvSpec {
  question: string
  placeholder: string
  followUpPlaceholder: string
  requiredFields: string[]
  isComplete: (extracted: Record<string, unknown>) => boolean
  getFollowUp: (extracted: Record<string, unknown>) => string | null
  summarize: (extracted: Record<string, unknown>) => string[]
}

const SCHEDULE_LABEL: Record<ScheduleValue, string> = {
  full_time:  "Full-time",
  part_time:  "Part-time",
  flexible:   "Flexible",
  shift_work: "Shift work",
}

const MODALITY_LABEL: Record<WorkModalityValue, string> = {
  on_site:       "On-site",
  remote:        "Remote",
  hybrid:        "Hybrid",
  no_preference: "No preference",
}

const TIMELINE_LABEL: Record<TimelineValue, string> = {
  immediate:               "As soon as possible",
  within_3_months:         "Within 3 months",
  within_6_to_12_months:   "Within 6–12 months",
  no_timeline:             "No rush",
}

const AVAILABILITY_LABEL: Record<AvailabilityValue, string> = {
  less_than_10: "<10 hrs/wk",
  "10_to_20":   "10–20 hrs/wk",
  "20_to_30":   "20–30 hrs/wk",
  "30_plus":    "30+ hrs/wk",
}

const FINANCIAL_LABEL: Record<FinancialConstraintValue, string> = {
  needs_income: "Need to keep earning",
  some_savings: "Some savings",
  has_runway:   "Have runway",
}

const EXP_LABEL: Record<ExperienceContextType, string> = {
  student:   "Student",
  working:   "Working",
  past_job:  "Past job",
  volunteer: "Volunteer",
  courses:   "Courses",
  hobby:     "Side project",
}

const INTEREST_LABEL: Record<CareerAreaInterestValue, string> = {
  building_fixing:    "Building/fixing things",
  numbers_data:       "Numbers & data",
  helping_people:     "Helping people",
  creating_content:   "Creating content",
  technical_problems: "Technical problems",
  running_organizing: "Running/organizing",
  selling_persuading: "Selling/persuading",
  outdoors_hands:     "Outdoors/hands-on",
  needs_assessment:   "Not sure yet",
}

const DIAG_LABEL: Record<ApplicationDiagnosticsValue, string> = {
  not_started:               "Just getting started",
  low_volume_no_response:    "Applied, no responses",
  high_volume_few_interviews:"Many apps, few interviews",
  interviews_no_offers:      "Interviews, no offers",
}

function str(v: unknown): string { return typeof v === "string" ? v : "" }
function arr<T>(v: unknown): T[] { return Array.isArray(v) ? (v as T[]) : [] }

export const CONV_SPECS: Record<string, ConvSpec> = {
  "1.1": {
    question: "Tell me where you are right now — do you know what job you want, have a general direction, or still exploring?",
    placeholder: "Tell me about your situation…",
    followUpPlaceholder: "Tell me more…",
    requiredFields: ["goalClarity"],
    isComplete: (e) => !!e.goalClarity,
    getFollowUp: () => null,
    summarize: (e) => {
      const parts: string[] = []
      const gc = e.goalClarity as string
      if (gc === "specific_target")   parts.push("I know what I want")
      else if (gc === "general_direction") parts.push("General direction")
      else if (gc === "exploring")    parts.push("Still exploring")
      if (e.goal && typeof e.goal === "string") parts.push(e.goal)
      const sig = e.careerStageSignal as string
      if (sig === "student")      parts.push("Student")
      else if (sig === "working")     parts.push("Currently working")
      else if (sig === "not_working") parts.push("Not working")
      return parts.filter(Boolean)
    },
  },

  "1.1a": {
    question: "What role are you looking for?",
    placeholder: "Software Engineer, Nurse, Teacher…",
    followUpPlaceholder: "Tell me more…",
    requiredFields: ["goal"],
    isComplete: (e) => !!str(e.goal).trim(),
    getFollowUp: () => null,
    summarize: (e) => str(e.goal) ? [str(e.goal)] : [],
  },

  "1.1b": {
    question: "What field or area are you interested in?",
    placeholder: "Healthcare, Technology, Finance…",
    followUpPlaceholder: "Tell me more…",
    requiredFields: ["targetCareer"],
    isComplete: (e) => !!str(e.targetCareer).trim(),
    getFollowUp: () => null,
    summarize: (e) => str(e.targetCareer) ? [str(e.targetCareer)] : [],
  },

  "1.3": {
    question: "One more thing — are you currently working, in school, or between things?",
    placeholder: "School, work, or between things…",
    followUpPlaceholder: "Tell me more…",
    requiredFields: ["careerStageSignal"],
    isComplete: (e) => {
      const s = e.careerStageSignal as string
      return s === "student" || s === "working" || s === "not_working"
    },
    getFollowUp: () => null,
    summarize: (e) => {
      const s = e.careerStageSignal as string
      if (s === "student")    return ["In school"]
      if (s === "working")    return ["Currently working"]
      if (s === "not_working") return ["Between things"]
      return []
    },
  },

  "2.2": {
    question: "To find jobs that actually work for you, tell me what you need — things like schedule, where you want to work, and the minimum pay you'd accept.",
    placeholder: "Tell me what you're looking for…",
    followUpPlaceholder: "e.g. $20/hr or $45,000/year…",
    requiredFields: ["schedulePreference", "workModality", "payAmount", "payUnit"],
    isComplete: (e) =>
      arr(e.schedulePreference).length > 0 &&
      !!e.workModality &&
      !!(e.payAmount as string)?.trim() &&
      !!e.payUnit,
    getFollowUp: (e) => {
      if (!e.payAmount || !e.payUnit) {
        return "What's the minimum pay that would actually work for you — per hour or per year?"
      }
      return null
    },
    summarize: (e) => {
      const parts: string[] = []
      const schedule = arr<ScheduleValue>(e.schedulePreference)
      if (schedule.length > 0) parts.push(schedule.map(s => SCHEDULE_LABEL[s] ?? s).join(", "))
      if (e.workModality) parts.push(MODALITY_LABEL[e.workModality as WorkModalityValue] ?? str(e.workModality))
      if (e.payAmount && e.payUnit) {
        const unit = e.payUnit === "hourly" ? "hr" : "yr"
        parts.push(`$${e.payAmount}/${unit}`)
      }
      return parts.filter(Boolean)
    },
  },

  "2.3": {
    question: "Tell me about the change you're making — where you're coming from, where you want to go, and how soon.",
    placeholder: "Tell me about your transition…",
    followUpPlaceholder: "Tell me more…",
    requiredFields: ["currentRoleOrField", "targetCareer", "targetTimeline"],
    isComplete: (e) => !!e.currentRoleOrField && !!e.targetCareer && !!e.targetTimeline,
    getFollowUp: (e) => {
      if (!e.currentRoleOrField) return "What are you doing now?"
      if (!e.targetCareer) return "Where are you hoping to go?"
      if (!e.targetTimeline) return "And how soon are you looking to make the switch — right away, in a few months, six to twelve months, or no rush?"
      return null
    },
    summarize: (e) => {
      const parts: string[] = []
      const role = str(e.currentRoleOrField)
      const employer = str(e.currentEmployer)
      const from = role && employer ? `${role} at ${employer}` : role
      if (from && e.targetCareer) {
        const fromTo = `${from} → ${e.targetCareer}`
        parts.push(fromTo.length <= 60 ? fromTo : fromTo.slice(0, 57) + "…")
      } else if (from) {
        parts.push(from)
      } else if (e.targetCareer) {
        parts.push(str(e.targetCareer))
      }
      if (e.targetTimeline) parts.push(TIMELINE_LABEL[e.targetTimeline as TimelineValue] ?? str(e.targetTimeline))
      return parts.filter(Boolean)
    },
  },

  "2.4": {
    question: "To help me suggest directions that fit you, tell me a bit about what you've been up to — school, work, hobbies, volunteering, anything you've spent real time on.",
    placeholder: "Tell me about your background…",
    followUpPlaceholder: "Tell me more…",
    requiredFields: ["employmentStatus"],
    isComplete: (e) => {
      if (!e.employmentStatus) return false
      if (e.noneSelected === true) return true
      return arr(e.experiences).length > 0
    },
    getFollowUp: () => null,
    summarize: (e) => {
      if (e.noneSelected === true) return ["Starting from scratch"]
      const exps = arr<{ type: ExperienceContextType; detail: string }>(e.experiences)
      if (exps.length === 0) return []
      return exps.map(exp => {
        const label = EXP_LABEL[exp.type] ?? exp.type
        return exp.detail ? `${label}: ${exp.detail}` : label
      })
    },
  },

  "3.1": {
    question: "Have you been applying already? Tell me roughly where you are — just getting started, applications without responses, lots of applications but few interviews, or interviews without offers?",
    placeholder: "Tell me where you are with your search…",
    followUpPlaceholder: "Tell me more…",
    requiredFields: ["applicationDiagnostics"],
    isComplete: (e) => !!e.applicationDiagnostics,
    getFollowUp: () => null,
    summarize: (e) => {
      const v = e.applicationDiagnostics as ApplicationDiagnosticsValue
      return v ? [DIAG_LABEL[v] ?? v] : []
    },
  },

  "3.2": {
    question: "How many hours a week can you put toward this, and is your financial situation need to keep earning, some savings, or have some runway?",
    placeholder: "Tell me about your availability and finances…",
    followUpPlaceholder: "e.g. $25/hr now, targeting $40/hr…",
    requiredFields: ["availability", "financialConstraint", "payMin", "payMinUnit"],
    isComplete: (e) =>
      !!e.availability &&
      !!e.financialConstraint &&
      !!(e.payMin as string)?.trim() && Number(e.payMin) > 0 && !!e.payMinUnit,
    getFollowUp: (e) => {
      if (!e.availability) {
        return "How many hours a week can you put toward this — less than 10, 10–20, 20–30, or 30+?"
      }
      if (!e.financialConstraint) {
        return "And is your financial situation need to keep earning, some savings, or have some runway?"
      }
      if (!e.payMin || !e.payMinUnit) {
        return "And what pay range works for you — what you need now at minimum, and what you're targeting longer-term?"
      }
      return null
    },
    summarize: (e) => {
      const hasMin    = !!e.payMin    && !!e.payMinUnit
      const hasTarget = !!e.payTarget && !!e.payTargetUnit

      // Turn 2: pay-only summary once any pay field has been captured.
      if (hasMin || hasTarget) {
        const parts: string[] = []
        if (hasMin) {
          const unit = e.payMinUnit === "hourly" ? "hr" : "yr"
          parts.push(hasTarget ? `$${e.payMin}/${unit} now` : `$${e.payMin}/${unit} minimum`)
        }
        if (hasTarget) {
          const unit = e.payTargetUnit === "hourly" ? "hr" : "yr"
          parts.push(`$${e.payTarget}/${unit} target`)
        }
        return parts
      }

      // Turn 1: availability + financial.
      const parts: string[] = []
      if (e.availability)        parts.push(AVAILABILITY_LABEL[e.availability as AvailabilityValue] ?? str(e.availability))
      if (e.financialConstraint) parts.push(FINANCIAL_LABEL[e.financialConstraint as FinancialConstraintValue] ?? str(e.financialConstraint))
      return parts.filter(Boolean)
    },
  },

  "3.3": {
    question: "What kinds of things sound interesting to you? Don't overthink it — things like helping people, building or fixing stuff, working with data, creating things, or working outdoors. Whatever draws you.",
    placeholder: "Tell me what sounds interesting…",
    followUpPlaceholder: "Tell me more…",
    requiredFields: ["careerInterests"],
    isComplete: (e) => arr(e.careerInterests).length > 0,
    getFollowUp: () => null,
    summarize: (e) => {
      const interests = arr<CareerAreaInterestValue>(e.careerInterests)
      return interests.map(i => INTEREST_LABEL[i] ?? i)
    },
  },
}
