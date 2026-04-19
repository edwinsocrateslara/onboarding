"use client"

import { ArrowLeft, User } from "lucide-react"
import { useOnboarding, getPreviousAnswer, getStageForStep } from "@/hooks/use-onboarding"
import type { Q1Option } from "@/hooks/use-onboarding"
import { PreviousAnswer } from "@/components/steps/shared"
import { Step11 } from "@/components/steps/step-1-1"
import { Step12 } from "@/components/steps/step-1-2"
import { Step13 } from "@/components/steps/step-1-3"
import { Step21 } from "@/components/steps/step-2-1"
import { Step22 } from "@/components/steps/step-2-2"
import { Step23 } from "@/components/steps/step-2-3"
import { Step24 } from "@/components/steps/step-2-4"
import { Step31 } from "@/components/steps/step-3-1"
import { Step33 } from "@/components/steps/step-3-3"
import { Step32 } from "@/components/steps/step-3-2"
import { Step41 } from "@/components/steps/step-4-1"

const STAGE_NAMES: Record<1 | 2 | 3 | 4, string> = {
  1: "Your situation",
  2: "Your preferences",
  3: "Your starting point",
  4: "Ready to go",
}

export default function OnboardingPage() {
  const {
    state,
    advanceFrom11,
    advanceFrom12Text,
    advanceFrom12Stage,
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

  const currentStage = getStageForStep(state.step)
  const completedStages: (1 | 2 | 3 | 4)[] = []
  if (currentStage > 1) completedStages.push(1)
  if (currentStage > 2) completedStages.push(2)
  if (currentStage > 3) completedStages.push(3)

  const previousAnswer = getPreviousAnswer(state)
  const showBack = state.step !== "1.1"
  const transitionClass =
    state.direction === "back" ? "animate-screen-back" : "animate-screen-forward"

  const progressPct = currentStage * 25

  function renderStep() {
    switch (state.step) {
      case "1.1":
        return (
          <Step11
            initialValue={state.q1Selection}
            onAdvance={advanceFrom11}
          />
        )
      case "1.2":
        return (
          <Step12
            q1Selection={state.q1Selection!}
            initialCareerStage={state.followUpCareerStage}
            initialText={state.followUpText}
            onAdvanceCareerStage={advanceFrom12Stage}
            onAdvanceText={advanceFrom12Text}
          />
        )
      case "1.3":
        return (
          <Step13
            initialValue={state.bridgingAnswer}
            onAdvance={advanceFrom13}
          />
        )
      case "2.1":
        return <Step21 />
      case "2.2":
        return (
          <Step22
            initialSchedule={state.schedulePreference}
            initialModality={state.workModality}
            initialPayAmount={state.payAmount}
            initialPayUnit={state.payUnit}
            onAdvance={advanceFrom22}
          />
        )
      case "2.3":
        return (
          <Step23
            initialFrom={state.currentRoleOrField}
            initialTo={state.targetCareer}
            initialTimeline={state.targetTimeline}
            onAdvance={advanceFrom23}
          />
        )
      case "2.4":
        return (
          <Step24
            initialExperiences={state.eceExperiences}
            initialNoneSelected={state.eceNoneSelected}
            onAdvance={advanceFrom24}
          />
        )
      case "3.1":
        return (
          <Step31
            initialValue={state.applicationDiagnostics}
            onAdvance={advanceFrom31}
          />
        )
      case "3.2":
        return (
          <Step32
            initialAvailability={state.ccAvailability}
            initialFinancial={state.ccFinancialConstraint}
            initialPayMin={state.ccPayMin}
            initialPayMinUnit={state.ccPayMinUnit}
            initialPayTarget={state.ccPayTarget}
            initialPayTargetUnit={state.ccPayTargetUnit}
            onAdvance={advanceFrom32}
          />
        )
      case "3.3":
        return (
          <Step33
            initialInterests={state.eceCareerInterests}
            onAdvance={advanceFrom33}
          />
        )
      case "4.1":
        return <Step41 />
    }
  }

  return (
    <div className="flex flex-col h-dvh bg-white relative overflow-hidden">
      {/* Lavender blob decoration */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 w-[55vw] max-w-[420px] h-[55vh] max-h-[420px]"
        style={{
          background: "radial-gradient(ellipse at 20% 80%, rgba(196,181,253,0.45) 0%, rgba(196,181,253,0.2) 40%, transparent 70%), radial-gradient(ellipse at 0% 100%, rgba(147,197,253,0.35) 0%, transparent 60%)",
          borderRadius: "0 60% 0 0",
          zIndex: 0,
        }}
      />

      {/* Nav header */}
      <div className="shrink-0 bg-white px-4 pt-3 pb-2 flex items-center gap-3 relative z-10">
        <div className="shrink-0 w-8 flex items-center">
          {showBack ? (
            <button
              type="button"
              onClick={back}
              aria-label="Go back"
              className="h-8 w-8 flex items-center justify-center rounded-lg text-[#6b7280] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium" style={{ color: "#9ca3af" }}>
            Step {currentStage} of 4
          </p>
          <p className="text-[13px] font-semibold truncate" style={{ color: "#374151" }}>
            {STAGE_NAMES[currentStage]}
          </p>
        </div>

        <div
          className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
          style={{ background: "#eef2ff" }}
        >
          <User className="h-4 w-4" style={{ color: "#6366f1" }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="shrink-0 h-[3px] relative z-10" style={{ background: "#f3f4f6" }}>
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progressPct}%`,
            background: "linear-gradient(to right, #7c3aed, #6366f1)",
          }}
        />
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div
          key={state.step}
          className={`mx-auto max-w-[500px] px-5 sm:px-6 py-10 ${transitionClass}`}
        >
          {previousAnswer && <PreviousAnswer answer={previousAnswer} />}
          {renderStep()}
        </div>
      </main>
    </div>
  )
}
