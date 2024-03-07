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
          '### Performance Optimization\n1. **Avoid unnecessary multiple API calls during initial load**:\n   - The code currently calls `getPipelines("prebuilt", LIMIT, offsetRef.current)` twice during the initial load, which can be optimized to reduce unnecessary API calls.\n   - To improve performance, call `getPipelines` only once during the initial load to fetch the initial set of pipelines.\n\n```tsx\nuseEffect(() => {\n    const initGetPipeline = async () => {\n      await getPipelines("prebuilt", LIMIT, offsetRef.current);\n    };\n    initGetPipeline();\n    // eslint-disable-next-line\n  }, []);\n```\n\n### Readability and Maintenance\n1. **Organize imports and remove unused code**:\n   - Organize imports in a structured order to improve readability and maintainability.\n   - Remove commented-out code like `// import PipelineMenu from "./PipelineMenu";` to keep the codebase clean.\n   \n```tsx\nimport { useCallback, useEffect, useRef, useState } from "react";\nimport { CinLoaderFull, useDisclosure, useTranslation } from "@cinnamon/design-system";\nimport { AiPipelineCard, AiPipelineContainer, Description, InfiniteScrollBox, StyledHeading, StyledPageWrapper } from "@/pages/AiPipeline/index.styled";\nimport { PIPELINE_TYPE, Pipeline } from "@/types/pipeline";\nimport { StyledContainer } from "@/common/Styled";\nimport * as pipelineService from "@/services/pipeline";\nimport PipelineDetail from "./PipelineDetail";\n```\n\n2. **Type Safety**:\n   - Ensure to handle errors properly by defining the error type in the catch block.\n   - Update `catch (error: any)` to `catch (error: Error)` to maintain type safety and catch specific error types.\n\n```tsx\ntry {\n    // Code block\n} catch (error: Error) {\n    console.log("failed to load pipeline", error.message);\n}\n```\n\n3. **Enhance Component Reusability**:\n   - Extract the logic in `renderPrebuildPipeline` into a separate reusable component if it can be used in other parts of the application.\n   - This promotes reusability and separation of concerns in your codebase.\n\nFeel free to reach out if you need further clarification or additional enhancements!',
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
