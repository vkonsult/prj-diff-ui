import { createTheme } from "@mui/material/styles";
import { NAVY, ORANGE } from "./constants";

/**
 * MUI theme for the PRJ diff app. Uses brand colors NAVY and ORANGE.
 */
export const appTheme = createTheme({
  palette: {
    primary: { main: NAVY },
    secondary: { main: ORANGE },
    background: { default: "#f8fafc" },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none" },
      },
    },
  },
});
