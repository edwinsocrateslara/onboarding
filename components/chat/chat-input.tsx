"use client"

import { useRef, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  placeholder?: string
  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "Type your answer...",
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 180)}px`
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) onSubmit()
    }
  }

  const canSubmit = value.trim().length > 0 && !isLoading

  return (
    <div className={cn("relative", className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        disabled={isLoading}
        className="w-full resize-none rounded-xl py-3.5 pl-4 pr-12 text-[15px] leading-[1.6] focus:outline-none disabled:opacity-50 transition-shadow"
        style={{
          background: "#ffffff",
          color: "#141413",
          caretColor: "#141413",
          boxShadow: "0px 0px 0px 1px #e8e6dc, rgba(0,0,0,0.04) 0px 2px 8px",
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow =
            "0px 0px 0px 1px #3898ec, 0px 0px 0px 3px rgba(56, 152, 236, 0.12), rgba(0,0,0,0.04) 0px 2px 8px"
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow =
            "0px 0px 0px 1px #e8e6dc, rgba(0,0,0,0.04) 0px 2px 8px"
        }}
        aria-label="Your answer"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-label="Send"
        className="absolute right-2.5 bottom-2.5 flex h-8 w-8 items-center justify-center rounded-lg transition-all disabled:opacity-30"
        style={{
          background: canSubmit ? "#c96442" : "#e8e6dc",
          boxShadow: canSubmit ? "0px 0px 0px 1px rgba(201,100,66,0.5)" : "none",
        }}
      >
        <ArrowUp className="h-4 w-4" style={{ color: canSubmit ? "#faf9f5" : "#87867f" }} />
      </button>
    </div>
  )
}
