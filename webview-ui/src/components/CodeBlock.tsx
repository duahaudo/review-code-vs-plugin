import ReactMarkdown from "react-markdown";
import SyntaxHighlighter from "react-syntax-highlighter";
// Choose your theme or import another one from react-syntax-highlighter/dist/esm/styles/prism
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
// @ts-expect-error
import CopyToClipboard from "react-copy-to-clipboard";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./Response/style.css";

// Component to render code blocks using react-syntax-highlighter
export const CodeBlock = ({ language, code }: any) => {
  return (
    <>
      <div>
        <CopyToClipboard text={code} onCopy={() => alert("Copied")}>
          <VSCodeButton>Copy</VSCodeButton>
        </CopyToClipboard>
      </div>
      <SyntaxHighlighter
        language={language || "javascript"}
        style={atomOneDark}
        wrapLongLines
        showLineNumbers>
        {code}
      </SyntaxHighlighter>
    </>
  );
};

// React component to render Markdown content
const MarkdownRenderer = ({ code }: { code: string; language?: string }) => {
  return (
    <ReactMarkdown
      children={code}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <CodeBlock language={match[1]} code={String(children).replace(/\n$/, "")} {...props} />
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    />
  );
};

export default MarkdownRenderer;
