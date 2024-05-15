import { createTheme } from "@mui/material/styles";
import { defaults } from "chart.js";
import {
  BACKGROUND,
  ERROR,
  GREY,
  INFO,
  PRIMARY,
  SECONDARY,
  SUCCESS,
  TERTIARY,
  TEXT,
  WARNING,
} from "./Colors";
import { BOXSHADOW } from "./BoxShadow";
import { BORDER_RADIUS } from "./BorderRadius";
import { SPACING } from "./Spacing";

defaults.font.family = "Vazirmatn, sans-serif";

// Theme configuration
const commonStyles = {
  direction: "rtl",
  spacing: SPACING,
  shape: {
    borderRadius: BORDER_RADIUS,
  },
  typography: {
    fontFamily: "Vazirmatn, sans-serif",
    small: {
      fontSize: 10,
      fontFamily: "Vazirmatn, sans-serif",
    },
    clickable: {
      fontFamily: "Vazirmatn, sans-serif",
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
    MuiChip: {},
  },
};

const lightTheme = createTheme({
  ...commonStyles,
  ...(commonStyles.components.MuiChip = {
    styleOverrides: {
      root: {
        fontWeight: 600,
        borderRadius: BORDER_RADIUS,
      },
      filledInfo: {
        backgroundColor: INFO.light[200],
        color: INFO.light.main,
      },
      filledWarning: {
        backgroundColor: WARNING.light[200],
        color: WARNING.light.main,
      },
      filledSuccess: {
        backgroundColor: SUCCESS.light[200],
        color: SUCCESS.light.main,
      },
      filledError: {
        backgroundColor: ERROR.light[200],
        color: ERROR.light.main,
      },
    },
  }),

  palette: {
    mode: "light",

    primary: PRIMARY.light,
    secondary: SECONDARY.light,
    tertiary: TERTIARY.light,
    background: BACKGROUND.light,
    text: TEXT.light,
    success: SUCCESS.light,
    warning: WARNING.light,
    info: INFO.light,
    error: ERROR.light,
    grey: GREY.light,
  },
  shadows: BOXSHADOW.light,
});

const darkTheme = createTheme({
  ...commonStyles,
  ...(commonStyles.components.MuiChip = {
    styleOverrides: {
      root: {
        fontWeight: 600,
        borderRadius: BORDER_RADIUS,
      },
      filledInfo: {
        backgroundColor: INFO.dark[200],
        color: INFO.dark.main,
      },
      filledWarning: {
        backgroundColor: WARNING.dark[200],
        color: WARNING.dark.main,
      },
      filledSuccess: {
        backgroundColor: SUCCESS.dark[200],
        color: SUCCESS.dark.main,
      },
      filledError: {
        backgroundColor: ERROR.dark[200],
        color: ERROR.dark.main,
      },
    },
  }),
  palette: {
    mode: "dark",

    primary: PRIMARY.dark,
    secondary: SECONDARY.dark,
    tertiary: TERTIARY.dark,
    background: BACKGROUND.dark,
    text: TEXT.dark,
    success: SUCCESS.dark,
    warning: WARNING.dark,
    info: INFO.dark,
    error: ERROR.dark,
    grey: GREY.dark,
  },

  shadows: BOXSHADOW.dark,
});

export const ChadormaloTheme = {
  lightTheme,
  darkTheme,
};
