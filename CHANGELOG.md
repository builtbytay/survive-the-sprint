# Changelog

Notable changes to Survive the Sprint are documented here. Releases use [Semantic Versioning](https://semver.org/).

## [1.0.0] - baseline proposed (date on release)

Initial tracked baseline of the existing game before the accessibility/security remediation work.

- Five-day sprint with ongoing weeks, promotions, workstations, tickets, meetings, bugs and career duties.
- Canvas office, touch and keyboard controls, sound, local high score and the rubber-duck Easter egg.
- Browser compatibility and mobile-layout improvements from PR #1.
- Cloudflare Workers preview configuration from PR #3.

**Scope:** This baseline is based on `main` commit `7aaffd4dc10880ad263034e93f2e62322d0273a1`. It does **not** include the separately open favicon/social metadata PR #2, unless that PR is merged before the release tag is created.

After this PR is merged, create the `v1.0.0` Git tag and GitHub Release on the versioning PR's merged commit. The Git tag is the immutable release reference; the VERSION and CHANGELOG files are human-readable records.
