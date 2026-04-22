// Hardcoded resume surfaced in the Upload Resume sub-flow. Single source of
// truth so Q2 (Career Changer) can pre-fill from the same values the review
// screen displays.
export const HARDCODED_RESUME = {
  currentRole:     "Registered Nurse",
  currentEmployer: "Memorial Hospital",
  currentTenure:   "Present",
  previousRole:    "Staff Nurse",
  previousEmployer:"Riverside Clinic",
  previousTenure:  "2019 – 2022",
  educationDegree: "BSN",
  educationSchool: "Osmania University",
} as const
