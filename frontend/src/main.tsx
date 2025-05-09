import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Toaster } from "sonner";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>,
);
