"use client"

import { useState, useRef, useEffect } from "react"

interface InputBarProps {
  stepKey: string
  isPrimary: boolean
  placeholder: string
  onSubmit: (text: string) => void
}

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && isPrimary && value.trim()) {
      onSubmit(value.trim())
      setValue("")
    }
  }

  const setFocusShadow = () => {
    if (!containerRef.current) return
    containerRef.current.style.boxShadow = isPrimary
      ? "0px 0px 0px 1px #3898ec, 0px 0px 0px 3px rgba(56,152,236,0.12)"
      : "0px 0px 0px 1px #eeede6"
  }

  const setBlurShadow = () => {
    if (!containerRef.current) return
    containerRef.current.style.boxShadow = isPrimary
      ? "0px 0px 0px 1px #e8e6dc, rgba(0,0,0,0.06) 0px 2px 8px"
      : "0px 0px 0px 1px #eeede6"
  }

  return (
    <div
      className="shrink-0 px-4 sm:px-6 pb-5 pt-3"
      style={{ background: "rgb(var(--color-bg))" }}
    >
      <div className="mx-auto max-w-[640px]">
        <div
          ref={containerRef}
          className="relative rounded-xl transition-colors duration-200"
          style={{
            background: isPrimary ? "#ffffff" : "rgba(255,255,255,0.55)",
            boxShadow: isPrimary
              ? "0px 0px 0px 1px #e8e6dc, rgba(0,0,0,0.06) 0px 2px 8px"
              : "0px 0px 0px 1px #eeede6",
          }}
        >
          {value.length === 0 && (
            <span
              key={placeholder}
              className="absolute inset-0 flex items-center px-4 text-[15px] pointer-events-none animate-fade-in"
              style={{ color: isPrimary ? "#c2c0b6" : "#d4d2ca" }}
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
            className="w-full rounded-xl px-4 py-3.5 text-[15px] bg-transparent focus:outline-none"
            style={{
              color: "#141413",
              opacity: isPrimary ? 1 : 0.5,
            }}
            aria-label="Type your response"
          />
        </div>
        <p
          className="text-[12px] mt-1.5 px-1 transition-opacity duration-200"
          style={{ color: "#c2c0b6", opacity: isPrimary ? 1 : 0 }}
        >
          Press Enter to continue
        </p>
      </div>
    </div>
  )
}
