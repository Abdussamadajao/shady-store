import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { routes } from "./routes";
import { ScrollToTop } from "@/components/shared";

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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <ScrollToTop />
        <Routes>{renderRoutes(routes)}</Routes>
      </div>
    </BrowserRouter>
  );
}
