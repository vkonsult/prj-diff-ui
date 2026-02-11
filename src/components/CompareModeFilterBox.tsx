import { ORANGE } from "../constants";

type Props = {
  children: React.ReactNode;
  /** Optional content rendered inside the border before "Show:" (e.g. compare summary label) */
  leadingContent?: React.ReactNode;
};

/** Rounded border with optional leading content, "Show" + filter on one row. Explicit font so all tabs match. */
const FILTER_ROW_STYLE: React.CSSProperties = {
  fontFamily: "inherit",
  fontSize: "12px",
};

export function CompareModeFilterBox({ children, leadingContent }: Props) {
  return (
    <div
      className="flex flex-wrap items-center justify-end gap-2 rounded-lg border px-3 py-2"
      style={{ borderColor: ORANGE, ...FILTER_ROW_STYLE }}
    >
      {leadingContent}
      <span className="font-bold text-slate-600" style={{ fontSize: "12px", fontFamily: "inherit" }}>Show:</span>
      {children}
    </div>
  );
}
