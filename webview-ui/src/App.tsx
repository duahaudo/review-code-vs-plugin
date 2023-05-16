import { VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import { useContext, useState } from "react";
import "./App.css";
import CodePanel from "./components/CodePanel";
import Optimize from "./components/Optimize";
import Thinking from "./components/Thinking";
import { WebViewContext } from "./reducer";
import { vscode } from "./utilities/vscode";

const App = () => {
  const { state } = useContext(WebViewContext);
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <main>
      {state.loading && <Thinking />}

      {!state.loading && (
        <VSCodeLink className="show-code" onClick={() => setShowOriginal(!showOriginal)}>
          {showOriginal ? `Hide code` : "Show code"}
        </VSCodeLink>
      )}

      <VSCodeLink
        className="back-to-file"
        onClick={() => vscode.postMessage({ command: "open-file", uri: state.fileName })}>
        Back to file
      </VSCodeLink>

      {showOriginal && <CodePanel />}
      <Optimize />
    </main>
  );
};

export default App;
