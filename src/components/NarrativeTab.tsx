import { NAVY, ORANGE } from "../constants";
import {
  NARRATIVE_KEY_VALUES,
  NARRATIVE_EVENT_HEADERS,
  NARRATIVE_EVENT_ROW,
  NARRATIVE_ABBREVS,
  NARRATIVE_PARAGRAPHS,
} from "../constants";
import { SUBJECTS } from "../constants";
import type { NarrativeSegment } from "../constants";

type Props = {
  selectedSubjectId: string;
  onSubjectChange?: (id: string) => void;
};

function NarrativePanel({
  side,
  selectedSubjectId,
  onSubjectChange,
  showTrackChangesButton,
}: {
  side: "new" | "existing";
  selectedSubjectId: string;
  onSubjectChange?: (id: string) => void;
  showTrackChangesButton: boolean;
}) {
  const narrativeSubjects = SUBJECTS.filter((r) => r.narrative);
  const isNew = side === "new";

  return (
    <div className="flex flex-col rounded-md bg-white shadow-sm ring-1 ring-slate-200">
      {/* Header: project label + pill, USUBJID dropdown */}
      <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-900">
            {isNew ? "PRJ012" : "PRJ011"}
          </span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-semibold ${
              isNew
                ? "bg-emerald-100 text-emerald-800"
                : "bg-orange-100 text-orange-800"
            }`}
          >
            {isNew ? "New" : "Existing"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-600">USUBJID</span>
          <select
            value={selectedSubjectId}
            onChange={(e) => onSubjectChange?.(e.target.value)}
            className="rounded border border-slate-300 bg-white px-2 py-1.5 text-sm font-medium text-slate-900 ring-1 ring-slate-200"
            aria-label="Select subject"
          >
            {narrativeSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3">
        {/* Sample Narrative title + TRACK CHANGES/PROMPTS (left only) */}
        <div className="flex items-center justify-between gap-2">
          <h2
            className="text-base font-bold"
            style={{ color: NAVY }}
          >
            Sample Narrative
          </h2>
          {showTrackChangesButton && (
            <button
              type="button"
              className="rounded px-2 py-1.5 text-sm font-semibold text-white"
              style={{ backgroundColor: ORANGE }}
            >
              TRACK CHANGES/PROMPTS
            </button>
          )}
        </div>

        {/* Key-value data block */}
        <div className="mt-3 divide-y divide-slate-200 rounded border border-slate-200">
          {NARRATIVE_KEY_VALUES.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-1 gap-1 px-2 py-1.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
            >
              <span className="text-xs font-medium text-slate-600">
                {row.label}
              </span>
              <span className="text-sm text-slate-900">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Event summary table */}
        <div className="mt-3 overflow-x-auto rounded border border-slate-200">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50">
                {NARRATIVE_EVENT_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="border-b border-slate-200 px-2 py-1.5 text-left text-xs font-semibold text-slate-700"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {NARRATIVE_EVENT_ROW.map((cell, i) => (
                  <td
                    key={i}
                    className="border-b border-slate-100 px-2 py-1.5 text-slate-800"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-slate-500">
          {NARRATIVE_ABBREVS.map((a) => (
            <span key={a}>{a}</span>
          ))}
        </div>

        {/* Free-text narrative: left = Data Modified (rose), right = New Data Found (emerald) */}
        <div className="mt-3 space-y-2">
          {NARRATIVE_PARAGRAPHS.map((segments, pIdx) => (
            <p key={pIdx} className="text-sm leading-relaxed text-slate-800">
              {segments.map((seg: NarrativeSegment, sIdx) => {
                if (isNew && seg.highlight === "modified")
                  return (
                    <span
                      key={sIdx}
                      className="bg-rose-100 text-rose-900 rounded-sm px-0.5"
                    >
                      {seg.text}
                    </span>
                  );
                if (!isNew && seg.highlight === "new")
                  return (
                    <span
                      key={sIdx}
                      className="bg-emerald-100 text-emerald-900 rounded-sm px-0.5"
                    >
                      {seg.text}
                    </span>
                  );
                return <span key={sIdx}>{seg.text}</span>;
              })}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NarrativeTab({
  selectedSubjectId,
  onSubjectChange,
}: Props) {
  const narrativeSubjects = SUBJECTS.filter((r) => r.narrative);
  const effectiveId = narrativeSubjects.some((s) => s.id === selectedSubjectId)
    ? selectedSubjectId
    : narrativeSubjects[0]?.id ?? selectedSubjectId;

  return (
    <div className="mt-2">
      <p className="mb-2 text-sm text-slate-600">
        Summary is showing the difference from all the domains, patient list and
        narrative.
      </p>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <NarrativePanel
          side="new"
          selectedSubjectId={effectiveId}
          onSubjectChange={onSubjectChange}
          showTrackChangesButton={true}
        />
        <NarrativePanel
          side="existing"
          selectedSubjectId={effectiveId}
          onSubjectChange={onSubjectChange}
          showTrackChangesButton={false}
        />
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 rounded-md bg-white px-3 py-2 shadow-sm ring-1 ring-slate-200">
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          Data Modified
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          New Data Found
        </span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
          <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
          No Data Found
        </span>
      </div>
    </div>
  );
}
