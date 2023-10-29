const fs = require("fs-extra");
require("dotenv").config();
const destPath = "./public";
try {
  if (process.env.REACT_APP_VERSION_CODE === undefined) {
    throw new Error(
      "REACT_APP_VERSION_CODE is not defined, Please check .env file!\n"
    );
  }
  fs.removeSync(destPath);
  console.log("Directory successfully removed.");

  const srcPath = `./versions-public/${process.env.REACT_APP_VERSION_CODE}/public`;

  fs.copySync(srcPath, destPath);
  console.log("Directory successfully copied.");
} catch (err) {
  console.error(
    "Error " +
      "REACT_APP_VERSION_CODE is not defined, Please check .env file!\n",
    err
  );
}
