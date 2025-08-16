import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { routes } from "./routes";
import { ScrollToTop } from "@/components/shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { authClient } from "./lib/auth-client";

const queryClient = new QueryClient();

const renderRoutes = (routes: RouteObject[]) => {
  return routes.map((route, index) => (
    <Route key={index} path={route.path} element={route.element}>
      {route.children &&
        route.children.map((child: any, childIndex: number) => (
          <Route
            key={`${index}-${childIndex}`}
            path={child.path}
            element={child.element}
            index={child.index}
          >
            {child.children && renderRoutes(child.children)}
          </Route>
        ))}
    </Route>
  ));
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="bg-primary-DEFAULT">
            <Toaster position="top-center" />
            <ScrollToTop />
            <Routes>{renderRoutes(routes)}</Routes>
          </div>
        </TooltipProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
