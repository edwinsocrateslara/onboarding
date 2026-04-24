"use client"

import { HandoffScreen } from "@/components/handoff-screen"
import type { Persona } from "@/lib/types"

interface Props {
  persona: Persona
}

export function Step41({ persona }: Props) {
  return <HandoffScreen persona={persona} />
}
