# Release and rollback guide

This project uses GitHub history, reviewable pull requests, and version tags for named release points. Keep work off `main` until a PR is reviewed.

## Create a release

1. Merge the reviewed changes into `main`.
2. Update `VERSION` and `CHANGELOG.md` in the appropriate PR. Use semantic versions: patch for fixes, minor for backwards-compatible features, major for intentionally breaking changes.
3. In GitHub, select **Releases → Draft a new release → Choose a tag → Create new tag**. For this initial release, choose `v1.0.0` and target the intended `main` commit. Double-check the commit SHA before publishing.
4. Publish the release notes, including noteworthy changes and known limitations.
5. Verify Cloudflare's resulting deployment and the live game independently; a GitHub tag alone does not deploy or roll back Cloudflare.

## Roll back source code

- To undo a merged change, use GitHub's **Revert** action on the merged PR (or revert the relevant commit on a new branch). Review and merge that rollback PR; Cloudflare can then deploy the reverted `main`.
- To restore a full prior release, create a branch from the known-good release tag, then submit a reviewed restoration PR. Do **not** force-push `main` to an older commit.
- The independent snapshot branch `snapshot/pre-accessibility-baseline` also points to the exact pre-accessibility source commit `7aaffd4dc10880ad263034e93f2e62322d0273a1`.

## Roll back an active Cloudflare deployment

Cloudflare's deployment history may allow an operational rollback to a previous deployment. This does not change GitHub's `main`, so reconcile source afterward or a subsequent CI deployment can restore the newer code.

## Important

- VERSION, CHANGELOG and release tags are the version history. `public/index.html` stays the independently deployable HTML game.
- Neither the snapshot branch nor a PR automatically creates a GitHub release or moves the production deployment.
