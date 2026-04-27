# Option-6 Flow Plan — Audit & Build Plan

Branch: `option-6`. Audited against option-5 codebase on 2026-04-25.

---

## 1. What carries over unchanged

These files require zero modification:

| File | Screen |
|---|---|
| `components/steps/step-intro.tsx` | Intro (name, last name, location) |
| `components/steps/step-2-3-education.tsx` | Education screen (no-experience path) |
| `components/steps/step-2-3-resume.tsx` | Resume upload (has-resume path) |
| `components/steps/step-4-0.tsx` | Tenant form |
| `components/steps/step-4-1.tsx` | Renders `<HandoffScreen>` — no change to this file |
| `components/steps/shared.tsx` | Design system (OptionCard, StickyFooter, etc.) |

**Note:** This is a short list by design. The persona Q3/Q4 infrastructure (6 screen components, all their state fields, and all persona-specific routing) is deleted in full.

The `handoff-screen.tsx` structure is unchanged; only the `PERSONA_LABEL` record keys update (see §2).

---

## 2. What gets renamed

### Persona type values

| Old | New |
|---|---|
| `"active_jobseeker"` | `"jobseeker"` |
| `"career_changer"` | `"career_switcher"` |
| `"career_explorer"` | unchanged |

Files touched by this rename:

- `lib/types.ts` — `Persona` union type
- `lib/classify.ts` — matrix values
- `app/api/classify/route.ts` — persona definitions in prompt
- `components/handoff-screen.tsx` — `PERSONA_LABEL` record keys

---

## 3. What gets removed

### Deleted screen components

| File | Reason |
|---|---|
| `components/steps/step-starter.tsx` | Replaced by new Q1 |
| `components/steps/step-2-2-student.tsx` | User-type Q2s replaced by single unified Q2 |
| `components/steps/step-2-2-recently-graduated.tsx` | Same |
| `components/steps/step-2-2-employed.tsx` | Same |
| `components/steps/step-2-2-unemployed.tsx` | Same |
| `components/steps/step-2-2-returning.tsx` | Same |
| `components/steps/q2-help-question.tsx` | No longer needed |
| `components/steps/step-2-2.tsx` | Jobseeker Q3 — persona flows removed |
| `components/steps/step-3-1.tsx` | Jobseeker Q4 — persona flows removed |
| `components/steps/step-2-3.tsx` | Career Switcher Q3 — persona flows removed |
| `components/steps/step-3-2.tsx` | Career Switcher Q4 — persona flows removed |
| `components/steps/step-2-4.tsx` | Career Explorer Q3 — persona flows removed |
| `components/steps/step-3-3.tsx` | Career Explorer Q4 — persona flows removed |

### State fields removed from `OnboardingState`

| Field | Reason |
|---|---|
| `hasTenantForm: boolean` | Tenant form is unconditional |
| `userType: UserType \| null` | Replaced by `q1Answer` |
| `employment_status: EmploymentStatus \| null` | Replaced by `q1Answer` + `q1SubOption` |
| `helpQuestionAnswer: string` | Replaced by `q2Answer` |
| `helpQuestionOtherText: string` | Replaced by `q2FreeText` |
| `goal: string \| null` | Replaced by `q2Answer` / `q2FreeText` |
| `goal_clarity: null` | Unused placeholder |
| `schedulePreference`, `workModality`, `payAmount`, `payUnit` | Jobseeker Q3 removed |
| `applicationDiagnostics` | Jobseeker Q4 removed |
| `currentRoleOrField`, `targetCareer`, `targetTimeline` | Career Switcher Q3 removed |
| `ccAvailability`, `ccFinancialConstraint`, `ccPayMin`, `ccPayMinUnit`, `ccPayTarget`, `ccPayTargetUnit` | Career Switcher Q4 removed |
| `eceExperiences`, `eceNoneSelected` | Career Explorer Q3 removed |
| `eceCareerInterests` | Career Explorer Q4 removed |

### Types and constants removed from `hooks/use-onboarding.ts`

- `UserType` union type
- `EmploymentStatus` union type
- `ScheduleValue`, `WorkModalityValue`, `PayUnitValue`, `ApplicationDiagnosticsValue`, `TimelineValue`, `AvailabilityValue`, `FinancialConstraintValue`, `ExperienceContextType`, `CareerAreaInterestValue`
- `SCHEDULE_LABEL`, `MODALITY_LABEL`, `TIMELINE_LABEL`, `ECE_EXPERIENCE_RECAP` label records
- `USER_TYPE_Q2` routing record
- `STAGE_2_CLEAR` object

### Actions removed from reducer

- `ADVANCE_STARTER`
- `ADVANCE_Q2`
- `ADVANCE_2_2`, `ADVANCE_2_3`, `ADVANCE_2_4`
- `ADVANCE_3_1`, `ADVANCE_3_2`, `ADVANCE_3_3`
- `SET_TENANT_CONFIG`
- `JUMP_TO_STAGE`

### Steps removed from `Step` union

- `"starter"`
- `"2.2-student"`, `"2.2-recently-graduated"`, `"2.2-employed"`, `"2.2-unemployed"`, `"2.2-returning"`
- `"2.2"`, `"2.3"`, `"2.4"`
- `"3.1"`, `"3.2"`, `"3.3"`

### Logic removed from `lib/classify.ts`

- 15-row `MATRIX` keyed on `${UserType}|${string}`
- `Q2_NAMED_OPTIONS` per-userType record
- `VALID_PERSONAS` per-userType record
- `FALLBACK_PERSONA` per-userType record
- `classifyDeterministic(userType, helpQuestionAnswer)` signature

### Logic removed from `app/api/classify/route.ts`

- `VALID_PERSONAS` per-userType record
- Per-userType constraint injection into the LLM prompt
- `userType` and `namedOptions` fields from request body

### Logic removed from `app/page.tsx`

- `useEffect` reading `?tenant=no-form`
- `setTenantConfig` import and call
- `hasTenantForm` conditional (`totalStages`, `stageName` selection)
- `STAGE_NAMES_5` (5-stage variant — option-6 is always 4 stages)
- Imports for all 13 deleted screen components
- `renderStep()` cases for all deleted steps

---

## 4. What gets modified

### `lib/types.ts`
```ts
// Before
export type Persona = "active_jobseeker" | "career_changer" | "career_explorer"

// After
export type Persona = "jobseeker" | "career_switcher" | "career_explorer"
```
`ClassificationResult` interface is otherwise unchanged.

### `lib/classify.ts`
Full rewrite of classification logic:

- New `Q1Answer` type: `"a" | "b" | "c" | "d"`
- New `Q2Answer` type: `"a" | "b" | "c" | "d" | "e"`
- New 3×4 `MATRIX` keyed on `${Q1Answer}|${Q2Answer}`:

| Q1 \ Q2 | (a) find job | (b) explore | (c) switch career | (d) training |
|---|---|---|---|---|
| (a) student/grad | jobseeker | career_explorer | career_explorer* | jobseeker |
| (b) employed | jobseeker | career_explorer | career_switcher | jobseeker |
| (c) unemployed | jobseeker | career_explorer | career_switcher | jobseeker |

*`(a)+(c)` → `career_explorer`: students haven't started a career to switch from.

- LLM path triggers when `q1Answer === "d"` OR `q2Answer === "e"`
- When LLM is used, all three personas are valid — no per-userType constraint
- Single global fallback: `"jobseeker"` (most conservative)
- `classifyDeterministic(q1Answer, q2Answer)` new signature
- `classifyOther(q1Answer, q1FreeText, q2Answer, q2FreeText)` new signature

### `app/api/classify/route.ts`
- Request body changes to `{ q1Answer, q1FreeText, q2Answer, q2FreeText }`
- Validation: `q1Answer === "d" || q2Answer === "e"` required to reach this route
- All three personas always valid — remove per-userType constraint
- Persona names updated to `jobseeker`, `career_switcher`, `career_explorer`
- Prompt updated to describe both Q1 and Q2 free-text inputs

### `hooks/use-onboarding.ts`

New `Step` values added: `"q1"`, `"q2"`, `"background"`, `"last-job"`

New `OnboardingState` fields:
```ts
q1Answer:         "a" | "b" | "c" | "d" | null
q1SubOption:      string | null   // sub-option key for Q1(a) and Q1(c)
q1FreeText:       string          // for Q1(d)
q2Answer:         "a" | "b" | "c" | "d" | "e" | null
q2FreeText:       string          // for Q2(e)
backgroundChoice: "has_resume" | "manual_entry" | "no_experience" | null
lastJobTitle:     string
```

New actions: `ADVANCE_Q1`, `ADVANCE_Q2_V6`, `ADVANCE_BACKGROUND`, `ADVANCE_LAST_JOB`

Routing changes:
- `ADVANCE_INTRO` → routes to `"q1"` (was `"starter"`)
- `ADVANCE_Q1` → always goes to `"q2"` (no branching)
- `ADVANCE_Q2_V6` → always goes to `"background"`
- `ADVANCE_BACKGROUND` → `"has_resume"` → `"2.3-resume"` | `"manual_entry"` → `"last-job"` | `"no_experience"` → `"2.3-education"`
- `ADVANCE_LAST_JOB` → goes to `"3.classification-pending"`
- `ADVANCE_EDUCATION` and `ADVANCE_RESUME` → unchanged, already go to `"3.classification-pending"`
- `SET_PERSONA` → always routes to `"4.0"` for ALL three personas (no persona Q3/Q4 routing)

`BACK` map:
```
"q1"                       → "intro"
"q2"                       → "q1"
"background"               → "q2"
"2.3-resume"               → "background"
"last-job"                 → "background"
"2.3-education"            → "background"
"3.classification-pending" → backgroundChoice-based:
  has_resume   → "2.3-resume"
  manual_entry → "last-job"
  no_experience → "2.3-education"
"4.0"                      → "3.classification-pending"
"4.1"                      → "4.0"
```

`getStageForStep` — 4 stages, no `hasTenantForm` param:
```
"intro"                                          → 1 (stepper hidden)
"q1"                                             → 1
"q2" | "background" | "2.3-resume" | "last-job"
  | "2.3-education" | "3.classification-pending" → 2
"4.0"                                            → 3
"4.1"                                            → 4
```

`getPreviousAnswer` — all cases return `null` (no recap summaries needed without Q3/Q4 screens); function can be removed or kept as a stub.

### `app/page.tsx`
- Remove `useEffect` / `setTenantConfig`
- `totalStages` hardcoded to `4`
- `stageName` uses single `STAGE_NAMES` record (4-stage only):
  ```ts
  const STAGE_NAMES: Record<1 | 2 | 3 | 4, string> = {
    1: "About you",
    2: "Goals",
    3: "Onboarding form",
    4: "Complete",
  }
  ```
- `getStageForStep` call drops `hasTenantForm` arg
- `renderStep()` switch: remove all 13 deleted cases, add `"q1"`, `"q2"`, `"background"`, `"last-job"`
- Remove all deleted component imports; add imports for 4 new components

### `components/steps/step-3-classification-pending.tsx`
Props change:
```ts
// Before
{ userType, helpQuestionAnswer, helpQuestionOtherText, onClassified }

// After
{ q1Answer, q1FreeText, q2Answer, q2FreeText, onClassified }
```
LLM trigger condition: `q1Answer === "d" || q2Answer === "e"` (was: `helpQuestionAnswer === "other"`)

### `components/handoff-screen.tsx`
```ts
// Before
const PERSONA_LABEL: Record<Persona, string> = {
  active_jobseeker: "Active Jobseeker",
  career_changer:   "Career Changer",
  career_explorer:  "Career Explorer",
}

// After
const PERSONA_LABEL: Record<Persona, string> = {
  jobseeker:       "Jobseeker",
  career_switcher: "Career Switcher",
  career_explorer: "Career Explorer",
}
```

---

## 5. What's new and needs to be built

### New screen: Q1 — Current situation (`components/steps/step-q1.tsx`)
**Step key:** `"q1"`

Heading: "Which best describes your current situation?"

Options (OptionCard, manual Next required — no auto-advance):
- (a) I'm a student or recent graduate
  → reveals inline sub-options when selected:
    (i) High school
    (ii) College or University
    (iii) Bootcamp or training program
- (b) I'm employed
- (c) I'm unemployed
  → reveals inline sub-options when selected:
    (i) I was recently laid off
    (ii) I just relocated to a new country
    (iii) I'm returning from a career break
    (iv) I'm a veteran
- (d) Something else
  → reveals free-text input

Sub-options and free-text are data-only — they don't affect classification routing.

Captures: `q1Answer`, `q1SubOption`, `q1FreeText`

### New screen: Q2 — Goal (`components/steps/step-q2.tsx`)
**Step key:** `"q2"`

Heading: "What would you most like help with?"

Options:
- (a) I want to find a job as soon as possible → auto-advance (300ms)
- (b) I am interested in career exploration → auto-advance
- (c) I want to switch into a new career or field → auto-advance
- (d) I want to find training or upskilling opportunities → auto-advance
- (e) Something else → reveals free-text + inline Next button (no auto-advance)

Single unified screen — same for all Q1 paths.

Captures: `q2Answer`, `q2FreeText`

### New screen: Background question (`components/steps/step-background.tsx`)
**Step key:** `"background"`

Heading: "Tell us about your background"
Sub-copy: "We'll use this to personalize your job matches, career suggestions, and learning opportunities."

Options (OptionCard, auto-advance 300ms):
- I have a resume I can provide → `"has_resume"` → `"2.3-resume"`
- I don't have a resume — I'll add my experience manually → `"manual_entry"` → `"last-job"`
- I don't have work experience yet → `"no_experience"` → `"2.3-education"`

Captures: `backgroundChoice`

### New screen: Last job title (`components/steps/step-last-job.tsx`)
**Step key:** `"last-job"`

Heading: "What was your last job title?"
Single text input. StickyFooter Next. Non-empty required to advance.

Captures: `lastJobTitle`

---

## 6. Open questions

### 6.1 Q1 sub-option UI pattern
Spec says sub-options are "shown inline when selected (data only)." Exact visual treatment is unspecified. Three options:
- A) Indented radio buttons that animate in below the selected card
- B) A row of pill/chip buttons that appear below the card
- C) Smaller secondary OptionCards stacked below

Recommendation: pill/chip buttons (Option B) — visually distinct from primary OptionCards, minimal vertical space. Please confirm preferred pattern.

### 6.2 Auto-advance timing on Q2
Option-5 used a 300ms delay before advancing on single-select screens. Confirming the same 300ms delay applies to Q2 options (a)–(d).

### 6.3 `getPreviousAnswer` / answer recap
Option-5 showed a recap summary in the step header for Q3 screens (e.g., "Full-time · Remote · $50,000/yr"). With all Q3/Q4 screens removed, this function has no useful inputs. Confirming it can be removed entirely rather than kept as a stub.
