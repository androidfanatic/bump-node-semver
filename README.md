# BumpNodeSemver

This action automatically bumps (increments) the semantic versioning of a nodejs project

## Inputs:

### `githubToken`

The github token for committing back updated version

## Outputs

### `oldVersion`

The previous version

### `newVersion`

The incremented version

## Example usage

uses: actions/hello-world-javascript-action@v1.1
with:
who-to-greet: 'Mona the Octocat'
