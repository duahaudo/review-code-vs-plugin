import { useEffect, useReducer } from "react";
import reducer, { ACTION, WebViewContext, initialState } from "."

const WebViewContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (window.location.href.includes("localhost")) {
      dispatch({
        type: ACTION.DISPLAY_CODE,
        payload: `
        webviewView.webview.options = {
          // Allow scripts in the webview
          enableScripts: true,
    
          localResourceRoots: [
            this.context.extensionUri
          ]
        };
        `
      })
    }
  }, [])

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
    <WebViewContext.Provider value={{ state, dispatch }}>
      {children}
    </WebViewContext.Provider>
  )
}

export default WebViewContextProvider