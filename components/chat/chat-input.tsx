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

const INPUT_REST  = "0px 0px 0px 1px #dad4c8, rgba(0,0,0,0.04) 0px 2px 8px"
const INPUT_FOCUS = "0px 0px 0px 2px #146ef5, rgba(0,0,0,0.04) 0px 2px 8px"

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
        className="w-full resize-none rounded py-3.5 pl-4 pr-12 text-[15px] leading-[1.6] focus:outline-none disabled:opacity-50 transition-shadow"
        style={{
          background: "#ffffff",
          color: "#000000",
          caretColor: "#000000",
          boxShadow: INPUT_REST,
        }}
        onFocus={(e) => (e.currentTarget.style.boxShadow = INPUT_FOCUS)}
        onBlur={(e) => (e.currentTarget.style.boxShadow = INPUT_REST)}
        aria-label="Your answer"
      />
      <button
        type="button"
        onClick={onSubmit}
        disabled={!canSubmit}
        aria-label="Send"
        className="absolute right-2.5 bottom-2.5 flex h-8 w-8 items-center justify-center transition-colors disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
        style={{
          borderRadius: "1584px",
          background: canSubmit ? "#43089f" : "#e8e7e2",
        }}
      >
        <ArrowUp className="h-4 w-4" style={{ color: canSubmit ? "#ffffff" : "#9f9b93" }} />
      </button>
    </div>
  )
}
