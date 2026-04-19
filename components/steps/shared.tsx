"use client"

import { ArrowLeft } from "lucide-react"

// ─── Design tokens ───────────────────────────────────────────────────────────
const C = {
  ink:          "#000000",
  subtle:       "#55534e",
  muted:        "#9f9b93",
  border:       "#dad4c8",
  surface:      "#ffffff",
  matcha:       "#078a52",
  matchaLight:  "rgba(7,138,82,0.08)",
  matchaBorder: "rgba(7,138,82,0.5)",
  lemon:        "#fbbd41",
  clayShadow:   "rgba(0,0,0,0.10) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px",
}

export function AssistantQuestion({ text }: { text: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div
        className="mt-1 shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-[12px] font-semibold"
        style={{ background: C.lemon, color: C.ink, fontFeatureSettings: '"ss01","ss03","ss10","ss11","ss12"' }}
      >
        F
      </div>
      <h1
        className="text-[20px] sm:text-[22px] font-semibold leading-[1.3]"
        style={{ color: C.ink, letterSpacing: "-0.4px", fontFeatureSettings: '"ss01","ss03","ss10","ss11","ss12"' }}
      >
        {text}
      </h1>
    </div>
  )
}

export function PreviousAnswer({ answer }: { answer: string }) {
  return (
    <p className="text-[12px] mb-5" style={{ color: C.muted }}>
      You said: <span style={{ color: C.subtle }}>{answer}</span>
    </p>
  )
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className="btn-clay h-8 w-8 flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(20,110,245)]"
      style={{ color: C.muted }}
    >
      <ArrowLeft className="h-[18px] w-[18px]" />
    </button>
  )
}

export function ContinueButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
      className="btn-clay min-h-[44px] px-6 rounded-full text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(20,110,245)]"
      style={
        disabled
          ? { background: C.border, color: C.muted, cursor: "default" }
          : { background: C.matcha, color: C.surface, cursor: "pointer", boxShadow: C.clayShadow }
      }
    >
      Continue
    </button>
  )
}

export function OptionCard({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left rounded-xl px-4 py-3.5 text-[15px] leading-[1.5] transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(20,110,245)]"
      style={
        selected
          ? {
              background: C.matchaLight,
              boxShadow: `0px 0px 0px 1.5px ${C.matchaBorder}`,
              color: C.ink,
            }
          : {
              background: disabled ? "transparent" : C.surface,
              boxShadow: disabled ? "none" : C.clayShadow,
              color: disabled ? C.muted : C.ink,
              border: disabled ? "none" : `1px solid ${C.border}`,
            }
      }
      aria-pressed={selected}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-[3px] h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: selected ? C.matcha : C.border,
            background:  selected ? C.matcha : "transparent",
          }}
        >
          {selected && <span className="block h-1.5 w-1.5 rounded-full bg-white" />}
        </span>
        {label}
      </span>
    </button>
  )
}

export function PillButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string
  selected: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-clay rounded-full px-4 py-2.5 text-[14px] font-medium transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(20,110,245)]"
      style={
        selected
          ? { background: C.matcha, color: C.surface, boxShadow: C.clayShadow }
          : { background: C.surface, color: C.ink, border: `1px solid ${C.border}`, boxShadow: C.clayShadow }
      }
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}
