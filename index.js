const core = require("@actions/core");
const github = require("@actions/github");
const semver = require("semver");
const fs = require("fs");

const main = async () => {
  const version = "0.0.4";
  const package = await fs.readFile("./package.json");
  console.log("Orig version", JSON.stringify(package));
  const incrementedVersion = semver.inc(version, "patch");
  core.setOutput("version", incrementedVersion);
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
};

main().catch((err) => core.setFailed(error.message));
