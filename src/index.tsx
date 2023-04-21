import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { DOMAttributes } from "react";
import { MathfieldElementAttributes } from "mathlive";

type CustomElement<T> = Partial<T & DOMAttributes<T>>;
export interface IntrinsicElements {
  ["math-field"]: CustomElement<MathfieldElementAttributes>;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
