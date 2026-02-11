import { useRef, useState } from "react";
import { Check, X } from "lucide-react";
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
import type { FilterParams } from "../types";
import { ChangeTypeFilter } from "./ChangeTypeFilter";
import { DifferencePill } from "./DifferencePill";

type ReviewDecision = "pending" | "accepted" | "rejected";

const TRACK_CHANGE_DETAILS: Record<string, string> = {
  "Subject identifier / country":
    "Subject identifier value format changed from Camel Case to ALL CAPS.",
  "Treatment group":
    "Updated wording to clarify dosing schedule and administration route.",
  "Reason of discontinuation from treatment":
    "Updated reason for treatment discontinuation based on progressive disease.",
  "Criteria met for narratives":
    "Narrative criteria flag updated based on new safety events.",
};

function ReviewStatusPill({ decision }: { decision: ReviewDecision }) {
  const config =
    decision === "accepted"
      ? { label: "Accepted", className: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300" }
      : decision === "rejected"
        ? { label: "Rejected", className: "bg-rose-100 text-rose-800 ring-1 ring-rose-300" }
        : { label: "Pending", className: "bg-slate-100 text-slate-600 ring-1 ring-slate-200" };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}
      style={{ fontFamily: "inherit" }}
    >
      {config.label}
    </span>
  );
}

type Props = {
  selectedSubjectId: string;
  onSubjectChange?: (id: string) => void;
};

function NarrativePanel({
  side,
  selectedSubjectId,
  onSubjectChange,
  showTrackChangesButton,
  enableChangeNavigation,
  reviewDecisions,
  onReviewDecisionChange,
  showReviewToggles,
}: {
  side: "new" | "existing";
  selectedSubjectId: string;
  onSubjectChange?: (id: string) => void;
  showTrackChangesButton: boolean;
  enableChangeNavigation?: boolean;
  reviewDecisions?: Record<string, ReviewDecision>;
  onReviewDecisionChange?: (label: string, decision: Exclude<ReviewDecision, "pending">) => void;
  showReviewToggles?: boolean;
}) {
  const narrativeSubjects = SUBJECTS.filter((r) => r.narrative);
  const isNew = side === "new";

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentChangeIdx, setCurrentChangeIdx] = useState(-1);
  const [keyRowFilter, setKeyRowFilter] =
    useState<FilterParams["changeType"]>("All");

  const handleNextChange = () => {
    if (!enableChangeNavigation || !isNew) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const changes = Array.from(
      container.querySelectorAll<HTMLElement>("[data-narrative-change]")
    ).sort(
      (a, b) =>
        Number(a.getAttribute("data-narrative-change")) -
        Number(b.getAttribute("data-narrative-change"))
    );
    if (!changes.length) return;
    const next = (currentChangeIdx + 1) % changes.length;
    const el = changes[next];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setCurrentChangeIdx(next);
  };

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

      <div ref={scrollContainerRef} className="flex-1 overflow-auto p-3">
        {/* Sample Narrative title + TRACK CHANGES/PROMPTS (left only) */}
        <div className="flex items-center justify-between gap-2">
          <h2
            className="text-base font-bold"
            style={{ color: NAVY }}
          >
            Sample Narrative
          </h2>
          <div className="flex items-center gap-2">
            {enableChangeNavigation && isNew && (
              <button
                type="button"
                onClick={handleNextChange}
                className="rounded px-2 py-1.5 text-xs font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50"
              >
                Next change
              </button>
            )}
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
        </div>

        {/* Difference filter for key/value rows (new side in track view) */}
        {isNew && enableChangeNavigation && (
          <div className="mt-2">
            <ChangeTypeFilter
              value={keyRowFilter}
              onChange={setKeyRowFilter}
              hideMatched
            />
          </div>
        )}

        {/* Key-value data block with Difference column */}
        <div className="mt-3 divide-y divide-slate-200 rounded border border-slate-200">
          {NARRATIVE_KEY_VALUES.filter(
            (row) =>
              row.changeType !== "Unchanged" &&
              (keyRowFilter === "All" || row.changeType === keyRowFilter)
          ).map((row, i) => (
            // Key/value + difference row
            <div
              key={i}
              className={`grid grid-cols-1 gap-1 px-2 py-1.5 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,2.5fr)_minmax(0,1fr)] ${
                row.changeType === "Removed"
                  ? "border-b border-dotted border-slate-300 line-through text-slate-500"
                  : ""
              }`}
            >
              <span className="text-xs font-medium text-slate-600">
                {row.label}
              </span>
              <span className="text-sm text-slate-900">{row.value}</span>
              <span className="flex items-center justify-start gap-2 sm:justify-end">
                <DifferencePill label={row.changeType} />
                {isNew &&
                  showReviewToggles &&
                  row.changeType !== "Unchanged" && (
                    <>
                      <ReviewStatusPill
                        decision={reviewDecisions?.[row.label] ?? "pending"}
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            onReviewDecisionChange?.(row.label, "accepted")
                          }
                          className={`flex h-6 w-6 items-center justify-center rounded border text-[10px] font-semibold ${
                            (reviewDecisions?.[row.label] ?? "pending") ===
                            "accepted"
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                              : "border-slate-300 bg-white text-slate-500 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-800"
                          }`}
                          aria-label={`Accept change for ${row.label}`}
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onReviewDecisionChange?.(row.label, "rejected")
                          }
                          className={`flex h-6 w-6 items-center justify-center rounded border text-[10px] font-semibold ${
                            (reviewDecisions?.[row.label] ?? "pending") ===
                            "rejected"
                              ? "border-rose-500 bg-rose-50 text-rose-700"
                              : "border-slate-300 bg-white text-slate-500 hover:border-rose-400 hover:bg-rose-50 hover:text-rose-800"
                          }`}
                          aria-label={`Reject change for ${row.label}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </>
                  )}
              </span>
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
          {(() => {
            let changeIndex = 0;
            return NARRATIVE_PARAGRAPHS.map((segments, pIdx) => (
              <p key={pIdx} className="text-sm leading-relaxed text-slate-800">
                {segments.map((seg: NarrativeSegment, sIdx) => {
                  if (isNew && seg.highlight === "modified") {
                    const idx = changeIndex++;
                    return (
                      <span
                        key={sIdx}
                        data-narrative-change={idx}
                        className="bg-rose-100 text-rose-900 rounded-sm px-0.5"
                      >
                        {seg.text}
                      </span>
                    );
                  }
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
            ));
          })()}
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

  const [viewMode, setViewMode] = useState<"comparison" | "trackView">(
    "comparison"
  );

  const [keyValueDecisions, setKeyValueDecisions] = useState<
    Record<string, ReviewDecision>
  >({});

  const handleKeyValueDecision = (
    label: string,
    decision: Exclude<ReviewDecision, "pending">
  ) => {
    setKeyValueDecisions((prev) => ({
      ...prev,
      [label]: decision,
    }));
  };

  return (
    <div className="mt-2 space-y-3">
      {/* View toggle */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-semibold text-slate-600">View:</span>
        <button
          type="button"
          onClick={() => setViewMode("comparison")}
          className={`rounded-full px-3 py-1 font-semibold ring-1 text-xs ${
            viewMode === "comparison"
              ? "bg-slate-900 text-white ring-slate-900"
              : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50"
          }`}
        >
          Side by side (PRJ012 vs PRJ011)
        </button>
        <button
          type="button"
          onClick={() => setViewMode("trackView")}
          className={`rounded-full px-3 py-1 font-semibold ring-1 text-xs ${
            viewMode === "trackView"
              ? "bg-slate-900 text-white ring-slate-900"
              : "bg-white text-slate-700 ring-slate-300 hover:bg-slate-50"
          }`}
        >
          Narrative + Track Changes
        </button>
      </div>

      {viewMode === "comparison" ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <NarrativePanel
            side="new"
            selectedSubjectId={effectiveId}
            onSubjectChange={onSubjectChange}
            showTrackChangesButton={true}
            enableChangeNavigation={false}
          />
          <NarrativePanel
            side="existing"
            selectedSubjectId={effectiveId}
            onSubjectChange={onSubjectChange}
            showTrackChangesButton={false}
            enableChangeNavigation={false}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          {/* Single narrative view (PRJ012) */}
          <NarrativePanel
            side="new"
            selectedSubjectId={effectiveId}
            onSubjectChange={onSubjectChange}
            showTrackChangesButton={true}
            enableChangeNavigation={true}
            reviewDecisions={keyValueDecisions}
            onReviewDecisionChange={handleKeyValueDecision}
            showReviewToggles={true}
          />

          {/* Track changes panel (static sample, based on reference UI) */}
          <div className="flex flex-col rounded-md bg-white shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Track Changes
              </h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                Text changes
              </span>
            </div>
            <div className="flex-1 space-y-3 overflow-auto p-3 text-xs text-slate-800">
              {NARRATIVE_KEY_VALUES.filter(
                (row) => row.changeType !== "Unchanged"
              ).map((row) => {
                const decision = keyValueDecisions[row.label] ?? "pending";
                const statusLabel =
                  decision === "accepted"
                    ? "Accepted"
                    : decision === "rejected"
                    ? "Rejected"
                    : "Pending";
                const statusClasses =
                  decision === "accepted"
                    ? "bg-emerald-100 text-emerald-800"
                    : decision === "rejected"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-slate-200 text-slate-800";

                return (
                  <div
                    key={row.label}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{row.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClasses}`}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <p className="mt-1">
                      {TRACK_CHANGE_DETAILS[row.label] ??
                        "Details for this change are highlighted in the narrative text."}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
