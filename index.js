const core = require("@actions/core");
const github = require("@actions/github");
const semver = require("semver");
const { promises: fs } = require("fs");

const main = async () => {
  // read input
  const githubToken = core.getInput("GITHUB_TOKEN");

  // read version
  const packageJsonPath = `${process.env.GITHUB_WORKSPACE}/package.json`;
  const package = JSON.parse(await fs.readFile(packageJsonPath, "utf8"));
  const oldVersion = package.version;

  // bump version
  const newVersion = semver.inc(oldVersion, "patch");
  package.version = newVersion;

  // commit updated version
  const octokit = github.getOctokit(githubToken);
  console.log(octokit.rest.repos);
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: "BumpNodeSemver",
    path: packageJsonPath,
    message: `chore: bump version to ${newVersion}`,
    content: Buffer.from(JSON.stringify(package)).toString("base64"),
    committer: {
      name: `BumpNodeSemver Bot`,
      email: "BumpNodeSemver@noreply",
    },
    author: {
      name: `BumpNodeSemver Bot`,
      email: "BumpNodeSemver@noreply",
    },
  });

  // set output
  core.setOutput("old_version", oldVersion);
  core.setOutput("new_version", newVersion);
};

main().catch((err) => core.setFailed(err.message));
