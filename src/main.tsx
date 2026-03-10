import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router/dom";
import "./App.css";
import { createBrowserRouter } from "react-router";
import FilterPage from "./routes/home";

const router = createBrowserRouter([
  {
    index: true,
    path: "/",
    loader: async () => {
      try {
        const data = await (await fetch("/data/indonesia_regions.json")).json();
        return { ...data };
      } catch (error) {
        return { error: "Cannot fetch data" };
      }
    },
    Component: FilterPage,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
