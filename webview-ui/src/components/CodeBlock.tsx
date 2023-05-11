import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const CodeBlock = ({ code, language }: { code: string, language?: string }) => {
  return (
    <SyntaxHighlighter
      language={language || "javascript"}
      style={atomOneDark}
      showLineNumbers className="code-block">
      {code}
    </SyntaxHighlighter>
  )
}

export default CodeBlock