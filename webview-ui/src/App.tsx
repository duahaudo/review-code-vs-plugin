import { useContext, useEffect, useState } from "react";
import "./App.css";
import { Title } from "./App.styled";
import CodePanel from "./components/codePanel";
import Optimize from "./components/optimize";
import { ACTION, WebViewContext } from "./reducer";
import WebViewContextProvider from "./reducer/provider";

const App = () => {

  const { dispatch } = useContext(WebViewContext)

  // const handleHowdyClick = useCallback(() => {
  //   vscode.postMessage({
  //     command: "hello",
  //     text: "Hey there partner! 🤠",
  //   });
  // }, [])

  useEffect(() => {

    window.addEventListener('message', event => {
      const message = event.data; // The JSON data our extension sent
      // console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ useEffect ➡ message:`, message);
      const { command, content } = message

      switch (command) {
        case "codeblock": {
          dispatch({
            type: ACTION.DISPLAY_CODE,
            payload: content
          })
          break;
        }
        case 'optimize': {
          dispatch({
            type: ACTION.DISPLAY_OPTIMIZE,
            payload: content
          })
          break;
        }
      }
    });

  }, [])

  return (
    <WebViewContextProvider>
      <main>
        <Title>Code block</Title>
        <CodePanel />
        <Title>Optimize</Title>
        <Optimize />
        {/* <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton> */}
      </main>
    </WebViewContextProvider>
  );
}

export default App;
