import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ErrorBoundary from "./components/layout/ErrorBoundary.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div className="p-8 font-bold text-ink">Kraunama...</div>}>
        <App />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);