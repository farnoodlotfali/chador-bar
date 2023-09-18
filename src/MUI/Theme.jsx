import { responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import { CacheProvider, keyframes } from "@emotion/react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";
import { useVersionENV } from "hook/useVersionENV";
import { Box, Typography } from "@mui/material";

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin, prefixer],
});

export default function Theme({ children }) {
  const [theme, setTheme] = useState(null);
  const { appTheme } = useContext(AppContext);
  const { version, CapVersion } = useVersionENV();

  useEffect(() => {
    import(`./versions/${version}`).then((module) => {
      const finalTheme = module[`${CapVersion}Theme`];

      setTheme(
        appTheme === "light" ? finalTheme.lightTheme : finalTheme.darkTheme
      );
    });
  }, [appTheme]);

  if (theme === null) {
    return <LoadingTheme />;
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={responsiveFontSizes(theme)}>
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}

const loaderAnimation = keyframes`
  0% {
    left: 0;
    height: 43px;
    width: 15px;
    transform: translateX(0);
  }
  50% {
    height: 10px;
    width: 40px;
  }
  100% {
    left: 100%;
    height: 43px;
    width: 15px;
    transform: translateX(-100%);
  }
`;

const LoadingTheme = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        pt: 10,
      }}
    >
      <Typography
        sx={{
          display: "inline-block",
          textAlign: "center",
          lineHeight: "60px",
          fontFamily: "IRANSansXV, sans-serif",
          position: "relative",
          padding: "0 48px",
          fontSize: { sm: 25, x: 16 },
          color: "black",
          "&::before, &::after": {
            content: '""',
            display: "block",
            width: 10,
            height: 10,
            background: "currentColor",
            position: "absolute",
            animation: `${loaderAnimation} 0.7s infinite alternate ease-in-out`,
            top: 0,
          },
          "&::after": {
            top: "auto",
            bottom: 0,
          },
        }}
      >
        بارگذاری قالب...
      </Typography>
    </Box>
  );
};
