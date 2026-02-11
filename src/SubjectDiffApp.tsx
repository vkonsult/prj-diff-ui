import { useState } from "react";
import { Box, Container } from "@mui/material";
import type { Tab } from "./tabs";
import { AppHeader } from "./components/AppHeader";
import {
  SourceDataFilesTab,
  PatientProfileTab,
  PatientListTab,
  NarrativesListChangesTab,
  NarrativeDifferenceTab,
} from "./tabs";
import { Footer } from "./components/Footer";
import { SUBJECTS } from "./constants";

export default function SubjectDiffApp() {
  const [tab, setTab] = useState<Tab>("Summary");
  const [selectedId, setSelectedId] = useState(SUBJECTS[1]?.id ?? SUBJECTS[0]?.id ?? "");
  const [onlyChangedCols, setOnlyChangedCols] = useState(true);
  const [selectedCols, setSelectedCols] = useState<string[]>([
    "AETERM",
    "AEDECOD",
    "AESEV",
    "AESER",
    "AEREL",
    "AESTDTC",
    "AEENDTC",
  ]);
  const [colsOpen, setColsOpen] = useState(false);

  const openNarrative = (subjectId: string) => {
    setSelectedId(subjectId);
    setTab("Narrative");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppHeader tab={tab} onTabChange={setTab} />
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2 }, py: 1 }}>
        {tab === "Summary" && (
          <SourceDataFilesTab
            onOpenDiff={() => setTab("Diff")}
            onSelectSubject={setSelectedId}
            onSetTab={setTab}
            onSetSelectedCols={setSelectedCols}
            onSetOnlyChangedCols={setOnlyChangedCols}
            onOpenNarrative={openNarrative}
          />
        )}
        {tab === "Diff" && (
          <PatientProfileTab
            selectedId={selectedId}
            onSelectedIdChange={setSelectedId}
            selectedCols={selectedCols}
            onSelectedColsChange={setSelectedCols}
            onlyChangedCols={onlyChangedCols}
            onOnlyChangedColsChange={setOnlyChangedCols}
            colsOpen={colsOpen}
            onColsOpenChange={setColsOpen}
            showAll={true}
            onlyNarrative={false}
            onOpenNarrative={openNarrative}
          />
        )}
        {tab === "PatientList" && <PatientListTab />}
        {tab === "NarrativesList" && <NarrativesListChangesTab />}
        {tab === "Narrative" && (
          <NarrativeDifferenceTab
            selectedSubjectId={selectedId}
            onSubjectChange={setSelectedId}
          />
        )}
      </Container>
      <Footer />
    </Box>
  );
}
