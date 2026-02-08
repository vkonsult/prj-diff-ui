import type { SubjectRow, FilterParams } from "./types";
import type { DiffCell } from "./types";

export function norm(v: unknown): string {
  return v === null ? "null" : v === undefined ? "" : String(v).trim();
}

export function isChanged(a: unknown, b: unknown): boolean {
  return norm(a) !== norm(b);
}

export function filterRows(rows: SubjectRow[], p: FilterParams): SubjectRow[] {
  const s = (p.search || "").trim().toLowerCase();
  return rows.filter((r) => {
    if (p.onlyNarrative && !r.narrative) return false;
    if (p.changeType !== "All" && r.changeType !== p.changeType) return false;
    if (p.onlyChanged && r.changeType === "Unchanged") return false;
    if (r.changeType === "Modified" && r.fieldsChanged < p.minChanges) return false;
    if (s && !r.id.toLowerCase().includes(s) && !r.notes.toLowerCase().includes(s)) return false;
    return true;
  });
}

export function computeDiff(diff: DiffCell[], selectedCols: string[], onlyChangedCols: boolean): DiffCell[] {
  const base = diff.filter((d) => selectedCols.includes(d.col));
  return onlyChangedCols ? base.filter((d) => isChanged(d.q1, d.q2)) : base;
}
