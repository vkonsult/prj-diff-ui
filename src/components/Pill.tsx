import type { ChangeType } from "../types";
import { CHANGE_STYLES } from "../constants";

type Props = { label: ChangeType };

export function Pill({ label }: Props) {
  const s = CHANGE_STYLES[label];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium ${s.pill}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
}
