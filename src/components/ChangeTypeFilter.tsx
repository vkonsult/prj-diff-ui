import type { FilterParams } from "../types";
import { DIFFERENCE_PILL_STYLES } from "../constants";

const FILTER_OPTIONS: { value: FilterParams["changeType"]; label: string }[] = [
  { value: "All", label: "All" },
  { value: "Modified", label: "Changed" },
  { value: "Added", label: "Added" },
  { value: "Removed", label: "Removed" },
  { value: "Unchanged", label: "Matched" },
];

const ALL_PILL = "bg-slate-50 text-slate-700 ring-1 ring-slate-200";

type Props = {
  value: FilterParams["changeType"];
  onChange: (value: FilterParams["changeType"]) => void;
  /** When true, hide the Matched (Unchanged) filter option and only show change types */
  hideMatched?: boolean;
};

/** Filter pills: same colors and rounded style as table Difference column. Explicit font so all tabs match. */
const PILL_FONT_STYLE: React.CSSProperties = {
  fontFamily: "inherit",
  fontSize: "12px",
  fontWeight: 500,
};

export function ChangeTypeFilter({ value, onChange, hideMatched }: Props) {
  const options = hideMatched
    ? FILTER_OPTIONS.filter((o) => o.value !== "Unchanged")
    : FILTER_OPTIONS;
  const effectiveValue =
    hideMatched && value === "Unchanged" ? "All" : value;
  return (
    <div className="flex flex-wrap items-center gap-2" style={PILL_FONT_STYLE}>
      {options.map(({ value: ct, label }) => {
        const isSelected = effectiveValue === ct;
        const pillStyle =
          ct === "All" ? ALL_PILL : DIFFERENCE_PILL_STYLES[ct].pill;
        return (
          <button
            key={ct}
            type="button"
            onClick={() => onChange(ct)}
            className={`rounded-full px-2.5 py-1 ring-1 border-0 cursor-pointer ${
              isSelected ? pillStyle : "bg-slate-100 text-slate-700 ring-slate-200 hover:bg-slate-200"
            }`}
            style={PILL_FONT_STYLE}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
