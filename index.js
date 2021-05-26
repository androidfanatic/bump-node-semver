const core = require("@actions/core");
const github = require("@actions/github");
const semver = require("semver");

try {
  const version = "0.0.4";
  const incrementedVersion = semver.inc(version, "patch");
  core.setOutput("version", incrementedVersion);
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
