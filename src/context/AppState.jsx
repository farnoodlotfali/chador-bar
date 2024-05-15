import React, { useState } from "react";
import { AppContext } from "./appContext";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const AppState = ({ children }) => {
  const queryClient = useQueryClient();

  // theme
  const [appTheme, setAppTheme] = useState(
    localStorage.getItem("theme") ?? "light"
  );

  // user
  const [user, setUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  // user role
  const [role, setRole] = useState(
    localStorage.getItem("role")
      ? JSON.parse(localStorage.getItem("role"))
      : null
  );

  // user userType
  const [userType, setUserType] = useState(
    localStorage.getItem("userType")
      ? JSON.parse(localStorage.getItem("userType"))
      : null
  );

  // user not allowed
  const [notPermissions, setNotPermissions] = useState(
    localStorage.getItem("not_permitted")
      ? JSON.parse(localStorage.getItem("not_permitted"))
      : []
  );

  // handle drawer for some themes
  const [drawer, setDrawer] = useState(
    localStorage.getItem("drawer")
      ? JSON.parse(localStorage.getItem("drawer"))
      : []
  );
  // control drawer
  const holdOpenMenu = (val) => {
    localStorage.setItem("drawer", JSON.stringify(val));
    setDrawer(val);
  };
  // toggle Theme
  const toggleTheme = () => {
    let newTheme = appTheme === "light" ? "dark" : "light";
    setAppTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  // logout
  const logoutUser = () => {
    Cookies.remove("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("not_permitted");
    localStorage.removeItem("userType");
    setUser(null);
    setRole(null);
    setUserType(null);
    setNotPermissions([]);
    queryClient.clear();
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
        role,
        setRole,
        logoutUser,
        userType,
        setUserType,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppState;
