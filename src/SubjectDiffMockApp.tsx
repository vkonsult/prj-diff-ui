import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Columns,
  Download,
  FileDiff,
  Filter,
  ListChecks,
  Search,
  X,
} from "lucide-react";

type ChangeType = "Added" | "Removed" | "Modified" | "Unchanged";
type DiffCell = { col: string; q1: unknown; q2: unknown };
type SubjectRow = {
  id: string;
  changeType: ChangeType;
  fieldsChanged: number;
  impact: "High" | "Medium" | "Low" | "—";
  lastSeen: "PRJ011" | "PRJ012";
  notes: string;
  narrative?: boolean;
  diff: DiffCell[];
};

const NAVY = "#213F68";
const ORANGE = "#CF5512";

const COLS = [
  "ARM",
  "TRT01A",
  "SAFFL",
  "ITTFL",
  "AETERM",
  "AEDECOD",
  "AESEV",
  "AESER",
  "AEREL",
  "AEACN",
  "AESTDTC",
  "AEENDTC",
  "CMDECOD",
  "CMTRT",
  "CMSTDTC",
  "CMENDTC",
] as const;

const SUMMARY = {
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

const SUBJECTS: SubjectRow[] = [
  {
    id: "SUBJ-0001",
    changeType: "Added",
    fieldsChanged: 0,
    impact: "—",
    lastSeen: "PRJ012",
    notes: "New USUBJID appears in PRJ012 (not present in PRJ011)",
    narrative: true,
    diff: [
      { col: "ARM", q1: "—", q2: "Treatment" },
      { col: "TRT01A", q1: "—", q2: "Drug X 100mg" },
      { col: "SAFFL", q1: "—", q2: "Y" },
    ],
  },
  {
    id: "SUBJ-10492",
    changeType: "Modified",
    fieldsChanged: 3,
    impact: "Medium",
    lastSeen: "PRJ012",
    notes: "AE updates: AESEV + AESER + AEENDTC",
    narrative: true,
    diff: [
      { col: "AEDECOD", q1: "HEADACHE", q2: "HEADACHE" },
      { col: "AESEV", q1: "MILD", q2: "MODERATE" },
      { col: "AESER", q1: "N", q2: "Y" },
      { col: "AEENDTC", q1: "2025-03-18", q2: "2025-03-20" },
    ],
  },
  {
    id: "SUBJ-10922",
    changeType: "Modified",
    fieldsChanged: 8,
    impact: "High",
    lastSeen: "PRJ012",
    notes: "Treatment + multiple AE fields changed",
    narrative: false,
    diff: [
      { col: "ARM", q1: "Placebo", q2: "Treatment" },
      { col: "TRT01A", q1: "Placebo", q2: "Drug X 100mg" },
      { col: "AESEV", q1: "MILD", q2: "SEVERE" },
      { col: "AEREL", q1: "NOT RELATED", q2: "POSSIBLY RELATED" },
      { col: "AEACN", q1: "NONE", q2: "DRUG WITHDRAWN" },
      { col: "AESTDTC", q1: "2025-04-02", q2: "2025-04-01" },
      { col: "AEDECOD", q1: "NAUSEA", q2: "NAUSEA" },
    ],
  },
  {
    id: "SUBJ-10202",
    changeType: "Removed",
    fieldsChanged: 0,
    impact: "—",
    lastSeen: "PRJ011",
    notes: "USUBJID present in PRJ011 but missing in PRJ012",
    narrative: true,
    diff: [{ col: "SAFFL", q1: "Y", q2: "—" }],
  },
  {
    id: "SUBJ-10333",
    changeType: "Unchanged",
    fieldsChanged: 0,
    impact: "—",
    lastSeen: "PRJ012",
    notes: "No changes detected for selected fields",
    narrative: false,
    diff: [],
  },
];

const CHANGE: Record<ChangeType, { pill: string; dot: string }> = {
  Added: { pill: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200", dot: "bg-emerald-500" },
  Removed: { pill: "bg-rose-50 text-rose-700 ring-1 ring-rose-200", dot: "bg-rose-500" },
  Modified: { pill: "bg-amber-50 text-amber-800 ring-1 ring-amber-200", dot: "bg-amber-500" },
  Unchanged: { pill: "bg-slate-50 text-slate-700 ring-1 ring-slate-200", dot: "bg-slate-400" },
};

const norm = (v: unknown) => (v === null ? "null" : v === undefined ? "" : String(v).trim());
const isChanged = (a: unknown, b: unknown) => norm(a) !== norm(b);

function filterRows(
  rows: SubjectRow[],
  p: {
    search: string;
    changeType: "All" | ChangeType;
    onlyChanged: boolean;
    minChanges: number;
    onlyNarrative: boolean;
  }
) {
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

function computeDiff(diff: DiffCell[], selectedCols: string[], onlyChangedCols: boolean) {
  const base = diff.filter((d) => selectedCols.includes(d.col));
  return onlyChangedCols ? base.filter((d) => isChanged(d.q1, d.q2)) : base;
}

const Pill = ({ label }: { label: ChangeType }) => {
  const s = CHANGE[label];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${s.pill}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
};

const SectionTitle = ({
  title,
  icon: Icon,
  right,
}: {
  title: string;
  icon: any;
  right?: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-3">
    <div className="flex items-center gap-2">
      <div className="rounded-xl bg-slate-100 p-2 ring-1 ring-slate-200">
        <Icon className="h-4 w-4 text-slate-700" />
      </div>
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
    </div>
    {right}
  </div>
);

const Switch = ({
  checked,
  label,
  accent,
  onToggle,
}: {
  checked: boolean;
  label: string;
  accent?: string;
  onToggle: (v: boolean) => void;
}) => (
  <button
    type="button"
    className="inline-flex items-center gap-2"
    aria-pressed={checked}
    onClick={() => onToggle(!checked)}
  >
    <span
      className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${
        checked ? "border-transparent" : "border-slate-300"
      }`}
      style={{ backgroundColor: checked ? accent || NAVY : "#e5e7eb" }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </span>
    <span className="text-sm font-semibold text-slate-700">{label}</span>
  </button>
);

const DiffRow = ({ col, q1, q2 }: { col: string; q1: unknown; q2: unknown }) => {
  const c = isChanged(q1, q2);
  const q1v = q1 === null ? "null" : q1 === undefined ? "—" : String(q1);
  const q2v = q2 === null ? "null" : q2 === undefined ? "—" : String(q2);

  return (
    <div
      className={`grid grid-cols-12 items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-slate-200 ${
        c ? "ring-amber-200 bg-amber-50/30" : ""
      }`}
    >
      <div className="col-span-4 min-w-0">
        <div className="truncate text-sm font-medium text-slate-900">{col}</div>
      </div>
      <div className="col-span-4 min-w-0">
        <div className="truncate text-sm text-slate-700">{q1v}</div>
      </div>
      <div className="col-span-4 min-w-0">
        <div className="truncate text-sm text-slate-700">{q2v}</div>
      </div>
    </div>
  );
};

function Popover({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onMouseDown={onClose}>
      <div className="absolute inset-0 bg-slate-900/20" />
      <div
        className="absolute left-1/2 top-24 w-[min(720px,calc(100%-2rem))] -translate-x-1/2 rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default function SubjectDiffMockApp() {
  const [tab, setTab] = useState<"Summary" | "Diff">("Summary");
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Diff-only controls
  const [showAll, setShowAll] = useState(true);
  const [onlyNarrative, setOnlyNarrative] = useState(false);

  const [search, setSearch] = useState("");
  const [changeType, setChangeType] = useState<"All" | ChangeType>("All");
  const [onlyChanged, setOnlyChanged] = useState(true);

  const [selectedId, setSelectedId] = useState(SUBJECTS[1]?.id ?? SUBJECTS[0]?.id ?? "");
  const [onlyChangedCols, setOnlyChangedCols] = useState(true);
  const [selectedCols, setSelectedCols] = useState<string[]>(["ARM", "TRT01A", "AESEV", "AESER", "AEREL"]);
  const [colsOpen, setColsOpen] = useState(false);

  const selected = useMemo(() => SUBJECTS.find((s) => s.id === selectedId) ?? SUBJECTS[0]!, [selectedId]);

  const filtered = useMemo(() => {
    const effectiveOnlyChanged = showAll ? false : onlyChanged;
    return filterRows(SUBJECTS, {
      search,
      changeType,
      onlyChanged: effectiveOnlyChanged,
      minChanges: 1,
      onlyNarrative,
    });
  }, [search, changeType, onlyChanged, onlyNarrative, showAll]);

  const diff = useMemo(
    () => computeDiff(selected.diff || [], selectedCols, onlyChangedCols),
    [selected, selectedCols, onlyChangedCols]
  );

  const toggleCol = (col: string) =>
    setSelectedCols((p) => (p.includes(col) ? p.filter((x) => x !== col) : [...p, col]));

  const topMax = Math.max(0, ...SUMMARY.topChangedCols.map((x) => x.changed));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white">
        <div className="border-b border-slate-200">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full" style={{ backgroundColor: ORANGE }} />
              <div className="leading-tight">
                <div className="text-sm font-extrabold tracking-wide text-slate-900">ACUMEN</div>
                <div className="text-[10px] font-semibold tracking-wide text-slate-500">MEDICAL COMMUNICATIONS</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Notifications">
                <span className="inline-block h-2 w-2 rounded-full bg-slate-300" />
              </button>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
                OP
              </div>
            </div>
          </div>
        </div>

        {/* Title / Tabs */}
        <div className="border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span>Projects</span>
                  <span>›</span>
                  <span className="text-slate-700">PRJ011</span>
                  <span>›</span>
                  <button className="font-semibold hover:underline" style={{ color: NAVY }}>
                    Compare with other project
                  </button>
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-900">PRJ011 vs PRJ012</div>
                <div className="mt-0.5 text-sm text-slate-600">Patient list + clinical domains (SDTM/ADaM) difference explorer.</div>
              </div>
              <button className="rounded-full p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-end gap-4 border-b border-slate-200">
              {(["Summary", "Diff"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`relative -mb-px pb-3 text-sm font-semibold transition ${
                    tab === k ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {k === "Summary" ? "Overall Summary" : "Patient Profile Changes"}
                  {tab === k ? (
                    <span className="absolute inset-x-0 -bottom-px h-0.5" style={{ backgroundColor: NAVY }} />
                  ) : null}
                </button>
              ))}
              <button disabled className="relative -mb-px pb-3 text-sm font-semibold text-slate-500 opacity-70">
                Patient List Changes <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </button>
              <button disabled className="relative -mb-px pb-3 text-sm font-semibold text-slate-500 opacity-70">
                Narrative Difference <span className="ml-1 inline-flex h-1.5 w-1.5 rounded-full bg-amber-500" />
              </button>
            </div>

            {tab === "Diff" ? (
              <div className="mt-2 flex flex-wrap items-center gap-3 pb-1">
                <Switch checked={showAll} label="Show All" accent={ORANGE} onToggle={setShowAll} />
                <Switch checked={onlyNarrative} label="Show Only Narrative Subjects" onToggle={setOnlyNarrative} />
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        {tab === "Summary" ? (
          <div className="mt-3 space-y-3">
            {/* Collapsed/expandable summary */}
            <div className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
              <button
                type="button"
                onClick={() => setSummaryOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-3 px-5 py-2.5"
                aria-expanded={summaryOpen}
              >
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-slate-100 p-2 ring-1 ring-slate-200">
                    <ListChecks className="h-4 w-4 text-slate-700" />
                  </div>
                  <div className="text-sm font-semibold text-slate-900">Summary</div>
                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
                    <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200">
                      {SUMMARY.modified.toLocaleString()} modified
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200">
                      {SUMMARY.added.toLocaleString()} added
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200">
                      {SUMMARY.removed.toLocaleString()} removed
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: NAVY }}>
                  {summaryOpen ? "Collapse" : "Expand"}
                  {summaryOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {!summaryOpen ? (
                <div className="px-5 pb-3">
                  <div className="grid gap-2 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-2xl bg-slate-50 p-2.5 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold text-slate-600">Key change</div>
                      <div className="mt-1 text-sm text-slate-800">{SUMMARY.bullets[0]}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-2.5 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold text-slate-600">Top column</div>
                      <div className="mt-1 text-sm font-semibold text-slate-900">{SUMMARY.topChangedCols[0].col}</div>
                      <div className="text-xs text-slate-500">{SUMMARY.topChangedCols[0].changed} changes</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="px-5 pb-4">
                  <div className="grid gap-3 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                      <SectionTitle icon={ListChecks} title="Key Changes" />
                      <div className="mt-2.5 space-y-2">
                        {SUMMARY.bullets.map((b) => (
                          <div key={b} className="flex items-start gap-2 rounded-2xl bg-slate-50 p-2.5 ring-1 ring-slate-200">
                            <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-900" />
                            <div className="text-sm text-slate-800">{b}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                      <SectionTitle icon={Columns} title="Columns Changed Most" />
                      <div className="mt-2.5 space-y-3">
                        {SUMMARY.topChangedCols.map((x) => {
                          const pct = topMax ? Math.round((x.changed / topMax) * 100) : 0;
                          return (
                            <button
                              key={x.col}
                              onClick={() => {
                                setTab("Diff");
                                setSelectedCols([x.col]);
                                setOnlyChangedCols(true);
                              }}
                              className="w-full rounded-2xl p-2 text-left hover:bg-slate-50"
                            >
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-700">{x.col}</span>
                                <span className="text-slate-500">{x.changed}</span>
                              </div>
                              <div className="mt-1 h-2 rounded-full bg-slate-100 ring-1 ring-slate-200">
                                <div className="h-2 rounded-full bg-slate-900" style={{ width: `${pct}%` }} />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-2 text-xs text-slate-500">Click a column to jump into Diff Explorer.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom section with more real estate */}
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <SectionTitle
                icon={FileDiff}
                title="Top Subjects by Change Impact"
                right={
                  <button
                    onClick={() => setTab("Diff")}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    Open Diff Explorer <ArrowRight className="h-4 w-4" />
                  </button>
                }
              />

              <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                  <div className="col-span-3">USUBJID</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Impact</div>
                  <div className="col-span-2"># Fields</div>
                  <div className="col-span-3">Notes</div>
                </div>

                <div className="max-h-[600px] overflow-auto">
                  {SUBJECTS.filter((r) => r.changeType !== "Unchanged")
                    .sort((a, b) => b.fieldsChanged - a.fieldsChanged)
                    .slice(0, 12)
                    .map((r) => (
                      <button
                        key={r.id}
                        onClick={() => {
                          setSelectedId(r.id);
                          setTab("Diff");
                        }}
                        className="grid w-full grid-cols-12 items-center px-4 py-3 text-left hover:bg-slate-50"
                      >
                        <div className="col-span-3 text-sm font-semibold text-slate-900">{r.id}</div>
                        <div className="col-span-2">
                          <Pill label={r.changeType} />
                        </div>
                        <div className="col-span-2 text-sm text-slate-700">{r.impact}</div>
                        <div className="col-span-2 text-sm text-slate-700">{r.fieldsChanged || "—"}</div>
                        <div className="col-span-3 truncate text-sm text-slate-600">{r.notes}</div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-3 lg:grid-cols-12">
            {/* Filters (start of Diff page) */}
            <div className="lg:col-span-12 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <SectionTitle
                icon={Filter}
                title="Filters"
                right={
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setColsOpen(true)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                    >
                      <Columns className="h-4 w-4" /> Select columns
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">
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
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search USUBJID or notes…"
                      className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <select
                    value={changeType}
                    onChange={(e) => setChangeType(e.target.value as any)}
                    className="w-full rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200"
                  >
                    {(["All", "Added", "Removed", "Modified", "Unchanged"] as const).map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-3 flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 ring-1 ring-slate-200">
                  <input
                    type="checkbox"
                    checked={onlyChanged}
                    onChange={(e) => setOnlyChanged(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-slate-700">Only changed</span>
                </div>
              </div>

              <div className="mt-2 text-xs text-slate-500">Selected columns: {selectedCols.length ? selectedCols.join(", ") : "(none)"}</div>
            </div>

            {/* Left list */}
            <div className="lg:col-span-5 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <SectionTitle icon={ListChecks} title="Subjects" />
              <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                <div className="grid grid-cols-12 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                  <div className="col-span-5">USUBJID</div>
                  <div className="col-span-4">Type</div>
                  <div className="col-span-3 text-right"># Fields</div>
                </div>

                <div className="max-h-[520px] overflow-auto">
                  {filtered.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={`grid w-full grid-cols-12 items-center px-4 py-3 text-left hover:bg-slate-50 ${
                        selectedId === r.id ? "bg-slate-50" : ""
                      }`}
                    >
                      <div className="col-span-5">
                        <div className="text-sm font-semibold text-slate-900">{r.id}</div>
                        <div className="truncate text-xs text-slate-500">{r.notes}</div>
                      </div>
                      <div className="col-span-4">
                        <Pill label={r.changeType} />
                      </div>
                      <div className="col-span-3 text-right text-sm text-slate-700">
                        {r.changeType === "Modified" ? r.fieldsChanged : "—"}
                      </div>
                    </button>
                  ))}
                  {!filtered.length ? (
                    <div className="px-4 py-10 text-center text-sm text-slate-500">
                      No subjects match the current filters.
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Right detail */}
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
                  onClick={() => setOnlyChangedCols((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  <FileDiff className="h-4 w-4" /> {onlyChangedCols ? "Only changed cols" : "All selected cols"}
                </button>
              </div>

              <div className="mt-3">
                {selected.changeType === "Unchanged" ? (
                  <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">
                    No differences detected for this subject.
                  </div>
                ) : selected.changeType === "Added" ? (
                  <div className="rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-800 ring-1 ring-emerald-200">
                    Subject exists in PRJ012 but not in PRJ011.
                  </div>
                ) : selected.changeType === "Removed" ? (
                  <div className="rounded-2xl bg-rose-50 p-5 text-sm text-rose-800 ring-1 ring-rose-200">
                    Subject exists in PRJ011 but not in PRJ012.
                  </div>
                ) : null}

                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-12 px-3 text-xs font-semibold text-slate-600">
                    <div className="col-span-4">Column</div>
                    <div className="col-span-4">PRJ011</div>
                    <div className="col-span-4">PRJ012</div>
                  </div>

                  {diff.length ? (
                    diff.map((r) => <DiffRow key={r.col} col={r.col} q1={r.q1} q2={r.q2} />)
                  ) : (
                    <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-700 ring-1 ring-slate-200">
                      No diffs to show for selected columns.
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                      Copy diff
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">
                      Export subject diff
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Column picker */}
      <Popover open={colsOpen} onClose={() => setColsOpen(false)}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-slate-900">Select columns to compare</div>
            <div className="mt-1 text-sm text-slate-600">Pick a focused set of SDTM/ADaM fields to reduce noise.</div>
          </div>
          <button onClick={() => setColsOpen(false)} className="rounded-xl p-2 hover:bg-slate-100" aria-label="Close">
            <X className="h-5 w-5 text-slate-700" />
          </button>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {COLS.map((col) => {
            const checked = selectedCols.includes(col);
            return (
              <button
                key={col}
                onClick={() => toggleCol(col)}
                className={`flex items-center justify-between rounded-2xl px-3 py-2 text-left ring-1 transition ${
                  checked
                    ? "bg-slate-900 text-white ring-slate-900"
                    : "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                <span className="text-sm font-semibold">{col}</span>
                <span className={`h-5 w-5 rounded-xl ${checked ? "bg-white/20" : "bg-slate-100"}`} />
              </button>
            );
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={() => setSelectedCols(["ARM", "TRT01A", "AESEV", "AESER", "AEREL"])}
            className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            onClick={() => setColsOpen(false)}
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Done
          </button>
        </div>
      </Popover>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-5 px-4 py-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>New Rows/Columns Added</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span>Modified</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Deleted Rows</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Minimal self-checks (dev/test only). Guarded to avoid runtime issues in non-test sandboxes.
try {
  const env = (globalThis as any)?.process?.env?.NODE_ENV;
  if (env === "test") {
    console.assert(isChanged("A", "B") === true, "isChanged should detect different values");
    console.assert(isChanged("A ", "A") === false, "isChanged should trim and treat as equal");
    const d = computeDiff([{ col: "ARM", q1: "P", q2: "T" }], ["ARM"], true);
    console.assert(d.length === 1 && d[0].col === "ARM", "computeDiff should include changed selected col");
    const f = filterRows(SUBJECTS, {
      search: "subj-",
      changeType: "All",
      onlyChanged: false,
      minChanges: 1,
      onlyNarrative: false,
    });
    console.assert(f.length >= 1, "filterRows should return matches for search");
  }
} catch {
  // ignore
}
