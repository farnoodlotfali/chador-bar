const webpack = require("webpack");

module.exports = function override(config, env) {
  const allVersions = process.env.REACT_APP_ALL_VERSIONS.split(",");

  if (process.env.REACT_APP_VERSION_CODE === undefined) {
    throw new Error(
      "REACT_APP_VERSION_CODE is not defined, Please check .env file!\n"
    );
  }

  const otherVersions = allVersions.filter(
    (item) => item !== process.env.REACT_APP_VERSION_CODE
  );

  // Define the name of the file to remove
  const fileNameToRemove = otherVersions;

  // Update the IgnorePlugin to modify the passed object instead of returning it
  config.plugins.forEach((plugin) => {
    if (plugin instanceof webpack.IgnorePlugin) {
      plugin.checkIgnore = (resource, context) => {
        for (const regExp of plugin.resourceRegExp) {
          if (regExp.test(resource)) {
            return true;
          }
        }
        return false;
      };
      // Update the IgnorePlugin resourceRegExp
      const updatedResourceRegExp = fileNameToRemove.map((fileName) => new RegExp(fileName, "i"));
      plugin.resourceRegExp = updatedResourceRegExp;
    }
  });

  return config;
};
