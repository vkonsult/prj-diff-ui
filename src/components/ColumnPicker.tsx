import { X } from "lucide-react";
import { COLS } from "../constants";
import { Popover } from "./Popover";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedCols: string[];
  onToggleCol: (col: string) => void;
  onReset: () => void;
};

export function ColumnPicker({ open, onClose, selectedCols, onToggleCol, onReset }: Props) {
  return (
    <Popover open={open} onClose={onClose}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-slate-900">Select columns to compare</div>
          <div className="mt-1 text-sm text-slate-600">Pick a focused set of SDTM/ADaM fields to reduce noise.</div>
        </div>
        <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100" aria-label="Close">
          <X className="h-5 w-5 text-slate-700" />
        </button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {COLS.map((col) => {
          const checked = selectedCols.includes(col);
          return (
            <button
              key={col}
              type="button"
              onClick={() => onToggleCol(col)}
              className={`flex items-center justify-between rounded-2xl px-3 py-2 text-left ring-1 transition ${checked ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50"}`}
            >
              <span className="text-sm font-semibold">{col}</span>
              <span className={`h-5 w-5 rounded-xl ${checked ? "bg-white/20" : "bg-slate-100"}`} />
            </button>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={onReset} className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50">Reset</button>
        <button type="button" onClick={onClose} className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Done</button>
      </div>
    </Popover>
  );
}
