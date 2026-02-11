/**
 * Tab identifiers for the main app navigation.
 * Each tab is implemented in its own file under tabs/.
 */
export type Tab =
  | "Summary"
  | "Diff"
  | "PatientList"
  | "NarrativesList"
  | "Narrative";

export const TAB_LABELS: Record<Tab, string> = {
  Summary: "Source Data Files",
  Diff: "Patient Profile",
  PatientList: "Patient List",
  NarrativesList: "Narratives list changes",
  Narrative: "Narrative Difference",
};
