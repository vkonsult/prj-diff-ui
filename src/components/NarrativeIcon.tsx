import { FileText } from "lucide-react";
import { NAVY } from "../constants";

type Props = { hasNarrative: boolean; onClick: () => void };

export function NarrativeIcon({ hasNarrative, onClick }: Props) {
  if (!hasNarrative) return <span className="inline-block w-6" />;
  return (
    <button
      type="button"
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className="inline-flex items-center justify-center rounded-lg p-1.5 font-medium underline-offset-2 hover:underline"
      style={{ color: NAVY }}
      title="View narrative difference (opens Narrative tab)"
      aria-label="View narrative difference — opens Narrative Difference tab"
    >
      <FileText className="h-4 w-4" />
    </button>
  );
}
