"use client"

import { useState, useCallback, useMemo } from "react"
import { useOnboarding, getPreviousAnswer, getStageForStep } from "@/hooks/use-onboarding"
import { HARDCODED_RESUME } from "@/lib/resume-data"
import type {
  ScheduleValue, WorkModalityValue, PayUnitValue,
  ApplicationDiagnosticsValue, TimelineValue, AvailabilityValue,
  FinancialConstraintValue, ExperienceContextType, CareerAreaInterestValue,
  CareerStageValue, JourneyPath,
} from "@/hooks/use-onboarding"
import type { GoalClarity, CareerStageSignal } from "@/lib/types"
import { useConversation } from "@/hooks/use-conversation"
import { CONV_SPECS } from "@/lib/extraction-specs"
import { Stepper } from "@/components/stepper"
import { BackButton, PreviousAnswer } from "@/components/steps/shared"
import { InputBar } from "@/components/input-bar"
import { ConversationalScreen } from "@/components/conversational-screen"
import { EditModal } from "@/components/edit-modal"
import { Step41 } from "@/components/steps/step-4-1"
import { Step1Journey } from "@/components/steps/step-1-journey"
import { Step1ResumeUpload } from "@/components/steps/step-1-resume-upload"
import { Step1ResumeReview } from "@/components/steps/step-1-resume-review"
import { Step1WorkExp } from "@/components/steps/step-1-work-exp"
import { Step1Education } from "@/components/steps/step-1-education"

const JOURNEY_STEPS = new Set([
  "1.journey", "1.resume-upload", "1.resume-review", "1.work-exp", "1.education",
])

export default function OnboardingPage() {
  const {
    state,
    advanceFrom11Conv,
    advanceFrom11a,
    advanceFrom11b,
    advanceFrom13,
    advanceFrom1Journey,
    advanceFrom1ResumeUpload,
    advanceFrom1ResumeReview,
    advanceFrom1WorkExp,
    advanceFrom1Education,
    advanceFrom22,
    advanceFrom23,
    advanceFrom24,
    advanceFrom31,
    advanceFrom32,
    advanceFrom33,
    back,
    jumpToStage,
  } = useOnboarding()

  const [showEditModal, setShowEditModal] = useState(false)

  const currentStage = getStageForStep(state.step)
  const completedStages: (1 | 2 | 3 | 4)[] = []
  if (currentStage > 1) completedStages.push(1)
  if (currentStage > 2) completedStages.push(2)
  if (currentStage > 3) completedStages.push(3)

  const previousAnswer = getPreviousAnswer(state)
  const showBack = state.step !== "1.1"
  const transitionClass =
    state.direction === "back" ? "animate-screen-back" : "animate-screen-forward"

  const isJourneyStep = JOURNEY_STEPS.has(state.step)
  const persona = state.classification?.persona ?? null
  const spec = CONV_SPECS[state.step]

  const handleConvComplete = useCallback((extracted: Record<string, unknown>) => {
    switch (state.step) {
      case "1.1":
        advanceFrom11Conv({
          goalClarity:       (extracted.goalClarity as GoalClarity) ?? "exploring",
          goal:              (extracted.goal as string | null) ?? null,
          careerStageSignal: (extracted.careerStageSignal as CareerStageSignal) ?? "unknown",
          followUpText:      (extracted.goal as string) ?? "",
        })
        break

      case "1.1a":
        advanceFrom11a((extracted.goal as string) ?? "")
        break

      case "1.1b":
        advanceFrom11b((extracted.targetCareer as string) ?? "")
        break

      case "1.3":
        advanceFrom13((extracted.careerStageSignal as CareerStageValue) ?? "not_working")
        break

      case "2.2":
        advanceFrom22({
          schedule:  ((extracted.schedulePreference as ScheduleValue[]) ?? []).filter(Boolean),
          modality:  (extracted.workModality as WorkModalityValue) ?? "no_preference",
          payAmount: String(extracted.payAmount ?? ""),
          payUnit:   (extracted.payUnit as PayUnitValue) ?? "hourly",
        })
        break

      case "2.3":
        advanceFrom23({
          currentRoleOrField: String(extracted.currentRoleOrField ?? ""),
          currentEmployer:    String(extracted.currentEmployer    ?? ""),
          targetCareer:       String(extracted.targetCareer ?? ""),
          targetTimeline:     (extracted.targetTimeline as TimelineValue) ?? "no_timeline",
        })
        break

      case "2.4":
        advanceFrom24({
          experiences:      ((extracted.experiences as { type: ExperienceContextType; detail: string }[]) ?? []),
          noneSelected:     extracted.noneSelected === true,
          employmentStatus: (extracted.employmentStatus as "student" | "employed" | "unemployed") ?? "unemployed",
        })
        break

      case "3.1":
        advanceFrom31((extracted.applicationDiagnostics as ApplicationDiagnosticsValue) ?? "not_started")
        break

      case "3.2":
        advanceFrom32({
          availability:        (extracted.availability as AvailabilityValue)            ?? "less_than_10",
          financialConstraint: (extracted.financialConstraint as FinancialConstraintValue) ?? "needs_income",
          payMin:              String(extracted.payMin    ?? ""),
          payMinUnit:          (extracted.payMinUnit    as PayUnitValue) ?? "hourly",
          payTarget:           String(extracted.payTarget ?? ""),
          payTargetUnit:       (extracted.payTargetUnit as PayUnitValue) ?? "hourly",
        })
        break

      case "3.3":
        advanceFrom33(((extracted.careerInterests as CareerAreaInterestValue[]) ?? []))
        break
    }
  }, [state.step, advanceFrom11Conv, advanceFrom11a, advanceFrom11b, advanceFrom13, advanceFrom22, advanceFrom23, advanceFrom24, advanceFrom31, advanceFrom32, advanceFrom33])

  const resumePrefill = state.step === "2.3" && state.journeyPath === "resume"
  const initialExtracted = useMemo(() => (
    resumePrefill
      ? {
          currentRoleOrField: HARDCODED_RESUME.currentRole,
          currentEmployer:    HARDCODED_RESUME.currentEmployer,
        }
      : undefined
  ), [resumePrefill])

  const { convState, submit, updateExtracted } = useConversation({
    stepKey:    state.step,
    step:       state.step,
    persona,
    spec:       spec ?? CONV_SPECS["1.1"],
    onComplete: handleConvComplete,
    initialExtracted,
  })

  const questionNode = useMemo(() => {
    if (resumePrefill) {
      const HINT = { color: "#000000", fontWeight: 500 } as const
      const label = `${HARDCODED_RESUME.currentRole} at ${HARDCODED_RESUME.currentEmployer}`
      return (
        <>
          I saw you&apos;re a{" "}
          <span style={HINT}>{label}</span>
          . Is that still the starting point? Tell me where you want to go and how soon.
        </>
      )
    }
    if (state.step === "3.2") {
      const HINT = { color: "#000000", fontWeight: 500 } as const
      return (
        <>
          How many hours a week can you put toward this —{" "}
          <span style={HINT}>less than 10</span>,{" "}
          <span style={HINT}>10–20</span>,{" "}
          <span style={HINT}>20–30</span>, or{" "}
          <span style={HINT}>30+</span>? And is your financial situation{" "}
          <span style={HINT}>need to keep earning</span>,{" "}
          <span style={HINT}>some savings</span>, or{" "}
          <span style={HINT}>have some runway</span>?
        </>
      )
    }
    return undefined
  }, [resumePrefill, state.step])

  const inputBarKey = `${state.step}-${convState.turnIndex}`

  const placeholder = spec
    ? (convState.status === "follow_up" && spec.followUpPlaceholder)
      ? spec.followUpPlaceholder
      : spec.placeholder
    : "Tell me more…"

  function renderStep() {
    // Terminal screen
    if (state.step === "4.1") return <Step41 />

    // Form-based journey sub-flow screens
    if (state.step === "1.journey")
      return <Step1Journey onSelect={(path: JourneyPath) => advanceFrom1Journey(path)} />
    if (state.step === "1.resume-upload")
      return <Step1ResumeUpload onAdvance={advanceFrom1ResumeUpload} />
    if (state.step === "1.resume-review")
      return <Step1ResumeReview onAdvance={advanceFrom1ResumeReview} />
    if (state.step === "1.work-exp")
      return <Step1WorkExp onAdvance={advanceFrom1WorkExp} />
    if (state.step === "1.education")
      return <Step1Education onAdvance={advanceFrom1Education} />

    // Conversational screens
    if (!spec) {
      return <p className="text-[15px]" style={{ color: "#9f9b93" }}>Loading…</p>
    }

    return (
      <ConversationalScreen
        stepKey={state.step}
        spec={spec}
        state={convState}
        onEdit={() => setShowEditModal(true)}
        questionNode={questionNode}
      />
    )
  }

  return (
    <div className="flex flex-col h-dvh" style={{ background: "#faf9f7" }}>
      {/* Top row */}
      <div
        className="shrink-0 border-b"
        style={{ borderColor: "#dad4c8", background: "#ffffff" }}
      >
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-3 flex items-center gap-2">
          {showBack && <BackButton onClick={back} />}
          <div className="flex-1 flex items-center min-w-0">
            <Stepper
              currentStage={currentStage}
              completedStages={completedStages}
              onStageClick={(stage) => jumpToStage(stage as 1 | 2 | 3)}
            />
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div
          key={state.step}
          className={`mx-auto max-w-2xl px-4 sm:px-6 py-8 ${transitionClass}`}
        >
          {previousAnswer && <PreviousAnswer answer={previousAnswer} />}
          {renderStep()}
        </div>
      </main>

      {/* InputBar: hidden on journey form steps and terminal screen */}
      {!isJourneyStep && state.step !== "4.1" && (
        <InputBar
          stepKey={inputBarKey}
          isPrimary={true}
          placeholder={placeholder}
          onSubmit={submit}
        />
      )}

      {/* Edit modal */}
      {showEditModal && spec && (
        <EditModal
          step={state.step}
          extracted={convState.extracted}
          onSave={(updated) => {
            updateExtracted(updated)
            setShowEditModal(false)
          }}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}
