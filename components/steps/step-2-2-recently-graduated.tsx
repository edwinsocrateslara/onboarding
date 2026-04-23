"use client"

import { AssistantQuestion } from "./shared"
import { Q2HelpQuestion }    from "./q2-help-question"
import type { Q2Option }     from "./q2-help-question"

const OPTIONS: Q2Option[] = [
  { key: "a", label: "I want to find a job as soon as possible"                                 },
  { key: "b", label: "I'm not sure yet — I'd like to explore what careers are out there for me" },
  { key: "c", label: "I want to build skills to become more competitive"                        },
]

interface Props {
  onAdvance: (data: { helpQuestionAnswer: string; helpQuestionOtherText: string; goal: string }) => void
}

export function Step22RecentlyGraduated({ onAdvance }: Props) {
  return (
    <div className="space-y-5">
      <AssistantQuestion text="What would you most like help with?" />
      <Q2HelpQuestion options={OPTIONS} onAdvance={onAdvance} />
    </div>
  )
}
