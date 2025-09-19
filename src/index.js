import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./index.css";
import "./styles/navigation.css";
import "./styles/quiz.css";
import "./styles/learn.css";

import { ScoreProvider } from "./state/ScoreContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScoreProvider>
        <App />
      </ScoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);
