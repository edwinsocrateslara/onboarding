"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

const PRIMARY   = "#43089f"
const BORDER    = "#dad4c8"
const SECONDARY = "#9f9b93"
const INK       = "#000000"

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
        <h2 className="text-[22px] font-semibold leading-snug" style={{ color: INK }}>
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
        className="w-full rounded-xl flex flex-col items-center justify-center gap-3 py-14 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#146ef5]"
        style={{
          background: processing ? "rgba(67,8,159,0.04)" : "#faf9f7",
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
