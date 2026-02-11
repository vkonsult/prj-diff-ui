/**
 * Main app header with logo, breadcrumb, and tab navigation.
 * Uses Material UI AppBar and Tabs.
 */
import { AppBar, Box, Button, Tab, Tabs, Toolbar, Typography } from "@mui/material";
import { NAVY } from "../constants";
import type { Tab as TabType } from "../tabs/types";
import { TAB_LABELS } from "../tabs/types";

type Props = {
  tab: TabType;
  onTabChange: (tab: TabType) => void;
};

const TAB_KEYS: TabType[] = ["Summary", "PatientList", "Diff", "NarrativesList", "Narrative"];

export function AppHeader({ tab, onTabChange }: Props) {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary" }}>
        <Toolbar variant="dense" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "secondary.main" }} />
            <Box>
              <Typography variant="body2" fontWeight="bold">ACUMEN</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>MEDICAL COMMUNICATIONS</Typography>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "grey.100", display: "flex", alignItems: "center", justifyContent: "center", border: 1, borderColor: "divider" }}>
            <Typography variant="caption" fontWeight="bold">OP</Typography>
          </Box>
        </Toolbar>
        <Box sx={{ borderBottom: 1, borderColor: "divider", px: { xs: 1, sm: 2 }, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Projects › PRJ011 ›{" "}
            <Button size="small" sx={{ color: NAVY, fontWeight: 600, minWidth: 0, p: 0, textTransform: "none" }}>
              Compare with other project
            </Button>
          </Typography>
          <Tabs
            value={tab}
            onChange={(_, v: TabType) => onTabChange(v)}
            sx={{ mt: 1, minHeight: 40, "& .MuiTab-root": { minHeight: 40, textTransform: "none", fontWeight: 600 } }}
          >
            {TAB_KEYS.map((k) => (
              <Tab key={k} label={TAB_LABELS[k]} value={k} />
            ))}
          </Tabs>
        </Box>
      </AppBar>
    </Box>
  );
}
