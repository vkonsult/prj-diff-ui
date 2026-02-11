import type { ChangeType } from "../types";
import { DIFFERENCE_PILL_STYLES } from "../constants";

const LABELS: Record<ChangeType, string> = {
  Added: "Added",
  Modified: "Changed",
  Removed: "Removed",
  Unchanged: "Matched",
};

type Props = { label: ChangeType };

/** Single pill for tables and filter: white text on colored bg + darker border (Matched=green, Changed=amber, Added=red, Removed=slate). */
export function DifferencePill({ label }: Props) {
  const s = DIFFERENCE_PILL_STYLES[label];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${s.pill}`}
      style={{ fontFamily: "inherit" }}
    >
      {LABELS[label]}
    </span>
  );
}
