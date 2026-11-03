# DevOps Understanding

Practice project with a frontend, Node.js backend, Docker, and CI/CD.

## Branch workflow

Frontend: feature/frontend-* -> staging-frontend -> staging -> main
Backend: feature/backend-* -> staging-backend -> staging -> main
DevOps: feature/devops-* -> staging -> main

## Automated tests

Run the API and frontend-serving tests locally with Node.js 22 or later:

```sh
node --test
```

GitHub Actions runs JavaScript syntax checks and the automated tests on pushes
to `main` and the staging branches, and on pull requests targeting those
branches. The workflow is in `.github/workflows/ci.yml`.

## Branch workflow

Frontend: feature/frontend-* -> staging-frontend -> staging -> main
Backend: feature/backend-* -> staging-backend -> staging -> main
DevOps: feature/devops-* -> staging -> main
