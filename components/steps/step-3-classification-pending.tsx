"use client"

import { useEffect, useRef, useState } from "react"
import { C } from "./shared"
import { classifyDeterministic, classifyOther } from "@/lib/classify"
import type { Q1Answer, Q2Answer } from "@/lib/classify"
import type { Persona } from "@/lib/types"

interface Props {
  q1Answer:     Q1Answer
  q1FreeText:   string
  q2Answer:     Q2Answer
  q2FreeText:   string
  onClassified: (persona: Persona) => void
}

export function Step3ClassificationPending({
  q1Answer,
  q1FreeText,
  q2Answer,
  q2FreeText,
  onClassified,
}: Props) {
  const [classifying, setClassifying] = useState(true)
  const firedRef    = useRef(false)
  const callbackRef = useRef(onClassified)
  callbackRef.current = onClassified

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    const useLLM = q1Answer === "d" || q2Answer === "e"
    const start  = Date.now()

    if (!useLLM) {
      const persona = classifyDeterministic(
        q1Answer as "a" | "b" | "c",
        q2Answer as "a" | "b" | "c" | "d",
      )
      const elapsed = Date.now() - start
      const delay   = Math.max(0, 500 - elapsed)
      setTimeout(() => {
        setClassifying(false)
        callbackRef.current(persona)
      }, delay)
      return
    }

    classifyOther(q1Answer, q1FreeText, q2Answer, q2FreeText).then(result => {
      const elapsed = Date.now() - start
      const delay   = Math.max(0, 500 - elapsed)
      setTimeout(() => {
        setClassifying(false)
        callbackRef.current(result.persona)
      }, delay)
    })
  }, [q1Answer, q1FreeText, q2Answer, q2FreeText])

  if (!classifying) return null

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div
        className="h-10 w-10 rounded-full border-4 animate-spin"
        style={{ borderColor: `${C.primary}40`, borderTopColor: C.primary }}
        aria-label="Classifying"
      />
      <p className="text-[15px]" style={{ color: C.muted }}>
        Personalizing your experience…
      </p>
    </div>
  )
}
