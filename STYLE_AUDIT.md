# Style Audit — option-6

> Audit only — no changes made. All values extracted directly from source files.
> Design tokens defined in `app/globals.css` and the `C` object in `components/steps/shared.tsx`.

---

## Design system tokens

```
CSS variables (globals.css)   C object (shared.tsx)         Raw hex
--color-canvas:  #ffffff      C.surface:     #ffffff
--color-ink:     #111827      C.ink:         #111827        "INK"   in per-screen consts
--color-subtle:  #374151      C.subtle:      #374151        "SUBTLE"
--color-muted:   #6b7280      C.muted:       #6b7280        "SECONDARY" in per-screen consts
--color-border:  #e5e7eb      C.border:      #e5e7eb        "BORDER"
--color-primary: #6366f1      C.primary:     #6366f1        "PRIMARY"
                              C.accentLight: #eef2ff
                              C.accentBorder:rgba(99,102,241,0.6)
                              C.disabledBg:  #f3f4f6
                              C.disabledText:#9ca3af
                              C.placeholder: #9ca3af        (also set in globals.css)
```

**Token usage pattern**: `app/page.tsx` (stepper) uses `var(--color-*)` CSS variables. Shared components use the `C` object. All per-screen components define their own local constants (`INK`, `SECONDARY`, `BORDER`, `PRIMARY`) with the same hex values — none use CSS variables or import `C`. This means the tokens exist but are not actually referenced by individual screens.

---

## Screen-by-screen inventory

### Intro (`step-intro.tsx`)

| Element | Value |
|---------|-------|
| Heading tag | `<h2>` |
| Heading text | "Let's get started" |
| Heading classes | `text-3xl font-semibold leading-normal w-full text-balance` |
| Heading size | 30px (`text-3xl`) |
| Heading weight | 600 (`font-semibold`) |
| Heading color | `#111827` (INK) |
| Heading casing | Sentence case |
| Heading letter-spacing | none |
| Heading bottom margin | controlled by parent `space-y-8` |
| Sub-copy text | "Tell us a bit about yourself." |
| Sub-copy classes | `text-base mt-1` |
| Sub-copy size | 16px (`text-base`) |
| Sub-copy weight | 400 (no class) |
| Sub-copy color | `#6b7280` (SECONDARY) |
| Sub-copy top margin | 4px (`mt-1`) |
| Sub-copy casing | Sentence case |
| Field labels | `text-sm font-medium mb-1.5`, color `#6b7280` |
| Field label size | 14px |
| Field label weight | 500 |
| Field label casing | Short noun ("First name", "Last name"), full question ("Where are you currently located?") |
| Field helper text | none |
| Input border | `1px solid #e5e7eb`, `rounded-md` |
| Input bg | `#ffffff` |
| Input text color | `#111827` |
| Input placeholder color | `#9ca3af` (globals.css) |
| Input placeholder casing | Sentence case ("Start typing...") |
| Input height | 40px (`h-10`) |
| Input padding | `px-3` |
| Primary button | `h-12 rounded-full text-base font-medium`, bg `#6366f1`, text `#ffffff` |
| Button label | "Next" |
| Button disabled | opacity 0.5 (bg stays `#6366f1`) |
| Sticky footer bg | `#ffffff`, border-top `1px solid #e5e7eb`, `px-5 py-4` |

---

### Q1 (`step-q1.tsx`)

| Element | Value |
|---------|-------|
| Heading tag | `<h1>` (via `AssistantQuestion`) |
| Heading text | "Which best describes your current situation?" |
| Heading classes | `text-3xl font-semibold leading-normal mb-2 w-full text-balance` |
| Heading size | 30px |
| Heading weight | 600 |
| Heading color | `#111827` (`C.ink`) |
| Heading built-in bottom margin | 8px (`mb-2`) |
| Sub-copy | none |
| OptionCard border (default) | `1px solid #e5e7eb`, `rounded-xl` |
| OptionCard border (selected) | `1.5px solid rgba(99,102,241,0.6)`, `rounded-xl` |
| OptionCard bg (default) | `#ffffff` |
| OptionCard bg (selected) | `#eef2ff` |
| OptionCard text (default) | `#111827` |
| OptionCard text (selected) | `#6366f1` |
| OptionCard padding | `px-4 py-3` |
| OptionCard min-height | 48px |
| OptionCard text size | `text-base` = 16px |
| OptionCard label casing | Sentence case |
| Radio sub-option label | `text-[15px] leading-normal`, color `#374151` (SUBTLE) |
| Radio sub-option casing | Sentence case |
| Free-text input | `rounded-md px-3 h-10 text-sm`, bg `#ffffff`, border `1px solid #e5e7eb` |
| Free-text placeholder | "Tell us a bit about your situation" — sentence case |
| Primary button | Same as Intro: `h-12 rounded-full text-base font-medium` |
| Button label | "Next" |

---

### Q2 (`step-q2.tsx`)

| Element | Value |
|---------|-------|
| Heading tag | `<h1>` (via `AssistantQuestion`) |
| Heading text | "What would you most like help with?" |
| Heading size/weight/color | same as Q1: 30px / 600 / `#111827` |
| Sub-copy | none |
| OptionCard styling | same as Q1 |
| Free-text input | same as Q1: `rounded-md px-3 h-10 text-sm` |
| Free-text placeholder | "Describe what you'd like help with" — sentence case |
| Inline Next button | `h-10 rounded-full text-sm font-medium` — 40px height, 14px text |
| Inline Next active | bg `#6366f1`, text `#ffffff` |
| Inline Next disabled | bg `#f3f4f6`, text `#9ca3af` |
| Sticky footer | none (auto-advance for a–d; inline button for e) |

---

### Background (`step-background.tsx`)

| Element | Value |
|---------|-------|
| Heading tag | `<h1>` (via `AssistantQuestion`) |
| Heading text | "Tell us about your background" |
| Heading size/weight/color | 30px / 600 / `#111827` |
| Sub-copy classes | `text-base leading-normal mb-8` (local `<p>`) |
| Sub-copy size | 16px |
| Sub-copy weight | 400 |
| Sub-copy color | `#6b7280` (MUTED) |
| Sub-copy bottom margin | 32px (`mb-8`) — no top margin, placed after AssistantQuestion's mb-2 |
| Sub-copy top margin | 0 (relies on heading's `mb-2`) |
| Icon card border (default) | `1px solid #e5e7eb`, `rounded-xl` |
| Icon card border (selected) | `1.5px solid rgba(99,102,241,0.6)`, `rounded-xl` |
| Icon card bg (default) | `#ffffff` |
| Icon card bg (selected) | `#eef2ff` |
| Icon card padding | `px-4 py-3.5` |
| Icon card label size | `text-base leading-snug` = 16px |
| Icon card label color (default) | `#111827` |
| Icon card label color (selected) | `#6366f1` |
| Icon card label casing | Sentence case |
| Sticky footer | none (auto-advance on select) |

---

### Resume upload — idle state (`step-2-3-resume.tsx`)

| Element | Value |
|---------|-------|
| Heading tag | `<h2>` |
| Heading text | "Upload your resume" |
| Heading classes | `text-3xl font-semibold leading-normal w-full text-balance` |
| Heading size/weight/color | 30px / 600 / `#111827` |
| Sub-copy classes | `text-base mt-1` |
| Sub-copy size | 16px |
| Sub-copy color | `#6b7280` |
| Sub-copy top margin | 4px (`mt-1`) |
| Upload zone border | `border-2 border-dashed`, `rounded-xl`, color `#e5e7eb` |
| Upload zone bg (hover) | `#f9fafb` |
| Upload zone icon container | h-12 w-12 `rounded-full`, bg `#eef2ff` |
| Upload zone primary text | `text-[15px] font-medium`, `#111827` — "Drag and drop or click to select a file" |
| Upload zone secondary text | `text-sm`, `#6b7280` — "We accept .pdf and .docx formats only" |
| Sticky footer | disabled until upload done |
| Button label | "Next" |

---

### Resume upload — review state (`step-2-3-resume.tsx`)

| Element | Value |
|---------|-------|
| Heading text | "Review details from your resume" |
| Heading tag | `<h2>`, same 30px / 600 / `#111827` |
| Sub-copy | hidden in review state |
| Section divider label | `text-[11px] font-semibold uppercase tracking-wide`, `#6b7280` |
| Section divider casing | Passed as "Work" / "Education" but rendered UPPERCASE via `uppercase` Tailwind class |
| Section divider line | `h-px`, `#e5e7eb` |
| Entry card bg | `#f9fafb` |
| Entry card border | `1px solid #e5e7eb`, `rounded-xl` |
| Entry card title | `text-[15px] font-semibold`, `#111827` |
| Entry card subtitle | `text-sm mt-0.5`, `#6b7280` |
| Edit/delete icons | `h-4 w-4`, color `#6b7280` |

---

### Last job (`step-last-job.tsx`)

| Element | Value |
|---------|-------|
| Heading tag | `<h2>` |
| Heading text | "What was your last job title?" |
| Heading size/weight/color | 30px / 600 / `#111827` |
| Sub-copy classes | `text-base mt-2` |
| Sub-copy size | 16px |
| Sub-copy color | `#6b7280` |
| Sub-copy top margin | 8px (`mt-2`) |
| Sub-copy casing | Sentence case |
| Field labels | `text-sm font-medium mb-1.5`, `#6b7280` |
| Field label size | 14px |
| Field label weight | 500 |
| Field label casing | Sentence case ("Job title", "Start date", "End date") |
| Select border | `1px solid #e5e7eb`, `rounded-md` |
| Select height | 40px (`h-10`) |
| Select padding | `px-3`, right 36px |
| Select bg (disabled) | `#f3f4f6` |
| Select text (disabled) | `#9ca3af` |
| Autocomplete dropdown | `rounded-xl`, bg `#ffffff`, border `1px solid #e5e7eb`, shadow |
| Autocomplete item | `text-sm px-4 py-2.5`, `#111827` |
| Checkbox | `h-[18px] w-[18px] rounded-[4px] border-2` |
| Checkbox checked | border+bg `#6366f1` |
| Checkbox check icon | `h-2.5 w-2.5 text-white strokeWidth={3}` |
| Checkbox label | `text-[15px]`, `#111827` |
| Button label | "Next" |

---

### Education (`step-2-3-education.tsx`)

| Element | Value |
|---------|-------|
| Heading tag | `<h2>` |
| Heading text | "What's your highest level of education?" |
| Heading size/weight/color | 30px / 600 / `#111827` |
| Sub-copy position | **below the education level dropdown**, not below heading |
| Sub-copy classes | `text-sm mt-2` |
| Sub-copy size | **14px** (`text-sm`) |
| Sub-copy color | `#6b7280` |
| Sub-copy top margin | 8px (`mt-2`, from the dropdown above it) |
| Field label ("Major / field of study") | `text-sm font-medium mb-1.5`, `#6b7280` — sentence case |
| Date column labels | `text-[11px] font-semibold uppercase tracking-wide mb-1.5`, `#6b7280` |
| Date label casing | UPPERCASE (via Tailwind `uppercase`) — passed as "Start date"/"End date" |
| Major placeholder | "e.g. Nursing, Computer Science, Business" — sentence case with examples |
| Select fields | same as Last Job |
| Checkbox | same pattern as Last Job |
| Button label | "Next" |

---

### Classification pending (`step-3-classification-pending.tsx`)

| Element | Value |
|---------|-------|
| Heading | none |
| Sub-copy | none |
| Loading text | `text-[15px]`, `#6b7280` — "Personalizing your experience…" |
| Spinner | h-10 w-10, `border-4`, border color `${PRIMARY}40` / top `PRIMARY` |
| Layout | `flex flex-col items-center justify-center gap-4 py-20` |

---

### Tenant form (`step-4-0.tsx`)

| Element | Value |
|---------|-------|
| Heading tag | `<h2>` |
| Heading text | "Onboarding form" |
| Heading size/weight/color | 30px / 600 / `#111827` |
| Sub-copy classes | `text-base mt-1` |
| Sub-copy size | 16px |
| Sub-copy top margin | 4px (`mt-1`) |
| Sub-copy casing | Sentence case |
| Per-field question label | `text-[15px] font-medium leading-snug`, color **`#111827` (INK)** |
| Per-field question casing | Sentence case, question format |
| Required asterisk | inline `<span style={{ color: "#ef4444" }}>*</span>` |
| Per-field helper text | `text-xs mt-0.5`, `#6b7280` |
| Helper text size | **12px** (`text-xs`) |
| Helper text casing | Sentence case except "check all that apply" (all lowercase) |
| Checkbox row border-radius | `rounded-lg` = **8px** |
| Checkbox row padding | `px-4 py-3 text-sm` |
| Checkbox row bg (selected) | `#eef2ff`, border `1.5px solid rgba(99,102,241,0.6)` |
| Checkbox inside | `h-[18px] w-[18px] rounded-[4px] border-2` |
| Checkbox check icon | `h-3 w-3 text-white strokeWidth={3}` |
| Select fields | same as other screens |
| Button label | **"Continue"** |

---

### Handoff (`handoff-screen.tsx`)

| Element | Value |
|---------|-------|
| Heading tag | `<h1>` |
| Heading text | "End of prototype" |
| Heading classes | `text-[24px] font-semibold mb-3` |
| Heading size | **24px** |
| Heading weight | 600 |
| Heading color | `#111827` |
| Heading casing | Sentence case |
| Sub-copy classes | `text-[15px] leading-[1.6] max-w-[400px] mb-8` |
| Sub-copy size | **15px** |
| Sub-copy weight | 400 |
| Sub-copy color | `#6b7280` |
| Sub-copy casing | Sentence case |
| Prototype badge | `text-[11px] font-medium tracking-wide uppercase`, `#6b7280`, bg `#f3f4f6` |
| Card label "Classified as" | `text-[11px] font-medium uppercase tracking-wide`, `#9ca3af` |
| Card value | `text-[15px] font-semibold`, `#374151` |
| Card bg | `#f9fafb`, border `1px solid #e5e7eb`, `rounded-xl` |
| Sticky footer | none |

---

### Stepper (`app/page.tsx`)

| Element | Value |
|---------|-------|
| "Step N of 5" text | `text-[11px] font-medium`, `var(--color-muted)` = `#6b7280` |
| Stage name text | `text-[13px] font-semibold truncate`, `var(--color-subtle)` = `#374151` |
| Stage name casing | Sentence / Title case ("Let's get started", "About you", "Goals", "Onboarding form", "Complete") |
| Stage name format | "Step N of 5" |
| Progress bar height | 4px (`h-1`) |
| Progress bar fill | `#6366f1` |
| Progress bar bg | `#e5e7eb` |
| Back button | h-8 w-8 `rounded-full`, color `#374151`, hover `#f3f4f6` |

---

## Casing inventory

| Element | Screen | Casing |
|---------|--------|--------|
| Page heading | Intro | Sentence case |
| Page heading | Q1 | Sentence case |
| Page heading | Q2 | Sentence case |
| Page heading | Background | Sentence case |
| Page heading | Resume (idle) | Sentence case |
| Page heading | Resume (review) | Sentence case |
| Page heading | Last job | Sentence case |
| Page heading | Education | Sentence case |
| Page heading | Tenant form | Sentence case |
| Page heading | Handoff | Sentence case |
| Sub-copy | Intro | Sentence case |
| Sub-copy | Background | Sentence case |
| Sub-copy | Resume | Sentence case |
| Sub-copy | Last job | Sentence case |
| Sub-copy | Education (dropdown helper) | Sentence case |
| Sub-copy | Tenant form | Sentence case |
| Sub-copy | Handoff | Sentence case |
| Field label | Intro ("First name") | Short noun, sentence case |
| Field label | Intro ("Last name") | Short noun, sentence case |
| Field label | Intro ("Where are you currently located?") | Full question, sentence case |
| Field label | Last job ("Job title") | Short noun, sentence case |
| Field label | Last job ("Start date") | Short noun, sentence case |
| Field label | Last job ("End date") | Short noun, sentence case |
| Field label | Education ("Major / field of study") | Short noun, sentence case |
| Field label | Education ("Start date" / "End date") | **UPPERCASE** (via CSS class) |
| Field label | Tenant form (all fields) | Full question, sentence case |
| Field helper text | Education | Sentence case |
| Field helper text | Tenant form ("Please enter in a valid phone number...") | Sentence case |
| Field helper text | Tenant form ("Please select the location from the dropdown") | Sentence case |
| Field helper text | Tenant form ("Please enter in the correct date of birth format") | Sentence case |
| Field helper text | Tenant form ("check all that apply") | **all lowercase** |
| OptionCard label | Q1 | Sentence case |
| OptionCard label | Q2 | Sentence case |
| Icon card label | Background | Sentence case |
| Checkbox label | Last job ("I currently work here") | Sentence case |
| Checkbox label | Education ("I currently study here") | Sentence case |
| Checkbox row label | Tenant form (ethnic groups) | Title Case / Sentence case (data-driven) |
| Section divider | Resume (review) | **UPPERCASE** (CSS `uppercase` on "Work", "Education") |
| Prototype badge | Handoff | **UPPERCASE** |
| Card micro-label | Handoff ("Classified as") | **UPPERCASE** |
| Stepper stage label | All | Sentence / Title case ("Let's get started", "Goals", "Complete") |
| Button label | Intro, Q1, Resume, Last job, Education | "Next" (Title case) |
| Button label | Tenant form | "Continue" (Title case) |
| Input placeholder | Intro location | Sentence case ("Start typing...") |
| Input placeholder | Q1 free text | Sentence case |
| Input placeholder | Q2 free text | Sentence case |
| Input placeholder | Last job title | Sentence case ("Start typing...") |
| Input placeholder | Education major | Sentence case ("e.g. Nursing, Computer Science, Business") |

---

## Inconsistencies found

### Heading
1. **Heading HTML tag**: Q1, Q2, Background use `<h1>` (via `AssistantQuestion`). Intro, Resume, Last Job, Education, Tenant form use `<h2>`. Handoff uses `<h1>` directly. Three different patterns.

2. **Heading font size — Handoff**: All screens use `text-3xl` (30px) except Handoff which uses `text-[24px]` (24px). The Handoff heading is 6px smaller than every other heading in the flow.

### Sub-copy
3. **Sub-copy font size**: Intro, Background, Resume, Last Job, Tenant form all use `text-base` (16px). Education's sub-copy (placed below the dropdown) uses `text-sm` (14px). Handoff uses `text-[15px]` (15px). Three different sizes for the same conceptual element.

4. **Sub-copy top margin from heading**:
   - `mt-1` (4px): Intro, Resume, Tenant form
   - `mt-2` (8px): Last Job
   - `0` (none — placed after heading's own `mb-2` = 8px): Background
   - Below dropdown (not below heading): Education

5. **Sub-copy placement on Education**: The helper text sits below the education level dropdown rather than below the heading. On every other screen the sub-copy immediately follows the heading.

### Field labels
6. **Education date labels vs Last Job date labels**: Both screens have Start date and End date fields. Education uses `DateColumnLabel` — 11px, semibold, uppercase. Last Job uses `FieldLabel` — 14px, medium, sentence case. Identical fields, completely different label treatment.

7. **Tenant form field labels vs all other screens**: Tenant form uses `FieldQuestion` — 15px, medium weight, `#111827` (ink/dark), question format with asterisk. All other screens use `FieldLabel` — 14px, medium, `#6b7280` (muted/gray), short noun or sentence. Two different visual hierarchies for field labels.

### Field helper text
8. **Helper text font size**: Education helper is `text-sm` (14px). Tenant form helpers are `text-xs` (12px). Two sizes for the same element type.

9. **Helper text casing inconsistency**: All Tenant form helpers start with a capital ("Please enter…", "Please select…"). The ethnic group helper is "check all that apply" — all lowercase, no capital. One exception within the same screen.

### Buttons
10. **Q2 inline Next button is undersized**: The inline "Next" button on Q2 (option e free-text) is `h-10 text-sm` (40px, 14px). Every other primary button is `h-12 text-base` (48px, 16px) via `ContinueButton`. Same visual intent, different size.

11. **Primary button label — "Continue" on Tenant form**: All screens say "Next"; Tenant form says "Continue". No functional reason for the difference — the user is advancing in both cases.

### Card / checkbox border radius
12. **CheckboxRow border-radius on Tenant form**: The ethnic group checkbox rows use `rounded-lg` (8px). OptionCards across Q1, Q2, and Background use `rounded-xl` (12px). Both are card-style interactive selection elements; the border-radius inconsistency is visible.

### Token usage
13. **No screen imports or uses the CSS variables from globals.css**: All per-screen components define their own local hex constants (`const INK = "#111827"` etc.). Only `app/page.tsx` uses `var(--color-*)`. The `C` object in `shared.tsx` mirrors the same values but is also not imported by any per-screen component. The design system tokens exist but are unused by individual screens.

---

## Recommendations

| # | Inconsistency | Recommendation | Rationale |
|---|---------------|----------------|-----------|
| 1 | Heading HTML tag (`<h1>` vs `<h2>`) | Standardise on `<h1>` for the main screen heading | There is only one heading per screen; `<h1>` is semantically correct. Update Intro, Resume, Last Job, Education, Tenant form to use `AssistantQuestion` or switch all to `<h1>`. |
| 2 | Handoff heading 24px vs 30px everywhere else | Change Handoff heading to `text-3xl` (30px) | The Handoff screen is a legitimate screen in the flow; its heading should match the design language of all preceding screens. |
| 3 | Sub-copy size (16px / 14px / 15px) | Standardise on `text-base` (16px) | Used on the majority of screens; `text-sm` on Education and `text-[15px]` on Handoff should be updated. |
| 4 | Sub-copy top margin (4px / 8px / 0) | Standardise on `mt-2` (8px) | `mt-2` is used on Last Job and gives slightly more breathing room between heading and sub-copy; cleaner than `mt-1`. |
| 5 | Education sub-copy below dropdown | Move the helper text to directly below the heading, before the dropdown | Consistent with every other screen and better information hierarchy — users need the "if in progress, select…" context before they interact with the dropdown, not after. |
| 6 | Education date labels UPPERCASE vs Last Job date labels sentence case | Standardise on `FieldLabel` (sentence case, 14px medium `#6b7280`) | Last Job's treatment is consistent with all other field labels in the codebase. Education's uppercase small-caps label only appears in two places (Education + Resume dividers) and is visually heavier than necessary for a sibling-input label. |
| 7 | Tenant form FieldQuestion vs standard FieldLabel | Decide: either promote `FieldQuestion` (15px ink, question format) to all screens, or revert Tenant form to use standard FieldLabel. | If the tenant form is meant to feel like a distinct "official form" section, keeping the heavier treatment is defensible — but document it as intentional. Otherwise standardise on `FieldLabel` across all screens. |
| 8 | Helper text size (14px on Education vs 12px on Tenant form) | Standardise on `text-xs` (12px) | Helper/hint text should be visually subordinate to both the label and the input; 12px serves that purpose. Education's `text-sm` helper competes with the field label it follows. |
| 9 | "check all that apply" all-lowercase | Capitalise to "Check all that apply" | Every other helper string starts with a capital. This appears to be an oversight. |
| 10 | Q2 inline Next button (`h-10 text-sm`) vs standard (`h-12 text-base`) | Update inline Next to match ContinueButton: `h-12 rounded-full text-base font-medium` | Users encounter identical CTA intent; different sizing creates visual inconsistency especially when transitioning from having just interacted with full-height buttons on Q1. |
| 11 | Tenant form button "Continue" vs "Next" everywhere else | Standardise on "Next" | "Continue" doesn't add meaning. All screens are simply advancing to the next step; "Next" is already established. |
| 12 | CheckboxRow `rounded-lg` vs OptionCard `rounded-xl` | Change Tenant form CheckboxRows to `rounded-xl` | `rounded-xl` is used by OptionCards, icon cards on Background, and entry cards on Resume. `rounded-lg` is a lone exception. |
| 13 | Screens hardcode hex values instead of using design tokens | Migrate local constants to CSS variables or to imports of the `C` object from `shared.tsx` | Centralised tokens mean a color change in one place propagates everywhere. Currently changing `--color-ink` in `globals.css` would only affect the stepper. |

---

## Summary counts

- **Heading tag inconsistency**: 3 patterns across 10 screens
- **Heading size inconsistency**: 1 outlier (Handoff, 24px)
- **Sub-copy size inconsistency**: 3 values (12px, 14px, 15px, 16px) across screens
- **Field label style inconsistency**: 3 visual treatments (standard FieldLabel, DateColumnLabel, FieldQuestion)
- **Button size inconsistency**: 1 outlier (Q2 inline Next)
- **Button label inconsistency**: 1 outlier (Tenant form "Continue")
- **Border-radius inconsistency**: 1 outlier (Tenant form CheckboxRow `rounded-lg`)
- **Token usage**: 0 of 9 per-screen components use the CSS variables; only page.tsx does
