import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ChatContainer from "./components/Chat/ChatContainer";
import MainLayout from "./components/Layout/MainLayout";

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#343541",
        paper: "#343541",
      },
      text: {
        primary: "#ECECF1",
        secondary: "#C5C5D2",
      },
      divider: "rgba(255,255,255,0.1)",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout>
        <ChatContainer />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
