import { AppContext } from "context/appContext";
import { memo, useContext, useMemo } from "react";

export const useHasPermission = (name) => {
  const { notPermissions, user } = useContext(AppContext);

  const hasPermission = useMemo(() => !notPermissions.includes(name), [user]);

  return { hasPermission, notPermissions };
};
