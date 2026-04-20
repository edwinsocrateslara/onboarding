"use client"

import type { Persona } from "@/lib/types"

const HANDOFF: Record<Persona, { heading: string; body: string }> = {
  job_seeker: {
    heading: "You're set.",
    body: "I've got what I need to start surfacing real jobs. Ready when you are.",
  },
  career_changer: {
    heading: "Good to go.",
    body: "You've shared enough for me to start mapping a path that makes sense for where you're headed.",
  },
  early_career_explorer: {
    heading: "Let's figure this out.",
    body: "You're in the right place. I have what I need to start pointing you toward things that'll actually fit.",
  },
}

interface Props {
  persona: Persona
}

export function HandoffScreen({ persona }: Props) {
  const { heading, body } = HANDOFF[persona]

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 text-center animate-fade-in">
      <div
        className="h-14 w-14 rounded-full flex items-center justify-center text-xl font-semibold mb-6"
        style={{ background: "rgba(67,8,159,0.1)", color: "#43089f" }}
      >
        F
      </div>
      <h1 className="text-[24px] font-semibold mb-3" style={{ color: "#000000" }}>
        {heading}
      </h1>
      <p className="text-[16px] leading-[1.6] max-w-[340px] mb-8" style={{ color: "#9f9b93" }}>
        {body}
      </p>
      <button
        type="button"
        disabled
        className="px-8 py-3 text-[16px] font-medium opacity-50 cursor-not-allowed focus-visible:outline-none"
        style={{ borderRadius: "1584px", background: "#43089f", color: "#ffffff" }}
        aria-label="Start my first session (coming soon)"
        title="Coming soon"
      >
        Start my first session
      </button>
    </div>
  )
}
