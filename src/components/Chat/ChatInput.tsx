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
      e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
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
          position: "relative",
          padding: "8px",
          backgroundColor: "#343541",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: "48rem",
            margin: "0 auto",
            position: "relative",
            backgroundColor: "#40414F",
            border: "1px solid rgba(32,33,35,0.5)",
            borderRadius: "0.75rem",
            boxShadow: "0 0 15px rgba(0,0,0,0.1)",
            padding: "10px",
            transition: "border-color 0.15s ease",
            "&:hover": {
              borderColor: "rgba(32,33,35,0.8)",
            },
            "&:focus-within": {
              borderColor: "#2C2D35",
              boxShadow: "0 0 15px rgba(0,0,0,0.2)",
            },
          }}
        >
          <InputBase
            inputRef={inputRef}
            multiline
            maxRows={8}
            placeholder={
              isGenerating
                ? "AI 正在回答中，您可以继续输入..."
                : "输入消息，按 Enter 发送，Shift + Enter 换行，按 / 聚焦"
            }
            disabled={disabled}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{
              width: "100%",
              minHeight: "24px",
              maxHeight: "200px",
              padding: "0 40px 0 10px",
              color: "#ECECF1",
              fontSize: "1rem",
              lineHeight: "1.5",
              backgroundColor: "transparent",
              "& .MuiInputBase-input": {
                padding: 0,
                "&::placeholder": {
                  color: "rgba(236,236,241,0.6)",
                  opacity: 1,
                },
              },
            }}
          />
          <IconButton
            type="submit"
            disabled={disabled || !input.trim()}
            sx={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              padding: "4px",
              color: isGenerating
                ? "primary.main"
                : disabled || !input.trim()
                ? "rgba(255,255,255,0.3)"
                : "#ECECF1",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
        <Box
          sx={{
            position: "absolute",
            bottom: "100%",
            left: 0,
            right: 0,
            height: "32px",
            background:
              "linear-gradient(to bottom, rgba(52,53,65,0), rgba(52,53,65,1))",
            pointerEvents: "none",
          }}
        />
      </Box>
    );
  }
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
