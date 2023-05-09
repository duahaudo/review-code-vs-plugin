import { vscode } from "./utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import { useEffect, useState } from "react";
import CodePanel from "./components/codePanel";
import { Title } from "./App.styled";

function App() {
  function handleHowdyClick() {
    vscode.postMessage({
      command: "hello",
      text: "Hey there partner! 🤠",
    });
  }

  const [codeBlock, setCodeBlock] = useState<string>(`export function markdownToText(markdown?: string): string {
    return remark()
        .use(stripMarkdown)
        .processSync(markdown ?? '')
        .toString();
}`)

  useEffect(() => {
    // Handle the message inside the webview
    if (!window.location.href.includes("localhost")) {
      window.addEventListener('message', event => {
        const message = event.data; // The JSON data our extension sent
        console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ useEffect ➡ message:`, message);
        setCodeBlock(message.codeBlock)
      });
    }
  }, [])

  return (
    <main>
      <Title>Code block</Title>
      {codeBlock && <CodePanel code={codeBlock} />}
      <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
    </main>
  );
}

export default App;
