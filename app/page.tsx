"use client"

import { useState, useCallback } from "react"
import { useOnboarding, getPreviousAnswer, getStageForStep } from "@/hooks/use-onboarding"
import type {
  ScheduleValue, WorkModalityValue, PayUnitValue,
  ApplicationDiagnosticsValue, TimelineValue, AvailabilityValue,
  FinancialConstraintValue, ExperienceContextType, CareerAreaInterestValue,
  CareerStageValue,
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

export default function OnboardingPage() {
  const {
    state,
    advanceFrom11Conv,
    advanceFrom13,
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

  const persona = state.classification?.persona ?? null
  const spec = CONV_SPECS[state.step]

  // Route extracted data to the correct advance function
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
          availability:       (extracted.availability as AvailabilityValue)           ?? "less_than_10",
          financialConstraint:(extracted.financialConstraint as FinancialConstraintValue) ?? "needs_income",
          payMin:             String(extracted.payMin    ?? ""),
          payMinUnit:         (extracted.payMinUnit    as PayUnitValue) ?? "hourly",
          payTarget:          String(extracted.payTarget ?? ""),
          payTargetUnit:      (extracted.payTargetUnit as PayUnitValue) ?? "hourly",
        })
        break

      case "3.3":
        advanceFrom33(((extracted.careerInterests as CareerAreaInterestValue[]) ?? []))
        break
    }
  }, [state.step, advanceFrom11Conv, advanceFrom13, advanceFrom22, advanceFrom23, advanceFrom24, advanceFrom31, advanceFrom32, advanceFrom33])

  const { convState, submit, updateExtracted } = useConversation({
    stepKey:    state.step,
    step:       state.step,
    persona,
    spec:       spec ?? CONV_SPECS["1.1"],
    onComplete: handleConvComplete,
  })

  // InputBar key: changes on step change OR after each LLM turn (refocuses input for follow-ups)
  const inputBarKey = `${state.step}-${convState.turnIndex}`

  // Placeholder adapts based on follow-up state
  const placeholder = spec
    ? (convState.status === "follow_up" && spec.followUpPlaceholder)
      ? spec.followUpPlaceholder
      : spec.placeholder
    : "Tell me more…"

  function renderStep() {
    if (state.step === "4.1") return <Step41 />

    if (!spec) {
      return (
        <p className="text-[15px]" style={{ color: "#9f9b93" }}>
          Loading…
        </p>
      )
    }

    return (
      <ConversationalScreen
        spec={spec}
        state={convState}
        onEdit={() => setShowEditModal(true)}
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
        <div className="mx-auto max-w-[640px] px-3 py-3 flex items-center gap-1">
          <div className="shrink-0 w-8 flex items-center">
            {showBack && <BackButton onClick={back} />}
          </div>
          <div className="flex-1 flex items-center min-w-0">
            <Stepper
              currentStage={currentStage}
              completedStages={completedStages}
              onStageClick={(stage) => jumpToStage(stage as 1 | 2 | 3)}
            />
          </div>
          <div className="shrink-0 w-8" />
        </div>
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div
          key={state.step}
          className={`mx-auto max-w-[640px] px-4 sm:px-6 py-8 ${transitionClass}`}
        >
          {previousAnswer && <PreviousAnswer answer={previousAnswer} />}
          {renderStep()}
        </div>
      </main>

      {/* Persistent input bar — always primary */}
      {state.step !== "4.1" && (
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
