import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useCallback, useContext } from "react";
import { WebViewContext } from "../../reducer";
import { vscode } from "../../utilities/vscode";
import "../../App.css";
import { CodeBlock } from "../CodeBlock";

const CodePanel = () => {
  const { state } = useContext(WebViewContext);

  const requestGpt = useCallback((command: string) => {
    vscode.postMessage({
      command,
    });
  }, []);

  return (
    <div className="container">
      <div className="content-container">
        <CodeBlock code={state.code} />

        <div className="button-container">
          <VSCodeButton className="button" onClick={() => requestGpt("review")}>
            Review
          </VSCodeButton>
          <VSCodeButton className="button" onClick={() => requestGpt("refactor")}>
            Refactor
          </VSCodeButton>
        </div>
      </div>
    </div>
  );
};

export default CodePanel;
