import React from "react";
import ReactDOM from "react-dom/client";
import Root from "../src/root";
import "../src/index.css";

// Rendering the application into the root element of the HTML file

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
