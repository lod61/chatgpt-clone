import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import ChatContainer from "./components/Chat/ChatContainer";
import MainLayout from "./components/Layout/MainLayout";

function App() {
  const theme = createTheme({
    palette: {
      mode: "light",
      background: {
        default: "#FFFFFF",
        paper: "#FFFFFF",
      },
      text: {
        primary: "#1A1A1A",
        secondary: "#6B6B6B",
      },
      divider: "rgba(0,0,0,0.1)",
    },
    typography: {
      fontFamily: "Söhne,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,\"Noto Color Emoji\"",
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
