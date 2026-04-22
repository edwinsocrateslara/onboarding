"use client"

import { ChevronRight, FileText, Briefcase, GraduationCap } from "lucide-react"
import type { JourneyPath } from "@/hooks/use-onboarding"

const PRIMARY       = "#6366f1"
const BORDER        = "#e5e7eb"
const INK           = "#111827"
const SECONDARY     = "#6b7280"

const ROWS: {
  path: JourneyPath
  icon: React.ElementType
  label: string
  iconBg: string
  iconColor: string
}[] = [
  { path: "resume",           icon: FileText,      label: "Upload my resume",           iconBg: "rgba(99,102,241,0.08)",  iconColor: PRIMARY    },
  { path: "work_exp",         icon: Briefcase,      label: "Add my work experience",     iconBg: "rgba(217,119,6,0.08)", iconColor: "#b45309"  },
  { path: "new_to_workforce", icon: GraduationCap,  label: "I'm new to the workforce",   iconBg: "rgba(5,150,105,0.08)", iconColor: "#047857"  },
]

interface Props {
  onSelect: (path: JourneyPath) => void
}

export function Step1Journey({ onSelect }: Props) {
  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: INK }}>
          Start your journey
        </h2>
        <p className="text-[15px]" style={{ color: SECONDARY }}>
          How would you like to build your profile?
        </p>
      </div>

      <div className="space-y-3">
        {ROWS.map(({ path, icon: Icon, label, iconBg, iconColor }) => (
          <button
            key={path}
            type="button"
            onClick={() => onSelect(path)}
            className="w-full flex items-center gap-4 rounded-xl px-4 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
            style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}
          >
            <span
              className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: iconBg }}
            >
              <Icon className="h-5 w-5" style={{ color: iconColor }} />
            </span>
            <span className="flex-1 text-[15px] font-medium" style={{ color: INK }}>
              {label}
            </span>
            <ChevronRight className="shrink-0 h-4 w-4" style={{ color: SECONDARY }} />
          </button>
        ))}
      </div>
    </div>
  )
}
