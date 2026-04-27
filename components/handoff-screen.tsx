"use client"

import { C } from "@/components/steps/shared"
import type { Persona } from "@/lib/types"

const PERSONA_LABEL: Record<Persona, string> = {
  jobseeker:       "Jobseeker",
  career_switcher: "Career Switcher",
  career_explorer: "Career Explorer",
}

interface Props {
  persona: Persona
}

export function HandoffScreen({ persona }: Props) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-16 text-center animate-fade-in">
      {/* Prototype badge */}
      <span
        className="inline-block rounded-full px-3 py-1 text-[11px] font-medium tracking-wide uppercase mb-8"
        style={{ background: C.disabledBg, color: C.muted, border: `1px solid ${C.border}` }}
      >
        Prototype end
      </span>

      <h1
        className="text-3xl font-semibold mb-3"
        style={{ color: C.ink }}
      >
        End of prototype
      </h1>

      <p
        className="text-base leading-[1.6] max-w-[400px] mb-8"
        style={{ color: C.muted }}
      >
        Onboarding data collected. In production, this is where the user would transition into the platform experience.
      </p>

      {/* Classification result */}
      <div
        className="w-full max-w-[400px] rounded-xl p-5 text-left"
        style={{ background: "#f9fafb", border: `1px solid ${C.border}` }}
      >
        <p className="text-[11px] font-medium uppercase tracking-wide mb-1" style={{ color: C.placeholder }}>
          Classified as
        </p>
        <p className="text-[15px] font-semibold" style={{ color: C.subtle }}>
          {PERSONA_LABEL[persona]}
        </p>
      </div>
    </div>
  )
}
