import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
})

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Hybrid conversational AI + structured onboarding",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={jakarta.variable} style={{ fontFamily: "var(--font-jakarta), sans-serif" }}>{children}</body>
    </html>
  )
}
