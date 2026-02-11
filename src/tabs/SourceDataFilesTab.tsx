/**
 * Source Data Files tab.
 * Compares data files between PRJ011 and PRJ012 with dataset and difference-type filters.
 * Lists file name, project, type, size, uploaded date and by.
 */
import { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { DATA_CHANGES_TABLE, NAVY, ORANGE } from "../constants";
import type { DataChangeRow } from "../constants";
import type { FilterParams } from "../types";
import { DifferencePill } from "../components/DifferencePill";
import { ChangeTypeFilter } from "../components/ChangeTypeFilter";
import { CompareModeFilterBox } from "../components/CompareModeFilterBox";
import { OldValueTooltip } from "../components/ui/OldValueTooltip";

export type SourceDataFilesTabProps = {
  onOpenDiff: () => void;
  onSelectSubject?: (id: string) => void;
  onSetTab?: (tab: "Diff") => void;
  onSetSelectedCols?: (cols: string[]) => void;
  onSetOnlyChangedCols?: (v: boolean) => void;
  onOpenNarrative?: (subjectId: string) => void;
};

export function SourceDataFilesTab({ onOpenDiff }: SourceDataFilesTabProps) {
  const [datasetFilter, setDatasetFilter] = useState<"All" | "SDTM" | "ADaM">("All");
  const [changeFilter, setChangeFilter] = useState<FilterParams["changeType"]>("All");

  const fileCounts = useMemo(() => {
    const added = DATA_CHANGES_TABLE.filter((r) => r.changeType === "Added").length;
    const removed = DATA_CHANGES_TABLE.filter((r) => r.changeType === "Removed").length;
    const total = DATA_CHANGES_TABLE.length;
    return {
      prj011: total,
      prj012: total + added - removed,
    };
  }, []);

  const filteredRows = useMemo(() => {
    let rows = DATA_CHANGES_TABLE;
    if (datasetFilter !== "All") {
      const isAdam = (r: DataChangeRow) =>
        r.fileName.startsWith("ADaM") || r.fileName.startsWith("Analysis Data Model");
      rows = rows.filter((r) =>
        datasetFilter === "SDTM" ? !isAdam(r) : isAdam(r)
      );
    }
    if (changeFilter !== "All") {
      rows = rows.filter((r) => r.changeType === changeFilter);
    }
    return rows;
  }, [datasetFilter, changeFilter]);

  return (
    <Box sx={{ mt: 0 }}>
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "nowrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Dataset</InputLabel>
            <Select
              value={datasetFilter}
              label="Dataset"
              onChange={(e) => setDatasetFilter(e.target.value as "All" | "SDTM" | "ADaM")}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="SDTM">SDTM</MenuItem>
              <MenuItem value="ADaM">ADaM</MenuItem>
            </Select>
          </FormControl>
          <CompareModeFilterBox
            leadingContent={
              <span className="shrink-0 text-sm font-bold" style={{ color: ORANGE }}>
                Compare found {fileCounts.prj012} data files in PRJ012 and {fileCounts.prj011} in PRJ011
              </span>
            }
          >
            <ChangeTypeFilter value={changeFilter} onChange={setChangeFilter} />
          </CompareModeFilterBox>
        </Box>

        <Box sx={{ minHeight: 220, overflow: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell sx={{ fontWeight: 600 }}>Difference</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>File Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Project Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>File Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>File Size</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Uploaded Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Uploaded By</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <SourceDataFilesRow key={row.id} row={row} onOpenDiff={onOpenDiff} />
              ))}
              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    No files for selected dataset.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper>
    </Box>
  );
}

function SourceDataFilesRow({
  row,
  onOpenDiff,
}: {
  row: DataChangeRow;
  onOpenDiff: () => void;
}) {
  const isRemoved = row.changeType === "Removed";
  return (
    <TableRow
      hover
      sx={{
        "& td": isRemoved
          ? { textDecoration: "line-through", borderBottom: "1px dotted", borderColor: "grey.300", color: "text.secondary" }
          : {},
      }}
    >
      <TableCell>
        <DifferencePill label={row.changeType} />
      </TableCell>
      <TableCell>
        <Button
          size="small"
          onClick={onOpenDiff}
          sx={{ color: NAVY, textTransform: "none", textAlign: "left", p: 0, minWidth: 0 }}
        >
          {row.fileName}
        </Button>
      </TableCell>
      <TableCell>{row.projectName}</TableCell>
      <TableCell>{row.fileType}</TableCell>
      <TableCell>
        <OldValueTooltip oldValue={row.changeType === "Modified" ? row.oldFileSize : undefined}>
          {row.fileSize}
        </OldValueTooltip>
      </TableCell>
      <TableCell>
        <OldValueTooltip oldValue={row.changeType === "Modified" ? row.oldUploadedDate : undefined}>
          {row.uploadedDate}
        </OldValueTooltip>
      </TableCell>
      <TableCell>
        <OldValueTooltip oldValue={row.changeType === "Modified" ? row.oldUploadedBy : undefined}>
          {row.uploadedBy}
        </OldValueTooltip>
      </TableCell>
    </TableRow>
  );
}
