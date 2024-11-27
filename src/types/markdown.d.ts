declare module 'react-markdown' {
  import React from 'react'
  
  export interface ReactMarkdownProps {
    children: string
    remarkPlugins?: any[]
    components?: {
      [key: string]: React.ComponentType<any>
    }
  }
  
  const ReactMarkdown: React.FC<ReactMarkdownProps>
  export default ReactMarkdown
}

declare module 'react-syntax-highlighter' {
  import { CSSProperties } from 'react'
  
  export interface SyntaxHighlighterProps {
    children: string
    style?: { [key: string]: CSSProperties }
    language?: string
    PreTag?: keyof JSX.IntrinsicElements | React.ComponentType<any>
  }
  
  export class Prism extends React.Component<SyntaxHighlighterProps> {}
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const styles: { [key: string]: { [key: string]: React.CSSProperties } }
  export const oneDark: typeof styles
} 