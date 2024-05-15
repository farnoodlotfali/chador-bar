/* eslint-disable react-hooks/exhaustive-deps */
import { AppContext } from "context/appContext";
import { useContext, useMemo } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import {
  BlankLayoutPaths,
  BlankLayoutWithAuthPaths,
  PanelLayoutRoutes,
  renderPanelRoute,
} from "router";

const App = () => {
  const { notPermissions, user } = useContext(AppContext);

  const panel = useMemo(
    () => renderPanelRoute(PanelLayoutRoutes, notPermissions),
    [notPermissions, user]
  );
  const blankWithAuth = useMemo(
    () => renderPanelRoute(BlankLayoutWithAuthPaths, notPermissions),
    [notPermissions, user]
  );

  return (
    <RouterProvider
      router={createBrowserRouter([BlankLayoutPaths, panel, blankWithAuth])}
    />
  );
};

export default App;
