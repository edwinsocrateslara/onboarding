"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

const PRIMARY   = "#6366f1"
const BORDER    = "#e5e7eb"
const SECONDARY = "#6b7280"
const INK       = "#111827"

interface Props {
  onAdvance: () => void
}

export function Step1ResumeUpload({ onAdvance }: Props) {
  const [processing, setProcessing] = useState(false)

  const handleClick = () => {
    if (processing) return
    setProcessing(true)
    setTimeout(() => onAdvance(), 900)
  }

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <h2 className="text-3xl font-semibold leading-normal w-full text-balance" style={{ color: INK }}>
          Upload your resume
        </h2>
        <p className="text-[15px]" style={{ color: SECONDARY }}>
          Upload your resume to generate your profile.
        </p>
      </div>

      <button
        type="button"
        onClick={handleClick}
        disabled={processing}
        className="w-full rounded-xl flex flex-col items-center justify-center gap-3 py-14 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6366f1]"
        style={{
          background: processing ? "rgba(99,102,241,0.04)" : "#faf9f7",
          border: `1.5px dashed ${processing ? PRIMARY : BORDER}`,
          cursor: processing ? "default" : "pointer",
        }}
        aria-label="Select a file to upload"
      >
        <Upload
          className="h-7 w-7"
          style={{ color: processing ? PRIMARY : SECONDARY }}
        />
        <span className="text-[14px] font-medium" style={{ color: processing ? PRIMARY : INK }}>
          {processing ? "Processing your resume…" : "Drag and drop or click to select a file"}
        </span>
        {!processing && (
          <span className="text-[12px]" style={{ color: SECONDARY }}>
            We accept .pdf and .docx formats only
          </span>
        )}
      </button>
    </div>
  )
}
