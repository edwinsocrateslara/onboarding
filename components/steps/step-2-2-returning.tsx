"use client"

import { AssistantQuestion } from "./shared"
import { Q2HelpQuestion }    from "./q2-help-question"
import type { Q2Option }     from "./q2-help-question"

const OPTIONS: Q2Option[] = [
  { key: "a", label: "I want to find a job in my previous field"                  },
  { key: "b", label: "I want to try something new — I'm open to a change"         },
  { key: "c", label: "I want to update my skills before jumping back in"           },
]

interface Props {
  onAdvance: (data: { helpQuestionAnswer: string; helpQuestionOtherText: string; goal: string }) => void
}

export function Step22Returning({ onAdvance }: Props) {
  return (
    <div className="space-y-5">
      <AssistantQuestion text="What would you most like help with?" />
      <Q2HelpQuestion options={OPTIONS} onAdvance={onAdvance} />
    </div>
  )
}
