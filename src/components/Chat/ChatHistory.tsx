import { useRef, useEffect, memo } from "react";
import { Box } from "@mui/material";
import { Message } from "@/types/chat";
import ChatMessage from "./ChatMessage";

interface ChatHistoryProps {
  messages: Message[];
  onEdit?: (index: number, content: string) => void;
}

const MemoizedChatMessage = memo(ChatMessage);

function ChatHistory({ messages, onEdit }: ChatHistoryProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const checkIfNearBottom = () => {
    if (scrollRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;
      isNearBottomRef.current = scrollBottom < 100;
    }
  };

  const handleScroll = () => {
    checkIfNearBottom();
  };

  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current && (isNearBottomRef.current || force)) {
      messagesEndRef.current.scrollIntoView({
        behavior: force ? "auto" : "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const shouldForceScroll =
      lastMessage?.role === "user" ||
      (lastMessage?.role === "assistant" && !lastMessage.content);
    scrollToBottom(shouldForceScroll);
  }, [messages]);

  return (
    <Box
      ref={scrollRef}
      onScroll={handleScroll}
      sx={{
        flex: 1,
        overflowY: "auto",
        bgcolor: "#343541",
        position: "relative",
        "&::-webkit-scrollbar": {
          width: "6px",
          height: "6px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(217,217,227,.8)",
          borderRadius: "3px",
          "&:hover": {
            background: "rgba(217,217,227,1)",
          },
        },
      }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "rgba(236,236,241,0.6)",
            textAlign: "center",
            width: "100%",
            px: 4,
          }}
        >
          开始新的对话
        </Box>
      ) : (
        messages.map((message, index) => (
          <MemoizedChatMessage
            key={index}
            message={message}
            onEdit={onEdit ? (content) => onEdit(index, content) : undefined}
          />
        ))
      )}
      <div ref={messagesEndRef} style={{ height: 20 }} />
    </Box>
  );
}

export default memo(ChatHistory);
