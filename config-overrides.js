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

  // Create a new IgnorePlugin instance to exclude the files
  const ignoreFilesPlugin = new webpack.IgnorePlugin({
    resourceRegExp: new RegExp(fileNameToRemove.join("|"), "i"),
  });

  // Add the IgnorePlugin to the plugins array in the Webpack configuration
  config.plugins.push(ignoreFilesPlugin);

  return config;
};
