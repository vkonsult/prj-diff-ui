import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Columns, FileDiff, ListChecks } from "lucide-react";
import { NarrativeIcon } from "./NarrativeIcon";
import { SUBJECTS, getColumnLabel } from "../constants";
import { filterRows, computeDiff } from "../utils";
import { Pill } from "./Pill";
import { SectionTitle } from "./SectionTitle";
import { DiffRow } from "./DiffRow";
import { ColumnPicker } from "./ColumnPicker";

type Props = {
  selectedId: string;
  onSelectedIdChange: (id: string) => void;
  selectedCols: string[];
  onSelectedColsChange: (cols: string[]) => void;
  onlyChangedCols: boolean;
  onOnlyChangedColsChange: (v: boolean) => void;
  colsOpen: boolean;
  onColsOpenChange: (v: boolean) => void;
  showAll: boolean;
  onlyNarrative: boolean;
  onOpenNarrative: (subjectId: string) => void;
};

export function DiffTab({
  selectedId, onSelectedIdChange,
  selectedCols, onSelectedColsChange,
  onlyChangedCols, onOnlyChangedColsChange,
  colsOpen, onColsOpenChange,
  showAll, onlyNarrative,
  onOpenNarrative,
}: Props) {
  const DIFF_PAGE_SIZE = 10;

  const filtered = filterRows(SUBJECTS, {
    search: "",
    changeType: "All",
    onlyChanged: false,
    minChanges: 1,
    onlyNarrative,
  });
  const selected = SUBJECTS.find((s) => s.id === selectedId) ?? SUBJECTS[0]!;
  const diff = computeDiff(selected.diff ?? [], selectedCols, onlyChangedCols);

  const [diffPage, setDiffPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(diff.length / DIFF_PAGE_SIZE));
  const start = diffPage * DIFF_PAGE_SIZE;
  const end = Math.min(start + DIFF_PAGE_SIZE, diff.length);
  const diffSlice = diff.slice(start, end);

  useEffect(() => {
    setDiffPage(0);
  }, [selectedId]);

  return (
    <div className="mt-2 grid gap-2 lg:grid-cols-12">
      <div className="lg:col-span-5 rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-200">
        <SectionTitle icon={ListChecks} title="Subjects" />
        <div className="mt-2 overflow-hidden rounded ring-1 ring-slate-200">
          <div className="grid grid-cols-12 bg-orange-100 px-3 py-2 text-xs font-semibold text-orange-800">
            <div className="col-span-5">USUBJID</div>
            <div className="col-span-3">Type</div>
            <div className="col-span-2 text-right"># Fields</div>
            <div className="col-span-1 text-center">Narrative</div>
          </div>
          <div className="max-h-[520px] overflow-auto">
            {filtered.map((r) => (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectedIdChange(r.id)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onSelectedIdChange(r.id); }}
                className={`grid grid-cols-12 items-center px-3 py-2 text-left hover:bg-orange-50 cursor-pointer ${selectedId === r.id ? "bg-orange-100 ring-1 ring-orange-200" : ""}`}
              >
                <div className="col-span-5">
                  <div className="text-sm font-semibold text-slate-900">{r.id}</div>
                  <div className="truncate text-xs text-slate-500">{r.notes}</div>
                </div>
                <div className="col-span-3"><Pill label={r.changeType} /></div>
                <div className="col-span-2 text-right text-sm text-slate-700">{r.changeType === "Modified" ? r.fieldsChanged : "—"}</div>
                <div className="col-span-1 flex justify-center" onClick={(e) => e.stopPropagation()}>
                  <NarrativeIcon hasNarrative={!!r.narrative} onClick={() => onOpenNarrative(r.id)} />
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="px-4 py-10 text-center text-sm text-slate-500">No subjects match the current filters.</div>
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-7 rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-base font-semibold text-slate-900">USUBJID: {selected.id}</div>
              <Pill label={selected.changeType} />
            </div>
            <div className="mt-1 text-sm text-slate-600">Last seen: {selected.lastSeen} • {selected.notes}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onColsOpenChange(true)}
              className="inline-flex items-center gap-2 rounded bg-white px-2 py-1.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              <Columns className="h-4 w-4" /> Select columns
            </button>
            <button
              type="button"
              onClick={() => onOnlyChangedColsChange(!onlyChangedCols)}
              className="inline-flex items-center gap-2 rounded bg-white px-2 py-1.5 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              <FileDiff className="h-4 w-4" /> {onlyChangedCols ? "Only changed cols" : "All selected cols"}
            </button>
          </div>
        </div>
        <div className="mt-1 text-xs text-slate-500">Selected columns: {selectedCols.length ? selectedCols.map(getColumnLabel).join(", ") : "(none)"}</div>
        <div className="mt-2">
          {selected.changeType === "Unchanged" && (
            <div className="rounded bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">No differences detected for this subject.</div>
          )}
          {selected.changeType === "Added" && (
            <div className="rounded bg-emerald-50 p-3 text-sm text-emerald-800 ring-1 ring-emerald-200">Subject exists in PRJ012 but not in PRJ011.</div>
          )}
          {selected.changeType === "Removed" && (
            <div className="rounded bg-rose-50 p-3 text-sm text-rose-800 ring-1 ring-rose-200">Subject exists in PRJ011 but not in PRJ012.</div>
          )}
          <div className="mt-3 space-y-2">
            {diff.length > 0 && (
              <div className="flex items-center justify-between gap-2 rounded bg-slate-50 px-2 py-1.5 ring-1 ring-slate-200">
                <button
                  type="button"
                  onClick={() => setDiffPage((p) => Math.max(0, p - 1))}
                  disabled={diffPage === 0}
                  className="flex items-center gap-1 rounded px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Previous rows"
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </button>
                <span className="text-sm font-semibold text-slate-700">
                  {diff.length <= DIFF_PAGE_SIZE
                    ? `${diff.length} row${diff.length !== 1 ? "s" : ""} changed`
                    : `${start + 1}–${end} of ${diff.length} rows changed`}
                </span>
                <button
                  type="button"
                  onClick={() => setDiffPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={diffPage >= totalPages - 1}
                  className="flex items-center gap-1 rounded px-2 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Next rows"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
            <div className="grid grid-cols-12 px-3 text-xs font-semibold text-slate-600">
              <div className="col-span-4">Column</div>
              <div className="col-span-4">PRJ011</div>
              <div className="col-span-4">PRJ012</div>
            </div>
            {diff.length ? diffSlice.map((r, i) => <DiffRow key={`${start + i}-${r.col}`} col={r.col} q1={r.q1} q2={r.q2} />) : (
              <div className="rounded bg-slate-50 p-3 text-sm text-slate-700 ring-1 ring-slate-200">No diffs to show for selected columns.</div>
            )}
          </div>
        </div>
      </div>

      <ColumnPicker
        open={colsOpen}
        onClose={() => onColsOpenChange(false)}
        selectedCols={selectedCols}
        onApply={onSelectedColsChange}
        onReset={() => onSelectedColsChange(["ARM", "TRT01A", "AESEV", "AESER", "AEREL"])}
      />
    </div>
  );
}
