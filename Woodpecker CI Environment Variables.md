<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Woodpecker CI Environment Variables

Woodpecker CI provides built-in environment variables injected into pipeline steps and plugins at runtime. Custom variables can be set per step but cannot overwrite built-in ones. Global variables are configured server-side via `WOODPECKER_ENVIRONMENT`.[^1]

## Repository Variables

| Name | Description | Example |
| :-- | :-- | :-- |
| `CI_REPO` | repository full name `<owner>/<name>` | `john-doe/my-repo` [^1] |
| `CI_REPO_OWNER` | repository owner | `john-doe` [^1] |
| `CI_REPO_NAME` | repository name | `my-repo` [^1] |
| `CI_REPO_REMOTE_ID` | repository remote ID (UID in forge) | `82` [^1] |
| `CI_REPO_URL` | repository web URL | `https://git.example.com/john-doe/my-repo` [^1] |
| `CI_REPO_CLONE_URL` | repository clone URL | `https://git.example.com/john-doe/my-repo.git` [^1] |
| `CI_REPO_CLONE_SSH_URL` | repository SSH clone URL | `git@git.example.com:john-doe/my-repo.git` [^1] |
| `CI_REPO_DEFAULT_BRANCH` | repository default branch | `main` [^1] |
| `CI_REPO_PRIVATE` | repository is private | `true` [^1] |
| `CI_REPO_TRUSTED_NETWORK` | repository has trusted network access | `false` [^1] |
| `CI_REPO_TRUSTED_VOLUMES` | repository has trusted volumes access | `false` [^1] |
| `CI_REPO_TRUSTED_SECURITY` | repository has trusted security access | `false` [^1] |

## Current Commit Variables

| Name | Description | Example |
| :-- | :-- | :-- |
| `CI_COMMIT_SHA` | commit SHA | `eba09b46064473a1d345da7abf28b477468e8dbd` [^1] |
| `CI_COMMIT_REF` | commit ref | `refs/heads/main` [^1] |
| `CI_COMMIT_REFSPEC` | commit ref spec | `issue-branch:main` [^1] |
| `CI_COMMIT_BRANCH` | commit branch (target for PRs) | `main` [^1] |
| `CI_COMMIT_SOURCE_BRANCH` | commit source branch (PRs only) | `issue-branch` [^1] |
| `CI_COMMIT_TARGET_BRANCH` | commit target branch (PRs only) | `main` [^1] |
| `CI_COMMIT_TAG` | commit tag name (tag events) | `v1.10.3` [^1] |
| `CI_COMMIT_PULL_REQUEST` | commit PR number (PRs only) | `1` [^1] |
| `CI_COMMIT_PULL_REQUEST_LABELS` | PR labels (PRs only) | `server` [^1] |
| `CI_COMMIT_PULL_REQUEST_MILESTONE` | PR milestone (PR events) | `summer-sprint` [^1] |
| `CI_COMMIT_MESSAGE` | commit message | `Initial commit` [^1] |
| `CI_COMMIT_AUTHOR` | commit author username | `john-doe` [^1] |
| `CI_COMMIT_AUTHOR_EMAIL` | commit author email | `john-doe@example.com` [^1] |
| `CI_COMMIT_PRERELEASE` | release is pre-release (release events) | `false` [^1] |

## Current Pipeline Variables

| Name | Description | Example |
| :-- | :-- | :-- |
| `CI_PIPELINE_NUMBER` | pipeline number | `8` [^1] |
| `CI_PIPELINE_PARENT` | parent pipeline number | `0` [^1] |
| `CI_PIPELINE_EVENT` | pipeline event | `push`, `pull_request`, etc. [^1] |
| `CI_PIPELINE_EVENT_REASON` | reason for `pull_request_metadata` | `label_updated`, etc. [^1] |
| `CI_PIPELINE_URL` | web UI link for pipeline | `https://ci.example.com/repos/7/pipeline/8` [^1] |
| `CI_PIPELINE_FORGE_URL` | forge UI link for commit/tag | `https://git.example.com/...` [^1] |
| `CI_PIPELINE_DEPLOY_TARGET` | deploy target (deployment events) | `production` [^1] |
| `CI_PIPELINE_DEPLOY_TASK` | deploy task (deployment events) | `migration` [^1] |
| `CI_PIPELINE_CREATED` | pipeline created timestamp | `1722617519` [^1] |
| `CI_PIPELINE_STARTED` | pipeline started timestamp | `1722617519` [^1] |
| `CI_PIPELINE_FILES` | changed files (push/PR, ≤500) | `[]`, `[".woodpecker.yml"]` [^1] |
| `CI_PIPELINE_AUTHOR` | pipeline author username | `octocat` [^1] |
| `CI_PIPELINE_AVATAR` | pipeline author avatar | `https://git.example.com/avatars/...` [^1] |

## Current Workflow and Step

| Name | Description | Example |
| :-- | :-- | :-- |
| `CI_WORKFLOW_NAME` | workflow name | `release` [^1] |
| `CI_STEP_NAME` | step name | `build package` [^1] |
| `CI_STEP_NUMBER` | step number | `0` [^1] |
| `CI_STEP_STARTED` | step started timestamp | `1722617519` [^1] |
| `CI_STEP_URL` | step UI URL | `https://ci.example.com/repos/7/pipeline/8` [^1] |

## Previous Commit Variables

| Name | Description | Example |
| :-- | :-- | :-- |
| `CI_PREV_COMMIT_SHA` | previous commit SHA | `15784117e4e103f36cba75a9e29da48046eb82c4` [^1] |
| `CI_PREV_COMMIT_REF` | previous commit ref | `refs/heads/main` [^1] |
| `CI_PREV_COMMIT_REFSPEC` | previous ref spec | `issue-branch:main` [^1] |
| `CI_PREV_COMMIT_BRANCH` | previous branch | `main` [^1] |
| `CI_PREV_COMMIT_SOURCE_BRANCH` | previous source branch (PRs) | `issue-branch` [^1] |
| `CI_PREV_COMMIT_TARGET_BRANCH` | previous target branch (PRs) | `main` [^1] |
| `CI_PREV_COMMIT_URL` | previous commit forge link | `https://git.example.com/...` [^1] |
| `CI_PREV_COMMIT_MESSAGE` | previous commit message | `test` [^1] |
| `CI_PREV_COMMIT_AUTHOR` | previous author username | `john-doe` [^1] |
| `CI_PREV_COMMIT_AUTHOR_EMAIL` | previous author email | `john-doe@example.com` [^1] |

## Previous Pipeline Variables

| Name | Description | Example |
| :-- | :-- | :-- |
| `CI_PREV_PIPELINE_NUMBER` | previous pipeline number | `7` [^1] |
| `CI_PREV_PIPELINE_PARENT` | previous parent number | `0` [^1] |
| `CI_PREV_PIPELINE_EVENT` | previous event | `push`, etc. [^1] |
| `CI_PREV_PIPELINE_EVENT_REASON` | previous metadata reason | `label_updated`, etc. [^1] |
| `CI_PREV_PIPELINE_URL` | previous pipeline CI link | `https://ci.example.com/repos/7/pipeline/7` [^1] |
| `CI_PREV_PIPELINE_FORGE_URL` | previous forge link | `https://git.example.com/...` [^1] |
| `CI_PREV_PIPELINE_DEPLOY_TARGET` | previous deploy target | `production` [^1] |
| `CI_PREV_PIPELINE_DEPLOY_TASK` | previous deploy task | `migration` [^1] |
| `CI_PREV_PIPELINE_STATUS` | previous status | `success`, `failure` [^1] |
| `CI_PREV_PIPELINE_CREATED` | previous created timestamp | `1722610173` [^1] |
| `CI_PREV_PIPELINE_STARTED` | previous started timestamp | `1722610173` [^1] |
| `CI_PREV_PIPELINE_FINISHED` | previous finished timestamp | `1722610383` [^1] |
| `CI_PREV_PIPELINE_AUTHOR` | previous author | `octocat` [^1] |
| `CI_PREV_PIPELINE_AVATAR` | previous avatar | `https://git.example.com/avatars/...` [^1] |

## System and Other Variables

| Name | Description | Example |
| :-- | :-- | :-- |
| `CI` | CI environment name | `woodpecker` [^1] |
| `CI_WORKSPACE` | workspace path | `/woodpecker/src/git.example.com/john-doe/my-repo` [^1] |
| `CI_SYSTEM_NAME` | CI system name | `woodpecker` [^1] |
| `CI_SYSTEM_URL` | CI system URL | `https://ci.example.com` [^1] |
| `CI_SYSTEM_HOST` | CI server hostname | `ci.example.com` [^1] |
| `CI_SYSTEM_VERSION` | server version | `2.7.0` [^1] |
| `CI_FORGE_TYPE` | forge name | `bitbucket`, `github`, etc. [^1] |
| `CI_FORGE_URL` | forge root URL | `https://git.example.com` [^1] |
| `CI_SCRIPT` | internal script path (don't use) | - [^1] |
| `CI_NETRC_*` | credentials for private repos (don't use) | - [^1] |

<span style="display:none">[^10][^2][^3][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://woodpecker-ci.org/docs/usage/environment

[^2]: https://stackoverflow.com/questions/72364430/using-global-environment-variables-in-woodpecker-ci

[^3]: https://github.com/woodpecker-ci/woodpecker/issues/3661

[^4]: https://github.com/woodpecker-ci/woodpecker/discussions/2266

[^5]: https://github.com/woodpecker-ci/woodpecker/issues/3311

[^6]: https://woodpecker-ci.org/docs/next/usage/environment

[^7]: https://stackoverflow.com/questions/79556326/woodpecker-ci-share-files-across-steps

[^8]: https://blog.csdn.net/gitblog_01083/article/details/148507653

[^9]: https://github.com/siddharthkp/ci-env/blob/main/.woodpecker.yml

[^10]: https://docs.trymondo.com/mops/devops/woodpecker

