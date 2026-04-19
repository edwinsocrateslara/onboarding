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
              {/* Circle + label */}
              <button
                type="button"
                onClick={() => isClickable && onStageClick(stage.num)}
                disabled={!isClickable}
                className={cn(
                  "flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec] rounded-sm",
                  isClickable && "hover:opacity-75 transition-opacity",
                  !isClickable && "cursor-default",
                )}
                aria-label={stage.label}
                aria-current={isCurrent ? "step" : undefined}
              >
                {/* Circle */}
                <span
                  className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold transition-colors"
                  style={
                    isCompleted
                      ? { background: "#c96442", color: "#faf9f5" }
                      : isCurrent
                      ? { background: "#c96442", color: "#faf9f5" }
                      : { background: "transparent", color: "#c2c0b6", border: "1.5px solid #c2c0b6" }
                  }
                >
                  {isCompleted ? <Check className="h-3 w-3" /> : stage.num}
                </span>

                {/* Label — always on sm+, only current on mobile */}
                <span
                  className={cn(
                    "text-[12px] font-medium leading-none whitespace-nowrap",
                    isCurrent ? "block" : "hidden sm:block",
                  )}
                  style={{
                    color: isCurrent ? "#141413" : isCompleted ? "#5e5d59" : "#c2c0b6",
                  }}
                >
                  {stage.label}
                </span>
              </button>

              {/* Connecting line (not after last) */}
              {i < STAGES.length - 1 && (
                <div
                  className="flex-1 h-px mx-2 min-w-[8px]"
                  style={{ background: isCompleted ? "#c96442" : "#e8e6dc" }}
                />
              )}
            </div>
          )
        })}
    </>
  )
}
