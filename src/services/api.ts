/**
 * OpenRouter API 配置
 */
const API_URL = 'https://openrouter.ai/api/v1/chat/completions'

/**
 * 验证 API key 是否有效
 * @param apiKey - OpenRouter API key
 * @returns Promise<boolean> - 验证结果
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ChatGPT Clone',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo-1106',
        messages: [{ role: 'user', content: 'Hi' }],
        temperature: 0.7,
        max_tokens: 150,
        stream: false,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Invalid API key')
    }

    return true
  } catch (error) {
    console.error('API key validation error:', error)
    throw error
  }
}

/**
 * 流式聊天请求
 * @param apiKey - OpenRouter API key
 * @param messages - 聊天消息历史
 * @param onChunk - 处理流式响应的回调函数
 * @param signal - AbortController 信号，用于取消请求
 */
export async function streamChat(
  apiKey: string,
  messages: { role: string; content: string }[],
  onChunk: (chunk: string) => void,
  signal?: AbortSignal
): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ChatGPT Clone',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo-1106',
        messages: [
          {
            role: 'system',
            content: '你是一个专业的AI助手，请直接回答问题，避免重复内容。'
          },
          ...messages
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }),
      signal,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      const errorMessage = errorData?.error?.message || `HTTP error! status: ${response.status}`
      console.error('API Error:', errorData)
      throw new Error(errorMessage)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No response body')
    }

    const decoder = new TextDecoder()
    let buffer = ''

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // 解码新的数据块并添加到缓冲区
        buffer += decoder.decode(value, { stream: true })

        // 处理完整的行
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // 保留最后一个不完整的行

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') continue

            try {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content
              if (content) {
                onChunk(content)
              }
            } catch (e) {
              console.error('Failed to parse chunk:', e)
            }
          }
        }
      }
    } finally {
      // 确保处理缓冲区中的最后一行
      if (buffer) {
        try {
          if (buffer.startsWith('data: ')) {
            const data = buffer.slice(6)
            if (data !== '[DONE]') {
              const parsed = JSON.parse(data)
              const content = parsed.choices[0]?.delta?.content
              if (content) {
                onChunk(content)
              }
            }
          }
        } catch (e) {
          console.error('Failed to parse final chunk:', e)
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.log('Request cancelled')
        return
      }
      throw error
    }
    throw new Error('Unknown error occurred')
  }
} 