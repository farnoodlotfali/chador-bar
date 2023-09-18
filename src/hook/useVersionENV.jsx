import { Box } from "@mui/material";
import { lazy, useEffect, useState, useMemo } from "react";

export const ALL_VERSIONS = ["chadormalo", "barestan"];

export const useVersionENV = (name) => {
  const [version, setVersion] = useState(process.env.REACT_APP_VERSION_CODE);

  useEffect(() => {
    setVersion(process.env.REACT_APP_VERSION_CODE);
  }, [process.env.REACT_APP_VERSION_CODE]);

  const LazyComponent = useMemo(
    () =>
      !name
        ? NameRequired
        : lazy(() =>
            import(
              `Components/versions/${name}/${
                version.charAt(0).toUpperCase() + version.slice(1)
              }${name}`
            )
          ),
    [name]
  );
  return {
    version,
    setVersion,
    allVersions: ALL_VERSIONS,
    LazyComponent,
    CapVersion: version
      ? version.charAt(0).toUpperCase() + version.slice(1)
      : "",
  };
};

const NameRequired = () => {
  return (
    <Box sx={{ color: "error.main" }}>name is required for useVersionENV</Box>
  );
};
