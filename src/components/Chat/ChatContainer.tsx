import { useApiKey } from "@/hooks/useApiKey";
import { streamChat } from "@/services/api";
import { Message } from "@/types/chat";
import { Settings as SettingsIcon } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import Settings from "../Settings/Settings";
import ChatHistory from "./ChatHistory";
import ChatInput from "./ChatInput";

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const { apiKey, error, isValidating, validateApiKey, clearApiKey } =
    useApiKey();
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInInput =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      console.log("Key pressed:", e.key);
      console.log("Target element:", target.tagName);
      console.log("Is in input:", isInInput);
      console.log("Input ref exists:", !!inputRef.current);

      if (e.key === "/" && !isInInput) {
        e.preventDefault();
        if (inputRef.current) {
          console.log("Focusing input");
          inputRef.current.focus();
          const input = inputRef.current as HTMLInputElement;
          if (input.value === "/") {
            input.value = "";
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, []);

  const updateMessage = useCallback((content: string) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastMessage = newMessages[newMessages.length - 1];
      if (lastMessage && lastMessage.role === "assistant") {
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
        };
        return newMessages;
      }
      return prev;
    });
  }, []);

  const handleSend = async (content: string) => {
    if (isGenerating) {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
      setIsLoading(false);
      setMessages((prev) =>
        prev.filter(
          (msg, index, arr) =>
            !(
              index === arr.length - 1 &&
              msg.role === "assistant" &&
              !msg.content
            )
        )
      );
    }

    if (!apiKey) return;

    const userMessage: Message = { role: "user", content };
    const aiMessage: Message = { role: "assistant", content: "" };

    setMessages((prevMessages) => {
      const currentMessages = prevMessages.filter(
        (msg) =>
          msg.role === "user" || (msg.role === "assistant" && msg.content)
      );

      const newMessages = [...currentMessages, userMessage, aiMessage];

      (async () => {
        setIsGenerating(true);
        setIsLoading(true);

        abortControllerRef.current = new AbortController();

        try {
          await streamChat(
            apiKey,
            currentMessages.concat(userMessage),
            updateMessage,
            abortControllerRef.current.signal
          );
        } catch (err) {
          console.error("Chat error:", err);
          if (err instanceof Error) {
            if (err.name === "AbortError") {
              console.log("Request cancelled");
            } else if (err.message.includes("API key")) {
              clearApiKey();
              setShowApiKeyInput(true);
            }
          }
        } finally {
          setIsGenerating(false);
          setIsLoading(false);
          abortControllerRef.current = null;
          inputRef.current?.focus();
        }
      })();

      return newMessages;
    });
  };

  const handleApiKeySubmit = async (key: string) => {
    const isValid = await validateApiKey(key);
    if (isValid) {
      setShowApiKeyInput(false);
      inputRef.current?.focus();
    }
  };

  const handleEdit = async (index: number, newContent: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    const newMessages = [...messages];
    const originalMessage = newMessages[index];
    
    if (!originalMessage) {
      console.error('Message not found at index:', index);
      return;
    }

    newMessages[index] = {
      role: originalMessage.role,
      content: newContent
    };

    newMessages.splice(index + 1);
    const aiMessage: Message = { role: "assistant", content: "" };
    setMessages((_prev) => [...newMessages, aiMessage]);
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      await streamChat(
        apiKey!,
        newMessages,
        updateMessage,
        abortControllerRef.current.signal
      );
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          console.log("Request cancelled");
        } else if (err.message.includes("API key")) {
          clearApiKey();
          setShowApiKeyInput(true);
        }
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
      inputRef.current?.focus();
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#343541",
        position: "relative",
      }}
    >
      <ChatHistory messages={messages} onEdit={handleEdit} />
      <ChatInput
        ref={inputRef}
        onSend={handleSend}
        disabled={!apiKey}
        isGenerating={isGenerating}
      />
      <Settings
        open={showApiKeyInput}
        onClose={() => apiKey && setShowApiKeyInput(false)}
        onSubmit={handleApiKeySubmit}
        error={error}
        isValidating={isValidating}
      />
      {apiKey && (
        <IconButton
          onClick={() => setShowApiKeyInput(true)}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            color: "#ECECF1",
          }}
        >
          <SettingsIcon />
        </IconButton>
      )}
      {isLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: "primary.main",
            zIndex: 9999,
            animation: "progress 1s infinite linear",
            "@keyframes progress": {
              "0%": {
                transform: "translateX(-100%)",
              },
              "100%": {
                transform: "translateX(100%)",
              },
            },
          }}
        />
      )}
    </Box>
  );
}
