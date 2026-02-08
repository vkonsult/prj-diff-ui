import { FileText } from "lucide-react";

type Props = { hasNarrative: boolean; onClick: () => void };

export function NarrativeIcon({ hasNarrative, onClick }: Props) {
  if (!hasNarrative) return <span className="inline-block w-6" />;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      title="Has narrative — view narrative difference"
      aria-label="View narrative difference"
    >
      <FileText className="h-4 w-4" />
    </button>
  );
}
