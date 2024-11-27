import React, { useRef, useCallback, useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { Settings as SettingsIcon } from '@mui/icons-material'
import { Message } from '@/types/chat'
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import Settings from '../Settings/Settings'
import { useApiKey } from '@/hooks/useApiKey'
import { streamChat } from '@/services/api'

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([])
  const { apiKey, error, isValidating, validateApiKey, clearApiKey } = useApiKey()
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const currentMessageRef = useRef<Message | null>(null)

  const updateMessage = useCallback((content: string) => {
    setMessages(prev => {
      const newMessages = [...prev]
      const lastMessage = newMessages[newMessages.length - 1]
      if (lastMessage && lastMessage.role === 'assistant') {
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content
        }
        return newMessages
      }
      return prev
    })
  }, [])

  const handleSend = async (content: string) => {
    if (!apiKey) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    const userMessage: Message = { role: 'user', content }
    const aiMessage: Message = { role: 'assistant', content: '' }

    setMessages(prev => [...prev, userMessage, aiMessage])
    setIsLoading(true)

    abortControllerRef.current = new AbortController()

    try {
      const currentMessages = messages.filter(msg => 
        msg.role === 'user' || (msg.role === 'assistant' && msg.content)
      )
      
      await streamChat(
        apiKey,
        [...currentMessages, userMessage],
        updateMessage,
        abortControllerRef.current.signal
      )
    } catch (err) {
      console.error('Chat error:', err)
      if (err instanceof Error && err.message.includes('API key')) {
        clearApiKey()
        setShowApiKeyInput(true)
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
      inputRef.current?.focus()
    }
  }

  const handleApiKeySubmit = async (key: string) => {
    const isValid = await validateApiKey(key)
    if (isValid) {
      setShowApiKeyInput(false)
      inputRef.current?.focus()
    }
  }

  const handleEdit = async (index: number, newContent: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    const newMessages = [...messages]
    newMessages[index] = { ...newMessages[index], content: newContent }
    
    newMessages.splice(index + 1)
    setMessages(newMessages)

    const aiMessage: Message = { role: 'assistant', content: '' }
    setMessages(prev => [...newMessages, aiMessage])
    setIsLoading(true)

    abortControllerRef.current = new AbortController()

    try {
      await streamChat(
        apiKey!,
        newMessages,
        updateMessage,
        abortControllerRef.current.signal
      )
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          console.log('Request cancelled')
        } else if (err.message.includes('API key')) {
          clearApiKey()
          setShowApiKeyInput(true)
        }
      }
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
      inputRef.current?.focus()
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#343541',
        position: 'relative',
      }}
    >
      <ChatHistory 
        messages={messages} 
        onEdit={(index, content) => handleEdit(index, content)}
      />
      <ChatInput 
        ref={inputRef}
        onSend={handleSend} 
        disabled={!apiKey || isLoading} 
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
            position: 'absolute',
            top: 16,
            right: 16,
            color: '#ECECF1',
          }}
        >
          <SettingsIcon />
        </IconButton>
      )}
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            bgcolor: 'primary.main',
            zIndex: 9999,
            animation: 'progress 1s infinite linear',
            '@keyframes progress': {
              '0%': {
                transform: 'translateX(-100%)',
              },
              '100%': {
                transform: 'translateX(100%)',
              },
            },
          }}
        />
      )}
    </Box>
  )
} 