import { useEffect, useReducer } from "react";
import reducer, { ACTION, WebViewContext, initialState } from "."

const WebViewContextProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (window.location.href.includes("localhost")) {
      dispatch({
        type: ACTION.DISPLAY_CODE,
        payload: "Test"
      })
    }
  }, [])

  return (
    <WebViewContext.Provider value={{ state, dispatch }}>
      {children}
    </WebViewContext.Provider>
  )
}

export default WebViewContextProvider