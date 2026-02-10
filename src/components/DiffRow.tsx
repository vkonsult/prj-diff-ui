import { getColumnLabel } from "../constants";
import { isChanged } from "../utils";

type Props = { col: string; q1: unknown; q2: unknown };

export function DiffRow({ col, q1, q2 }: Props) {
  const changed = isChanged(q1, q2);
  const q1v = q1 === null ? "null" : q1 === undefined ? "—" : String(q1);
  const q2v = q2 === null ? "null" : q2 === undefined ? "—" : String(q2);
  return (
    <div className={`grid grid-cols-12 items-center gap-2 rounded p-2 ring-1 ring-slate-200 ${changed ? "ring-slate-300" : "bg-white"}`}>
      <div className="col-span-4 min-w-0 truncate text-sm font-medium text-slate-900">{getColumnLabel(col)}</div>
      <div className={`col-span-4 min-w-0 truncate text-sm rounded px-1.5 py-0.5 ${changed ? "bg-rose-50 text-rose-900 ring-1 ring-rose-200" : "text-slate-700"}`}>{q1v}</div>
      <div className={`col-span-4 min-w-0 truncate text-sm rounded px-1.5 py-0.5 ${changed ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200" : "text-slate-700"}`}>{q2v}</div>
    </div>
  );
}
