const core = require("@actions/core");
const github = require("@actions/github");
const semver = require("semver");
const { promises: fs } = require("fs");

const main = async () => {
  // read input
  const githubToken = core.getInput("githubToken");
  const rawPath = "package.json";
  const repoPath = `${process.env.GITHUB_WORKSPACE}/${rawPath}`;
  const [actor, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const branch = process.env.GITHUB_REF.split("/").pop();

  // read version
  const package = JSON.parse(await fs.readFile(repoPath, "utf8"));
  const oldVersion = package.version;

  // bump version
  const newVersion = semver.inc(oldVersion, "patch");
  package.version = newVersion;

  // commit updated version
  const octokit = github.getOctokit(githubToken);

  const result = await octokit.rest.repos.getContent({
    owner: actor,
    repo,
    path: rawPath,
  });

  const sha = result.data.sha;

  const updatePayload = {
    owner: actor,
    repo,
    branch,
    sha,
    path: rawPath,
    message: `chore: bump version to ${newVersion}`,
    content: Buffer.from(JSON.stringify(package, undefined, 2)).toString(
      "base64"
    ),
    committer: {
      name: actor,
      email: `${actor}@users.noreply.github.com`,
    },
    author: {
      name: actor,
      email: `${actor}@users.noreply.github.com`,
    },
  };
  await octokit.rest.repos.createOrUpdateFileContents(updatePayload);

  // set output
  core.setOutput("old_version", oldVersion);
  core.setOutput("new_version", newVersion);
};

main().catch((err) => core.setFailed(err.message));
