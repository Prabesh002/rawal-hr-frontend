import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import { loadAppConfig } from "./api/config/apiConfig.ts";
import "@/styles/globals.css";

const rootElement = document.getElementById("root")!;

const renderApp = () => {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <Provider>
          <App />
        </Provider>
      </BrowserRouter>
    </React.StrictMode>,
  );
};

loadAppConfig()
  .then(() => {
    renderApp();
  })
  .catch(error => {
    console.error("Failed to initialize the app:", error);
  });