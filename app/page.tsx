"use client"

import { ArrowLeft, User } from "lucide-react"
import { useOnboarding, getStageForStep } from "@/hooks/use-onboarding"

import { StepIntro } from "@/components/steps/step-intro"
import { StepQ1 }   from "@/components/steps/step-q1"
import { StepDone } from "@/components/steps/step-done"

const STAGE_NAMES: Record<1 | 2 | 3, string> = {
  1: "Let's get started",
  2: "About you",
  3: "Complete",
}

export default function OnboardingPage() {
  const { state, advanceFromIntro, advanceFromQ1, back } = useOnboarding()

  const totalStages  = 3
  const currentStage = getStageForStep(state.step)
  const stageName    = STAGE_NAMES[currentStage]
  const progressPct  = (currentStage / totalStages) * 100

  const showBack        = state.step !== "intro"
  const transitionClass =
    state.direction === "back" ? "animate-screen-back" : "animate-screen-forward"

  function renderStep() {
    switch (state.step) {
      case "intro":
        return (
          <StepIntro
            initialFirstName={state.firstName}
            initialLastName={state.lastName}
            initialLocation={state.location}
            onAdvance={advanceFromIntro}
          />
        )
      case "q1":
        return (
          <StepQ1
            initialQ1Answer={state.q1Answer}
            initialQ1SubOption={state.q1SubOption}
            initialQ1FreeText={state.q1FreeText}
            onAdvance={advanceFromQ1}
          />
        )
      case "done":
        return <StepDone />
    }
  }

  return (
    <div className="flex flex-col h-dvh relative overflow-hidden">
      {/* Decorative blob */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-0 left-0 w-[50vw] max-w-[440px] h-[50vh] max-h-[440px]"
        style={{
          background: "radial-gradient(ellipse at 20% 80%, rgba(196,181,253,0.45) 0%, rgba(196,181,253,0.2) 40%, transparent 70%), radial-gradient(ellipse at 0% 100%, rgba(147,197,253,0.35) 0%, transparent 60%)",
          borderRadius: "0 60% 0 0",
          filter: "blur(72px)",
          zIndex: 0,
        }}
      />

      {/* Nav header + progress bar */}
      <>
        <div className="shrink-0 px-4 pt-3 pb-2 flex items-center gap-3 relative z-10" style={{ background: "var(--color-canvas)" }}>
          <div className="shrink-0 w-8 flex items-center">
            {showBack ? (
              <button
                type="button"
                onClick={back}
                aria-label="Go back"
                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#f3f4f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                style={{ color: "#374151" }}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium" style={{ color: "var(--color-muted)" }}>
              Step {currentStage} of {totalStages}
            </p>
            <p className="text-[13px] font-semibold truncate" style={{ color: "var(--color-subtle)" }}>
              {stageName}
            </p>
          </div>

          <div className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center" style={{ background: state.step !== "intro" ? "#eef2ff" : "transparent" }}>
            {state.step !== "intro" && <User className="h-4 w-4" style={{ color: "#6366f1" }} />}
          </div>
        </div>

        <div className="shrink-0 h-1 rounded-full relative z-10" style={{ background: "#e5e7eb" }}>
          <div
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%`, background: "#6366f1" }}
          />
        </div>
      </>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div
          key={state.step}
          className={`mx-auto max-w-xl px-5 sm:px-6 pt-12 md:pt-16 pb-10 ${transitionClass}`}
        >
          {renderStep()}
        </div>
      </main>
    </div>
  )
}
