# DevOps Understanding

A small web application for practicing Git workflows, automated testing, and
GitHub Actions. The project has a dependency-free Node.js backend, a simple
browser frontend, backend HTTP tests, and Playwright browser end-to-end tests.

## Architecture

```text
Browser
  ├── GET /, /style.css, /app.js
  └── GET /api/health
          |
          v
      Node.js server (server.js, port 3000 by default)
          ├── Serves the frontend files
          └── Returns health JSON with status and timestamp

GitHub Actions
  ├── Backend checks: install dependencies, syntax check, Node.js tests
  └── Frontend E2E: install Playwright Chromium, launch app, test in browser
```

The page displays the visitor's local time and checks the backend health
endpoint on load and every 10 seconds. The health endpoint returns
`{"status":"ok","timestamp":"..."}`. Unknown paths return `404`; unsupported
HTTP methods return `405`.

## Project files

| File | Purpose |
| --- | --- |
| `server.js` | Node.js HTTP server, frontend file serving, and health API |
| `index.html` | Page markup |
| `style.css` | Responsive page styling |
| `app.js` | Live clock and browser-side health checks |
| `test/server.test.js` | Backend HTTP tests using Node's built-in test runner |
| `e2e/app.e2e.js` | Real-browser end-to-end tests using Playwright |
| `playwright.config.js` | Playwright browser, server startup, and reporting settings |
| `package.json` / `package-lock.json` | Scripts and locked development dependencies |
| `.github/workflows/ci.yml` | Automated GitHub Actions checks |

## Requirements

- Node.js 22 or later (npm is included with Node.js).
- For local browser tests, Playwright's Chromium browser. CI installs it
  automatically.

## Install and run locally

The backend uses only Node.js built-in modules at runtime. Install the locked
development dependency (Playwright) before running tests:

```sh
npm ci
```

Start the app:

```sh
npm start
```

Open <http://localhost:3000>. Stop the server with `Ctrl+C`. The default port
can be changed with `PORT`, for example `PORT=4000 npm start`.

## Automated checks

Check JavaScript syntax:

```sh
npm run check
```

Run backend HTTP tests:

```sh
npm test
```

These tests start the server on an available temporary port and check the health
response, homepage and assets, unknown routes, and unsupported methods.

Install the local Chromium browser once:

```sh
npx playwright install chromium
```

Run frontend end-to-end tests:

```sh
npm run test:e2e
```

Playwright starts the app automatically on port `4173`, opens a real Chromium
browser, and checks that the page renders, the clock loads, the frontend
receives a healthy backend status, the health endpoint responds, and no
uncaught browser JavaScript errors occur.

Run all checks locally with:

```sh
npm run check
npm test
npm run test:e2e
```

## GitHub Actions CI

The workflow in `.github/workflows/ci.yml` runs for pushes to `main`, `beta`,
`staging-frontend`, `staging-backend`, and `feature/**`; it also runs for pull
requests targeting `main`, `beta`, or either component staging branch. It can
also be started manually from the GitHub Actions tab.

CI uses two separate jobs on GitHub-hosted Ubuntu runners:

1. **Backend checks** install locked dependencies with `npm ci`, check
   JavaScript syntax, and run the Node.js HTTP tests.
2. **Frontend end-to-end** installs locked dependencies, installs Chromium and
   its system dependencies, starts the app, and runs the Playwright browser
   tests. Playwright reports and diagnostics are uploaded as an artifact.

The workflow has read-only repository permissions, limits job run time, and
cancels outdated runs for the same branch or pull request. CI reports pass or
fail; to prevent merges when checks fail, configure GitHub branch protection or
a ruleset requiring both **Backend checks** and
**Frontend end-to-end (Playwright)**.

## Branch workflow

The intended promotion path is:

```text
feature/frontend-* -> staging-frontend ─┐
                                         ├-> beta -> main
feature/backend-*  -> staging-backend  ──┘
feature/devops-*   -----------------------> beta
```

Create a feature branch from its component staging branch. Open a pull request
from the feature branch into that component branch. After review and CI pass,
open pull requests from `staging-frontend` and `staging-backend` into `beta` to
combine and test the app. Once the combined app passes checks and review, open
a pull request from `beta` into `main`. Pull requests request review and
merging; they do not merge automatically.

The repository also has an older `staging` branch, but it is not part of this
workflow or the CI triggers.

## Current limitations

- There is no Dockerfile or Docker Compose setup in this repository.
- There is no production deployment or continuous deployment (CD) workflow.
- There is no database or external service.
- CI is not a merge gate until GitHub branch protection requires its checks.

Choose and configure a deployment target before adding a deployment workflow.
