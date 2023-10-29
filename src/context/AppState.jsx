import React, { useState } from "react";
import { AppContext } from "./appContext";

const AppState = ({ children }) => {
  const [appTheme, setAppTheme] = useState(
    localStorage.getItem("theme") ?? "light"
  );

  // remove  localStorage.getItem("theme") after receiving profile api
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );
  const [notPermissions, setNotPermissions] = useState(
    localStorage.getItem("not_permitted")
      ? JSON.parse(localStorage.getItem("not_permitted"))
      : []
  );
  const [drawer, setDrawer] = useState(
    localStorage.getItem("drawer")
      ? JSON.parse(localStorage.getItem("drawer"))
      : []
  );

  const holdOpenMenu = (val) => {
    localStorage.setItem("drawer", JSON.stringify(val));
    setDrawer(val);
  };

  const toggleTheme = () => {
    let newTheme = appTheme === "light" ? "dark" : "light";
    setAppTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };
  return (
    <AppContext.Provider
      value={{
        appTheme,
        toggleTheme,
        drawer,
        setDrawer: holdOpenMenu,
        user,
        setUser,
        notPermissions,
        setNotPermissions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppState;
