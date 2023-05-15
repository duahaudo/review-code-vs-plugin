import { VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import { useContext, useEffect, useState } from "react";
import "./App.css";
import CodePanel from "./components/CodePanel";
import Optimize from "./components/Optimize";
import { WebViewContext } from "./reducer";

const Thinking = () => {
  const [think, setThink] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setThink((prevThink) => {
        if (prevThink.length < 5) {
          return prevThink + "💭";
        } else {
          return "";
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <div style={{ position: "fixed", top: 0 }}>{think}</div>;
};

const App = () => {
  const { state } = useContext(WebViewContext);
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <main>
      {state.loading && <Thinking />}

      {!state.loading && (
        <VSCodeLink
          style={{ position: "fixed", top: 0, left: 20 }}
          onClick={() => setShowOriginal(!showOriginal)}>
          {showOriginal ? `Hide code` : "Show code"}
        </VSCodeLink>
      )}

      {showOriginal && <CodePanel />}
      <Optimize />
    </main>
  );
};

export default App;
