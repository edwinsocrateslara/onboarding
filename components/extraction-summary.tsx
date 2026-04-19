"use client"

interface ExtractionSummaryProps {
  parts:     string[]
  advancing: boolean
  onEdit:    () => void
}

export function ExtractionSummary({ parts, advancing, onEdit }: ExtractionSummaryProps) {
  if (parts.length === 0) return null

  return (
    <button
      type="button"
      onClick={advancing ? undefined : onEdit}
      className="text-left text-[13px] leading-relaxed transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3898ec] rounded"
      style={{ cursor: advancing ? "default" : "pointer", opacity: advancing ? 0.7 : 1 }}
    >
      <span style={{ color: "#87867f" }}>You said: </span>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && <span style={{ color: "#c2c0b6" }}> · </span>}
          <span style={{ color: "#5e5d59" }}>{part}</span>
        </span>
      ))}
      {!advancing && (
        <span
          className="ml-2 text-[11px] underline underline-offset-2"
          style={{ color: "#c2c0b6" }}
        >
          Edit
        </span>
      )}
    </button>
  )
}
