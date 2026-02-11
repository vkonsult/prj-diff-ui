/**
 * Narrative Difference tab.
 * Side-by-side or single narrative view with track changes. Key-value metadata
 * with difference pills and accept/reject toggles; track changes panel lists all
 * changed rows with status. Matched rows are hidden on this tab.
 */
import { NarrativeTab } from "../components/NarrativeTab";

export type NarrativeDifferenceTabProps = {
  selectedSubjectId: string;
  onSubjectChange?: (id: string) => void;
};

export function NarrativeDifferenceTab({
  selectedSubjectId,
  onSubjectChange,
}: NarrativeDifferenceTabProps) {
  return (
    <NarrativeTab
      selectedSubjectId={selectedSubjectId}
      onSubjectChange={onSubjectChange}
    />
  );
}
