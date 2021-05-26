const core = require("@actions/core");
const github = require("@actions/github");
const semver = require("semver");
const { promises: fs } = require("fs");

const main = async () => {
  // read input
  const githubToken = core.getInput("githubToken");
  const actor = "androidfanatic"; // process.env.GITHUB_ACTOR;
  const packageJsonPath = `${process.env.GITHUB_WORKSPACE}/package.json`;
  const repo = process.env.GITHUB_REPOSITORY;

  // read version
  const package = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
  const oldVersion = package.version;

  // bump version
  const newVersion = semver.inc(oldVersion, "patch");
  package.version = newVersion;

  // commit updated version
  const octokit = github.getOctokit(githubToken);

  const updatePayload = {
    owner: actor,
    repo,
    path: "package.json",
    message: `chore: bump version to ${newVersion}`,
    content: Buffer.from(JSON.stringify(package)).toString("base64"),
    committer: {
      name: actor,
      email: `${actor}@users.noreply.github.com`,
    },
    author: {
      name: actor,
      email: `${actor}@users.noreply.github.com`,
    },
  };
  console.log("upload payload", updatePayload);
  await octokit.rest.repos.createOrUpdateFileContents(updatePayload);

  console.log(res);

  // set output
  core.setOutput("old_version", oldVersion);
  core.setOutput("new_version", newVersion);
};

main().catch((err) => core.setFailed(err.message));
