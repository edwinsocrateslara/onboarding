"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { ConvSpec } from "@/lib/extraction-specs"

export type ConvStatus = "idle" | "loading" | "summary" | "follow_up" | "advancing" | "error"

export interface ConvState {
  status:           ConvStatus
  extracted:        Record<string, unknown>
  followUpQuestion: string | null
  error:            string | null
  summaryParts:     string[]
  turnIndex:        number
}

export function useConversation({
  stepKey,
  step,
  persona,
  spec,
  onComplete,
}: {
  stepKey:    string
  step:       string
  persona:    string | null
  spec:       ConvSpec
  onComplete: (extracted: Record<string, unknown>) => void
}) {
  const [convState, setConvState] = useState<ConvState>({
    status:           "idle",
    extracted:        {},
    followUpQuestion: null,
    error:            null,
    summaryParts:     [],
    turnIndex:        0,
  })

  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const specRef = useRef(spec)
  specRef.current = spec

  const extractedRef = useRef<Record<string, unknown>>({})
  extractedRef.current = convState.extracted

  // Reset when step changes
  useEffect(() => {
    setConvState({
      status: "idle", extracted: {}, followUpQuestion: null,
      error: null, summaryParts: [], turnIndex: 0,
    })
  }, [stepKey])

  const submit = useCallback(async (userText: string) => {
    const currentExtracted = extractedRef.current
    const spec = specRef.current

    setConvState(prev => ({ ...prev, status: "loading", error: null }))

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)

    let attempts = 0
    const maxAttempts = 3

    while (attempts < maxAttempts) {
      attempts++
      try {
        const resp = await fetch("/api/extract", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ step, persona, userText, priorExtraction: currentExtracted }),
          signal:  controller.signal,
        })

        clearTimeout(timeout)

        if (!resp.ok) {
          const data = await resp.json().catch(() => ({})) as { error?: string }
          if (resp.status >= 500 && attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, 1000 * attempts))
            continue
          }
          throw new Error(data.error ?? "api_error")
        }

        const { extracted: newFields, error } = await resp.json() as { extracted?: Record<string, unknown>; error?: string }
        if (error) throw new Error(error)

        const merged = { ...currentExtracted, ...newFields }
        const summaryParts = spec.summarize(merged)

        if (spec.isComplete(merged)) {
          setConvState(prev => ({
            ...prev, status: "advancing", extracted: merged,
            followUpQuestion: null, error: null, summaryParts,
            turnIndex: prev.turnIndex + 1,
          }))
          setTimeout(() => onCompleteRef.current(merged), 500)
        } else {
          const followUp = spec.getFollowUp(merged)
          setConvState(prev => ({
            status:           followUp ? "follow_up" : "summary",
            extracted:        merged,
            followUpQuestion: followUp,
            error:            null,
            summaryParts,
            turnIndex:        prev.turnIndex + 1,
          }))
        }
        return

      } catch (err) {
        clearTimeout(timeout)
        const error = err as Error
        if (error.name === "AbortError") {
          setConvState(prev => ({
            ...prev, status: "error",
            error: "That took too long — want to try again?",
          }))
          return
        }
        if (attempts >= maxAttempts) {
          const isParseError = error.message === "parse_failed"
          setConvState(prev => ({
            ...prev, status: "error",
            error: isParseError
              ? "Hmm, I didn't quite catch that — could you rephrase?"
              : "Something went wrong — want to try again?",
          }))
          return
        }
        await new Promise(r => setTimeout(r, 1000 * attempts))
      }
    }
  }, [step, persona])

  const updateField = useCallback((field: string, value: unknown) => {
    setConvState(prev => {
      const spec = specRef.current
      const merged = { ...prev.extracted, [field]: value }
      const summaryParts = spec.summarize(merged)
      const isComplete = spec.isComplete(merged)
      if (isComplete) {
        setTimeout(() => onCompleteRef.current(merged), 500)
        return { ...prev, extracted: merged, summaryParts, status: "advancing", followUpQuestion: null }
      }
      return { ...prev, extracted: merged, summaryParts, status: "summary" }
    })
  }, [])

  const updateExtracted = useCallback((newExtracted: Record<string, unknown>) => {
    setConvState(prev => {
      const spec = specRef.current
      const summaryParts = spec.summarize(newExtracted)
      const isComplete = spec.isComplete(newExtracted)
      if (isComplete) {
        setTimeout(() => onCompleteRef.current(newExtracted), 500)
        return { ...prev, extracted: newExtracted, summaryParts, status: "advancing", followUpQuestion: null }
      }
      return { ...prev, extracted: newExtracted, summaryParts, status: "summary" }
    })
  }, [])

  return { convState, submit, updateField, updateExtracted }
}
