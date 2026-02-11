import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  ArrowRight,
  Check,
} from "lucide-react";
import { ORANGE } from "../constants";
import {
  INITIAL_PATIENT_LIST_QUERIES,
  PATIENT_LIST_NEW,
  PATIENT_LIST_EXISTING,
} from "../constants";
import { DifferencePill } from "./DifferencePill";
import { ChangeTypeFilter } from "./ChangeTypeFilter";
import { CompareModeFilterBox } from "./CompareModeFilterBox";
import { YellowTooltip } from "./YellowTooltip";
import type { PatientListQuery, PatientListRow } from "../types";
import type { ChangeType } from "../types";
import type { FilterParams } from "../types";

function QueryBlockEditable({
  q,
  onUpdate,
  onRun,
}: {
  q: PatientListQuery;
  onUpdate: (id: string, upd: Partial<PatientListQuery>) => void;
  onRun: (id: string) => void;
}) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-900">{q.title}</span>
        <button
          type="button"
          className="rounded p-0.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          aria-label="Edit query"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-2">
        <label className="text-xs font-medium text-slate-600">Dataset</label>
        <select
          value={q.dataset}
          onChange={(e) =>
            onUpdate(q.id, { dataset: e.target.value as "SDTM" | "ADaM" })
          }
          className="mt-0.5 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800"
        >
          <option value="SDTM">SDTM</option>
          <option value="ADaM">ADaM</option>
        </select>
      </div>
      <div className="mt-2">
        <label className="text-xs font-medium text-slate-600">Free Text</label>
        <div className="mt-0.5 flex gap-1">
          <input
            type="text"
            value={q.freeText}
            onChange={(e) => onUpdate(q.id, { freeText: e.target.value })}
            className="min-w-0 flex-1 rounded border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-800"
            placeholder="e.g. Patients who died during the study..."
          />
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-white"
            style={{ backgroundColor: ORANGE }}
            aria-label="Apply"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-2">
        <label className="text-xs font-medium text-slate-600">Logic</label>
        <pre className="mt-0.5 overflow-x-auto rounded border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs text-slate-700">
          {q.logic}
        </pre>
      </div>
      <div className="mt-2">
        <button
          type="button"
          onClick={() => onRun(q.id)}
          className="rounded bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
          aria-label={`Run ${q.title}`}
        >
          RUN
        </button>
      </div>
    </div>
  );
}

function PatientTable({
  rows,
  showSort,
  oldRowsBySubjid,
  newSubjidSet,
}: {
  rows: PatientListRow[];
  showSort?: boolean;
  oldRowsBySubjid?: Record<string, PatientListRow>;
  /** Set of SUBJIDs in the new list; rows not in this set are Removed */
  newSubjidSet?: Set<string>;
}) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    return [...rows].sort((a, b) => {
      const ak = (a as Record<string, unknown>)[sortKey];
      const bk = (b as Record<string, unknown>)[sortKey];
      if (typeof ak === "number" && typeof bk === "number") return ak - bk;
      return String(ak).localeCompare(String(bk));
    });
  }, [rows, sortKey]);

  const getOldValueDisplay = (
    row: PatientListRow,
    field: keyof PatientListRow
  ): string | undefined => {
    if (!oldRowsBySubjid) return undefined;
    const oldRow = oldRowsBySubjid[row.subjid];
    if (!oldRow) return undefined;
    const a = row[field];
    const b = oldRow[field];
    const changed =
      typeof a === "boolean" && typeof b === "boolean"
        ? a !== b
        : String(a) !== String(b);
    if (!changed) return undefined;
    const raw = b;
    if (typeof raw === "boolean") return raw ? "Yes" : "No";
    if (raw === undefined || raw === null) return "—";
    return String(raw);
  };

  const getDifferenceType = (row: PatientListRow): ChangeType => {
    if (newSubjidSet && !newSubjidSet.has(row.subjid)) return "Removed";
    if (!oldRowsBySubjid) return "Unchanged";
    const oldRow = oldRowsBySubjid[row.subjid];
    if (!oldRow) return "Added";
    const keys: (keyof PatientListRow)[] = ["age", "sex", "race", "death", "sae", "aeToDc"];
    const changed = keys.some((k) => {
      const a = row[k];
      const b = oldRow[k];
      if (typeof a === "boolean" && typeof b === "boolean") return a !== b;
      return String(a) !== String(b);
    });
    return changed ? "Modified" : "Unchanged";
  };

  const Header = ({ col, label }: { col: string; label: string }) => (
    <th className="border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-left text-xs font-semibold text-slate-700">
      {showSort ? (
        <button
          type="button"
          className="flex items-center gap-0.5 hover:text-slate-900"
          onClick={() => setSortKey((k) => (k === col ? null : col))}
        >
          {label}
          <ChevronDown className="h-3 w-3 opacity-70" />
        </button>
      ) : (
        label
      )}
    </th>
  );

  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="w-full min-w-[600px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="border-b border-slate-200 bg-slate-50 px-2 py-1.5 text-left text-xs font-semibold text-slate-700">
              Difference
            </th>
            <Header col="subjid" label="SUBJID" />
            <Header col="age" label="Age" />
            <Header col="sex" label="Sex" />
            <Header col="race" label="Race" />
            <Header col="death" label="Death" />
            <Header col="sae" label="SAE" />
            <Header col="aeToDc" label="AE to DC" />
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => (
            <tr
              key={r.subjid}
              className={`border-b hover:bg-slate-50 ${
                getDifferenceType(r) === "Removed"
                  ? "border-dotted border-slate-300 line-through text-slate-500"
                  : "border-slate-100"
              }`}
            >
              <td className="px-2 py-1.5">
                <DifferencePill label={getDifferenceType(r)} />
              </td>
              <td className="px-2 py-1.5 text-slate-800">{r.subjid}</td>
              <td className="px-2 py-1.5 text-slate-700">
                <YellowTooltip oldValue={getDifferenceType(r) === "Modified" ? getOldValueDisplay(r, "age") : undefined}>
                  {r.age}
                </YellowTooltip>
              </td>
              <td className="px-2 py-1.5 text-slate-700">
                <YellowTooltip oldValue={getDifferenceType(r) === "Modified" ? getOldValueDisplay(r, "sex") : undefined}>
                  {r.sex}
                </YellowTooltip>
              </td>
              <td className="px-2 py-1.5 text-slate-700">
                <YellowTooltip oldValue={getDifferenceType(r) === "Modified" ? getOldValueDisplay(r, "race") : undefined}>
                  {r.race}
                </YellowTooltip>
              </td>
              <td className="px-2 py-1.5">
                <YellowTooltip oldValue={getDifferenceType(r) === "Modified" ? getOldValueDisplay(r, "death") : undefined}>
                  {r.death ? (
                    <Check className="h-4 w-4 text-slate-800" />
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </YellowTooltip>
              </td>
              <td className="px-2 py-1.5">
                <YellowTooltip oldValue={getDifferenceType(r) === "Modified" ? getOldValueDisplay(r, "sae") : undefined}>
                  {r.sae ? (
                    <Check className="h-4 w-4 text-slate-800" />
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </YellowTooltip>
              </td>
              <td className="px-2 py-1.5">
                <YellowTooltip oldValue={getDifferenceType(r) === "Modified" ? getOldValueDisplay(r, "aeToDc") : undefined}>
                  {r.aeToDc ? (
                    <Check className="h-4 w-4 text-slate-800" />
                  ) : (
                    <span className="text-slate-500">—</span>
                  )}
                </YellowTooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getDifferenceTypeForRow(row: PatientListRow, oldRowsBySubjid: Record<string, PatientListRow>): ChangeType {
  const oldRow = oldRowsBySubjid[row.subjid];
  if (!oldRow) return "Added";
  const keys: (keyof PatientListRow)[] = ["age", "sex", "race", "death", "sae", "aeToDc"];
  const changed = keys.some((k) => {
    const a = row[k];
    const b = oldRow[k];
    if (typeof a === "boolean" && typeof b === "boolean") return a !== b;
    return String(a) !== String(b);
  });
  return changed ? "Modified" : "Unchanged";
}

export function PatientListTab() {
  const [queries, setQueries] = useState<PatientListQuery[]>(
    () => INITIAL_PATIENT_LIST_QUERIES
  );
  const [querySectionOpen, setQuerySectionOpen] = useState(false);
  const [changeFilter, setChangeFilter] = useState<FilterParams["changeType"]>("All");

  const updateQuery = (id: string, upd: Partial<PatientListQuery>) => {
    setQueries((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...upd } : q))
    );
  };

  const addQuery = () => {
    setQueries((prev) => [
      ...prev,
      {
        id: `q-new-${Date.now()}`,
        title: "New Query",
        dataset: "SDTM",
        freeText: "",
        logic: "SELECT ... FROM ... WHERE ...",
      },
    ]);
  };

  const clearAll = () => setQueries([]);
  const runQuery = (_id: string) => {}; // no-op for mock

  const patientsNew = useMemo(() => PATIENT_LIST_NEW, []);
  const newSubjidSet = useMemo(() => new Set(patientsNew.map((r) => r.subjid)), [patientsNew]);

  const existingBySubjid = useMemo(() => {
    const map: Record<string, PatientListRow> = {};
    for (const row of PATIENT_LIST_EXISTING) {
      map[row.subjid] = row;
    }
    return map;
  }, []);

  const removedRows = useMemo(
    () => PATIENT_LIST_EXISTING.filter((r) => !newSubjidSet.has(r.subjid)),
    [newSubjidSet]
  );

  const allRows = useMemo(
    () => [...patientsNew, ...removedRows],
    [patientsNew, removedRows]
  );

  const patientsFiltered = useMemo(() => {
    if (changeFilter === "All") return allRows;
    return allRows.filter((r) => {
      const type: ChangeType = !newSubjidSet.has(r.subjid) ? "Removed" : getDifferenceTypeForRow(r, existingBySubjid);
      return type === changeFilter;
    });
  }, [allRows, changeFilter, newSubjidSet, existingBySubjid]);

  return (
    <div className="mt-0">
      <div className="flex flex-col rounded-md bg-white shadow-sm ring-1 ring-slate-200">
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded py-1.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
          onClick={() => setQuerySectionOpen((o) => !o)}
        >
          <span className="flex items-center gap-1.5">
            {querySectionOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            Query Builder
          </span>
          <button
            type="button"
            className="flex h-7 w-7 items-center justify-center rounded text-white hover:opacity-90"
            style={{ backgroundColor: ORANGE }}
            onClick={(e) => {
              e.stopPropagation();
              addQuery();
            }}
            aria-label="Add query"
          >
            <Plus className="h-4 w-4" />
          </button>
        </button>
        <div className="flex flex-1 flex-col overflow-hidden p-3">
          {/* Query Builder - centered */}
          <div className="mb-4 flex justify-center">
            <div className="w-full max-w-md">
            {querySectionOpen && (
              <div className="mt-2 space-y-2">
                {queries.map((q) => (
                  <QueryBlockEditable
                    key={q.id}
                    q={q}
                    onUpdate={updateQuery}
                    onRun={runQuery}
                  />
                ))}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={clearAll}
                    className="rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    CLEAR ALL
                  </button>
                  <button
                    type="button"
                    onClick={() => queries.forEach((q) => runQuery(q.id))}
                    className="rounded px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
                    style={{ backgroundColor: ORANGE }}
                  >
                    RUN ALL
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>

          {/* List of Patients - heading + filters in one row, bordered wrapper to bottom */}
          <div className="flex min-h-[60vh] flex-1 flex-col rounded-lg border border-slate-200 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-3 py-2">
              <h3 className="text-sm font-bold text-slate-900">Patient List</h3>
              <CompareModeFilterBox
                leadingContent={
                  <span className="shrink-0 text-sm font-bold" style={{ color: ORANGE }}>
                    Compare found {PATIENT_LIST_NEW.length} patients in PRJ012 vs {PATIENT_LIST_EXISTING.length} patients in PRJ011
                  </span>
                }
              >
                <ChangeTypeFilter value={changeFilter} onChange={setChangeFilter} />
              </CompareModeFilterBox>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <PatientTable
                rows={patientsFiltered}
                showSort
                oldRowsBySubjid={existingBySubjid}
                newSubjidSet={newSubjidSet}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
