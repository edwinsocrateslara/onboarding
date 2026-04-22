"use client"

import { Briefcase, GraduationCap } from "lucide-react"
import { HARDCODED_RESUME } from "@/lib/resume-data"

const PRIMARY       = "#43089f"
const BORDER        = "#dad4c8"
const INK           = "#000000"
const SECONDARY     = "#9f9b93"
const CLAY_SHADOW   = `rgba(0,0,0,0.1) 0px 1px 1px, rgba(0,0,0,0.04) 0px -1px 1px inset, rgba(0,0,0,0.05) 0px -0.5px 1px, 0px 0px 0px 1px ${BORDER}`

interface Props {
  onAdvance: () => void
}

export function Step1ResumeReview({ onAdvance }: Props) {
  const r = HARDCODED_RESUME

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-[22px] font-semibold leading-snug" style={{ color: INK }}>
          Here&apos;s what we found
        </h2>
        <p className="text-[14px]" style={{ color: SECONDARY }}>
          We extracted these details from your resume. You can edit them later.
        </p>
      </div>

      <div className="rounded-xl p-4 space-y-3" style={{ background: "#ffffff", boxShadow: CLAY_SHADOW }}>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" style={{ color: PRIMARY }} />
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: PRIMARY }}>
            Work experience
          </span>
        </div>
        <div className="space-y-0.5">
          <p className="text-[15px] font-semibold" style={{ color: INK }}>{r.currentRole}</p>
          <p className="text-[13px]" style={{ color: SECONDARY }}>{r.currentEmployer} · {r.currentTenure}</p>
        </div>
        <div className="space-y-0.5 pt-1">
          <p className="text-[15px] font-semibold" style={{ color: INK }}>{r.previousRole}</p>
          <p className="text-[13px]" style={{ color: SECONDARY }}>{r.previousEmployer} · {r.previousTenure}</p>
        </div>
      </div>

      <div className="rounded-xl p-4 space-y-3" style={{ background: "#ffffff", boxShadow: CLAY_SHADOW }}>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4" style={{ color: PRIMARY }} />
          <span className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: PRIMARY }}>
            Education
          </span>
        </div>
        <div className="space-y-0.5">
          <p className="text-[15px] font-semibold" style={{ color: INK }}>{r.educationDegree}</p>
          <p className="text-[13px]" style={{ color: SECONDARY }}>{r.educationSchool}</p>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={onAdvance}
          className="min-h-[44px] px-8 text-[16px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
          style={{ borderRadius: "1584px", background: PRIMARY, color: "#ffffff", cursor: "pointer" }}
        >
          Looks good
        </button>
      </div>
    </div>
  )
}
