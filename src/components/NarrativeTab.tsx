import { FileText } from "lucide-react";
import { SUBJECTS } from "../constants";
import { Pill } from "./Pill";
import { SectionTitle } from "./SectionTitle";

type Props = { selectedSubjectId: string };

export function NarrativeTab({ selectedSubjectId }: Props) {
  const subject = SUBJECTS.find((s) => s.id === selectedSubjectId);
  const narrativeSubjects = SUBJECTS.filter((r) => r.narrative);

  return (
    <div className="mt-4 space-y-4">
      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <SectionTitle icon={FileText} title="Narrative Difference" />
        <p className="mt-2 text-sm text-slate-600">
          Narrative text differences for the selected subject between PRJ011 and PRJ012.
        </p>
        {subject ? (
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-slate-900">USUBJID: {subject.id}</span>
              <Pill label={subject.changeType} />
            </div>
            <p className="mt-2 text-sm text-slate-700">{subject.notes}</p>
            {subject.narrative ? (
              <div className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-800 ring-1 ring-slate-200">
                <div className="font-medium text-slate-600">Narrative content (placeholder)</div>
                <p className="mt-1">
                  This subject has narrative differences. In a full implementation, PRJ011 vs PRJ012 narrative text would be shown here.
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-slate-500">No narrative flagged for this subject.</p>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">Select a subject with a narrative icon to view narrative difference.</p>
        )}
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <SectionTitle icon={FileText} title="Subjects with narrative" />
        <div className="mt-3 space-y-2">
          {narrativeSubjects.map((r) => (
            <div
              key={r.id}
              className={`flex items-center justify-between rounded-2xl px-4 py-3 ring-1 ${r.id === selectedSubjectId ? "bg-slate-100 ring-slate-300" : "bg-slate-50 ring-slate-200"}`}
            >
              <span className="text-sm font-semibold text-slate-900">{r.id}</span>
              <span className="text-xs text-slate-600">{r.notes}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
