"use client"

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-slide-up">
      <div
        className="mt-0.5 shrink-0 h-[22px] w-[22px] rounded-full flex items-center justify-center text-[11px] font-semibold"
        style={{ background: "rgba(67,8,159,0.1)", color: "#43089f" }}
      >
        F
      </div>
      <div className="flex items-center gap-1 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block h-[6px] w-[6px] rounded-full"
            style={{
              background: "#dad4c8",
              animation: `dot-bounce 1.2s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
