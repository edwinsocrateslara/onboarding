"use client"

import { useState, useRef } from "react"
import { Upload, FileText, CheckCircle } from "lucide-react"
import { StickyFooter } from "./shared"

const INK       = "#111827"
const SECONDARY = "#6b7280"
const PRIMARY   = "#6366f1"
const BORDER    = "#e5e7eb"

// Hardcoded mock resume review content
const MOCK_REVIEW = {
  name:   "Jane Smith",
  role:   "Registered Nurse",
  employer: "Memorial Hospital",
}

type UploadState = "idle" | "processing" | "done"

interface Props {
  onAdvance: (data: { uploaded: boolean; skipped: boolean }) => void
}

export function Step23Resume({ onAdvance }: Props) {
  const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [skipped,     setSkipped]     = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = () => {
    if (uploadState !== "idle") return
    setUploadState("processing")
    setTimeout(() => setUploadState("done"), 1500)
  }

  const handleSkip = () => {
    setSkipped(true)
    onAdvance({ uploaded: false, skipped: true })
  }

  const ready = uploadState === "done" || skipped

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: INK }}>
          Upload your resume
        </h2>
        <p className="text-base mt-1" style={{ color: SECONDARY }}>
          We&apos;ll use this to personalize your experience.
        </p>
      </div>

      {uploadState === "idle" && (
        <button
          type="button"
          onClick={handleUpload}
          className="w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-3 py-10 transition-colors hover:bg-[#f9fafb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
          style={{ borderColor: BORDER }}
        >
          <span
            className="h-12 w-12 rounded-full flex items-center justify-center"
            style={{ background: "#eef2ff" }}
          >
            <Upload className="h-5 w-5" style={{ color: PRIMARY }} />
          </span>
          <span className="text-[15px] font-medium" style={{ color: INK }}>Upload resume</span>
          <span className="text-sm" style={{ color: SECONDARY }}>PDF or DOCX</span>
        </button>
      )}

      {uploadState === "processing" && (
        <div className="w-full rounded-xl border flex flex-col items-center justify-center gap-3 py-10" style={{ borderColor: BORDER }}>
          <div
            className="h-10 w-10 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: `${PRIMARY}40`, borderTopColor: "transparent" }}
            aria-label="Processing"
          />
          <span className="text-sm" style={{ color: SECONDARY }}>Processing your resume…</span>
        </div>
      )}

      {uploadState === "done" && (
        <div
          className="w-full rounded-xl border p-4 flex items-start gap-3"
          style={{ borderColor: "#bbf7d0", background: "#f0fdf4" }}
        >
          <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" style={{ color: "#16a34a" }} />
          <div>
            <p className="text-sm font-medium" style={{ color: INK }}>Resume uploaded</p>
            <p className="text-sm mt-0.5" style={{ color: SECONDARY }}>
              {MOCK_REVIEW.name} — {MOCK_REVIEW.role} at {MOCK_REVIEW.employer}
            </p>
          </div>
          <FileText className="h-5 w-5 mt-0.5 ml-auto shrink-0" style={{ color: SECONDARY }} />
        </div>
      )}

      {/* Hidden file input — not actually used, upload is purely mocked */}
      <input ref={inputRef} type="file" accept=".pdf,.docx" className="sr-only" tabIndex={-1} aria-hidden />

      <button
        type="button"
        onClick={handleSkip}
        className="w-full text-sm text-center py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1] rounded"
        style={{ color: SECONDARY }}
      >
        Skip for now — I&apos;ll add this later
      </button>

      <div className="h-20" aria-hidden="true" />
      <StickyFooter
        onClick={() => onAdvance({ uploaded: uploadState === "done", skipped: false })}
        disabled={!ready || skipped}
        label="Next"
      />
    </div>
  )
}
