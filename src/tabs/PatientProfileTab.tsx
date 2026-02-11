/**
 * Patient Profile tab.
 * Subject-level diff view with domain and column selection. Shows difference pills and
 * per-column values with optional "only changed columns" and column picker.
 */
import { useMemo, useState } from "react";
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
  Typography,
} from "@mui/material";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import DifferenceIcon from "@mui/icons-material/Difference";
import { SUBJECTS, getColumnLabel, DOMAINS, COLUMN_DATASETS } from "../constants";
import { filterRows, isChanged, norm } from "../utils";
import { DifferencePill } from "../components/DifferencePill";
import { ChangeTypeFilter } from "../components/ChangeTypeFilter";
import { CompareModeFilterBox } from "../components/CompareModeFilterBox";
import { OldValueTooltip } from "../components/ui/OldValueTooltip";
import { ColumnPicker } from "../components/ColumnPicker";

export type PatientProfileTabProps = {
  selectedId: string;
  onSelectedIdChange: (id: string) => void;
  selectedCols: string[];
  onSelectedColsChange: (cols: string[]) => void;
  onlyChangedCols: boolean;
  onOnlyChangedColsChange: (v: boolean) => void;
  colsOpen: boolean;
  onColsOpenChange: (v: boolean) => void;
  showAll: boolean;
  onlyNarrative: boolean;
  onOpenNarrative?: (subjectId: string) => void;
};

export function PatientProfileTab({
  selectedCols,
  onSelectedColsChange,
  onlyChangedCols,
  onOnlyChangedColsChange,
  colsOpen,
  onColsOpenChange,
  showAll,
  onlyNarrative,
}: PatientProfileTabProps) {
  const [changeFilter, setChangeFilter] = useState<import("../types").FilterParams["changeType"]>("All");
  const [domainFilter, setDomainFilter] = useState<string>("AE");

  const columnsByDomain = useMemo(() => {
    const m: Record<string, Set<string>> = {};
    for (const d of COLUMN_DATASETS) {
      for (const t of d.tables) {
        m[t.id] = new Set(t.columns.map((c) => c.code));
      }
    }
    return m;
  }, []);

  const filtered = useMemo(
    () =>
      filterRows(SUBJECTS, {
        search: "",
        changeType: changeFilter,
        onlyChanged: !showAll,
        minChanges: 1,
        onlyNarrative,
      }),
    [changeFilter, onlyNarrative, showAll]
  );

  const effectiveColsBase = useMemo(() => {
    if (!onlyChangedCols) return selectedCols;
    const changed = new Set<string>();
    for (const s of SUBJECTS) {
      for (const d of s.diff) {
        if (selectedCols.includes(d.col) && isChanged(d.q1, d.q2)) {
          changed.add(d.col);
        }
      }
    }
    const cols = selectedCols.filter((c) => changed.has(c));
    return cols.length > 0 ? cols : selectedCols;
  }, [onlyChangedCols, selectedCols]);

  const effectiveCols = useMemo(() => {
    if (!domainFilter || !columnsByDomain[domainFilter]) return effectiveColsBase;
    const domainSet = columnsByDomain[domainFilter];
    return effectiveColsBase.filter((c) => domainSet.has(c));
  }, [domainFilter, columnsByDomain, effectiveColsBase]);

  return (
    <Box sx={{ mt: 1 }}>
      <Paper elevation={0} sx={{ p: 1.5, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Domain</InputLabel>
            <Select
              value={domainFilter}
              label="Domain"
              onChange={(e) => setDomainFilter(e.target.value)}
            >
              {DOMAINS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ViewColumnIcon />}
            onClick={() => onColsOpenChange(true)}
          >
            Configure columns
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DifferenceIcon />}
            onClick={() => onOnlyChangedColsChange(!onlyChangedCols)}
          >
            {onlyChangedCols ? "Only changed cols" : "All selected cols"}
          </Button>
          <Box sx={{ ml: "auto" }}>
            <CompareModeFilterBox>
              <ChangeTypeFilter value={changeFilter} onChange={setChangeFilter} />
            </CompareModeFilterBox>
          </Box>
        </Box>

        <Box sx={{ mt: 1, minHeight: 200, overflow: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ bgcolor: "secondary.light" }}>
                <TableCell sx={{ fontWeight: 600 }}>Difference</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>USUBJID</TableCell>
                {effectiveCols.map((c) => (
                  <TableCell key={c} sx={{ fontWeight: 600 }} title={getColumnLabel(c)}>
                    {c}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((s) => (
                <TableRow
                  key={s.rowKey ?? s.id}
                  hover
                  sx={{
                    "& td": s.changeType === "Removed"
                      ? { textDecoration: "line-through", borderBottom: "1px dotted", borderColor: "grey.300", color: "text.secondary" }
                      : {},
                  }}
                >
                  <TableCell>
                    <DifferencePill label={s.changeType} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{s.id}</TableCell>
                  {effectiveCols.map((c) => {
                    const d = s.diff.find((x) => x.col === c);
                    const newVal = d ? d.q2 : "—";
                    const oldVal = d ? d.q1 : "—";
                    const displayNew = norm(newVal) || "—";
                    const displayOld = norm(oldVal) || "—";
                    const changed = displayNew !== displayOld;
                    const showTooltip = s.changeType === "Modified" && changed;
                    return (
                      <TableCell key={c}>
                        <OldValueTooltip oldValue={showTooltip ? displayOld : undefined}>
                          {displayNew}
                        </OldValueTooltip>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2 + effectiveCols.length} align="center" sx={{ py: 4 }}>
                    No subjects match the current filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          Showing {filtered.length} subject{filtered.length === 1 ? "" : "s"} • Columns:{" "}
          {effectiveCols.length ? effectiveCols.map(getColumnLabel).join(", ") : "(none selected)"}
        </Typography>

        <ColumnPicker
          open={colsOpen}
          onClose={() => onColsOpenChange(false)}
          selectedCols={selectedCols}
          onApply={onSelectedColsChange}
          onReset={() => onSelectedColsChange(["AETERM", "AEDECOD", "AESEV", "AESER", "AEREL", "AESTDTC", "AEENDTC"])}
        />
      </Paper>
    </Box>
  );
}
