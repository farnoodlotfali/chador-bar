export const blackColor = "#3b3b3b";
export const whiteColor = "#ffffff";
const roleName = localStorage.getItem("role");

const primOwner = {
  dark: {
    extraLight: "#F5F7F9",
    light: "#E5EFF2",
    main: "#432039",
    contrastText: whiteColor,
    100: "#e9d0d6",
    200: "#dab1ba",
    300: "#cb919e",
    400: "#bc7283",
    500: "#ad5267",
    600: "#8d4354",
    700: "#b36174",
    800: "#813e4d",
    900: "#432039",
  },
  light: {
    extraLight: "#F5F7F9",
    light: "#E5EFF2",
    main: "#432039",
    contrastText: whiteColor,
    100: "#e9d0d6",
    200: "#dab1ba",
    300: "#cb919e",
    400: "#bc7283",
    500: "#ad5267",
    600: "#8d4354",
    700: "#b36174",
    800: "#813e4d",
    900: "#432039",
  },
};
const secondOwner = {
  dark: {
    light: "#e9ecfa",
    main: "#361C30",
    contrastText: whiteColor,
    100: "#e9d5d9",
    200: "#dbb9bf",
    300: "#cc9da6",
    400: "#be818d",
    500: "#af6573",
    600: "#9a505e",
    700: "#9a505e",
    800: "#46242b",
    900: "#361C30",
  },
  light: {
    light: "#e9ecfa",
    main: "#361C30",
    contrastText: whiteColor,
    100: "#e9d5d9",
    200: "#dbb9bf",
    300: "#cc9da6",
    400: "#be818d",
    500: "#af6573",
    600: "#9a505e",
    700: "#9a505e",
    800: "#46242b",
    900: "#361C30",
  },
};

const primShipping = {
  dark: {
    extraLight: "#F5F7F9",
    light: "#E5EFF2",
    main: "#204343",
    contrastText: whiteColor,
    100: "#bddfdf",
    200: "#a2d3d3",
    300: "#88c6c6",
    400: "#6db9b9",
    500: "#52adad",
    600: "#469292",
    700: "#469292",
    800: "#204343",
    900: "#204343",
  },
  light: {
    extraLight: "#F5F7F9",
    light: "#E5EFF2",
    main: "#204343",
    contrastText: whiteColor,
    100: "#bddfdf",
    200: "#a2d3d3",
    300: "#88c6c6",
    400: "#6db9b9",
    500: "#52adad",
    600: "#469292",
    700: "#469292",
    800: "#204343",
    900: "#204343",
  },
};
const secondShipping = {
  dark: {
    light: "#e9ecfa",
    main: "#1C3136",
    contrastText: whiteColor,
    100: "#bed8dd",
    200: "#bed8dd",
    300: "#8bb8c3",
    400: "#8bb8c3",
    500: "#5798a8",
    600: "#5798a8",
    700: "#469292",
    800: "#2f525a",
    900: "#1C3136",
  },
  light: {
    light: "#e9ecfa",
    main: "#1C3136",
    contrastText: whiteColor,
    100: "#bed8dd",
    200: "#bed8dd",
    300: "#8bb8c3",
    400: "#8bb8c3",
    500: "#5798a8",
    600: "#5798a8",
    700: "#469292",
    800: "#2f525a",
    900: "#1C3136",
  },
};
export const PRIMARY = roleName?.includes("legal-owner")
  ? primOwner
  : roleName?.includes("shipping-manager")
  ? primShipping
  : {
      dark: {
        extraLight: "#F5F7F9",
        light: "#E5EFF2",
        main: "#536688",
        contrastText: whiteColor,
        100: "#c8d5ee",
        200: "#acb9d6",
        300: "#8e9dbe",
        400: "#7888ab",
        500: "#627499",
        600: "#536688",
        700: "#435371",
        800: "#33405b",
        900: "#202c43",
      },
      light: {
        extraLight: "#F5F7F9",
        light: "#E5EFF2",
        main: roleName?.includes("legal-owner")
          ? "#432028"
          : roleName?.includes("shipping-manager")
          ? "#204343"
          : "#202C43",
        contrastText: whiteColor,
        100: "#c8d5ee",
        200: "#acb9d6",
        300: "#8e9dbe",
        400: "#7888ab",
        500: "#627499",
        600: "#536688",
        700: "#435371",
        800: "#33405b",
        900: "#202c43",
      },
    };
export const SECONDARY = roleName?.includes("legal-owner")
  ? secondOwner
  : roleName?.includes("shipping-manager")
  ? secondShipping
  : {
      dark: {
        light: "#e9ecfa",
        main: "#8a96b0",
        contrastText: whiteColor,
        100: "#c8d2e4",
        200: "#aab4c9",
        300: "#8a96b0",
        400: "#73809c",
        500: "#5c6b8a",
        600: "#4e5d79",
        700: "#3e4b63",
        800: "#2e394d",
        900: "#1c2536",
      },
      light: {
        light: "#e9ecfa",
        main: "#1c2536",
        contrastText: whiteColor,
        100: "#c8d2e4",
        200: "#aab4c9",
        300: "#8a96b0",
        400: "#73809c",
        500: "#5c6b8a",
        600: "#4e5d79",
        700: "#3e4b63",
        800: "#2e394d",
        900: "#1c2536",
      },
    };
export const TERTIARY = {
  dark: { main: "#fff", contrastText: blackColor },
  light: { main: "#fff", contrastText: blackColor },
};
export const BACKGROUND = {
  dark: { default: "#151521", paper: "#1E1E2D" },
  light: { default: "#F3F6F9", paper: "#FFFFFF" },
};
export const TEXT = {
  dark: { primary: whiteColor, secondary: "#acacac" },
  light: { primary: blackColor, secondary: "#acacac" },
};
export const SUCCESS = {
  dark: { 200: "#1B3C48", main: "#13DEB9" },
  light: { 200: "#E6FFFA", main: "#13DEB9" },
};
export const WARNING = {
  dark: { 200: "#4D3A2A", main: "#FFAE1F" },
  light: { 200: "#FEF5E5", main: "#FFAE1F" },
};
export const INFO = {
  dark: { 200: "#253662", main: "#5D87FF" },
  light: { 200: "#ECF2FF", main: "#5D87FF" },
};
export const ERROR = {
  dark: { 200: "#4B313D", main: "#EF6143" },
  light: { 200: "#FBF2EF", main: "#EF6143" },
};
export const GREY = {
  dark: { A700: "#2B2B40" },
  light: { A200: "#cccccc40" },
};
