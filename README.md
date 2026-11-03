# DevOps Understanding

A beginner-friendly DevOps practice project: a small web application with a
Node.js server, automated tests, and GitHub Actions continuous integration (CI).
The project is intentionally dependency-free and does not currently include a
database, Docker setup, or deployment pipeline.

## Application architecture

```text
Browser
  ├── GET /             -> HTML page
  ├── GET /style.css    -> page styles
  ├── GET /app.js       -> browser-side behavior
  └── GET /api/health   -> Node.js health response
          |
          v
      server.js
```

The Node.js server serves the frontend files and implements the health endpoint.
The browser displays a local clock and checks the backend health endpoint when
the page loads and every 10 seconds.

### HTTP routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/` or `/index.html` | Serve the page |
| `GET` | `/style.css` | Serve page styles |
| `GET` | `/app.js` | Serve browser JavaScript |
| `GET` | `/api/health` | Return JSON with `status: "ok"` and an ISO timestamp |

Unknown paths return `404 Not Found`. Methods other than `GET` return
`405 Method Not Allowed`.

## Project files

| File | Purpose |
| --- | --- |
| `server.js` | Node.js HTTP server, static-file serving, and health API |
| `index.html` | Main page markup |
| `style.css` | Responsive page styling |
| `app.js` | Browser clock and backend health polling |
| `test/server.test.js` | Automated HTTP tests for the server |
| `.github/workflows/ci.yml` | GitHub Actions CI workflow |
| `.gitignore` | Files and local data Git should ignore |

## Run locally

Requires Node.js 22 or later. No package installation is needed.

```sh
node server.js
```

Open <http://localhost:3000>. The server listens on port `3000` by default;
set `PORT` to use a different port:

```sh
PORT=4000 node server.js
```

Check the health endpoint from another terminal:

```sh
curl http://localhost:3000/api/health
```

Stop the server with `Ctrl+C`.

## Automated tests

Run the test suite locally:

```sh
node --test
```

The tests start the app server on an available temporary local port and check:

- The health response, status, timestamp, and cache-control header.
- The homepage and frontend assets.
- The `404` response for an unknown route.
- The `405` response and `Allow: GET` header for unsupported methods.

## GitHub Actions continuous integration

The workflow at `.github/workflows/ci.yml` runs on:

- Pushes to `main`, `beta`, `staging-frontend`, `staging-backend`, and
  `feature/**` branches.
- Pull requests targeting `main`, `beta`, `staging-frontend`, or
  `staging-backend`.

On a GitHub-hosted Ubuntu runner, CI checks out the repository, sets up Node.js
22, checks JavaScript syntax, and runs `node --test`. It has read-only
repository permissions and cancels outdated runs for the same branch or PR.

CI reports whether checks pass, but it does not by itself prevent a merge. Set
up GitHub branch protection or a ruleset that requires the `Test application`
check if merges must be blocked when CI fails.

## Branch workflow

The intended promotion path is:

```text
feature/frontend-* -> staging-frontend ─┐
                                         ├-> beta -> main
feature/backend-*  -> staging-backend  ──┘
feature/devops-*   -----------------------> beta
```

1. Create a feature branch from the matching component branch.
2. Open a pull request from the feature branch into `staging-frontend` or
   `staging-backend`.
3. After review and CI pass, promote the component staging branch to `beta`
   with a pull request.
4. Test the combined application on `beta`.
5. After review and CI pass, open a pull request from `beta` to `main`.

Pull requests request review and merging; they do not merge themselves.

### Current GitHub branch status

As checked on 2026-11-03, `beta`, `staging-frontend`, and `staging-backend`
contain the application, tests, and CI workflow. Their project files match the
files on `main`, and the recent GitHub Actions runs completed successfully.
However, the merges that updated `main` came directly from the component
staging branches, rather than through a final `beta`-to-`main` pull request.
The branch histories therefore differ even though the project files currently
match.

The older `staging` branch still contains only the initial README and
`.gitignore`; it is not part of the current CI triggers or the intended flow.
GitHub currently reports that `main` has no branch protection configured.

## Not configured yet

- No Dockerfile or Docker Compose setup is currently present in this repository.
- No production deployment or continuous deployment (CD) workflow is
  configured.
- No database or external service is used.
- CI is not a merge gate until branch protection requires its check.

Choose and configure a deployment target before adding a deployment workflow.
