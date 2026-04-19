import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-roobert",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Onboarding",
  description: "Hybrid conversational AI + structured onboarding",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${spaceMono.variable}`}>{children}</body>
    </html>
  )
}
