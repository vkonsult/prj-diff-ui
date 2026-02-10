import type { SubjectRow, PatientListQuery, PatientListRow } from "./types";

export const NAVY = "#213F68";
export const ORANGE = "#CF5512";

export const COLS = [
  "ARM", "TRT01A", "SAFFL", "ITTFL", "AETERM", "AEDECOD", "AESEV", "AESER",
  "AEREL", "AEACN", "AESTDTC", "AEENDTC", "CMDECOD", "CMTRT", "CMSTDTC", "CMENDTC",
] as const;

/** Dataset/table/column structure for column picker (descriptive labels + codes) */
export type ColumnDef = { code: string; label: string };
export type TableDef = { id: string; label: string; columns: ColumnDef[] };
export type DatasetDef = { id: "SDTM" | "ADaM"; label: string; tables: TableDef[] };

export const COLUMN_DATASETS: DatasetDef[] = [
  {
    id: "SDTM",
    label: "SDTM",
    tables: [
      {
        id: "DD",
        label: "Death Details (DD)",
        columns: [
          { code: "DDTERM", label: "Death Cause (DDTERM)" },
          { code: "DDSTDTC", label: "Death Date (DDSTDTC)" },
        ],
      },
      {
        id: "DM",
        label: "Demographics (DM)",
        columns: [
          { code: "ROWID", label: "Row Identifier (ROWID)" },
          { code: "STUDYID", label: "Study Identifier (STUDYID)" },
          { code: "DOMAIN", label: "Domain Abbreviation (DOMAIN)" },
          { code: "USUBJID", label: "Unique Subject Identifier (USUBJID)" },
          { code: "ARM", label: "Treatment Arm (ARM)" },
          { code: "TRT01A", label: "Actual Treatment (TRT01A)" },
          { code: "SAFFL", label: "Safety Population (SAFFL)" },
          { code: "ITTFL", label: "Intent-to-Treat (ITTFL)" },
        ],
      },
      {
        id: "AE",
        label: "Adverse Events (AE)",
        columns: [
          { code: "AETERM", label: "Reported Term (AETERM)" },
          { code: "AEDECOD", label: "Decoded Term (AEDECOD)" },
          { code: "AESEV", label: "Severity (AESEV)" },
          { code: "AESER", label: "Serious (AESER)" },
          { code: "AEREL", label: "Causality (AEREL)" },
          { code: "AEACN", label: "Action (AEACN)" },
          { code: "AESTDTC", label: "Start Date (AESTDTC)" },
          { code: "AEENDTC", label: "End Date (AEENDTC)" },
        ],
      },
      {
        id: "CM",
        label: "Concomitant Medications (CM)",
        columns: [
          { code: "CMDECOD", label: "Medication (CMDECOD)" },
          { code: "CMTRT", label: "Treatment (CMTRT)" },
          { code: "CMSTDTC", label: "Start Date (CMSTDTC)" },
          { code: "CMENDTC", label: "End Date (CMENDTC)" },
        ],
      },
    ],
  },
  {
    id: "ADaM",
    label: "ADaM",
    tables: [
      {
        id: "ADSL",
        label: "Subject-Level Analysis (ADSL)",
        columns: [
          { code: "STUDYID", label: "Study Identifier (STUDYID)" },
          { code: "USUBJID", label: "Unique Subject Identifier (USUBJID)" },
          { code: "ARM", label: "Treatment Arm (ARM)" },
          { code: "SAFFL", label: "Safety Flag (SAFFL)" },
        ],
      },
    ],
  },
];

/** All column codes from COLUMN_DATASETS (for backward compatibility) */
export const ALL_COLUMN_CODES = COLUMN_DATASETS.flatMap((d) =>
  d.tables.flatMap((t) => t.columns.map((c) => c.code))
);

/** Map column code → user-friendly label (first occurrence in COLUMN_DATASETS). Use everywhere we display column names. */
const _codeToLabel = new Map<string, string>();
for (const d of COLUMN_DATASETS) {
  for (const t of d.tables) {
    for (const c of t.columns) {
      if (!_codeToLabel.has(c.code)) _codeToLabel.set(c.code, c.label);
    }
  }
}
export function getColumnLabel(code: string): string {
  return _codeToLabel.get(code) ?? code;
}

/** Domain options for filter dropdown */
export const DOMAINS = [
  { value: "", label: "All domains" },
  { value: "DM", label: "Demographics (DM)" },
  { value: "AE", label: "Adverse Events (AE)" },
  { value: "CM", label: "Concomitant Meds (CM)" },
  { value: "DD", label: "Death Details (DD)" },
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
    "914 subjects changed; most differences were in Treatment Arm (ARM)/Actual Treatment (TRT01A) and Adverse Event fields.",
    "112 subjects had Serious (AESER) changes; review downstream safety outputs.",
    "46 subjects had Severity (AESEV) updates that could impact listings and narratives.",
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

/** Default criteria (read-only) for PRJ011 Existing panel */
export const DEFAULT_CRITERIA: PatientListQuery[] = [
  {
    id: "dc-1",
    title: "Death",
    dataset: "SDTM",
    freeText: "Patients who died during the study within 30 days of last dose, regardless of cause",
    logic: "SELECT ROWID, USUBJID, DOTESTCD, DOTEST, DDORRES, DDSTRESC, DDDTC, DODY FROM [Foghorn_SDTM].[dd] WHERE DDTESTCD = 'PRCDTH'",
  },
  {
    id: "dc-2",
    title: "AESI 1, AESI 2, AESI 3, AESI 4",
    dataset: "SDTM",
    freeText: "Patients with any of the predefined AESI events",
    logic: "SELECT ROWID, USUBJID, AETERM, AEDECOD, AESEV, AESER FROM [Foghorn_SDTM].[ae] WHERE AEDECOD IN ('AESI1','AESI2','AESI3','AESI4')",
  },
  {
    id: "dc-3",
    title: "AE - Discontinuation of Drug",
    dataset: "SDTM",
    freeText: "Patients who discontinued study drug due to an adverse event",
    logic: "SELECT ROWID, USUBJID, AEACN, AETERM FROM [Foghorn_SDTM].[ae] WHERE AEACN = 'DRUG WITHDRAWN'",
  },
];

/** Initial editable list of query (PRJ012 New) - same structure, can be edited */
export const INITIAL_PATIENT_LIST_QUERIES: PatientListQuery[] = DEFAULT_CRITERIA.map((q) => ({ ...q, id: `q-${q.id}` }));

/** Mock patients for PRJ012 New panel */
const _newRows: PatientListRow[] = [
  { subjid: "C-700-01-007-025", status: "green", age: 45, sex: "M", race: "White", death: true, sae: true, aeToDc: false, narrative: true },
  { subjid: "C-700-01-007-019", status: "yellow", age: 52, sex: "F", race: "Asian", death: false, sae: false, aeToDc: true, narrative: false },
  { subjid: "C-700-01-007-033", status: "red", age: 38, sex: "M", race: "Black", death: false, sae: true, aeToDc: true, narrative: true },
  { subjid: "C-700-01-008-001", status: "green", age: 61, sex: "F", race: "White", death: true, sae: true, aeToDc: false, narrative: false },
  { subjid: "C-700-01-008-012", status: "yellow", age: 44, sex: "M", race: "Other", death: false, sae: false, aeToDc: false, narrative: true },
];
for (let i = 6; i <= 40; i++) {
  _newRows.push({
    subjid: `C-700-01-008-${String(i).padStart(3, "0")}`,
    status: i % 3 === 0 ? "red" : i % 3 === 1 ? "yellow" : "green",
    age: 30 + (i % 40),
    sex: i % 2 ? "M" : "F",
    race: ["White", "Asian", "Black", "Other"][i % 4],
    death: i % 5 === 0,
    sae: i % 4 === 0,
    aeToDc: i % 6 === 0,
    narrative: i % 3 === 0,
  });
}
export const PATIENT_LIST_NEW = _newRows;

/** Mock patients for PRJ011 Existing panel */
const _existingRows: PatientListRow[] = [
  { subjid: "C-700-01-007-025", status: "green", age: 45, sex: "M", race: "White", death: true, sae: true, aeToDc: false, narrative: true },
  { subjid: "C-700-01-007-019", status: "yellow", age: 52, sex: "F", race: "Asian", death: false, sae: false, aeToDc: true, narrative: false },
  { subjid: "C-700-01-007-033", status: "red", age: 38, sex: "M", race: "Black", death: false, sae: true, aeToDc: true, narrative: true },
  { subjid: "C-700-01-008-001", status: "green", age: 61, sex: "F", race: "White", death: true, sae: true, aeToDc: false, narrative: false },
];
for (let i = 5; i <= 30; i++) {
  _existingRows.push({
    subjid: `C-700-01-007-${String(i).padStart(3, "0")}`,
    status: i % 3 === 0 ? "red" : i % 3 === 1 ? "yellow" : "green",
    age: 28 + (i % 45),
    sex: i % 2 ? "M" : "F",
    race: ["White", "Asian", "Black", "Other"][i % 4],
    death: i % 6 === 0,
    sae: i % 5 === 0,
    aeToDc: i % 7 === 0,
    narrative: i % 4 === 0,
  });
}
export const PATIENT_LIST_EXISTING = _existingRows;

/** Narrative tab: key-value block (label + value rows) */
export const NARRATIVE_KEY_VALUES = [
  { label: "Study (protocol)", value: "C-700-01-008-012 - M1" },
  { label: "Subject identifier / country", value: "287-103, BRL" },
  { label: "Subject demographics", value: "98-year-old white female" },
  { label: "Disease under study specific disease type", value: "Epithelial ovarian cancer" },
  { label: "Treatment group", value: "Carboplatin + Gemcitabine" },
  { label: "Date of first infusion of study drug", value: "23-Dec-2019" },
  { label: "Date of last discontinuation of study drug", value: "14-Apr-2021" },
  { label: "Reason of discontinuation from treatment", value: "Progressive disease" },
  { label: "Criteria met for narratives", value: "Yes" },
] as const;

/** Narrative tab: event summary table */
export const NARRATIVE_EVENT_HEADERS = ["TEAE", "AE Leading to Death", "SAE", "AEQC", "AEI", "Onset (Study Day)", "Causality", "Outcome", "Action Taken Study Drug"] as const;
export const NARRATIVE_EVENT_ROW = ["Pseudopregnancy", "", "✓", "ADDQC", "✓", "30-Sep-2022", "Probably related", "Recovered/Resolved", "Not applicable"] as const;
export const NARRATIVE_ABBREVS = ["AE = adverse event", "SAE = serious adverse event", "TEAE = treatment-emergent adverse event", "AEQC = AE of special interest", "AEI = AE leading to discontinuation"] as const;

/** Narrative paragraph segment: normal text or highlighted (modified = rose in PRJ012, new = emerald in PRJ011) */
export type NarrativeSegment = { text: string; highlight?: "modified" | "new" };
export const NARRATIVE_PARAGRAPHS: NarrativeSegment[][] = [
  [
    { text: "The subject received " },
    { text: "carboplatin (23-Dec-2019 to 03-Feb-2021; 3 cycles)", highlight: "modified" },
    { text: " and " },
    { text: "gemcitabine (23-Dec-2020 to 14-Apr-2021; 6 cycles)", highlight: "modified" },
    { text: " for epithelial ovarian cancer. Prior therapies included " },
    { text: "gemcitabine (03-Sep-2019 to 21-Nov-2019; 6 cycles)", highlight: "new" },
    { text: "." },
  ],
  [
    { text: "On 30-Sep-2022 the subject experienced pseudopregnancy, assessed as probably related to study drug, serious. Outcome was recovered/resolved. No action taken with study drug." },
  ],
  [
    { text: "No other clinically significant AEs were reported. The subject discontinued due to progressive disease on 14-Apr-2021." },
  ],
];

export const CHANGE_STYLES: Record<import("./types").ChangeType, { pill: string; dot: string }> = {
  Added: { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Removed: { pill: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", dot: "bg-rose-500" },
  Modified: { pill: "bg-amber-50 text-amber-800 ring-1 ring-amber-200", dot: "bg-amber-500" },
  Unchanged: { pill: "bg-slate-50 text-slate-700 ring-1 ring-slate-200", dot: "bg-slate-400" },
};
