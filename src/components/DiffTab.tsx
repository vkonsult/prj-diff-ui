import { Columns, Download, FileDiff, Filter, ListChecks, Search } from "lucide-react";
import { NarrativeIcon } from "./NarrativeIcon";
import { SUBJECTS } from "../constants";
import type { ChangeType } from "../types";
import { filterRows, computeDiff } from "../utils";
import { Pill } from "./Pill";
import { SectionTitle } from "./SectionTitle";
import { DiffRow } from "./DiffRow";
import { ColumnPicker } from "./ColumnPicker";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  changeType: "All" | ChangeType;
  onChangeTypeChange: (v: "All" | ChangeType) => void;
  onlyChanged: boolean;
  onOnlyChangedChange: (v: boolean) => void;
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
  search, onSearchChange,
  changeType, onChangeTypeChange,
  onlyChanged, onOnlyChangedChange,
  selectedId, onSelectedIdChange,
  selectedCols, onSelectedColsChange,
  onlyChangedCols, onOnlyChangedColsChange,
  colsOpen, onColsOpenChange,
  showAll, onlyNarrative,
  onOpenNarrative,
}: Props) {
  const filtered = filterRows(SUBJECTS, {
    search,
    changeType,
    onlyChanged: showAll ? false : onlyChanged,
    minChanges: 1,
    onlyNarrative,
  });
  const selected = SUBJECTS.find((s) => s.id === selectedId) ?? SUBJECTS[0]!;
  const diff = computeDiff(selected.diff ?? [], selectedCols, onlyChangedCols);

  const toggleCol = (col: string) =>
    onSelectedColsChange(selectedCols.includes(col) ? selectedCols.filter((x) => x !== col) : [...selectedCols, col]);

  return (
    <div className="mt-4 grid gap-3 lg:grid-cols-12">
      <div className="lg:col-span-12 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <SectionTitle
          icon={Filter}
          title="Filters"
          right={
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={() => onColsOpenChange(true)} className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">
                <Columns className="h-4 w-4" /> Select columns
              </button>
              <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">
                <Download className="h-4 w-4" /> Export filtered
              </button>
            </div>
          }
        />
        <div className="mt-3 grid gap-2 md:grid-cols-12">
          <div className="md:col-span-6">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search USUBJID or notes…"
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-3">
            <select
              value={changeType}
              onChange={(e) => onChangeTypeChange(e.target.value as "All" | ChangeType)}
              className="w-full rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200"
            >
              {(["All", "Added", "Removed", "Modified", "Unchanged"] as const).map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-3 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
            <input type="checkbox" checked={onlyChanged} onChange={(e) => onOnlyChangedChange(e.target.checked)} className="h-4 w-4" />
            <span className="text-sm text-slate-700">Only changed</span>
          </div>
        </div>
        <div className="mt-2 text-xs text-slate-500">Selected columns: {selectedCols.length ? selectedCols.join(", ") : "(none)"}</div>
      </div>

      <div className="lg:col-span-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <SectionTitle icon={ListChecks} title="Subjects" />
        <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <div className="grid grid-cols-12 bg-violet-100 px-4 py-3 text-xs font-semibold text-violet-800">
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
                className={`grid grid-cols-12 items-center px-4 py-3 text-left hover:bg-violet-50 cursor-pointer ${selectedId === r.id ? "bg-violet-100 ring-1 ring-violet-200" : ""}`}
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

      <div className="lg:col-span-7 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="text-base font-semibold text-slate-900">USUBJID: {selected.id}</div>
              <Pill label={selected.changeType} />
            </div>
            <div className="mt-1 text-sm text-slate-600">Last seen: {selected.lastSeen} • {selected.notes}</div>
          </div>
          <button
            type="button"
            onClick={() => onOnlyChangedColsChange(!onlyChangedCols)}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            <FileDiff className="h-4 w-4" /> {onlyChangedCols ? "Only changed cols" : "All selected cols"}
          </button>
        </div>
        <div className="mt-3">
          {selected.changeType === "Unchanged" && (
            <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">No differences detected for this subject.</div>
          )}
          {selected.changeType === "Added" && (
            <div className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-800 ring-1 ring-emerald-200">Subject exists in PRJ012 but not in PRJ011.</div>
          )}
          {selected.changeType === "Removed" && (
            <div className="rounded-2xl bg-rose-50 p-5 text-sm text-rose-800 ring-1 ring-rose-200">Subject exists in PRJ011 but not in PRJ012.</div>
          )}
          <div className="mt-3 space-y-2">
            <div className="grid grid-cols-12 px-3 text-xs font-semibold text-slate-600">
              <div className="col-span-4">Column</div>
              <div className="col-span-4">PRJ011</div>
              <div className="col-span-4">PRJ012</div>
            </div>
            {diff.length ? diff.map((r) => <DiffRow key={r.col} col={r.col} q1={r.q1} q2={r.q2} />) : (
              <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">No diffs to show for selected columns.</div>
            )}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Copy diff</button>
              <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">Export subject diff</button>
            </div>
          </div>
        </div>
      </div>

      <ColumnPicker
        open={colsOpen}
        onClose={() => onColsOpenChange(false)}
        selectedCols={selectedCols}
        onToggleCol={toggleCol}
        onReset={() => onSelectedColsChange(["ARM", "TRT01A", "AESEV", "AESER", "AEREL"])}
      />
    </div>
  );
}
