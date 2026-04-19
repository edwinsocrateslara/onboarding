"use client"

import { useState, useRef, useEffect } from "react"

interface InputBarProps {
  stepKey:     string
  isPrimary:   boolean
  placeholder: string
  onSubmit:    (text: string) => void
}

const FOCUS_RING = "0px 0px 0px 2px rgb(67, 8, 159)"

export function InputBar({ stepKey, isPrimary, placeholder, onSubmit }: InputBarProps) {
  const [value, setValue] = useState("")
  const inputRef     = useRef<HTMLInputElement>(null)
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isPrimary && value.trim()) {
      onSubmit(value.trim())
      setValue("")
    }
  }

  const setFocusShadow = () => {
    if (!containerRef.current) return
    containerRef.current.style.boxShadow = isPrimary ? FOCUS_RING : "none"
  }

  const setBlurShadow = () => {
    if (!containerRef.current) return
    containerRef.current.style.boxShadow = "none"
  }

  return (
    <div
      className="shrink-0 px-4 sm:px-6 pb-5 pt-3"
      style={{ background: "rgb(var(--color-bg))" }}
    >
      <div className="mx-auto max-w-[640px]">
        <div
          ref={containerRef}
          className="relative rounded-lg transition-shadow duration-150"
          style={{
            background: isPrimary ? "#ffffff" : "rgba(255,255,255,0.6)",
            border:     `1px solid #dad4c8`,
          }}
        >
          {value.length === 0 && (
            <span
              key={placeholder}
              className="absolute inset-0 flex items-center px-4 text-[15px] pointer-events-none animate-fade-in"
              style={{ color: isPrimary ? "#9f9b93" : "#c2c0b6" }}
            >
              {placeholder}
            </span>
          )}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={setFocusShadow}
            onBlur={setBlurShadow}
            placeholder=""
            className="w-full rounded-lg px-4 py-3.5 text-[15px] bg-transparent focus:outline-none"
            style={{ color: "#000000", opacity: isPrimary ? 1 : 0.45 }}
            aria-label="Type your response"
          />
        </div>
        <p
          className="text-[12px] mt-1.5 px-1 transition-opacity duration-200 uppercase font-semibold"
          style={{
            color:          "#9f9b93",
            letterSpacing:  "0.6px",
            opacity:        isPrimary ? 1 : 0,
          }}
        >
          Press Enter to continue
        </p>
      </div>
    </div>
  )
}
