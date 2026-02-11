export type ChangeType = "Added" | "Removed" | "Modified" | "Unchanged";

export type DiffCell = { col: string; q1: unknown; q2: unknown };

export type SubjectRow = {
  id: string;
  /** Unique key when multiple rows share the same USUBJID (e.g. one row per AE record) */
  rowKey?: string;
  changeType: ChangeType;
  fieldsChanged: number;
  impact: "High" | "Medium" | "Low" | "—";
  lastSeen: "PRJ011" | "PRJ012";
  notes: string;
  narrative?: boolean;
  diff: DiffCell[];
};

export type FilterParams = {
  search: string;
  changeType: "All" | ChangeType;
  onlyChanged: boolean;
  minChanges: number;
  onlyNarrative: boolean;
};

/** Patient list query block (editable or read-only) */
export type PatientListQuery = {
  id: string;
  title: string;
  dataset: "SDTM" | "ADaM";
  freeText: string;
  logic: string;
};

/** Row in the List of Patients table */
export type PatientListRow = {
  subjid: string;
  status: "green" | "yellow" | "red";
  age: number;
  sex: string;
  race: string;
  death: boolean;
  sae: boolean;
  aeToDc: boolean;
  narrative?: boolean;
};
