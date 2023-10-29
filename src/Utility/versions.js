// loads appropriate version
export const loadENV = () => {
  let version = process.env.REACT_APP_VERSION_CODE;
  return version.charAt(0).toUpperCase() + version.slice(1);
};

// all farsi version`s names
export const ALL_VERSIONS_FA = {
  barestan: "بارستان",
  baarestanV2: "بارستان",
  chadormalo: "دراپ",
};
// all english version`s names
export const ALL_VERSIONS = {
  barestan: "barestan",
  baarestanV2: "barestan",
  chadormalo: "chadormalo",
};
// loads farsi name version
export const loadFarsiVersion = () => {
  let version = process.env.REACT_APP_VERSION_CODE;
  return ALL_VERSIONS_FA[version] ?? null;
};
