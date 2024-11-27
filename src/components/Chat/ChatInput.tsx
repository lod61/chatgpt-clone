import React, { forwardRef } from "react";
import { Box, IconButton, InputBase } from "@mui/material";
import { Send } from "@mui/icons-material";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ onSend, disabled }, ref) => {
    const [input, setInput] = React.useState("");

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !disabled) {
        onSend(input.trim());
        setInput("");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && !e.shiftKey && !disabled) {
        e.preventDefault();
        if (input.trim()) {
          onSend(input.trim());
          setInput("");
        }
      }
    };

    return (
      <Box
        sx={{
          position: "relative",
          p: { xs: 1, sm: 2, md: 4 },
          bgcolor: "#343541",
          borderTop: "1px solid",
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: "48rem",
            mx: "auto",
            position: "relative",
          }}
        >
          <InputBase
            ref={ref}
            multiline
            maxRows={5}
            placeholder="输入消息，按 Enter 发送，Shift + Enter 换行，按 / 聚焦"
            disabled={disabled}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: { xs: "0.75rem", sm: "1rem" },
                bgcolor: "#40414f",
                border: "1px solid rgba(255,255,255,0.1)",
                "&:hover": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&.Mui-focused": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "& fieldset": {
                  border: "none",
                },
                "& textarea": {
                  color: "#ECECF1",
                  padding: {
                    xs: "8px 40px 8px 12px",
                    sm: "12px 45px 12px 16px",
                  },
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  lineHeight: "1.5",
                  "&::placeholder": {
                    color: "rgba(236,236,241,0.5)",
                    opacity: 1,
                  },
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  type="submit"
                  disabled={disabled || !input.trim()}
                  sx={{
                    position: "absolute",
                    right: 8,
                    bottom: 8,
                    color:
                      disabled || !input.trim()
                        ? "rgba(255,255,255,0.3)"
                        : "#ECECF1",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  <Send />
                </IconButton>
              ),
            }}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            height: "2rem",
            background:
              "linear-gradient(to bottom, transparent, rgba(52,53,65,0.9))",
            pointerEvents: "none",
          }}
        />
      </Box>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
