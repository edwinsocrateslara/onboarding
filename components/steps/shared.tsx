"use client"

import { ArrowLeft, Check } from "lucide-react"

const PRIMARY         = "#43089f"
const PRIMARY_TINT    = "rgba(67,8,159,0.06)"
const PRIMARY_BORDER  = "rgba(67,8,159,0.4)"
const AVATAR_BG       = "rgba(67,8,159,0.1)"
const BORDER          = "#dad4c8"
const SURFACE         = "#ffffff"
const INK             = "#000000"
const SECONDARY       = "#9f9b93"
const MUTED_FRAME     = "#55534e"
const CLAY_SHADOW     = `rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px, 0px 0px 0px 1px ${BORDER}`
const SELECTED_RING   = `0px 0px 0px 1.5px ${PRIMARY_BORDER}`
const FOCUS_RING      = "focus-visible:ring-2 focus-visible:ring-[#146ef5]"

export function AssistantQuestion({ text, children, muted }: { text?: string; children?: React.ReactNode; muted?: boolean }) {
  return (
    <h1
      className={`text-[20px] sm:text-[22px] leading-[1.3] ${muted ? "font-normal" : "font-semibold"}`}
      style={{ color: muted ? MUTED_FRAME : INK }}
    >
      {children ?? text}
    </h1>
  )
}

export function PreviousAnswer({ answer }: { answer: string }) {
  return (
    <p className="text-[12px] mb-5" style={{ color: SECONDARY }}>
      You said: <span style={{ color: INK }}>{answer}</span>
    </p>
  )
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className={`h-8 w-8 flex items-center justify-center rounded-lg focus-visible:outline-none ${FOCUS_RING}`}
      style={{ color: SECONDARY }}
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
      className={`min-h-[44px] px-6 text-[16px] font-medium focus-visible:outline-none ${FOCUS_RING}`}
      style={{
        borderRadius: "1584px",
        background: disabled ? "#e8e7e2" : PRIMARY,
        color: disabled ? SECONDARY : "#ffffff",
        cursor: disabled ? "default" : "pointer",
      }}
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
      className={`w-full text-left rounded-xl px-4 py-3.5 text-[15px] leading-[1.5] transition-colors min-h-[48px] focus-visible:outline-none ${FOCUS_RING}`}
      style={
        selected
          ? { background: PRIMARY_TINT, boxShadow: SELECTED_RING, color: INK }
          : disabled
          ? { background: "transparent", boxShadow: "none", color: SECONDARY }
          : { background: SURFACE, boxShadow: CLAY_SHADOW, color: INK }
      }
      aria-pressed={selected}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-[3px] h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: selected ? PRIMARY : BORDER,
            background: selected ? PRIMARY : "transparent",
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
      className={`px-4 py-2.5 text-[14px] font-medium transition-colors min-h-[44px] focus-visible:outline-none ${FOCUS_RING}`}
      style={{
        borderRadius: "1584px",
        background: selected ? PRIMARY : SURFACE,
        color: selected ? "#ffffff" : INK,
        boxShadow: selected ? `0px 0px 0px 1.5px ${PRIMARY_BORDER}` : `0px 0px 0px 1px ${BORDER}`,
      }}
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}

export function CheckboxCard({
  label,
  checked,
  onClick,
}: {
  label: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl px-4 py-3.5 text-[15px] leading-[1.5] transition-colors min-h-[48px] focus-visible:outline-none ${FOCUS_RING}`}
      style={
        checked
          ? { background: PRIMARY_TINT, boxShadow: SELECTED_RING, color: INK }
          : { background: SURFACE, boxShadow: CLAY_SHADOW, color: INK }
      }
      aria-pressed={checked}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-[3px] h-4 w-4 shrink-0 rounded-sm border-2 flex items-center justify-center"
          style={{
            borderColor: checked ? PRIMARY : BORDER,
            background: checked ? PRIMARY : "transparent",
          }}
        >
          {checked && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
        </span>
        {label}
      </span>
    </button>
  )
}
