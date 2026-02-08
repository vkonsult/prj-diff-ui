import { List } from "lucide-react";
import { SectionTitle } from "./SectionTitle";

export function PatientListTab() {
  return (
    <div className="mt-2">
      <div className="rounded-md bg-white p-3 shadow-sm ring-1 ring-slate-200">
        <SectionTitle icon={List} title="Patient List Changes" />
        <p className="mt-2 text-sm text-slate-600">
          Patient list changes between PRJ011 and PRJ012. This view is marked the same as other tabs; content can be added here.
        </p>
        <div className="mt-2 rounded bg-slate-50 p-4 text-center text-sm text-slate-500 ring-1 ring-slate-200">
          Patient list diff placeholder — same tab style as Overall Summary and Patient Profile Changes.
        </div>
      </div>
    </div>
  );
}
