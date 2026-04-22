import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-roobert)", "system-ui", "sans-serif"],
      },
      colors: {
        canvas:   "var(--color-canvas)",
        surface:  "var(--color-surface)",
        ink:      "var(--color-ink)",
        subtle:   "var(--color-subtle)",
        muted:    "var(--color-muted)",
        border:   "var(--color-border)",
        primary:  "var(--color-primary)",
      },
    },
  },
  plugins: [animate],
}

export default config
