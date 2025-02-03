import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/App"; // ✅ Ensure App.jsx exists in src/pages
import "./styles/App.css"; // ✅ Ensure this exists

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

