/**
 * Narratives list changes tab.
 * List of narrative documents with difference type, versions, progress, and bulk actions
 * (e.g. download). Supports filtering by change type and row selection.
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
  Button,
  Typography,
  IconButton,
  Checkbox,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { NARRATIVES_LIST, NAVY, ORANGE } from "../constants";
import type { FilterParams } from "../types";
import { DifferencePill } from "../components/DifferencePill";
import { ChangeTypeFilter } from "../components/ChangeTypeFilter";
import { CompareModeFilterBox } from "../components/CompareModeFilterBox";
import { OldValueTooltip } from "../components/ui/OldValueTooltip";

export function NarrativesListChangesTab() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [changeFilter, setChangeFilter] = useState<FilterParams["changeType"]>("All");

  const filteredRows = useMemo(() => {
    if (changeFilter === "All") return NARRATIVES_LIST;
    return NARRATIVES_LIST.filter((r) => r.changeType === changeFilter);
  }, [changeFilter]);

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredRows.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredRows.map((r) => r.id)));
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", borderBottom: 1, borderColor: "divider", p: 1 }}>
          <CompareModeFilterBox>
            <ChangeTypeFilter value={changeFilter} onChange={setChangeFilter} />
          </CompareModeFilterBox>
        </Box>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: "center", justifyContent: "space-between", gap: 1, p: 1, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" fontWeight="bold" sx={{ borderBottom: 2, borderColor: ORANGE }}>
            LIST OF NARRATIVES
          </Typography>
          <Button variant="contained" startIcon={<DownloadIcon />} sx={{ bgcolor: NAVY }}>
            Download All
          </Button>
        </Box>

        <Box sx={{ minHeight: 220, overflow: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={filteredRows.length > 0 && selectedIds.size === filteredRows.length}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Difference</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Narrative Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Versions</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Progress</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => {
                const isRemoved = row.changeType === "Removed";
                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      "& td": isRemoved
                        ? { textDecoration: "line-through", borderBottom: "1px dotted", borderColor: "grey.300", color: "text.secondary" }
                        : {},
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleRow(row.id)}
                        aria-label={`Select ${row.narrativeName}`}
                      />
                    </TableCell>
                    <TableCell><DifferencePill label={row.changeType} /></TableCell>
                    <TableCell>
                      <OldValueTooltip oldValue={row.changeType === "Modified" ? row.oldNarrativeName : undefined}>
                        <Button size="small" sx={{ color: NAVY, textTransform: "none", p: 0, minWidth: 0 }}>
                          {row.narrativeName}
                        </Button>
                      </OldValueTooltip>
                    </TableCell>
                    <TableCell>
                      <OldValueTooltip oldValue={row.changeType === "Modified" ? row.oldVersions : undefined}>
                        {row.versions || "—"}
                      </OldValueTooltip>
                    </TableCell>
                    <TableCell>
                      <OldValueTooltip oldValue={row.changeType === "Modified" ? row.oldProgress : undefined}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography component="span" sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, borderRadius: "50%", bgcolor: "success.main", color: "white", fontSize: "0.75rem", fontWeight: 600 }}>
                            {row.progressPct}%
                          </Typography>
                          <Typography variant="body2">{row.progress}</Typography>
                        </Box>
                      </OldValueTooltip>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" title="Download" aria-label="Download">
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredRows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    No narratives match the current filters.
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
