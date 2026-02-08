import { useState } from "react";
import type { ChangeType } from "./types";
import type { Tab } from "./components/Header";
import { Header } from "./components/Header";
import { SummaryTab } from "./components/SummaryTab";
import { DiffTab } from "./components/DiffTab";
import { NarrativeTab } from "./components/NarrativeTab";
import { PatientListTab } from "./components/PatientListTab";
import { Footer } from "./components/Footer";
import { SUBJECTS } from "./constants";

export default function SubjectDiffApp() {
  const [tab, setTab] = useState<Tab>("Summary");
  const [showAll, setShowAll] = useState(true);
  const [onlyNarrative, setOnlyNarrative] = useState(false);
  const [search, setSearch] = useState("");
  const [changeType, setChangeType] = useState<"All" | ChangeType>("All");
  const [onlyChanged, setOnlyChanged] = useState(true);
  const [selectedId, setSelectedId] = useState(SUBJECTS[1]?.id ?? SUBJECTS[0]?.id ?? "");
  const [onlyChangedCols, setOnlyChangedCols] = useState(true);
  const [selectedCols, setSelectedCols] = useState<string[]>(["ARM", "TRT01A", "AESEV", "AESER", "AEREL"]);
  const [colsOpen, setColsOpen] = useState(false);

  const openNarrative = (subjectId: string) => {
    setSelectedId(subjectId);
    setTab("Narrative");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        tab={tab}
        onTabChange={setTab}
        showAll={showAll}
        onShowAllChange={setShowAll}
        onlyNarrative={onlyNarrative}
        onOnlyNarrativeChange={setOnlyNarrative}
      />
      <div className="mx-auto max-w-7xl px-4 py-4">
        {tab === "Summary" && (
          <SummaryTab
            onOpenDiff={() => setTab("Diff")}
            onSelectSubject={setSelectedId}
            onSetTab={setTab}
            onSetSelectedCols={setSelectedCols}
            onSetOnlyChangedCols={setOnlyChangedCols}
            onOpenNarrative={openNarrative}
          />
        )}
        {tab === "Diff" && (
          <DiffTab
            search={search}
            onSearchChange={setSearch}
            changeType={changeType}
            onChangeTypeChange={setChangeType}
            onlyChanged={onlyChanged}
            onOnlyChangedChange={setOnlyChanged}
            selectedId={selectedId}
            onSelectedIdChange={setSelectedId}
            selectedCols={selectedCols}
            onSelectedColsChange={setSelectedCols}
            onlyChangedCols={onlyChangedCols}
            onOnlyChangedColsChange={setOnlyChangedCols}
            colsOpen={colsOpen}
            onColsOpenChange={setColsOpen}
            showAll={showAll}
            onlyNarrative={onlyNarrative}
            onOpenNarrative={openNarrative}
          />
        )}
        {tab === "PatientList" && <PatientListTab />}
        {tab === "Narrative" && <NarrativeTab selectedSubjectId={selectedId} />}
      </div>
      <Footer />
    </div>
  );
}
