import React, { memo, useState } from "react";
import { Box, Typography, Avatar, TextField, IconButton } from "@mui/material";
import { Message } from "@/types/chat";
import { Person, SmartToy, Edit, Check, Close } from "@mui/icons-material";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { ComponentType } from "react";

interface ChatMessageProps {
  message: Message;
  onEdit?: (content: string) => void;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

const ChatMessage = memo(({ message, onEdit }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const isTyping = !isUser && message.content === "";
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleEdit = () => {
    if (editContent.trim() !== message.content) {
      onEdit?.(editContent.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  const CodeBlock: React.FC<CodeProps> = ({
    inline,
    className,
    children,
    ...props
  }) => {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        {...props}
        style={oneDark as { [key: string]: React.CSSProperties }}
        language={match[1]}
        PreTag="div"
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: isUser ? "#343541" : "#444654",
        borderBottom: "1px solid",
        borderColor: "rgba(255,255,255,0.1)",
        position: "relative",
        "&:hover": {
          "& .edit-button": {
            opacity: 1,
          },
        },
      }}
    >
      <Box
        sx={{
          maxWidth: "48rem",
          mx: "auto",
          display: "flex",
          gap: { xs: 2, sm: 3 },
          py: { xs: 4, sm: 6 },
          px: { xs: 3, sm: 4, md: 8, lg: 10 },
        }}
      >
        <Avatar
          sx={{
            width: 30,
            height: 30,
            bgcolor: isUser ? "#5436DA" : "#19c37d",
            flexShrink: 0,
          }}
        >
          {isUser ? <Person /> : <SmartToy />}
        </Avatar>

        <Box sx={{ flex: 1, position: "relative", minWidth: 0 }}>
          {isEditing ? (
            <Box
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                handleEdit();
              }}
            >
              <TextField
                fullWidth
                multiline
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                autoFocus
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#ECECF1",
                    bgcolor: "rgba(255,255,255,0.1)",
                    "& fieldset": {
                      borderColor: "rgba(255,255,255,0.2)",
                    },
                  },
                }}
              />
              <Box
                sx={{
                  mt: 1,
                  display: "flex",
                  gap: 1,
                  justifyContent: "flex-end",
                }}
              >
                <IconButton size="small" onClick={handleCancel}>
                  <Close />
                </IconButton>
                <IconButton size="small" onClick={handleEdit} color="primary">
                  <Check />
                </IconButton>
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  color: "#ECECF1",
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  "& p": {
                    mb: 2,
                    "&:last-child": {
                      mb: 0,
                    },
                  },
                  "& a": {
                    color: "#7C7CFF",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#5C5CFF",
                    },
                  },
                  "& ul, & ol": {
                    pl: 4,
                    mb: 2,
                  },
                  "& li": {
                    mb: 1,
                  },
                  "& blockquote": {
                    borderLeft: 3,
                    borderColor: "rgba(255,255,255,0.2)",
                    pl: 2,
                    ml: 0,
                    color: "rgba(236,236,241,0.8)",
                  },
                  "& table": {
                    width: "100%",
                    borderCollapse: "collapse",
                    my: 2,
                    "& th, & td": {
                      border: 1,
                      borderColor: "rgba(255,255,255,0.2)",
                      p: 1,
                    },
                    "& th": {
                      bgcolor: "rgba(255,255,255,0.1)",
                      fontWeight: "bold",
                    },
                  },
                }}
              >
                {isUser ? (
                  <Typography
                    component="div"
                    sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
                  >
                    {message.content}
                  </Typography>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: CodeBlock as unknown as ComponentType<unknown>,
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
                {isTyping && (
                  <Box
                    component="span"
                    sx={{
                      display: "inline-block",
                      width: "0.5em",
                      height: "1em",
                      bgcolor: "#ECECF1",
                      ml: 0.5,
                      animation: "blink 1s infinite",
                      "@keyframes blink": {
                        "0%, 100%": { opacity: 0.2 },
                        "50%": { opacity: 0.8 },
                      },
                    }}
                  />
                )}
              </Box>
              {isUser && onEdit && (
                <IconButton
                  className="edit-button"
                  size="small"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    position: "absolute",
                    right: -40,
                    top: 0,
                    opacity: 0,
                    transition: "opacity 0.2s",
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": {
                      color: "rgba(255,255,255,0.9)",
                    },
                    zIndex: 10,
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
