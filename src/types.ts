export type ChangeType = "Added" | "Removed" | "Modified" | "Unchanged";

export type DiffCell = { col: string; q1: unknown; q2: unknown };

export type SubjectRow = {
  id: string;
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
