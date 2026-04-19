"use client"

import { ArrowLeft, Check } from "lucide-react"

const C = {
  ink:         "#111827",
  subtle:      "#374151",
  muted:       "#6b7280",
  placeholder: "#9ca3af",
  border:      "#e5e7eb",
  surface:     "#ffffff",
  primary:     "#fbbd41",
  accent:      "#6366f1",
  accentLight: "#eef2ff",
  accentBorder:"rgba(99,102,241,0.6)",
  disabledBg:  "#f3f4f6",
  disabledText:"#9ca3af",
}

export const FOCUS_RING = "0px 0px 0px 2px #ffffff, 0px 0px 0px 4px #6366f1"

export function AssistantQuestion({ text }: { text: string }) {
  return (
    <h1
      className="text-[26px] sm:text-[30px] font-bold leading-tight text-center mb-2"
      style={{ color: C.ink, letterSpacing: "-0.3px" }}
    >
      {text}
    </h1>
  )
}

export function ScreenSubtitle({ text }: { text: string }) {
  return (
    <p className="text-[15px] text-center leading-relaxed mb-8" style={{ color: C.muted }}>
      {text}
    </p>
  )
}

export function PreviousAnswer({ answer }: { answer: string }) {
  return (
    <p className="text-[13px] text-center mb-6" style={{ color: C.muted }}>
      You answered: <span style={{ color: C.subtle }}>{answer}</span>
    </p>
  )
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className="h-8 w-8 flex items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      style={{ color: C.muted }}
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  )
}

export function ContinueButton({
  onClick,
  disabled,
  label = "Next",
}: {
  onClick: () => void
  disabled: boolean
  label?: string
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      aria-disabled={disabled}
      className="w-full h-[52px] rounded-lg text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      style={
        disabled
          ? { background: C.disabledBg, color: C.disabledText, cursor: "default" }
          : { background: C.primary, color: C.ink, cursor: "pointer" }
      }
    >
      {label}
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
      className="w-full text-left rounded-lg px-4 py-3.5 text-[15px] leading-[1.5] transition-colors min-h-[52px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      style={
        selected
          ? {
              background: C.accentLight,
              border: `1.5px solid ${C.accentBorder}`,
              color: C.ink,
            }
          : {
              background: C.surface,
              border: `1px solid ${C.border}`,
              color: disabled ? C.disabledText : C.ink,
            }
      }
      aria-pressed={selected}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-[3px] h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors"
          style={{
            borderColor: selected ? C.accent : C.border,
            background:  selected ? C.accent : "transparent",
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
      className="rounded-full px-4 py-2 text-[14px] font-medium transition-colors min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
      style={
        selected
          ? { background: C.accent, color: "#ffffff", border: `1px solid ${C.accent}` }
          : { background: C.surface, color: C.subtle, border: `1px solid ${C.border}` }
      }
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}

export function CheckboxItem({
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
      role="checkbox"
      aria-checked={checked}
      onClick={onClick}
      className="flex items-center gap-3 text-left w-full py-2 focus-visible:outline-none"
    >
      <span
        className="shrink-0 h-[18px] w-[18px] rounded-[4px] border-2 flex items-center justify-center transition-colors"
        style={{
          borderColor: checked ? C.accent : C.border,
          background:  checked ? C.accent : C.surface,
        }}
      >
        {checked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
      </span>
      <span className="text-[15px]" style={{ color: C.ink }}>{label}</span>
    </button>
  )
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-widest mb-1.5"
      style={{ color: C.muted }}
    >
      {children}
    </p>
  )
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  disabled,
}: {
  options: readonly { label: string; value: T }[]
  value: T | null
  onChange: (v: T) => void
  disabled?: boolean
}) {
  return (
    <div
      className="inline-flex rounded-lg overflow-hidden"
      style={{ border: `1px solid ${C.border}` }}
    >
      {options.map((opt, i) => {
        const isSelected = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => { if (!disabled) onChange(opt.value) }}
            disabled={disabled}
            className="px-5 py-2.5 text-[14px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] min-h-[40px] disabled:opacity-50"
            style={{
              background: isSelected ? C.accent : C.surface,
              color:      isSelected ? "#ffffff" : C.subtle,
              borderLeft: i > 0 ? `1px solid ${C.border}` : "none",
            }}
            aria-pressed={isSelected}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
