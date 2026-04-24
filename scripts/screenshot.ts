/**
 * Playwright screenshot script — option-5 onboarding prototype
 * Run: npx tsx scripts/screenshot.ts
 * Requires dev server on http://localhost:3001
 */

import { chromium, type Page } from "playwright"
import * as fs from "fs"
import * as path from "path"

const BASE_URL = "http://localhost:3001"
const ROOT_DIR = path.join(process.cwd(), "screenshots")
const HEADLESS = true
const PAUSE    = 400  // ms to wait before each screenshot

const FLOW_DIRS = {
  flow1: path.join(ROOT_DIR, "flow1-career-explorer-student"),
  flow2: path.join(ROOT_DIR, "flow2-career-explorer-other"),
  flow3: path.join(ROOT_DIR, "flow3-active-jobseeker-recently-graduated"),
  flow4: path.join(ROOT_DIR, "flow4-career-changer-employed"),
  flow5: path.join(ROOT_DIR, "flow5-no-tenant-form"),
}

// Clear root and recreate all subdirectories fresh
if (fs.existsSync(ROOT_DIR)) fs.rmSync(ROOT_DIR, { recursive: true })
fs.mkdirSync(ROOT_DIR, { recursive: true })
Object.values(FLOW_DIRS).forEach(d => fs.mkdirSync(d, { recursive: true }))

let screenshotCount = 0
const errors: string[] = []

async function shot(page: Page, dir: string, filename: string) {
  await page.waitForTimeout(PAUSE)
  const filepath = path.join(dir, filename)
  await page.screenshot({ path: filepath, fullPage: true })
  screenshotCount++
  console.log(`  ✓ ${filename}`)
}

// ── Shared helpers ────────────────────────────────────────────────────────────

async function fillIntro(page: Page) {
  await page.getByLabel("First name").fill("Alex")
  await page.getByLabel("Last name").fill("Rivera")
  const locInput = page.getByLabel("Location")
  await locInput.fill("New York")
  await page.waitForTimeout(100)
  await page.getByRole("option", { name: "New York, NY, USA" }).click()
}

// Exclude the Next.js dev tools button (aria-label contains "Next.js") by data attribute
async function clickNext(page: Page) {
  await page.locator('button:not([data-nextjs-dev-tools-button])').filter({ hasText: /^Next$/ }).click()
}

async function clickContinue(page: Page) {
  await page.locator('button[aria-disabled]').filter({ hasText: /^Continue$/ }).click()
}

async function fillTenantForm(page: Page) {
  await page.getByLabel("Phone number").fill("5550001234")
  await page.getByLabel("City").selectOption("New York, NY")
  await page.getByLabel("Birth month").selectOption("June")
  await page.getByLabel("Birth day").selectOption("15")
  await page.getByLabel("Birth year").selectOption("1995")
  await page.getByRole("button", { name: "White", exact: false }).click()
}

// ── Flow 1: Student → Career Explorer (deterministic option b) ───────────────

async function flow1(page: Page) {
  const dir = FLOW_DIRS.flow1
  console.log("\nFlow 1 — Student → Career Explorer (deterministic)")

  await page.goto(BASE_URL)
  await shot(page, dir, "01-intro-empty.png")

  await fillIntro(page)
  await shot(page, dir, "02-intro-filled.png")

  await clickNext(page)
  await shot(page, dir, "03-starter.png")

  await page.getByRole("button", { name: "I'm a student" }).click()
  await shot(page, dir, "04-q2-student.png")

  await page.getByRole("button", { name: "I want to build skills for my future career" }).click()
  await page.waitForTimeout(600)
  await shot(page, dir, "05-ce-q3-empty.png")

  await page.getByRole("button", { name: "I've had a past job or internship" }).click()
  await page.waitForTimeout(100)
  await page.getByLabel("What was it?").fill("Barista at local coffee shop")
  await shot(page, dir, "06-ce-q3-filled.png")

  await clickNext(page)
  await shot(page, dir, "07-ce-q4-empty.png")

  await page.getByRole("button", { name: "Helping people directly", exact: false }).click()
  await shot(page, dir, "08-ce-q4-selected.png")

  await clickNext(page)
  await shot(page, dir, "09-tenant-form-empty.png")

  await fillTenantForm(page)
  await shot(page, dir, "10-tenant-form-filled.png")

  await clickContinue(page)
  await shot(page, dir, "11-handoff.png")
}

// ── Flow 2: Student → Other → spinner → Career Explorer ──────────────────────

async function flow2(page: Page) {
  const dir = FLOW_DIRS.flow2
  console.log("\nFlow 2 — Student → Other → classifying spinner → Career Explorer")

  await page.goto(BASE_URL)
  await fillIntro(page)
  await clickNext(page)
  await page.waitForTimeout(PAUSE)

  await page.getByRole("button", { name: "I'm a student" }).click()
  await page.waitForTimeout(400)

  await page.getByRole("button", { name: "Other", exact: true }).click()
  await shot(page, dir, "01-q2-other-selected.png")

  await page.getByLabel("Describe what you'd like help with").fill(
    "I have no idea what career to pursue and just want to explore options"
  )
  await shot(page, dir, "02-q2-other-filled.png")

  await clickNext(page)
  await page.waitForTimeout(150)
  await shot(page, dir, "03-classifying-spinner.png")

  await page.waitForSelector('button[aria-pressed]', { timeout: 20_000 })
  await shot(page, dir, "04-q3.png")

  const isCEQ3 = await page.locator('button').filter({ hasText: "I've had a past job" }).count() > 0

  if (isCEQ3) {
    await page.locator('button').filter({ hasText: "hobby or side project" }).click()
    await page.waitForTimeout(100)
    await page.getByLabel("What is it?").fill("Birdwatching blog")
    await clickNext(page)
    await shot(page, dir, "05-q4.png")
    await page.locator('button').filter({ hasText: "Working outdoors or with your hands" }).click()
    await clickNext(page)
  } else {
    // Landed on AJS Q3
    await page.getByRole("button", { name: "Full-time" }).click()
    await page.getByRole("button", { name: "Remote" }).click()
    await page.getByLabel("Minimum pay amount").fill("40000")
    await page.getByRole("button", { name: "Yearly" }).click()
    await shot(page, dir, "05-q4.png")
    await clickNext(page)
    await page.getByRole("button", { name: "No, I'm just getting started" }).click()
    await page.waitForTimeout(600)
  }

  await shot(page, dir, "06-tenant-form.png")
  await fillTenantForm(page)
  await clickContinue(page)
  await shot(page, dir, "07-handoff.png")
}

// ── Flow 3: Recently Graduated → Active Jobseeker ────────────────────────────

async function flow3(page: Page) {
  const dir = FLOW_DIRS.flow3
  console.log("\nFlow 3 — Recently Graduated → Active Jobseeker")

  await page.goto(BASE_URL)
  await fillIntro(page)
  await clickNext(page)
  await shot(page, dir, "01-starter.png")

  await page.getByRole("button", { name: "I recently graduated" }).click()
  await shot(page, dir, "02-q2-recently-graduated.png")

  await page.getByRole("button", { name: "I want to find a job as soon as possible" }).click()
  await page.waitForTimeout(600)
  await shot(page, dir, "03-education-empty.png")

  await page.getByLabel("Education level").selectOption("Bachelor's Degree")
  await page.getByLabel("Major or field of study").fill("Business Administration")
  await page.getByLabel("Start year").selectOption("2020")
  await shot(page, dir, "04-education-filled.png")

  await clickNext(page)
  await shot(page, dir, "05-ajs-q3-empty.png")

  await page.getByRole("button", { name: "Full-time" }).click()
  await page.getByRole("button", { name: "Remote" }).click()
  await page.getByLabel("Minimum pay amount").fill("50000")
  await page.getByRole("button", { name: "Yearly" }).click()
  await shot(page, dir, "06-ajs-q3-filled.png")

  await clickNext(page)
  await shot(page, dir, "07-ajs-q4.png")

  await page.getByRole("button", { name: "No, I'm just getting started" }).click()
  await page.waitForTimeout(600)
  await shot(page, dir, "08-tenant-form-empty.png")

  await fillTenantForm(page)
  await shot(page, dir, "09-tenant-form-filled.png")

  await clickContinue(page)
  await shot(page, dir, "10-handoff.png")
}

// ── Flow 4: Employed → Career Changer ────────────────────────────────────────

async function flow4(page: Page) {
  const dir = FLOW_DIRS.flow4
  console.log("\nFlow 4 — Employed → Career Changer")

  await page.goto(BASE_URL)
  await fillIntro(page)
  await clickNext(page)
  await shot(page, dir, "01-starter.png")

  await page.getByRole("button", { name: "I'm employed" }).click()
  await shot(page, dir, "02-q2-employed.png")

  await page.getByRole("button", { name: "I want to switch into a different career" }).click()
  await page.waitForTimeout(600)
  await shot(page, dir, "03-resume-idle.png")

  await page.getByRole("button", { name: "Upload resume" }).click()
  await page.waitForTimeout(300)
  await shot(page, dir, "04-resume-processing.png")

  await page.waitForTimeout(1500)
  await shot(page, dir, "05-resume-done.png")

  await clickNext(page)
  await shot(page, dir, "06-cc-q3-empty.png")

  await page.getByLabel("What you're doing now").fill("Software sales")
  await page.getByLabel("Where you want to go").fill("UX design")
  await page.getByRole("button", { name: "Within 6–12 months", exact: false }).click()
  await shot(page, dir, "07-cc-q3-filled.png")

  await clickNext(page)
  await shot(page, dir, "08-cc-q4-empty.png")

  await page.getByRole("button", { name: "10–20 hours", exact: false }).click()
  await page.getByRole("button", { name: "I have some savings", exact: false }).click()
  await page.getByLabel("Minimum pay you need now").fill("60000")
  await page.getByRole("button", { name: "Yearly" }).first().click()
  await page.getByLabel("Target pay amount").fill("90000")
  await page.getByRole("button", { name: "Yearly" }).last().click()
  await shot(page, dir, "09-cc-q4-filled.png")

  await clickNext(page)
  await shot(page, dir, "10-tenant-form-empty.png")

  await fillTenantForm(page)
  await shot(page, dir, "11-tenant-form-filled.png")

  await clickContinue(page)
  await shot(page, dir, "12-handoff.png")
}

// ── Flow 5: ?tenant=no-form ───────────────────────────────────────────────────

async function flow5(page: Page) {
  const dir = FLOW_DIRS.flow5
  console.log("\nFlow 5 — ?tenant=no-form (Q4 → handoff directly)")

  await page.goto(`${BASE_URL}?tenant=no-form`)
  await shot(page, dir, "01-intro.png")

  await fillIntro(page)
  await clickNext(page)
  await shot(page, dir, "02-starter.png")

  await page.getByRole("button", { name: "I'm a student" }).click()
  await page.waitForTimeout(400)
  await shot(page, dir, "03-q2-student.png")

  await page.getByRole("button", { name: "I want to build skills for my future career" }).click()
  await page.waitForTimeout(600)

  await page.getByRole("button", { name: "I've had a past job or internship" }).click()
  await page.waitForTimeout(100)
  await page.getByLabel("What was it?").fill("Intern at tech company")
  await shot(page, dir, "04-ce-q3-filled.png")
  await clickNext(page)

  await shot(page, dir, "05-ce-q4.png")
  await page.getByRole("button", { name: "Helping people directly", exact: false }).click()
  await clickNext(page)

  await shot(page, dir, "06-handoff-direct.png")
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Starting Playwright screenshot run…")
  console.log(`Target:  ${BASE_URL}`)
  console.log(`Output:  ${ROOT_DIR}`)
  console.log(`Viewport: 1440×900\n`)

  const browser = await chromium.launch({ headless: HEADLESS })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  const flows: Array<[string, (p: Page) => Promise<void>]> = [
    ["Flow 1", flow1],
    ["Flow 2", flow2],
    ["Flow 3", flow3],
    ["Flow 4", flow4],
    ["Flow 5", flow5],
  ]

  for (const [name, fn] of flows) {
    const page = await context.newPage()
    try {
      await fn(page)
    } catch (err) {
      const msg = `${name} errored: ${err instanceof Error ? err.message : String(err)}`
      errors.push(msg)
      console.error(`  ✗ ${msg}`)
    } finally {
      await page.close()
    }
  }

  await browser.close()

  // Report
  console.log("\n── Summary ──────────────────────────────────────────")
  console.log(`Screenshots captured: ${screenshotCount}`)

  let totalBytes = 0
  let totalFiles = 0
  for (const [flowName, dir] of Object.entries(FLOW_DIRS)) {
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter(f => f.endsWith(".png"))
    const bytes = files.reduce((acc, f) => acc + fs.statSync(path.join(dir, f)).size, 0)
    totalBytes += bytes
    totalFiles += files.length
    console.log(`  ${flowName}: ${files.length} screens (${(bytes / 1_048_576).toFixed(2)} MB)`)
  }
  console.log(`Total: ${totalFiles} files — ${(totalBytes / 1_048_576).toFixed(2)} MB`)

  if (errors.length === 0) {
    console.log("Errors: none")
  } else {
    console.log(`\nErrors (${errors.length}):`)
    errors.forEach(e => console.log(`  - ${e}`))
  }
}

main().catch(err => {
  console.error("Fatal:", err)
  process.exit(1)
})
