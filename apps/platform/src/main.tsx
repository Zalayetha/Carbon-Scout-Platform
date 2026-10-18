import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { platformLogger } from "./lib/logger";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  platformLogger.info("Initializing Carbon Scout Platform client...");
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
