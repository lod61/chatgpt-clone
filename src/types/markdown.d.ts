/// <reference types="react" />

declare module 'react-markdown' {
  import type { FC, ComponentType } from 'react'
  
  export interface ReactMarkdownProps {
    children: string
    remarkPlugins?: unknown[]
    components?: {
      [key: string]: ComponentType<unknown>
    }
  }
  
  const ReactMarkdown: FC<ReactMarkdownProps>
  export default ReactMarkdown
}

declare module 'react-syntax-highlighter' {
  import type { CSSProperties, ComponentType, ReactNode, Component } from 'react'
  import type { JSX } from 'react/jsx-runtime'
  
  export interface SyntaxHighlighterProps {
    children: string
    style?: { [key: string]: CSSProperties }
    language?: string
    PreTag?: keyof JSX.IntrinsicElements | ComponentType<ReactNode>
  }
  
  export class Prism extends Component<SyntaxHighlighterProps> {}
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  import type { CSSProperties } from 'react'
  const styles: { [key: string]: { [key: string]: CSSProperties } }
  export const oneDark: typeof styles
} 