import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App"; // ✅ FIX: Ensure correct path
import "./styles/index.css"; // ✅ FIX: Ensure `index.css` is inside `src/styles/`

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

