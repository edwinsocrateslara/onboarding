"use client"

import { useEffect } from "react"
import { ArrowLeft, User } from "lucide-react"
import { useOnboarding, getStageForStep } from "@/hooks/use-onboarding"

import { StepIntro }               from "@/components/steps/step-intro"
import { StepStarter }             from "@/components/steps/step-starter"
import { Step22Student }           from "@/components/steps/step-2-2-student"
import { Step22RecentlyGraduated } from "@/components/steps/step-2-2-recently-graduated"
import { Step22Employed }          from "@/components/steps/step-2-2-employed"
import { Step22Unemployed }        from "@/components/steps/step-2-2-unemployed"
import { Step22Returning }         from "@/components/steps/step-2-2-returning"
import { Step23Education }         from "@/components/steps/step-2-3-education"
import { Step23Resume }            from "@/components/steps/step-2-3-resume"
import { Step3ClassificationPending } from "@/components/steps/step-3-classification-pending"
import { Step22 } from "@/components/steps/step-2-2"
import { Step23 } from "@/components/steps/step-2-3"
import { Step24 } from "@/components/steps/step-2-4"
import { Step31 } from "@/components/steps/step-3-1"
import { Step32 } from "@/components/steps/step-3-2"
import { Step33 } from "@/components/steps/step-3-3"
import { Step40 } from "@/components/steps/step-4-0"
import { Step41 } from "@/components/steps/step-4-1"

const STAGE_NAMES_5: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "Getting to know you",
  2: "Your goals",
  3: "Your situation",
  4: "Final questions",
  5: "Complete",
}

const STAGE_NAMES_4: Record<1 | 2 | 3 | 4, string> = {
  1: "Getting to know you",
  2: "Your goals",
  3: "Your situation",
  4: "Complete",
}

export default function OnboardingPage() {
  const {
    state,
    advanceFromIntro,
    advanceFromStarter,
    advanceFromQ2,
    advanceFromEducation,
    advanceFromResume,
    setPersona,
    setTenantConfig,
    advanceFrom22,
    advanceFrom23,
    advanceFrom24,
    advanceFrom31,
    advanceFrom32,
    advanceFrom33,
    advanceFrom40,
    back,
  } = useOnboarding()

  // Read ?tenant=no-form once on mount — no visible UI toggle
  useEffect(() => {
    const noForm = new URLSearchParams(window.location.search).get("tenant") === "no-form"
    if (noForm) setTenantConfig(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { hasTenantForm } = state
  const totalStages  = hasTenantForm ? 5 : 4
  const currentStage = getStageForStep(state.step, hasTenantForm)
  const stageName    = hasTenantForm
    ? STAGE_NAMES_5[currentStage]
    : STAGE_NAMES_4[currentStage as 1 | 2 | 3 | 4]
  const progressPct  = (currentStage / totalStages) * 100

  const showBack       = state.step !== "intro"
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
      case "starter":
        return (
          <StepStarter
            initialValue={state.userType}
            onAdvance={advanceFromStarter}
          />
        )
      case "2.2-student":
        return <Step22Student onAdvance={advanceFromQ2} />
      case "2.2-recently-graduated":
        return <Step22RecentlyGraduated onAdvance={advanceFromQ2} />
      case "2.2-employed":
        return <Step22Employed onAdvance={advanceFromQ2} />
      case "2.2-unemployed":
        return <Step22Unemployed onAdvance={advanceFromQ2} />
      case "2.2-returning":
        return <Step22Returning onAdvance={advanceFromQ2} />
      case "2.3-education":
        return <Step23Education onAdvance={advanceFromEducation} />
      case "2.3-resume":
        return <Step23Resume onAdvance={advanceFromResume} />
      case "3.classification-pending":
        return (
          <Step3ClassificationPending
            userType={state.userType!}
            helpQuestionAnswer={state.helpQuestionAnswer}
            helpQuestionOtherText={state.helpQuestionOtherText}
            onClassified={setPersona}
          />
        )
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
      case "4.0":
        return <Step40 onAdvance={advanceFrom40} />
      case "4.1":
        return <Step41 persona={state.classification!.persona} />
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
      {/* Nav header */}
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

        <div
          className="shrink-0 h-8 w-8 rounded-full flex items-center justify-center"
          style={{ background: "#eef2ff" }}
        >
          <User className="h-4 w-4" style={{ color: "#6366f1" }} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="shrink-0 h-1 rounded-full relative z-10" style={{ background: "#e5e7eb" }}>
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%`, background: "#6366f1" }}
        />
      </div>

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
