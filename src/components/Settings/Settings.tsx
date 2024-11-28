import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Link,
  Box,
  Typography,
} from "@mui/material";

interface SettingsProps {
  open: boolean
  onClose: () => void
  onSubmit: (apiKey: string) => void
  error?: string | null
  isValidating?: boolean
}

export default function Settings({
  open,
  onClose,
  onSubmit,
  error,
  isValidating = false,
}: SettingsProps) {
  const [apiKey, setApiKey] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSubmit(apiKey.trim());
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#2D2D2D",
          color: "#ECECF1",
          borderRadius: 2,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6">API Key Settings</Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                bgcolor: "rgba(255,0,0,0.1)",
                color: "#ff6b6b",
                "& .MuiAlert-icon": {
                  color: "#ff6b6b",
                },
              }}
            >
              {error}
            </Alert>
          )}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
              Enter your OpenRouter API key to start chatting. You can get one from{" "}
              <Link 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener"
                sx={{ color: "#7C7CFF" }}
              >
                openrouter.ai
              </Link>
            </Typography>
          </Box>
          <TextField
            autoFocus
            fullWidth
            label="API Key"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            disabled={isValidating}
            sx={{
              "& .MuiOutlinedInput-root": {
                color: "#ECECF1",
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#7C7CFF",
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.7)",
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={!apiKey.trim() || isValidating}
            fullWidth
            sx={{
              height: 44,
              bgcolor: "#7C7CFF",
              "&:hover": {
                bgcolor: "#6B6BE5",
              },
              "&.Mui-disabled": {
                bgcolor: "rgba(124,124,255,0.3)",
              },
            }}
          >
            {isValidating ? (
              <CircularProgress size={24} sx={{ color: "#ECECF1" }} />
            ) : (
              "Save API Key"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
} 