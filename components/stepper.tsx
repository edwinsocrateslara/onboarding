"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STAGES = [
  { num: 1 as const, label: "Your situation" },
  { num: 2 as const, label: "Your preferences" },
  { num: 3 as const, label: "Your starting point" },
  { num: 4 as const, label: "Ready to go" },
]

type StageNum = 1 | 2 | 3 | 4

interface StepperProps {
  currentStage: StageNum
  completedStages: StageNum[]
  onStageClick: (stage: StageNum) => void
}

export function Stepper({ currentStage, completedStages, onStageClick }: StepperProps) {
  return (
    <>
      {STAGES.map((stage, i) => {
          const isCompleted = completedStages.includes(stage.num)
          const isCurrent = currentStage === stage.num
          const isFuture = !isCompleted && !isCurrent
          const isClickable = isCompleted

          return (
            <div key={stage.num} className="flex items-center min-w-0 last:shrink-0">
              <button
                type="button"
                onClick={() => isClickable && onStageClick(stage.num)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5] rounded-sm",
                  isClickable && "transition-opacity",
                  !isClickable && "cursor-default",
                )}
                aria-label={stage.label}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold transition-colors"
                  style={
                    isCompleted
                      ? { background: "#43089f", color: "#ffffff" }
                      : isCurrent
                      ? { background: "#43089f", color: "#ffffff" }
                      : { background: "transparent", color: "#9f9b93", border: "1.5px solid #dad4c8" }
                  }
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : stage.num}
                </span>

                <span
                  className={cn(
                    "text-[12px] font-medium leading-none whitespace-nowrap",
                    isCurrent ? "block" : "hidden sm:block",
                  )}
                  style={{
                    color: isCurrent ? "#000000" : isCompleted ? "#9f9b93" : "#9f9b93",
                  }}
                >
                  {stage.label}
                </span>
              </button>

              {i < STAGES.length - 1 && (
                <div
                  className="flex-1 h-px mx-2 min-w-[8px]"
                  style={{ background: isCompleted ? "#43089f" : "#dad4c8" }}
                />
              )}
            </div>
          )
        })}
    </>
  )
}
