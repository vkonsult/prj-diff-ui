import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { appTheme } from "./theme";
import SubjectDiffApp from "./SubjectDiffApp";

export default function App() {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <SubjectDiffApp />
    </ThemeProvider>
  );
}
