# GHCR package publish & visibility

Crime Tips production images live at:

`ghcr.io/benjaminsingleton/crime-tips`

CI workflow: [`.github/workflows/publish-image.yml`](../../.github/workflows/publish-image.yml).

## What publishes what

| Trigger | Image tags |
|---------|------------|
| Git tag `vX.Y.Z` (and GitHub Release) | `:X.Y.Z`, `:X.Y`, `:latest` |
| Push to `master` | `:master`, `:sha-<short>` |
| Manual `workflow_dispatch` | Same as the ref that ran |

Police departments should pin a release tag (e.g. `:1.0.0`), not `:master`.

## First release / package visibility (maintainers)

GitHub Container Registry packages are often **private by default** until an owner changes visibility. Anonymous `docker pull` fails with `unauthorized` until the package is public (or the puller logs in with `read:packages`).

After tagging `v1.0.0` (or any first image push that creates the package):

1. Wait for the **Publish container image** workflow on that tag to finish green:  
   https://github.com/benjaminsingleton/crime-tips/actions
2. Open the package page:  
   https://github.com/benjaminsingleton/crime-tips/pkgs/container/crime-tips  
   (also: repo → **Packages** → **crime-tips**)
3. **Package settings** → **Change visibility** → **Public** → confirm.
4. Verify without login:

   ```bash
   docker pull ghcr.io/benjaminsingleton/crime-tips:1.0.0
   ```

Org/user package policies can restrict who may change visibility; an org owner may need to allow public packages first.

## Cutting a release (maintainers)

From an up-to-date `master` (annotated tag preferred):

```bash
git checkout master
git pull origin master
git tag -a v1.0.0 -m "v1.0.0"
git push origin v1.0.0
gh release create v1.0.0 --title "v1.0.0" --notes-file RELEASE_NOTES.md
# or: gh release create v1.0.0 --generate-notes
```

Pushing the `v*` tag starts the publish workflow. Creating the GitHub Release is the public changelog surface for PD IT; keep [CHANGELOG.md](../../CHANGELOG.md) in sync on `master`.

## PD pull failures

If `docker compose … pull` or `docker pull` returns `unauthorized` / `denied`:

1. Confirm the tag exists on the package page.
2. Confirm package visibility is **Public** (steps above), **or**
3. `echo "$GHCR_TOKEN" | docker login ghcr.io -u USERNAME --password-stdin` with a PAT that has `read:packages`.

See also [update.md](./update.md).
