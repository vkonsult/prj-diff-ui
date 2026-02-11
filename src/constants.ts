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

/** Row for the Dataset Files table (same columns as reference image) */
export type DataChangeRow = {
  id: string;
  fileName: string;
  projectName: string;
  fileType: string;
  fileSize: string;
  uploadedDate: string;
  uploadedBy: string;
  /** Difference pill: Added | Modified | Removed | Unchanged */
  changeType: import("./types").ChangeType;
  /** Tooltip for File Size column */
  tooltipFileSize?: string;
  /** Tooltip for Uploaded Date column */
  tooltipUploadedDate?: string;
  /** Tooltip for Uploaded By column */
  tooltipUploadedBy?: string;
  /** Old values for Modified rows (show "Old value: X" tooltip on changed cells) */
  oldFileName?: string;
  oldFileSize?: string;
  oldUploadedDate?: string;
  oldUploadedBy?: string;
};

export const DATA_CHANGES_TABLE: DataChangeRow[] = [
  { id: "adae", fileName: "ADaM Adverse Events (adae)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "9072kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Modified", oldFileName: "ADaM Adverse Events (adae) v1", oldFileSize: "8200kb", tooltipFileSize: "9,072 KB uncompressed", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "adcm", fileName: "ADaM Concomitant Medications (adcm)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "21248kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Unchanged", tooltipFileSize: "21,248 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "addc", fileName: "Analysis Data Model - Disease Characteristics (ADDC)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "792kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Added", tooltipFileSize: "792 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "adex", fileName: "ADaM Exposure (ADEX)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "4520kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Unchanged", tooltipFileSize: "4,520 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "admh", fileName: "ADaM Medical History (ADMH)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "1200kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Removed", tooltipFileSize: "1,200 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "adpr", fileName: "ADaM Procedures (ADPR)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "890kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Unchanged", tooltipFileSize: "890 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "adsl", fileName: "ADaM Subject Level (adsl)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "18500kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Modified", oldFileSize: "17200kb", oldUploadedDate: "1/15/2026, 10:00:00 AM", tooltipFileSize: "18,500 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "dm", fileName: "Demographics (DM)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "3200kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Modified", oldFileName: "Demographics (dm)", oldFileSize: "3000kb", tooltipFileSize: "3,200 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "ae", fileName: "Adverse Events (AE)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "8500kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Unchanged", tooltipFileSize: "8,500 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "cm", fileName: "Concomitant Medications (CM)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "2100kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Added", tooltipFileSize: "2,100 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "ds", fileName: "Disposition (DS)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "1100kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Unchanged", tooltipFileSize: "1,100 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
  { id: "vs", fileName: "Vital Signs (VS)", projectName: "PRJ012", fileType: "sas7bdat", fileSize: "3400kb", uploadedDate: "1/16/2026, 1:38:30 PM", uploadedBy: "Kelly Danyow", changeType: "Unchanged", tooltipFileSize: "3,400 KB", tooltipUploadedDate: "Uploaded on January 16, 2026 at 1:38:30 PM", tooltipUploadedBy: "Kelly Danyow (last modified this file)" },
];

/** Patient Profile (Diff) tab: multiple rows per USUBJID, AE domain focus. Most Matched, few Changed, 2 Added, 1 Removed. */
export const SUBJECTS: SubjectRow[] = [
  // 2 Added
  { rowKey: "ae-add-1", id: "SUBJ-0001", changeType: "Added", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "New AE in PRJ012", narrative: true, diff: [{ col: "AETERM", q1: "—", q2: "NAUSEA" }, { col: "AEDECOD", q1: "—", q2: "NAUSEA" }, { col: "AESEV", q1: "—", q2: "MILD" }, { col: "AESER", q1: "—", q2: "N" }, { col: "AEREL", q1: "—", q2: "POSSIBLY RELATED" }, { col: "AEACN", q1: "—", q2: "NONE" }, { col: "AESTDTC", q1: "—", q2: "2025-03-10" }, { col: "AEENDTC", q1: "—", q2: "2025-03-15" }] },
  { rowKey: "ae-add-2", id: "SUBJ-10492", changeType: "Added", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "New AE in PRJ012", narrative: false, diff: [{ col: "AETERM", q1: "—", q2: "FATIGUE" }, { col: "AEDECOD", q1: "—", q2: "FATIGUE" }, { col: "AESEV", q1: "—", q2: "MODERATE" }, { col: "AESER", q1: "—", q2: "N" }, { col: "AEREL", q1: "—", q2: "NOT RELATED" }, { col: "AEACN", q1: "—", q2: "NONE" }, { col: "AESTDTC", q1: "—", q2: "2025-04-01" }, { col: "AEENDTC", q1: "—", q2: "2025-04-05" }] },
  // 1 Removed
  { rowKey: "ae-rem-1", id: "SUBJ-10202", changeType: "Removed", fieldsChanged: 0, impact: "—", lastSeen: "PRJ011", notes: "AE in PRJ011 only", narrative: true, diff: [{ col: "AETERM", q1: "HEADACHE", q2: "—" }, { col: "AEDECOD", q1: "HEADACHE", q2: "—" }, { col: "AESEV", q1: "MILD", q2: "—" }, { col: "AESER", q1: "N", q2: "—" }, { col: "AEREL", q1: "NOT RELATED", q2: "—" }, { col: "AEACN", q1: "NONE", q2: "—" }, { col: "AESTDTC", q1: "2025-02-01", q2: "—" }, { col: "AEENDTC", q1: "2025-02-10", q2: "—" }] },
  // 3 Modified
  { rowKey: "ae-mod-1", id: "SUBJ-0001", changeType: "Modified", fieldsChanged: 2, impact: "Medium", lastSeen: "PRJ012", notes: "AESEV and AESER updated", narrative: true, diff: [{ col: "AETERM", q1: "HEADACHE", q2: "HEADACHE" }, { col: "AEDECOD", q1: "HEADACHE", q2: "HEADACHE" }, { col: "AESEV", q1: "MILD", q2: "MODERATE" }, { col: "AESER", q1: "N", q2: "Y" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-03-01", q2: "2025-03-01" }, { col: "AEENDTC", q1: "2025-03-18", q2: "2025-03-20" }] },
  { rowKey: "ae-mod-2", id: "SUBJ-10492", changeType: "Modified", fieldsChanged: 1, impact: "Low", lastSeen: "PRJ012", notes: "AEREL updated", narrative: true, diff: [{ col: "AETERM", q1: "NAUSEA", q2: "NAUSEA" }, { col: "AEDECOD", q1: "NAUSEA", q2: "NAUSEA" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "POSSIBLY RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-03-05", q2: "2025-03-05" }, { col: "AEENDTC", q1: "2025-03-12", q2: "2025-03-12" }] },
  { rowKey: "ae-mod-3", id: "SUBJ-10922", changeType: "Modified", fieldsChanged: 2, impact: "Medium", lastSeen: "PRJ012", notes: "AESEV and AEACN updated", narrative: false, diff: [{ col: "AETERM", q1: "NAUSEA", q2: "NAUSEA" }, { col: "AEDECOD", q1: "NAUSEA", q2: "NAUSEA" }, { col: "AESEV", q1: "MILD", q2: "SEVERE" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "DRUG WITHDRAWN" }, { col: "AESTDTC", q1: "2025-04-02", q2: "2025-04-01" }, { col: "AEENDTC", q1: "2025-04-10", q2: "2025-04-10" }] },
  // 14 Unchanged (Matched) – same USUBJID repeated for multiple AE records
  { rowKey: "ae-unch-1", id: "SUBJ-0001", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "COUGH", q2: "COUGH" }, { col: "AEDECOD", q1: "COUGH", q2: "COUGH" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-02-01", q2: "2025-02-01" }, { col: "AEENDTC", q1: "2025-02-14", q2: "2025-02-14" }] },
  { rowKey: "ae-unch-2", id: "SUBJ-0001", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "RASH", q2: "RASH" }, { col: "AEDECOD", q1: "RASH", q2: "RASH" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "POSSIBLY RELATED", q2: "POSSIBLY RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-02-15", q2: "2025-02-15" }, { col: "AEENDTC", q1: "2025-03-01", q2: "2025-03-01" }] },
  { rowKey: "ae-unch-3", id: "SUBJ-0001", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "PYREXIA", q2: "PYREXIA" }, { col: "AEDECOD", q1: "PYREXIA", q2: "PYREXIA" }, { col: "AESEV", q1: "MODERATE", q2: "MODERATE" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-03-20", q2: "2025-03-20" }, { col: "AEENDTC", q1: "2025-03-25", q2: "2025-03-25" }] },
  { rowKey: "ae-unch-4", id: "SUBJ-10492", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "HEADACHE", q2: "HEADACHE" }, { col: "AEDECOD", q1: "HEADACHE", q2: "HEADACHE" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-01-10", q2: "2025-01-10" }, { col: "AEENDTC", q1: "2025-01-18", q2: "2025-01-18" }] },
  { rowKey: "ae-unch-5", id: "SUBJ-10492", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "BACK PAIN", q2: "BACK PAIN" }, { col: "AEDECOD", q1: "BACK PAIN", q2: "BACK PAIN" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-02-01", q2: "2025-02-01" }, { col: "AEENDTC", q1: "2025-02-20", q2: "2025-02-20" }] },
  { rowKey: "ae-unch-6", id: "SUBJ-10492", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "DIZZINESS", q2: "DIZZINESS" }, { col: "AEDECOD", q1: "DIZZINESS", q2: "DIZZINESS" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "POSSIBLY RELATED", q2: "POSSIBLY RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-03-01", q2: "2025-03-01" }, { col: "AEENDTC", q1: "2025-03-08", q2: "2025-03-08" }] },
  { rowKey: "ae-unch-7", id: "SUBJ-10922", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "NAUSEA", q2: "NAUSEA" }, { col: "AEDECOD", q1: "NAUSEA", q2: "NAUSEA" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-03-15", q2: "2025-03-15" }, { col: "AEENDTC", q1: "2025-03-22", q2: "2025-03-22" }] },
  { rowKey: "ae-unch-8", id: "SUBJ-10922", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "VOMITING", q2: "VOMITING" }, { col: "AEDECOD", q1: "VOMITING", q2: "VOMITING" }, { col: "AESEV", q1: "MODERATE", q2: "MODERATE" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "POSSIBLY RELATED", q2: "POSSIBLY RELATED" }, { col: "AEACN", q1: "DOSE REDUCED", q2: "DOSE REDUCED" }, { col: "AESTDTC", q1: "2025-04-05", q2: "2025-04-05" }, { col: "AEENDTC", q1: "2025-04-12", q2: "2025-04-12" }] },
  { rowKey: "ae-unch-9", id: "SUBJ-10333", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "HEADACHE", q2: "HEADACHE" }, { col: "AEDECOD", q1: "HEADACHE", q2: "HEADACHE" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-01-05", q2: "2025-01-05" }, { col: "AEENDTC", q1: "2025-01-12", q2: "2025-01-12" }] },
  { rowKey: "ae-unch-10", id: "SUBJ-10333", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "ARTHRALGIA", q2: "ARTHRALGIA" }, { col: "AEDECOD", q1: "ARTHRALGIA", q2: "ARTHRALGIA" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-02-10", q2: "2025-02-10" }, { col: "AEENDTC", q1: "2025-02-28", q2: "2025-02-28" }] },
  { rowKey: "ae-unch-11", id: "SUBJ-10333", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "INSOMNIA", q2: "INSOMNIA" }, { col: "AEDECOD", q1: "INSOMNIA", q2: "INSOMNIA" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-03-01", q2: "2025-03-01" }, { col: "AEENDTC", q1: "2025-03-10", q2: "2025-03-10" }] },
  { rowKey: "ae-unch-12", id: "SUBJ-0001", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "DYSPEPSIA", q2: "DYSPEPSIA" }, { col: "AEDECOD", q1: "DYSPEPSIA", q2: "DYSPEPSIA" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-04-01", q2: "2025-04-01" }, { col: "AEENDTC", q1: "2025-04-08", q2: "2025-04-08" }] },
  { rowKey: "ae-unch-13", id: "SUBJ-10492", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "UPPER RESPIRATORY INFECTION", q2: "UPPER RESPIRATORY INFECTION" }, { col: "AEDECOD", q1: "UPPER RESPIRATORY INFECTION", q2: "UPPER RESPIRATORY INFECTION" }, { col: "AESEV", q1: "MILD", q2: "MILD" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "NOT RELATED", q2: "NOT RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-04-01", q2: "2025-04-01" }, { col: "AEENDTC", q1: "2025-04-15", q2: "2025-04-15" }] },
  { rowKey: "ae-unch-14", id: "SUBJ-10922", changeType: "Unchanged", fieldsChanged: 0, impact: "—", lastSeen: "PRJ012", notes: "No changes", narrative: false, diff: [{ col: "AETERM", q1: "FATIGUE", q2: "FATIGUE" }, { col: "AEDECOD", q1: "FATIGUE", q2: "FATIGUE" }, { col: "AESEV", q1: "MODERATE", q2: "MODERATE" }, { col: "AESER", q1: "N", q2: "N" }, { col: "AEREL", q1: "POSSIBLY RELATED", q2: "POSSIBLY RELATED" }, { col: "AEACN", q1: "NONE", q2: "NONE" }, { col: "AESTDTC", q1: "2025-04-20", q2: "2025-04-20" }, { col: "AEENDTC", q1: "2025-04-28", q2: "2025-04-28" }] },
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

/** Return 2 or 3 true values for death, sae, aeToDc (randomly by seed). Each row has at least 2 TRUE. */
function randomTwoOrThreeTrue(seed: number): { death: boolean; sae: boolean; aeToDc: boolean } {
  const n = 2 + (seed % 2); // 2 or 3 true
  const whichFalse = seed % 3; // 0=death, 1=sae, 2=aeToDc
  return {
    death: n === 3 || whichFalse !== 0,
    sae: n === 3 || whichFalse !== 1,
    aeToDc: n === 3 || whichFalse !== 2,
  };
}

/** Mock patients for PRJ012 New panel: 29 rows (30 total with 1 Removed). Each row has 2+ TRUE in Death/SAE/AE to DC. */
const _newRows: PatientListRow[] = [];
for (let i = 1; i <= 29; i++) {
  const subjid = `C-700-01-008-${String(i).padStart(3, "0")}`;
  const flags = randomTwoOrThreeTrue(i * 7 + 11);
  _newRows.push({
    subjid,
    status: i % 3 === 0 ? "red" : i % 3 === 1 ? "yellow" : "green",
    age: 28 + (i % 45),
    sex: i % 2 ? "M" : "F",
    race: ["White", "Asian", "Black", "Other"][i % 4],
    death: flags.death,
    sae: flags.sae,
    aeToDc: flags.aeToDc,
    narrative: i % 4 === 0,
  });
}
// One Modified row: Death TRUE in PRJ012 (new), FALSE in PRJ011 (old)
_newRows[0] = { ..._newRows[0], death: true };
export const PATIENT_LIST_NEW = _newRows;

/** Mock patients for PRJ011 Existing panel: 27 overlapping NEW + 1 Removed. Each row has 2+ TRUE. */
const _existingRows: PatientListRow[] = [];
for (let i = 1; i <= 27; i++) {
  const subjid = `C-700-01-008-${String(i).padStart(3, "0")}`;
  const flags = randomTwoOrThreeTrue(i * 13 + 17);
  _existingRows.push({
    subjid,
    status: i % 3 === 0 ? "red" : i % 3 === 1 ? "yellow" : "green",
    age: 28 + (i % 45),
    sex: i % 2 ? "M" : "F",
    race: ["White", "Asian", "Black", "Other"][i % 4],
    death: flags.death,
    sae: flags.sae,
    aeToDc: flags.aeToDc,
    narrative: i % 4 === 0,
  });
}
// C-700-01-008-001: old value Death FALSE (existing), new value TRUE (new) → Modified; keep 2+ TRUE
_existingRows[0] = { ..._existingRows[0], death: false, sae: true, aeToDc: true };
// Removed: in PRJ011 but not in PRJ012 (different study id); 2+ TRUE
_existingRows.push({
  subjid: "C-700-01-007-099",
  status: "green",
  age: 41,
  sex: "M",
  race: "White",
  death: true,
  sae: true,
  aeToDc: false,
  narrative: false,
});
export const PATIENT_LIST_EXISTING = _existingRows;

/** Narrative tab: key-value block (label + value rows + difference type). oldValue = previous value for Modified/Removed. */
export const NARRATIVE_KEY_VALUES: {
  label: string;
  value: string;
  changeType: import("./types").ChangeType;
  oldValue?: string;
}[] = [
  { label: "Study (protocol)", value: "C-700-01-008-012 - M1", changeType: "Unchanged" },
  { label: "Subject identifier / country", value: "287-103, BRL", changeType: "Modified", oldValue: "SubjectId, Country" },
  { label: "Subject demographics", value: "98-year-old white female", changeType: "Unchanged" },
  { label: "Disease under study specific disease type", value: "Epithelial ovarian cancer", changeType: "Unchanged" },
  { label: "Treatment group", value: "Carboplatin + Gemcitabine", changeType: "Modified", oldValue: "Treatment group description" },
  { label: "Date of first infusion of study drug", value: "23-Dec-2019", changeType: "Unchanged" },
  { label: "Date of last discontinuation of study drug", value: "14-Apr-2021", changeType: "Unchanged" },
  { label: "Reason of discontinuation from treatment", value: "Progressive disease", changeType: "Removed", oldValue: "Progressive disease" },
  { label: "Criteria met for narratives", value: "Yes", changeType: "Added" },
];

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

/** Difference pill: lighter colors, dark text, darker border. Same for tables and filter. */
export const DIFFERENCE_PILL_STYLES: Record<import("./types").ChangeType, { pill: string; dot: string }> = {
  Added: { pill: "bg-red-100 text-red-800 ring-2 ring-red-300", dot: "bg-red-500" },
  Removed: { pill: "bg-slate-200 text-slate-700 ring-2 ring-slate-400", dot: "bg-slate-500" },
  Modified: { pill: "bg-amber-100 text-amber-800 ring-2 ring-amber-300", dot: "bg-amber-500" },
  Unchanged: { pill: "bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300", dot: "bg-emerald-500" },
};

/** Row for Narratives list changes table */
export type NarrativeListRow = {
  id: string;
  narrativeName: string;
  versions: string;
  progress: string;
  progressPct: number;
  changeType: import("./types").ChangeType;
  /** Old values for Modified rows (tooltip "Old value: X" on changed cells) */
  oldNarrativeName?: string;
  oldVersions?: string;
  oldProgress?: string;
};

export const NARRATIVES_LIST: NarrativeListRow[] = [
  { id: "n1", narrativeName: "IMGN853-0419-019-108", versions: "v2", progress: "Completed", progressPct: 100, changeType: "Modified", oldNarrativeName: "IMGN853-0419-019-108 (draft)", oldVersions: "v1", oldProgress: "In progress" },
  { id: "n2", narrativeName: "IMGN853-0419-019-112", versions: "v1", progress: "Completed", progressPct: 100, changeType: "Unchanged" },
  { id: "n3", narrativeName: "IMGN853-0419-020-201", versions: "", progress: "Completed", progressPct: 100, changeType: "Added" },
  { id: "n4", narrativeName: "IMGN853-0419-018-099", versions: "v1", progress: "Completed", progressPct: 100, changeType: "Removed" },
  { id: "n5", narrativeName: "IMGN853-0419-021-305", versions: "v2", progress: "Completed", progressPct: 100, changeType: "Unchanged" },
  { id: "n6", narrativeName: "IMGN853-0419-022-410", versions: "", progress: "Completed", progressPct: 100, changeType: "Added" },
];
