import { Message } from "@/types/chat";
import { Check, Close, Edit, Person, SmartToy } from "@mui/icons-material";
import { Avatar, Box, IconButton, TextField, Typography } from "@mui/material";
import React, { ComponentType, memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

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
        bgcolor: "#FFFFFF",
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
          gap: { xs: 3, sm: 4 },
          py: { xs: 4, sm: 6 },
          px: { xs: 4, sm: 6, md: 10, lg: 12 },
        }}
      >
        <Box sx={{ width: 30, flexShrink: 0 }}>
          <Avatar
            sx={{
              width: 30,
              height: 30,
              bgcolor: isUser ? "#FDD633" : "#19C37D",
              color: isUser ? "#000000" : "#FFFFFF",
            }}
          >
            {isUser ? <Person /> : <SmartToy />}
          </Avatar>
        </Box>

        <Box sx={{ flex: 1, position: "relative", minWidth: 0 }}>
          <Box sx={{ mb: 1, color: "#000000", fontWeight: 600 }}>
            {isUser ? "You" : "ChatGPT"}
          </Box>
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
                  color: "#000000",
                  fontSize: "1rem",
                  lineHeight: 1.75,
                  whiteSpace: "pre-wrap",
                  "& p": {
                    my: 0,
                    "&:not(:last-child)": {
                      mb: 2,
                    },
                  },
                  "& ol": {
                    my: 2,
                    pl: 2,
                    counterReset: "item",
                    listStyle: "none",
                    "& li": {
                      counterIncrement: "item",
                      display: "flex",
                      "&::before": {
                        content: 'counter(item) "."',
                        fontWeight: 600,
                        minWidth: "1.5em",
                      },
                    },
                  },
                  "& ul": {
                    my: 2,
                    pl: 2,
                  },
                  "& li": {
                    mb: 0.5,
                  },
                  "& a": {
                    color: "#3B3B3B",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#1A1A1A",
                    },
                  },
                  "& blockquote": {
                    my: 2,
                    pl: 2,
                    borderLeft: "3px solid rgba(0,0,0,0.2)",
                    color: "rgba(0,0,0,0.7)",
                  },
                  "& code": {
                    fontFamily: "monospace",
                    backgroundColor: "rgba(0,0,0,0.1)",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    fontSize: "0.875em",
                  },
                  "& pre": {
                    my: 2,
                    p: 0,
                    "& code": {
                      p: 0,
                      backgroundColor: "transparent",
                    },
                  },
                }}
              >
                {isUser ? (
                  <Typography component="div">
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
                      width: "6px",
                      height: "16px",
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
                      backgroundColor: "rgba(255,255,255,0.1)",
                    },
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
