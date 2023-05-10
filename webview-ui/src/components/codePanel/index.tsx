import { VSCodeButton } from "@vscode/webview-ui-toolkit/react"
import { useCallback, useContext } from "react"
import { Title } from "../../App.styled"
import { WebViewContext } from "../../reducer"
import { vscode } from "../../utilities/vscode"
import "./style.css"

const CodePanel = () => {
  const { state } = useContext(WebViewContext)

  const requestGpt = useCallback((command: string) => {
    vscode.postMessage({
      command
    });
  }, [])

  return (
    <div className="container">
      <Title>Code block</Title>
      <div className="content-container">
        <div className="code-block">
          {state.code}
        </div>
        <div className="button-container">
          <VSCodeButton className="button" onClick={() => requestGpt("review")}>Review</VSCodeButton>
          <VSCodeButton className="button" onClick={() => requestGpt("refactor")}>Refactor</VSCodeButton>
        </div>
      </div>
    </div>
  )
}

export default CodePanel