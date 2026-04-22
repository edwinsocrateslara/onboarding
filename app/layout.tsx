import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-roobert",
})

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Hybrid conversational AI + structured onboarding",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.variable}>{children}</body>
    </html>
  )
}
