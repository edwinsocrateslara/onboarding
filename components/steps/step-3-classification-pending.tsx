"use client"

import { useEffect, useRef, useState } from "react"
import { classifyDeterministic, classifyOther } from "@/lib/classify"
import type { UserType } from "@/hooks/use-onboarding"
import type { Persona } from "@/lib/types"

const SECONDARY = "#6b7280"
const PRIMARY   = "#6366f1"

interface Props {
  userType:              UserType
  helpQuestionAnswer:    string
  helpQuestionOtherText: string
  onClassified:          (persona: Persona) => void
}

export function Step3ClassificationPending({
  userType,
  helpQuestionAnswer,
  helpQuestionOtherText,
  onClassified,
}: Props) {
  const [classifying, setClassifying] = useState(helpQuestionAnswer === "other")
  const firedRef    = useRef(false)
  const callbackRef = useRef(onClassified)
  callbackRef.current = onClassified

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    if (helpQuestionAnswer !== "other") {
      try {
        const persona = classifyDeterministic(userType, helpQuestionAnswer)
        requestAnimationFrame(() => callbackRef.current(persona))
      } catch {
        requestAnimationFrame(() => callbackRef.current("career_explorer"))
      }
      return
    }

    const start = Date.now()
    classifyOther(userType, helpQuestionOtherText).then(persona => {
      const elapsed = Date.now() - start
      const delay   = Math.max(0, 500 - elapsed)
      setTimeout(() => {
        setClassifying(false)
        callbackRef.current(persona)
      }, delay)
    })
  }, [helpQuestionAnswer, helpQuestionOtherText, userType])

  if (!classifying) return null

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div
        className="h-10 w-10 rounded-full border-4 animate-spin"
        style={{ borderColor: `${PRIMARY}40`, borderTopColor: PRIMARY }}
        aria-label="Classifying"
      />
      <p className="text-[15px]" style={{ color: SECONDARY }}>
        Personalizing your experience…
      </p>
    </div>
  )
}
