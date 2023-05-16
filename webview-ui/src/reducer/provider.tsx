import { useEffect, useReducer } from "react";
import reducer, { ACTION, WebViewContext, initialState } from ".";
import { Uri } from "vscode";

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
        `,
      });

      dispatch({
        type: ACTION.DISPLAY_OPTIMIZE,
        payload:
          'Explanation:\nThis code defines a method called "clearSession", which performs the following tasks:\n1. Calls another method called "stopGenerating".\n2. Sets a property called "apiGpt3" to undefined.\n3. Sets a property called "messageId" to undefined.\n4. Sets a property called "conversationId" to undefined.\n5. Calls a method called "logEvent" with the argument "cleared-session".\n\nOptimized code:\npublic clearSession(): void {\n\t\tthis.stopGenerating();\n\t\tthis.apiGpt3 = this.messageId = this.conversationId = undefined;\n\t\tthis.logEvent("cleared-session");\n\t}\n\nExplanation:\nThis optimized code does the same thing as the original code, but it sets the properties "apiGpt3", "messageId", and "conversationId" to undefined in a single line of code, using the shorthand for multiple variable assignments. This results in more concise and easier-to-read code.',
      });
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: ACTION.RELOAD_DATA,
      payload: null,
    });

    window.addEventListener("message", (event) => {
      const message = event.data; // The JSON data our extension sent
      // console.log(`🚀 SLOG (${new Date().toLocaleTimeString()}): ➡ useEffect ➡ message:`, message);
      const { command, content } = message;

      switch (command) {
        case "codeblock": {
          dispatch({
            type: ACTION.DISPLAY_CODE,
            payload: content as {
              selection: string;
              fileName: string;
              uri: Uri;
            },
          });
          break;
        }
        case "optimize": {
          dispatch({
            type: ACTION.DISPLAY_OPTIMIZE,
            payload: content,
          });
          break;
        }
        case "optimize-in-stream": {
          dispatch({
            type: ACTION.DISPLAY_OPTIMIZE_STREAM,
            payload: content,
          });
          break;
        }
        case "show-loading": {
          dispatch({
            type: ACTION.SHOW_LOADING,
            payload: content,
          });
          break;
        }
      }
    });
  }, []);

  return <WebViewContext.Provider value={{ state, dispatch }}>{children}</WebViewContext.Provider>;
};

export default WebViewContextProvider;
