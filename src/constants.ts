import type { SubjectRow } from "./types";

export const NAVY = "#213F68";
export const ORANGE = "#CF5512";

export const COLS = [
  "ARM", "TRT01A", "SAFFL", "ITTFL", "AETERM", "AEDECOD", "AESEV", "AESER",
  "AEREL", "AEACN", "AESTDTC", "AEENDTC", "CMDECOD", "CMTRT", "CMSTDTC", "CMENDTC",
] as const;

export const SUMMARY = {
  added: 260,
  removed: 78,
  modified: 914,
  topChangedCols: [
    { col: "ARM", changed: 220 },
    { col: "TRT01A", changed: 198 },
    { col: "AESEV", changed: 712 },
    { col: "AESER", changed: 141 },
    { col: "AEREL", changed: 288 },
  ],
  bullets: [
    "914 subjects changed; most differences were in ARM/TRT01A and AE fields.",
    "112 subjects had AESER changes; review downstream safety outputs.",
    "46 subjects had AESEV updates that could impact listings and narratives.",
    "260 new subjects appear in PRJ012; 78 in PRJ011 are missing in PRJ012.",
  ],
} as const;

export const SUBJECTS: SubjectRow[] = [
  { id: "SUBJ-0001", changeType: "Added", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "New USUBJID appears in PRJ012 (not present in PRJ011)", narrative: true, diff: [{ col: "ARM", q1: "—", q2: "Treatment" }, { col: "TRT01A", q1: "—", q2: "Drug X 100mg" }, { col: "SAFFL", q1: "—", q2: "Y" }] },
  { id: "SUBJ-10492", changeType: "Modified", fieldsChanged: 3, impact: "Medium", lastSeen: "PRJ012", notes: "AE updates: AESEV + AESER + AEENDTC", narrative: true, diff: [{ col: "AEDECOD", q1: "HEADACHE", q2: "HEADACHE" }, { col: "AESEV", q1: "MILD", q2: "MODERATE" }, { col: "AESER", q1: "N", q2: "Y" }, { col: "AEENDTC", q1: "2025-03-18", q2: "2025-03-20" }] },
  { id: "SUBJ-10922", changeType: "Modified", fieldsChanged: 8, impact: "High", lastSeen: "PRJ012", notes: "Treatment + multiple AE fields changed", narrative: false, diff: [{ col: "ARM", q1: "Placebo", q2: "Treatment" }, { col: "TRT01A", q1: "Placebo", q2: "Drug X 100mg" }, { col: "AESEV", q1: "MILD", q2: "SEVERE" }, { col: "AEREL", q1: "NOT RELATED", q2: "POSSIBLY RELATED" }, { col: "AEACN", q1: "NONE", q2: "DRUG WITHDRAWN" }, { col: "AESTDTC", q1: "2025-04-02", q2: "2025-04-01" }, { col: "AEDECOD", q1: "NAUSEA", q2: "NAUSEA" }] },
  { id: "SUBJ-10202", changeType: "Removed", fieldsChanged: 0, impact: "—", lastSeen: "PRJ011", notes: "USUBJID present in PRJ011 but missing in PRJ012", narrative: true, diff: [{ col: "SAFFL", q1: "Y", q2: "—" }] },
  { id: "SUBJ-10333", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes detected for selected fields", narrative: false, diff: [] },
];

export const CHANGE_STYLES: Record<import("./types").ChangeType, { pill: string; dot: string }> = {
  Added: { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Removed: { pill: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", dot: "bg-rose-500" },
  Modified: { pill: "bg-amber-50 text-amber-800 ring-1 ring-amber-200", dot: "bg-amber-500" },
  Unchanged: { pill: "bg-slate-50 text-slate-700 ring-1 ring-slate-200", dot: "bg-slate-400" },
};
