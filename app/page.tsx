"use client"

import { useOnboarding, getPreviousAnswer, getStageForStep } from "@/hooks/use-onboarding"
import type { Q1Option } from "@/hooks/use-onboarding"
import { Stepper } from "@/components/stepper"
import { BackButton, PreviousAnswer } from "@/components/steps/shared"
import { InputBar } from "@/components/input-bar"
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

function getBarConfig(step: string, q1Selection: Q1Option | null) {
  if (step === "1.2" && (q1Selection === "a" || q1Selection === "b")) {
    return {
      isPrimary: true,
      placeholder: q1Selection === "a"
        ? "What role are you looking for?"
        : "What field or area are you interested in?",
    }
  }
  if (step === "2.3") {
    return { isPrimary: false, placeholder: "Or describe it in your own words…" }
  }
  return { isPrimary: false, placeholder: "Or tell me in your own words…" }
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

  const stepKey = `${state.step}-${state.q1Selection ?? ""}`
  const barConfig = getBarConfig(state.step, state.q1Selection)

  function handleBarSubmit(text: string) {
    if (state.step === "1.2" && (state.q1Selection === "a" || state.q1Selection === "b")) {
      advanceFrom12Text(text)
    }
  }

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
            onAdvanceCareerStage={advanceFrom12Stage}
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
    <div className="flex flex-col h-dvh" style={{ background: "rgb(var(--color-bg))" }}>
      {/* Top row: back button + stepper + spacer */}
      <div
        className="shrink-0 border-b"
        style={{ borderColor: "#e8e6dc", background: "rgb(var(--color-surface))" }}
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

      {/* Persistent input bar */}
      <InputBar
        stepKey={stepKey}
        isPrimary={barConfig.isPrimary}
        placeholder={barConfig.placeholder}
        onSubmit={handleBarSubmit}
      />
    </div>
  )
}
