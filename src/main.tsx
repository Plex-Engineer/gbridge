import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Provider from "providers";
import { GlobalStyle } from "cantoui";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <GlobalStyle />
      <App />
    </Provider>
  </React.StrictMode>
);
