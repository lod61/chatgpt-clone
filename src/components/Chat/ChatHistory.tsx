import { Message } from "@/types/chat";
import { Box } from "@mui/material";
import { memo, useEffect, useRef } from "react";
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
  const userScrolledRef = useRef(false);
  const lastScrollHeightRef = useRef(0);

  const checkIfNearBottom = () => {
    if (scrollRef.current) {
      const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
      const scrollBottom = scrollHeight - scrollTop - clientHeight;
      isNearBottomRef.current = scrollBottom < 100;
      lastScrollHeightRef.current = scrollHeight;
    }
  };

  const handleScroll = () => {
    userScrolledRef.current = true;
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

  // 处理内容增长时的滚动
  const handleContentGrowth = () => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = scrollRef.current;
      const heightDiff = scrollHeight - lastScrollHeightRef.current;
      
      // 如果内容增长，且用户视图在底部附近
      if (heightDiff > 0 && scrollHeight - (scrollTop + clientHeight) < 100) {
        scrollRef.current.scrollTop = scrollTop + heightDiff;
      }
      
      lastScrollHeightRef.current = scrollHeight;
    }
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    const isNewUserMessage = lastMessage?.role === "user";
    const isStartingAIMessage = lastMessage?.role === "assistant" && !lastMessage.content;
    const isCompletingAIMessage = lastMessage?.role === "assistant" && lastMessage.content;

    if (isNewUserMessage || isStartingAIMessage) {
      userScrolledRef.current = false;
      scrollToBottom(true);
    } else if (isCompletingAIMessage) {
      handleContentGrowth();
    }
  }, [messages]);

  // 监听 DOM 变化以处理流式响应
  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (!userScrolledRef.current) {
        handleContentGrowth();
      }
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    return () => observer.disconnect();
  }, []);

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (!userScrolledRef.current) {
        scrollToBottom(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Box
      ref={scrollRef}
      onScroll={handleScroll}
      sx={{
        flex: 1,
        overflowY: "auto",
        bgcolor: "#FFFFFF",
        position: "relative",
        paddingBottom: { xs: "80px", sm: "120px" },
        "&::-webkit-scrollbar": {
          width: "8px",
          height: "8px",
          display: "none",
        },
        "&:hover::-webkit-scrollbar": {
          display: "block",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0,0,0,.2)",
          borderRadius: "4px",
          border: "2px solid transparent",
          backgroundClip: "content-box",
          "&:hover": {
            background: "rgba(0,0,0,.3)",
            backgroundClip: "content-box",
          },
        },
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        "&:hover": {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            display: "block",
          },
        },
      }}
    >
      {messages.length === 0 ? (
        <Box
          sx={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "rgba(0,0,0,0.5)",
            textAlign: "center",
            width: "100%",
            maxWidth: "48rem",
            px: 4,
            fontSize: { xs: "1rem", sm: "1.25rem" },
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
      <div ref={messagesEndRef} style={{ height: 30 }} />
    </Box>
  );
}

export default memo(ChatHistory);
