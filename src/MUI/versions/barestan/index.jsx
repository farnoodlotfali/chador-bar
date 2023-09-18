import { createTheme } from "@mui/material/styles";

import { defaults } from "chart.js";
import { BORDER_RADIUS } from "./BorderRadius";
import { BOXSHADOW } from "./BoxShadow";
import { SPACING } from "./Spacing";
import { BACKGROUND, PRIMARY, SECONDARY, TERTIARY, TEXT } from "./Colors";

defaults.font.family = "YekanBakhFaNum, sans-serif";

const commonStyles = {
  direction: "rtl",
  spacing: SPACING,
  shape: {
    borderRadius: BORDER_RADIUS,
  },
  typography: {
    fontFamily: "YekanBakhFaNum, sans-serif",
    small: {
      fontSize: 10,
      fontFamily: "YekanBakhFaNum, sans-serif",
    },
    clickable: {
      fontFamily: "YekanBakhFaNum, sans-serif",
      cursor: "pointer",
      width: "fit-content",
      margin: "auto",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: "auto",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: "0",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "inherit",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "none",
        },
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        size: 30,
      },
    },
  },
};

const lightTheme = createTheme({
  ...commonStyles,

  palette: {
    mode: "light",
    primary: PRIMARY.light,
    secondary: SECONDARY.light,
    tertiary: TERTIARY.light,
    background: BACKGROUND.light,
    text: TEXT.light,
  },
  shadows: BOXSHADOW.light,
});

const darkTheme = createTheme({
  ...commonStyles,

  palette: {
    mode: "dark",

    primary: PRIMARY.dark,
    secondary: SECONDARY.dark,
    tertiary: TERTIARY.dark,
    background: BACKGROUND.dark,
    text: TEXT.dark,
  },
  shadows: BOXSHADOW.dark,
});

export const BarestanTheme = {
  lightTheme,
  darkTheme,
};
