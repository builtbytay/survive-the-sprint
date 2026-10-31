# Changelog

Notable changes to Survive the Sprint are documented here. Releases use [Semantic Versioning](https://semver.org/).

## [1.0.2] - Unreleased

- Add branded SVG favicon and social-sharing artwork with Open Graph and X card metadata.
- Keep the modern external CSS/JavaScript and security headers intact.
- Add alternate text for social sharing images and allow the branded favicon host in CSP.

## [1.0.1] - Unreleased

Accessibility changes proposed for review:

- Manage keyboard focus for intro, pause, sprintboard and meeting dialogs.
- Offer an optional relaxed timing mode and a setting to disable single-character shortcuts; default gameplay timing is unchanged.
- Announce important gameplay state changes to screen readers and expose priority selection state.
- Respect reduced-motion preferences in the canvas, remove the duplicate rubber duck control, and correct the station shortcut order.
- Expose the current mission through the persistent tickets control in compact layouts.

**Before merging:** Verify the Cloudflare preview, full keyboard-only gameplay, screen readers, zoom/reflow, and normal/relaxed game progression.

## [1.0.0] - baseline proposed (date on release)

Initial tracked baseline of the existing game before the accessibility/security remediation work.

- Five-day sprint with ongoing weeks, promotions, workstations, tickets, meetings, bugs and career duties.
- Canvas office, touch and keyboard controls, sound, local high score and the rubber-duck Easter egg.
- Browser compatibility and mobile-layout improvements from PR #1.
- Cloudflare Workers preview configuration from PR #3.

**Scope:** This baseline is based on `main` commit `7aaffd4dc10880ad263034e93f2e62322d0273a1`. It does **not** include the separately open favicon/social metadata PR #2, unless that PR is merged before the release tag is created.

After this PR is merged, create the `v1.0.0` Git tag and GitHub Release on the versioning PR's merged commit. The Git tag is the immutable release reference; the VERSION and CHANGELOG files are human-readable records.
