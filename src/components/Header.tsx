import { NAVY, ORANGE } from "../constants";

export type Tab = "Summary" | "Diff" | "PatientList" | "NarrativesList" | "Narrative";

const TAB_LABELS: Record<Tab, string> = {
  Summary: "Source Data Files",
  Diff: "Patient Profile",
  PatientList: "Patient List",
  NarrativesList: "Narratives list changes",
  Narrative: "Narrative Difference",
};

type Props = {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
};

export function Header({ tab, onTabChange }: Props) {
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
          <div className="mt-2 flex flex-wrap gap-2 pb-2">
            {(["Summary", "PatientList", "Diff", "NarrativesList", "Narrative"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onTabChange(k)}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  tab === k
                    ? "border-transparent text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                }`}
                style={tab === k ? { backgroundColor: NAVY } : undefined}
              >
                {TAB_LABELS[k]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
