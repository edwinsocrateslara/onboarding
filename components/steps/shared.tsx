"use client"

import { ArrowLeft } from "lucide-react"

export function AssistantQuestion({ text }: { text: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div
        className="mt-1 shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-[12px] font-semibold"
        style={{ background: "rgba(201,100,66,0.12)", color: "#c96442" }}
      >
        F
      </div>
      <h1 className="text-[20px] sm:text-[22px] font-semibold leading-[1.3]" style={{ color: "#141413" }}>
        {text}
      </h1>
    </div>
  )
}

export function PreviousAnswer({ answer }: { answer: string }) {
  return (
    <p className="text-[12px] mb-5" style={{ color: "#87867f" }}>
      You said: <span style={{ color: "#5e5d59" }}>{answer}</span>
    </p>
  )
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Go back"
      className="h-8 w-8 flex items-center justify-center rounded-lg transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
      style={{ color: "#87867f" }}
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
      className="min-h-[44px] px-6 rounded-full text-[15px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
      style={
        disabled
          ? { background: "#e8e6dc", color: "#c2c0b6", cursor: "default" }
          : { background: "#c96442", color: "#ffffff", cursor: "pointer" }
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
      className="w-full text-left rounded-xl px-4 py-3.5 text-[15px] leading-[1.5] transition-all min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
      style={
        selected
          ? { background: "rgba(201,100,66,0.08)", boxShadow: "0px 0px 0px 1.5px rgba(201,100,66,0.5)", color: "#141413" }
          : { background: disabled ? "transparent" : "#faf9f5", boxShadow: disabled ? "none" : "0px 0px 0px 1px #e8e6dc", color: disabled ? "#87867f" : "#3d3d3a" }
      }
      aria-pressed={selected}
    >
      <span className="flex items-start gap-3">
        <span
          className="mt-[3px] h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center"
          style={{
            borderColor: selected ? "#c96442" : "#c2c0b6",
            background: selected ? "#c96442" : "transparent",
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
      className="rounded-full px-4 py-2.5 text-[14px] font-medium transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec]"
      style={
        selected
          ? { background: "#c96442", color: "#faf9f5", boxShadow: "0px 0px 0px 1px rgba(201,100,66,0.5)" }
          : { background: "rgba(201,100,66,0.07)", color: "#4d4c48", boxShadow: "0px 0px 0px 1px rgba(201,100,66,0.18)" }
      }
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}
