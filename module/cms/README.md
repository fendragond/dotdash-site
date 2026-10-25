# CMS module (opt-in)

Git-based [Sveltia CMS](https://sveltiacms.app/) add-on for atlaseo-starter projects. It lives outside the core: nothing under `module/cms/` is bundled at build time. Activate it only when a project needs an editorial UI; copy the admin files into that project's static tree and wire OAuth separately.

## Two moving parts

1. **`admin/` folder** — static SPA (`index.html` + `config.yml`) served by the site Worker at `/admin/`. Copy from this module into the project's `public/admin/` (or equivalent static root). No npm dependency.
2. **OAuth Worker** — a separate Cloudflare Worker deployed from the official [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth) repo as its own Cloudflare project. It completes the GitHub OAuth handshake; the site Worker does not handle tokens.

## Auth model

Use a dedicated GitHub account per project (`{{client}}-cms`) added as a **Write** collaborator on the site repo, plus a GitHub OAuth App. The editor signs in with GitHub and never handles a personal access token. GitHub has no PKCE backendless OAuth for this flow, which is why the dedicated auth Worker is required.

## Activation

See [docs/modules/cms.md](../../docs/modules/cms.md) for architecture and the per-project activation procedure.
