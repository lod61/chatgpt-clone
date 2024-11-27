export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatHistory {
  messages: Message[]
}

export interface ApiKeyConfig {
  key: string
}

export interface ChatResponse {
  choices: {
    delta?: {
      content?: string
    }
    text?: string
  }[]
} 