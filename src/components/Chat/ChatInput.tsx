import { Send } from "@mui/icons-material";
import { Box, IconButton, InputBase } from "@mui/material";
import React, { forwardRef } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isGenerating?: boolean;
}

const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  ({ onSend, disabled, isGenerating }, ref) => {
    const [input, setInput] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() && !disabled) {
        onSend(input.trim());
        setInput("");
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
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
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          padding: { xs: "8px 8px 24px", sm: "8px 8px 24px" },
          background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%)",
          zIndex: 1000,
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: "48rem",
            margin: "0 auto",
            position: "relative",
            backgroundColor: "#FFFFFF",
            border: "1px solid rgba(0,0,0,0.1)",
            borderRadius: "0.75rem",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            padding: { xs: "8px", sm: "10px" },
            transition: "border-color 0.15s ease",
            "&:hover": {
              borderColor: "rgba(0,0,0,0.2)",
            },
            "&:focus-within": {
              borderColor: "#10A37F",
              boxShadow: "0 0 0 1px #10A37F",
            },
          }}
        >
          <InputBase
            inputRef={inputRef}
            multiline
            maxRows={8}
            placeholder={
              isGenerating
                ? "继续输入..."
                : "输入消息，按 Enter 发送，Shift + Enter 换行"
            }
            disabled={disabled}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: "100%",
              minHeight: "24px",
              maxHeight: { xs: "150px", sm: "200px" },
              padding: "0 40px 0 10px",
              color: "#1A1A1A",
              fontSize: { xs: "0.875rem", sm: "1rem" },
              lineHeight: 1.5,
              backgroundColor: "transparent",
              fontFamily: "inherit",
              "& .MuiInputBase-input": {
                padding: 0,
                "&::placeholder": {
                  color: "rgba(0,0,0,0.4)",
                  opacity: 1,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                },
              },
            }}
          />
          <IconButton
            type="submit"
            disabled={disabled || !input.trim()}
            sx={{
              position: "absolute",
              right: { xs: "8px", sm: "10px" },
              top: "50%",
              transform: "translateY(-50%)",
              padding: { xs: "4px", sm: "6px" },
              color: disabled || !input.trim() ? "rgba(0,0,0,0.2)" : "#10A37F",
              "&:hover": {
                backgroundColor: "rgba(16,163,127,0.1)",
              },
            }}
          >
            <Send sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
      </Box>
    );
  },
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
