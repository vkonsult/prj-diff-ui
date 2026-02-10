import { Check, ChevronDown, ChevronRight } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { COLUMN_DATASETS } from "../constants";
import { NAVY, ORANGE } from "../constants";
import { Popover } from "./Popover";

type Props = {
  open: boolean;
  onClose: () => void;
  selectedCols: string[];
  onApply: (cols: string[]) => void;
  onReset?: () => void;
};

export function ColumnPicker({ open, onClose, selectedCols, onApply, onReset }: Props) {
  const defaultCols = ["ARM", "TRT01A", "AESEV", "AESER", "AEREL"];
  const [dataset, setDataset] = useState<"SDTM" | "ADaM">("SDTM");
  const [expandedTableId, setExpandedTableId] = useState<string | null>("DM");
  const [pending, setPending] = useState<Set<string>>(new Set(selectedCols));

  const currentDataset = useMemo(() => COLUMN_DATASETS.find((d) => d.id === dataset)!, [dataset]);
  const allCodes = useMemo(
    () => currentDataset.tables.flatMap((t) => t.columns.map((c) => c.code)),
    [currentDataset]
  );

  const toggleCol = (code: string) => {
    setPending((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const toggleTable = (tableId: string) => {
    const table = currentDataset.tables.find((t) => t.id === tableId)!;
    const codes = table.columns.map((c) => c.code);
    const allSelected = codes.every((c) => pending.has(c));
    setPending((prev) => {
      const next = new Set(prev);
      if (allSelected) codes.forEach((c) => next.delete(c));
      else codes.forEach((c) => next.add(c));
      return next;
    });
  };

  const handleApply = () => {
    onApply(Array.from(pending));
    onClose();
  };

  const handleCancel = () => {
    setPending(new Set(selectedCols));
    onClose();
  };

  useEffect(() => {
    if (open) setPending(new Set(selectedCols));
  }, [open, selectedCols]);

  const expandedTable = expandedTableId ? currentDataset.tables.find((t) => t.id === expandedTableId) : null;

  return (
    <Popover open={open} onClose={handleCancel}>
      <div className="flex flex-col gap-4 max-h-[70vh]">
        {/* Dataset */}
        <div>
          <div className="text-sm font-semibold mb-2" style={{ color: NAVY }}>
            Dataset
          </div>
          <div className="flex gap-6">
            {(["SDTM", "ADaM"] as const).map((id) => (
              <label key={id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="dataset"
                  checked={dataset === id}
                  onChange={() => { setDataset(id); setExpandedTableId(COLUMN_DATASETS.find((d) => d.id === id)?.tables[0]?.id ?? null); }}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm font-medium text-slate-800">{id}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 flex-1 min-h-0">
          {/* Tables */}
          <div className="flex flex-col min-h-0 border border-slate-200 rounded p-2">
            <div className="text-sm font-semibold mb-2" style={{ color: NAVY }}>
              Tables
            </div>
            <div className="overflow-y-auto space-y-1 flex-1">
              {currentDataset.tables.map((table) => {
                const codes = table.columns.map((c) => c.code);
                const allSelected = codes.length > 0 && codes.every((c) => pending.has(c));
                const someSelected = codes.some((c) => pending.has(c));
                const isExpanded = expandedTableId === table.id;
                return (
                  <div key={table.id} className="rounded border border-slate-200 overflow-hidden">
                    <div className="flex items-center gap-2 bg-white border-b border-slate-100">
                      <button
                        type="button"
                        onClick={() => setExpandedTableId(isExpanded ? null : table.id)}
                        className="p-1.5 text-slate-600 hover:bg-slate-50"
                        aria-expanded={isExpanded}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleTable(table.id)}
                        className="flex items-center gap-2 flex-1 text-left py-2 pr-2 hover:bg-slate-50"
                      >
                        <span className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 flex-shrink-0 ${someSelected ? "bg-orange-500 border-orange-500" : "border-slate-300"}`}>
                          {allSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </span>
                        <span className="text-sm font-medium text-slate-800">{table.label}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Columns */}
          <div className="flex flex-col min-h-0 border border-slate-200 rounded p-2">
            <div className="text-sm font-semibold mb-2" style={{ color: NAVY }}>
              Columns
            </div>
            <div className="overflow-y-auto flex-1 space-y-1">
              {expandedTable ? (
                expandedTable.columns.map((col) => {
                  const checked = pending.has(col.code);
                  return (
                    <label
                      key={col.code}
                      className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-slate-50 cursor-pointer"
                    >
                      <span className={`inline-flex items-center justify-center w-4 h-4 rounded border-2 flex-shrink-0 ${checked ? "bg-orange-500 border-orange-500" : "border-slate-300"}`}>
                        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                      </span>
                      <span className="text-sm text-slate-800">{col.label}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCol(col.code)}
                        className="sr-only"
                      />
                    </label>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 py-2">Expand a table to select columns.</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2 border-t border-slate-200">
          {onReset ? (
            <button type="button" onClick={() => setPending(new Set(defaultCols))} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
              Reset
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-semibold rounded border-2 bg-white text-slate-700 hover:bg-slate-50"
              style={{ borderColor: "#0ea5e9" }}
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 text-sm font-semibold rounded text-white"
              style={{ backgroundColor: ORANGE }}
            >
              APPLY
            </button>
          </div>
        </div>
      </div>
    </Popover>
  );
}
