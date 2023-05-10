import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import WebViewContextProvider from "./reducer/provider";

ReactDOM.render(
  <React.StrictMode>
    <WebViewContextProvider>
      <App />
    </WebViewContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
