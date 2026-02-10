import { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { ORANGE } from "../constants";
import {
  DEFAULT_CRITERIA,
  INITIAL_PATIENT_LIST_QUERIES,
  PATIENT_LIST_NEW,
  PATIENT_LIST_EXISTING,
} from "../constants";
import { Switch } from "./Switch";
import type { PatientListQuery, PatientListRow } from "../types";

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

function QueryBlockReadOnly({ q }: { q: PatientListQuery }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-3">
      <div className="text-sm font-semibold text-slate-900">{q.title}</div>
      <div className="mt-2">
        <span className="text-xs font-medium text-slate-600">Free Text</span>
        <p className="mt-0.5 text-sm text-slate-700">{q.freeText}</p>
      </div>
      <div className="mt-2">
        <span className="text-xs font-medium text-slate-600">Logic</span>
        <pre className="mt-0.5 overflow-x-auto rounded border border-slate-200 bg-purple-50 px-2 py-1.5 text-xs text-slate-700">
          {q.logic}
        </pre>
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: PatientListRow["status"] }) {
  const color =
    status === "green"
      ? "bg-emerald-500"
      : status === "yellow"
        ? "bg-amber-500"
        : "bg-red-500";
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${color}`}
      title={status}
    />
  );
}

function PatientTable({
  rows,
  showSort,
}: {
  rows: PatientListRow[];
  showSort?: boolean;
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
            <Header col="subjid" label="SUBJID" />
            <Header col="status" label="Status" />
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
              className="border-b border-slate-100 hover:bg-slate-50"
            >
              <td className="px-2 py-1.5 text-slate-800">{r.subjid}</td>
              <td className="px-2 py-1.5">
                <StatusDot status={r.status} />
              </td>
              <td className="px-2 py-1.5 text-slate-700">{r.age}</td>
              <td className="px-2 py-1.5 text-slate-700">{r.sex}</td>
              <td className="px-2 py-1.5 text-slate-700">{r.race}</td>
              <td className="px-2 py-1.5">
                {r.death ? (
                  <Check className="h-4 w-4 text-slate-800" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </td>
              <td className="px-2 py-1.5">
                {r.sae ? (
                  <Check className="h-4 w-4 text-slate-800" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </td>
              <td className="px-2 py-1.5">
                {r.aeToDc ? (
                  <Check className="h-4 w-4 text-slate-800" />
                ) : (
                  <X className="h-4 w-4 text-red-500" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PatientListTab() {
  const [queries, setQueries] = useState<PatientListQuery[]>(
    () => INITIAL_PATIENT_LIST_QUERIES
  );
  const [querySectionOpen, setQuerySectionOpen] = useState(false);
  const [criteriaSectionOpen, setCriteriaSectionOpen] = useState(false);
  const [showOnlyNarrative, setShowOnlyNarrative] = useState(false);

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

  const patientsNew = useMemo(() => {
    if (!showOnlyNarrative) return PATIENT_LIST_NEW;
    return PATIENT_LIST_NEW.filter((p) => p.narrative);
  }, [showOnlyNarrative]);

  const patientsExisting = PATIENT_LIST_EXISTING;

  return (
    <div className="mt-2">
      <p className="mb-2 text-sm text-slate-600">
        Summary is showing the difference from all the domains, patient list and
        narrative.
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Left: PRJ012 New */}
        <div className="flex flex-col rounded-md bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-3 py-2">
            <h3 className="text-sm font-bold text-slate-900">PRJ012 New</h3>
          </div>
          <div className="flex-1 overflow-auto p-3">
            {/* List of Query */}
            <div className="mb-4">
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
                  List of Query
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

            {/* List of Patients */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  List of Patients
                </span>
                <Switch
                  checked={showOnlyNarrative}
                  label="Show Only Narrative Subjects"
                  accent={ORANGE}
                  onToggle={setShowOnlyNarrative}
                />
              </div>
              <p className="mb-2 text-xs text-slate-600">
                {patientsNew.length} New Patients found
              </p>
              <PatientTable rows={patientsNew} showSort />
            </div>
          </div>
        </div>

        {/* Right: PRJ011 Existing */}
        <div className="flex flex-col rounded-md bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-3 py-2">
            <h3 className="text-sm font-bold text-slate-900">PRJ011 Existing</h3>
          </div>
          <div className="flex-1 overflow-auto p-3">
            {/* Default Criteria */}
            <div className="mb-4">
              <button
                type="button"
                className="flex w-full items-center gap-2 rounded py-1.5 text-left text-sm font-semibold text-slate-800 hover:bg-slate-50"
                onClick={() => setCriteriaSectionOpen((o) => !o)}
              >
                {criteriaSectionOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Default Criteria
              </button>
              {criteriaSectionOpen && (
                <div className="mt-2 space-y-2">
                  {DEFAULT_CRITERIA.map((q) => (
                    <QueryBlockReadOnly key={q.id} q={q} />
                  ))}
                </div>
              )}
            </div>

            {/* List of Patients */}
            <div>
              <div className="mb-2 text-sm font-semibold text-slate-800">
                List of Patients
              </div>
              <p className="mb-2 text-xs text-slate-600">
                {patientsExisting.length} New Patients found
              </p>
              <PatientTable rows={patientsExisting} showSort />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
