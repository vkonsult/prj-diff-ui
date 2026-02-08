import { NAVY } from "../constants";

type Props = {
  checked: boolean;
  label: string;
  accent?: string;
  onToggle: (v: boolean) => void;
};

export function Switch({ checked, label, accent, onToggle }: Props) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2"
      aria-pressed={checked}
      onClick={() => onToggle(!checked)}
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full border transition ${checked ? "border-transparent" : "border-slate-300"}`}
        style={{ backgroundColor: checked ? accent ?? NAVY : "#e5e7eb" }}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </span>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </button>
  );
}
