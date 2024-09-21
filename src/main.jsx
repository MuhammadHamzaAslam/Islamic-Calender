import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./appRouting.jsx";
import { PostsProvider } from "./context/AaraasContext.jsx";

createRoot(document.getElementById("root")).render(
  <PostsProvider>
    <AppRouter />
  </PostsProvider>
);
