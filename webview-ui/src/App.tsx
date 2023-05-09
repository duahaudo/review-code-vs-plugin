import { useEffect, useReducer, useState } from "react";
import "./App.css";
import { Title } from "./App.styled";
import CodePanel from "./components/codePanel";
import reducer, { ACTION, WebViewContext, initialState } from "./reducer";
import Optimize from "./components/optimize";

const App = () => {

  const [, dispatch] = useReducer(reducer, initialState);

  // const handleHowdyClick = useCallback(() => {
  //   vscode.postMessage({
  //     command: "hello",
  //     text: "Hey there partner! 🤠",
  //   });
  // }, [])

  const [code, setCode] = useState("")
  const [optimize, setOptimize] = useState("")

  useEffect(() => {
    // Handle the message inside the webview
    if (!window.location.href.includes("localhost")) {
      window.addEventListener('message', event => {
        const message = event.data; // The JSON data our extension sent
        // console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ useEffect ➡ message:`, message);
        const { command, content } = message

        switch (command) {
          case "codeblock": {
            setCode(content)
            dispatch({
              type: ACTION.DISPLAY_CODE,
              payload: content
            })
            break;
          }
          case 'optimize': {
            setOptimize(content)
            dispatch({
              type: ACTION.DISPLAY_OPTIMIZE,
              payload: content
            })
            break;
          }
        }
      });
    } else {
      dispatch({
        type: ACTION.DISPLAY_CODE,
        payload: "Test"
      })
    }
  }, [dispatch])

  return (
    <WebViewContext.Provider value={{ ...initialState }}>
      <main>
        <Title>Code block</Title>
        <CodePanel code={code} />
        <Title>Optimize</Title>
        <Optimize code={optimize} />
        {/* <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton> */}
      </main>
    </WebViewContext.Provider>
  );
}

export default App;
