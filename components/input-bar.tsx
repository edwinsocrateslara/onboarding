"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"

interface InputBarProps {
  stepKey: string
  isPrimary: boolean
  placeholder: string
  onSubmit: (text: string) => void
}

const INPUT_REST  = "0px 0px 0px 1px #dad4c8, rgba(0,0,0,0.06) 0px 2px 8px"
const INPUT_FOCUS = "0px 0px 0px 2px #146ef5, rgba(0,0,0,0.06) 0px 2px 8px"

export function InputBar({ stepKey, isPrimary, placeholder, onSubmit }: InputBarProps) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setValue("")
    if (isPrimary) {
      const t = setTimeout(() => inputRef.current?.focus(), 220)
      return () => clearTimeout(t)
    }
  }, [stepKey])

  useEffect(() => {
    if (isPrimary) {
      const t = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(t)
    }
  }, [isPrimary])

  const handleSubmit = () => {
    if (!isPrimary || !value.trim()) return
    onSubmit(value.trim())
    setValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit()
  }

  const setFocusShadow = () => {
    if (!containerRef.current) return
    containerRef.current.style.boxShadow = isPrimary ? INPUT_FOCUS : "0px 0px 0px 1px #dad4c8"
  }

  const setBlurShadow = () => {
    if (!containerRef.current) return
    containerRef.current.style.boxShadow = isPrimary ? INPUT_REST : "0px 0px 0px 1px #dad4c8"
  }

  const hasContent = value.trim().length > 0

  return (
    <div
      className="shrink-0 pb-5 pt-3"
      style={{ background: "#faf9f7" }}
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <div
          ref={containerRef}
          className="relative flex items-center transition-shadow duration-200"
          style={{
            borderRadius: "9999px",
            background: isPrimary ? "#ffffff" : "rgba(255,255,255,0.55)",
            boxShadow: isPrimary ? INPUT_REST : "0px 0px 0px 1px #dad4c8",
          }}
        >
          {value.length === 0 && (
            <span
              key={placeholder}
              className="absolute left-0 right-12 flex items-center px-4 text-[15px] pointer-events-none animate-fade-in"
              style={{ color: isPrimary ? "#9f9b93" : "#c0bdb5", top: "50%", transform: "translateY(-50%)" }}
            >
              {placeholder}
            </span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={setFocusShadow}
            onBlur={setBlurShadow}
            placeholder=""
            className="flex-1 min-w-0 px-4 py-3.5 text-[15px] bg-transparent focus:outline-none"
            style={{
              borderRadius: "9999px",
              color: "#000000",
              opacity: isPrimary ? 1 : 0.5,
            }}
            aria-label="Type your response"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!hasContent || !isPrimary}
            aria-label="Send"
            className="shrink-0 h-8 w-8 flex items-center justify-center mr-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
            style={{
              borderRadius: "9999px",
              background: hasContent && isPrimary ? "#6366f1" : "#e5e7eb",
              color: hasContent && isPrimary ? "#ffffff" : "#9ca3af",
              cursor: hasContent && isPrimary ? "pointer" : "default",
            }}
            onMouseEnter={(e) => {
              if (hasContent && isPrimary) e.currentTarget.style.background = "#4f46e5"
            }}
            onMouseLeave={(e) => {
              if (hasContent && isPrimary) e.currentTarget.style.background = "#6366f1"
            }}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
