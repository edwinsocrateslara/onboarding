"use client"

import type { Persona } from "@/lib/types"

const BODY: Record<Persona, string> = {
  active_jobseeker: "You're all set. I've got what I need to start surfacing real jobs for you.",
  career_changer:   "You're all set. I've got what I need to map out your transition.",
  career_explorer:  "You're all set. I've got what I need to help you figure out the right direction.",
}

interface Props {
  persona: Persona
}

export function HandoffScreen({ persona }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 text-center animate-fade-in">
      <div
        className="h-14 w-14 rounded-full flex items-center justify-center text-xl font-semibold mb-6"
        style={{ background: "rgba(201,100,66,0.12)", color: "#c96442" }}
      >
        F
      </div>
      <h1
        className="text-[24px] font-semibold mb-3 font-serif"
        style={{ color: "#141413" }}
      >
        Onboarding complete
      </h1>
      <p className="text-[16px] leading-[1.6] max-w-[340px] mb-8" style={{ color: "#5e5d59" }}>
        {BODY[persona]}
      </p>
      <button
        type="button"
        disabled
        className="rounded-xl px-8 py-3 text-[15px] font-medium opacity-50 cursor-not-allowed"
        style={{ background: "#c96442", color: "#faf9f5" }}
        aria-label="Continue (coming soon)"
        title="Coming soon"
      >
        Continue
      </button>
    </div>
  )
}
