# Security Policy

## Supported versions

This repository is a showcase site deployed continuously from `main`. The
latest commit on `main` is the only version that receives fixes.

## Reporting a vulnerability

Please **do not** open a public issue for security vulnerabilities. Instead,
report them privately through
[GitHub private vulnerability reporting](https://github.com/aniruddhaadak80/wow-repo/security/advisories/new)
or contact the maintainer directly on GitHub.

Include:

- A description of the vulnerability and its impact
- Steps to reproduce, or a proof of concept if you have one
- The affected route, component, or dependency if you know it

You should receive a response within a few days. Once the issue is confirmed,
a fix will be prepared and credited to the reporter unless they prefer to
remain anonymous.

## Scope notes

- The site serves no user accounts, cookies, or personal data
- The `/api/*` routes read only the typed content in `content/`
- All registry URLs point at third-party projects; their security posture is
  their own
- No API keys or secrets are required to run or deploy this repository
