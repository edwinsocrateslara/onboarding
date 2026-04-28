"use client"

import { C } from "./shared"

export function StepDone() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: C.ink }}>
        End of exploration
      </h1>
      <p className="text-base mt-2" style={{ color: C.muted }}>
        This is a placeholder. Q1-2 exploration ends here.
      </p>
    </div>
  )
}
