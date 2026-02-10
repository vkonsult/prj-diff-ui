import { NAVY, ORANGE } from "../constants";
import { Switch } from "./Switch";

export type Tab = "Summary" | "Diff" | "PatientList" | "Narrative";

const TAB_LABELS: Record<Tab, string> = {
  Summary: "Overall Summary",
  Diff: "Patient Profile Changes",
  PatientList: "Patient List Changes",
  Narrative: "Narrative Difference",
};

type Props = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  showAll: boolean;
  onShowAllChange: (v: boolean) => void;
  onlyNarrative: boolean;
  onOnlyNarrativeChange: (v: boolean) => void;
};

export function Header({ tab, onTabChange, showAll, onShowAllChange, onlyNarrative, onOnlyNarrativeChange }: Props) {
  return (
    <div className="sticky top-0 z-40 bg-white">
      <div className="border-b border-slate-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full" style={{ backgroundColor: ORANGE }} />
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-wide text-slate-900">ACUMEN</div>
              <div className="text-[10px] font-semibold tracking-wide text-slate-500">MEDICAL COMMUNICATIONS</div>
            </div>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700 ring-1 ring-slate-200">OP</div>
        </div>
      </div>
      <div className="border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-3 py-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>Projects</span><span>›</span><span className="text-slate-700">PRJ011</span><span>›</span>
            <button type="button" className="font-semibold hover:underline" style={{ color: NAVY }}>Compare with other project</button>
          </div>
          <div className="mt-2 text-lg font-semibold text-slate-900">PRJ011 vs PRJ012</div>
          <div className="mt-0.5 text-sm text-slate-600">Patient list + clinical domains difference explorer.</div>
          <div className="mt-2 flex flex-wrap items-end gap-3 border-b border-slate-200">
            {(["Summary", "PatientList", "Diff", "Narrative"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onTabChange(k)}
                className={`relative -mb-px pb-2 text-sm font-semibold transition ${tab === k ? "text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
              >
                {TAB_LABELS[k]}
                {tab === k && <span className="absolute inset-x-0 -bottom-px h-0.5" style={{ backgroundColor: NAVY }} />}
              </button>
            ))}
          </div>
          {tab === "Diff" && (
            <div className="mt-2 flex flex-wrap items-center gap-3 pb-1">
              <Switch checked={showAll} label="Show All" accent={ORANGE} onToggle={onShowAllChange} />
              <Switch checked={onlyNarrative} label="Show Only Narrative Subjects" onToggle={onOnlyNarrativeChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
