"use client"

import { useState } from "react"
import { Upload, Pencil, Trash2 } from "lucide-react"
import { C, StickyFooter } from "./shared"

const MOCK_WORK = [
  { title: "Registered Nurse",  company: "Memorial Hospital"   },
  { title: "Nursing Assistant", company: "Sunrise Care Center" },
]

const MOCK_EDUCATION = [
  { title: "Nursing", institution: "University of Toronto", degree: "Bachelor's Degree (or equivalent)" },
]

type UploadState = "idle" | "processing" | "done"

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-px" style={{ background: C.border }} />
      <span className="text-[11px] font-semibold uppercase tracking-wide shrink-0" style={{ color: C.muted }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: C.border }} />
    </div>
  )
}

function EntryCard({ title, line2, line3 }: { title: string; line2: string; line3?: string }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3.5"
      style={{ background: "#f9fafb", border: `1px solid ${C.border}` }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold leading-snug" style={{ color: C.ink }}>{title}</p>
        <p className="text-sm mt-0.5" style={{ color: C.muted }}>{line2}</p>
        {line3 && <p className="text-sm mt-0.5" style={{ color: C.muted }}>{line3}</p>}
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          aria-label="Edit"
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#e5e7eb] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
          style={{ color: C.muted }}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Delete"
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-[#fee2e2] hover:text-[#ef4444] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
          style={{ color: C.muted }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

interface Props {
  onAdvance: (data: { uploaded: boolean }) => void
}

export function Step23Resume({ onAdvance }: Props) {
  const [uploadState, setUploadState] = useState<UploadState>("idle")

  const handleUpload = () => {
    if (uploadState !== "idle") return
    setUploadState("processing")
    setTimeout(() => setUploadState("done"), 1500)
  }

  const ready = uploadState === "done"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: C.ink }}>
          {uploadState === "done" ? "Review details from your resume" : "Upload your resume"}
        </h1>
        {uploadState !== "done" && (
          <p className="text-base mt-2" style={{ color: C.muted }}>
            Upload your resume to generate your profile.
          </p>
        )}
      </div>

      {uploadState === "idle" && (
        <button
          type="button"
          onClick={handleUpload}
          className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 transition-colors hover:bg-[#f9fafb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
          style={{ borderColor: C.border }}
        >
          <span
            className="h-12 w-12 rounded-full flex items-center justify-center"
            style={{ background: C.accentLight }}
          >
            <Upload className="h-5 w-5" style={{ color: C.primary }} />
          </span>
          <span className="text-[15px] font-medium" style={{ color: C.ink }}>Drag and drop or click to select a file</span>
          <span className="text-sm" style={{ color: C.muted }}>We accept .pdf and .docx formats only</span>
        </button>
      )}

      {uploadState === "processing" && (
        <div className="w-full rounded-xl border flex flex-col items-center justify-center gap-3 py-10" style={{ borderColor: C.border }}>
          <div
            className="h-10 w-10 rounded-full border-4 animate-spin"
            style={{ borderColor: `${C.primary}40`, borderTopColor: C.primary }}
            aria-label="Processing"
          />
          <span className="text-sm" style={{ color: C.muted }}>Processing your resume…</span>
        </div>
      )}

      {uploadState === "done" && (
        <div className="space-y-4">
          <SectionDivider label="Work" />
          <div className="space-y-2">
            {MOCK_WORK.map(entry => (
              <EntryCard key={entry.title} title={entry.title} line2={entry.company} />
            ))}
          </div>

          <SectionDivider label="Education" />
          <div className="space-y-2">
            {MOCK_EDUCATION.map(entry => (
              <EntryCard key={entry.title} title={entry.title} line2={entry.institution} line3={entry.degree} />
            ))}
          </div>
        </div>
      )}

      <div className="h-20" aria-hidden="true" />
      <StickyFooter
        onClick={() => onAdvance({ uploaded: true })}
        disabled={!ready}
        label="Next"
      />
    </div>
  )
}
