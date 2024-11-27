import { Box } from "@mui/material";
import { ReactNode } from "react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        bgcolor: "#FFFFFF",
      }}
    >
      <Box
        component="main"
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          height: "100vh",
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 