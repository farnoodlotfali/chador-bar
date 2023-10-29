import { AppContext } from "context/appContext";
import { useContext, useMemo } from "react";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import { BlankLayoutPaths, renderPanelRoute } from "router";

const App = () => {
  const { notPermissions, user } = useContext(AppContext);

  const panel = useMemo(
    () => renderPanelRoute(notPermissions),
    [notPermissions, user]
  );

  return (
    <RouterProvider router={createBrowserRouter([BlankLayoutPaths, panel])} />
  );
};

export default App;
