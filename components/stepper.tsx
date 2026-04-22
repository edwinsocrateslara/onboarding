"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STAGES = [
  { num: 1 as const, label: "Your situation"     },
  { num: 2 as const, label: "Your preferences"   },
  { num: 3 as const, label: "Your starting point"},
  { num: 4 as const, label: "Final questions"    },
  { num: 5 as const, label: "Ready to go"        },
]

type StageNum = 1 | 2 | 3 | 4 | 5

interface StepperProps {
  currentStage:    StageNum
  completedStages: StageNum[]
  onStageClick:    (stage: 1 | 2 | 3 | 4) => void
}

export function Stepper({ currentStage, completedStages, onStageClick }: StepperProps) {
  return (
    <>
      {STAGES.map((stage, i) => {
        const isCompleted = completedStages.includes(stage.num)
        const isCurrent   = currentStage === stage.num
        const isClickable = isCompleted

        return (
          <div key={stage.num} className="flex items-center min-w-0 last:shrink-0">
            <button
              type="button"
              onClick={() => isClickable && stage.num !== 5 && onStageClick(stage.num as 1 | 2 | 3 | 4)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-1.5 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(67,8,159)] rounded-sm",
                isClickable && "hover:opacity-75 transition-opacity",
                !isClickable && "cursor-default",
              )}
              aria-label={stage.label}
              aria-current={isCurrent ? "step" : undefined}
            >
              <span
                className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-semibold transition-colors"
                style={
                  isCompleted || isCurrent
                    ? { background: "#43089f", color: "#ffffff" }
                    : { background: "transparent", color: "#dad4c8", border: "1.5px solid #dad4c8" }
                }
              >
                {isCompleted ? <Check className="h-3 w-3" /> : stage.num}
              </span>

              <span
                className={cn(
                  "text-[11px] font-semibold leading-none whitespace-nowrap uppercase",
                  isCurrent ? "block" : "hidden sm:block",
                )}
                style={{
                  letterSpacing: "0.6px",
                  color: isCurrent ? "#000000" : isCompleted ? "#55534e" : "#dad4c8",
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
