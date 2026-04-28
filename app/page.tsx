"use client"

import { ArrowLeft } from "lucide-react"
import { useOnboarding } from "@/hooks/use-onboarding"

import { StepQ1   } from "@/components/steps/step-q1"
import { StepDone } from "@/components/steps/step-done"

export default function OnboardingPage() {
  const { state, advanceFromQ1, back } = useOnboarding()

  const showBack        = state.step === "done"
  const transitionClass =
    state.direction === "back" ? "animate-screen-back" : "animate-screen-forward"

  function renderStep() {
    switch (state.step) {
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

      {/* Back button — only on terminal screen */}
      {showBack && (
        <div className="shrink-0 px-4 pt-3 pb-2 relative z-10" style={{ background: "var(--color-canvas)" }}>
          <button
            type="button"
            onClick={back}
            aria-label="Go back"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#f3f4f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
            style={{ color: "#374151" }}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto relative z-10">
        <div
          key={state.step}
          className={`min-h-full flex flex-col items-center justify-center px-8 py-10 ${transitionClass}`}
        >
          {renderStep()}
        </div>
      </main>
    </div>
  )
}
