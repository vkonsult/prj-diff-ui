import { ArrowRight, ChevronDown, ChevronUp, Columns, FileDiff, ListChecks } from "lucide-react";
import { SUMMARY, SUBJECTS } from "../constants";
import { useState } from "react";
import { NAVY } from "../constants";
import { NarrativeIcon } from "./NarrativeIcon";
import { Pill } from "./Pill";
import { SectionTitle } from "./SectionTitle";

type Props = {
  onOpenDiff: () => void;
  onSelectSubject: (id: string) => void;
  onSetTab: (tab: "Diff") => void;
  onSetSelectedCols: (cols: string[]) => void;
  onSetOnlyChangedCols: (v: boolean) => void;
  onOpenNarrative: (subjectId: string) => void;
};

export function SummaryTab({ onOpenDiff, onSelectSubject, onSetTab, onSetSelectedCols, onSetOnlyChangedCols, onOpenNarrative }: Props) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const topMax = Math.max(0, ...SUMMARY.topChangedCols.map((x) => x.changed));

  const topSubjects = SUBJECTS.filter((r) => r.changeType !== "Unchanged")
    .sort((a, b) => b.fieldsChanged - a.fieldsChanged)
    .slice(0, 12);

  return (
    <div className="mt-3 space-y-3">
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
            <span className="text-sm font-semibold text-slate-900">Summary</span>
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200">{SUMMARY.modified.toLocaleString()} modified</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200">{SUMMARY.added.toLocaleString()} added</span>
              <span className="rounded-full bg-slate-100 px-2 py-1 ring-1 ring-slate-200">{SUMMARY.removed.toLocaleString()} removed</span>
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
                        type="button"
                        onClick={() => { onSetTab("Diff"); onSetSelectedCols([x.col]); onSetOnlyChangedCols(true); }}
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

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <SectionTitle
          icon={FileDiff}
          title="Top Subjects by Change Impact"
          right={
            <button type="button" onClick={onOpenDiff} className="inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">
              Open Diff Explorer <ArrowRight className="h-4 w-4" />
            </button>
          }
        />
        <div className="mt-3 overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <div className="grid grid-cols-12 bg-sky-100 px-4 py-3 text-xs font-semibold text-sky-800">
            <div className="col-span-3">USUBJID</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Impact</div>
            <div className="col-span-2"># Fields</div>
            <div className="col-span-2">Notes</div>
            <div className="col-span-1 text-center">Narrative</div>
          </div>
          <div className="max-h-[600px] overflow-auto">
            {topSubjects.map((r) => (
              <div
                key={r.id}
                role="button"
                tabIndex={0}
                onClick={() => { onSelectSubject(r.id); onSetTab("Diff"); }}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { onSelectSubject(r.id); onSetTab("Diff"); } }}
                className="grid grid-cols-12 items-center px-4 py-3 hover:bg-sky-50 cursor-pointer"
              >
                <div className="col-span-3 text-sm font-semibold text-slate-900">{r.id}</div>
                <div className="col-span-2"><Pill label={r.changeType} /></div>
                <div className="col-span-2 text-sm text-slate-700">{r.impact}</div>
                <div className="col-span-2 text-sm text-slate-700">{r.fieldsChanged || "—"}</div>
                <div className="col-span-2 truncate text-sm text-slate-600">{r.notes}</div>
                <div className="col-span-1 flex justify-center" onClick={(e) => e.stopPropagation()}>
                  <NarrativeIcon hasNarrative={!!r.narrative} onClick={() => onOpenNarrative(r.id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
