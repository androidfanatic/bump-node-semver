const core = require("@actions/core");
const github = require("@actions/github");
const semver = require("semver");
const { promises: fs } = require("fs");

const main = async () => {
  // read input
  const githubToken = core.getInput("githubToken");
  const actor = process.env.GITHUB_ACTOR;
  const packageJsonPath = `${process.env.GITHUB_WORKSPACE}/package.json`;
  const repo = process.env.GITHUB_REPOSITORY;

  // read version
  const package = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
  const oldVersion = package.version;

  // bump version
  const newVersion = semver.inc(oldVersion, "patch");
  package.version = newVersion;

  // commit updated version
  const octokit = github.getOctokit(githubToken, {
    log: console,
  });

  await octokit.rest.repos.createOrUpdateFileContents({
    owner: actor,
    repo: repo,
    author: {
      name: actor,
      email: `${actor}@users.noreply.github.com`,
    },
  });

  console.log(res);

  // set output
  core.setOutput("old_version", oldVersion);
  core.setOutput("new_version", newVersion);
};

main().catch((err) => core.setFailed(err.message));
