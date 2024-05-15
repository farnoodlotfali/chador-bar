export const blackColor = "#3b3b3b";
export const whiteColor = "#d8d8d8";
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
        extraLight: "#e3f2f8",
        light: "#3A415F",
        main: "#0067a5",
        contrastText: whiteColor,
        100: "#baddf0",
        200: "#90c9e8",
        300: "#68b3de",
        400: "#48a3d9",
        500: "#2995d4",
        600: "#1d87c8",
        700: "#0e76b6",
        800: "#0067a5",
        900: "#004986",
      },
      light: {
        extraLight: "#e3f2f8",
        light: "#E5EAFF",
        main: "#0067a5",
        contrastText: whiteColor,
        100: "#baddf0",
        200: "#90c9e8",
        300: "#68b3de",
        400: "#48a3d9",
        500: "#2995d4",
        600: "#1d87c8",
        700: "#0e76b6",
        800: "#0067a5",
        900: "#004986",
      },
    };
export const SECONDARY = roleName?.includes("legal-owner")
  ? secondOwner
  : roleName?.includes("shipping-manager")
  ? secondShipping
  : {
      dark: {
        main: whiteColor,
        contrastText: blackColor,
        100: "#c0c8d6",
        200: "#99a5ba",
        300: "#73839e",
        400: "#56698b",
        500: "#39517a",
        600: "#334972",
        700: "#2b4067",
        800: "#25375a",
        900: "#1c2741",
      },
      light: {
        light: "#E5EAFF",
        main: "#25375a",
        contrastText: whiteColor,
        100: "#c0c8d6",
        200: "#99a5ba",
        300: "#73839e",
        400: "#56698b",
        500: "#39517a",
        600: "#334972",
        700: "#2b4067",
        800: "#25375a",
        900: "#1c2741",
      },
    };
export const TERTIARY = {
  dark: { main: blackColor, contrastText: "#fff" },
  light: { main: "#fff", contrastText: blackColor },
};
export const BACKGROUND = {
  dark: { default: "#1A1D21", paper: "#212529" },
  light: { default: "#f3f3f37f", paper: "#fff" },
};
export const TEXT = {
  dark: { primary: whiteColor, secondary: "#acacac" },
  light: { primary: blackColor, secondary: "#acacac" },
};
