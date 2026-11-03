# DevOps Understanding

Practice project with a frontend, Node.js backend, Docker, and CI/CD.

## Branch workflow

Frontend:
`feature/frontend-*` -> `staging-frontend` -> `beta` -> `main`

Backend:
`feature/backend-*` -> `staging-backend` -> `beta` -> `main`

DevOps:
`feature/devops-*` -> `beta` -> `main`

The `staging-frontend` and `staging-backend` branches collect changes for
their respective components. Pull requests from both component branches into
`beta` combine the changes for integration testing. After the application
passes the beta checks and review, open a pull request from `beta` to `main`.

## Automated tests

Run the API and frontend-serving tests locally with Node.js 22 or later:

```sh
node --test
```

GitHub Actions runs JavaScript syntax checks and the automated tests on pushes
to `main`, `beta`, the component staging branches, and feature branches. It
also runs on pull requests targeting `main`, `beta`, or either component
staging branch. The workflow is in `.github/workflows/ci.yml`.

Continuous deployment (CD) from `main` is not configured yet. Add it later
after choosing and configuring a deployment target.
