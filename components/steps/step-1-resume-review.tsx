"use client"

import { Briefcase, GraduationCap } from "lucide-react"
import { StickyFooter } from "./shared"

const PRIMARY       = "#6366f1"
const BORDER        = "#e5e7eb"
const INK           = "#111827"
const SECONDARY     = "#6b7280"

interface Props {
  onAdvance: () => void
}

export function Step1ResumeReview({ onAdvance }: Props) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: INK }}>
          Here&apos;s what we found
        </h2>
        <p className="text-[14px]" style={{ color: SECONDARY }}>
          We extracted these details from your resume. You can edit them later.
        </p>
      </div>

      <div className="rounded-xl p-4 space-y-3" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" style={{ color: PRIMARY }} />
          <span className="text-sm font-medium" style={{ color: PRIMARY }}>
            Work experience
          </span>
        </div>
        <div className="space-y-0.5">
          <p className="text-[15px] font-semibold" style={{ color: INK }}>Warehouse Associate</p>
          <p className="text-[13px]" style={{ color: SECONDARY }}>Apex Logistics · 2021 – Present</p>
        </div>
      </div>

      <div className="rounded-xl p-4 space-y-3" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" style={{ color: PRIMARY }} />
          <span className="text-sm font-medium" style={{ color: PRIMARY }}>
            Education
          </span>
        </div>
        <div className="space-y-0.5">
          <p className="text-[15px] font-semibold" style={{ color: INK }}>High School Diploma</p>
          <p className="text-[13px]" style={{ color: SECONDARY }}>Riverside Secondary School · 2019</p>
        </div>
      </div>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter onClick={onAdvance} disabled={false} />
    </div>
  )
}
