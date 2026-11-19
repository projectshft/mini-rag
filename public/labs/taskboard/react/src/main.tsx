// Starts the app in the browser. You don't need to change this file.
// The tests don't load it: they render <App> themselves, with a pretend API.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { createApi } from "./api";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App api={createApi("/api")} />
  </StrictMode>,
);
