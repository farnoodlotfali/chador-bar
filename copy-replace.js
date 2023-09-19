const fs = require("fs-extra");
require("dotenv").config();
const destPath = "./public";
try {
  fs.removeSync(destPath);
  console.log("Directory successfully removed.");

  const srcPath = `./versions-public/${process.env.REACT_APP_VERSION_CODE}/public`;

  fs.copySync(srcPath, destPath);
  console.log("Directory successfully copied.");
} catch (err) {
  console.error("Error", err);
}
