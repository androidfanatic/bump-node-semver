const core = require("@actions/core");
const github = require("@actions/github");
const semver = require("semver");
const { promises: fs } = require("fs");

const main = async () => {
  const package = JSON.parse(
    await fs.readFile(`${process.env.GITHUB_WORKSPACE}/package.json`, "utf8")
  );
  const oldVersion = package.version;
  const newVersion = semver.inc(oldVersion, "patch");
  core.setOutput("old_version", oldVersion);
  core.setOutput("new_version", newVersion);
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
};

main().catch((err) => core.setFailed(err.message));
