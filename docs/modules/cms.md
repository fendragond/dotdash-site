# CMS module — architecture

Opt-in Sveltia CMS for atlaseo-starter projects. Templated files live in [`module/cms/`](../../module/cms/); they are not part of the core build. Activate per project only.

## Architecture

```
Editor browser
    │
    ├─ GET /admin/  ──────────────►  Site Worker (static assets)
    │                                 public/admin/index.html
    │                                 public/admin/config.yml
    │
    └─ GitHub OAuth ──────────────►  sveltia-cms-auth Worker
           │                           (separate Cloudflare project)
           └─ callback ───────────►  GitHub OAuth App
                                      (owned by the agency GitHub account)
```

| Piece | Role |
| --- | --- |
| **Site Worker** | Serves `public/admin/` statically at `/admin/`. CMS JS loads from the unpkg CDN; no CMS code is bundled into the Astro build. |
| **sveltia-cms-auth Worker** | Handles the GitHub OAuth handshake. Deploy from the official [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) repo as its own Cloudflare project. Authorization callback URL is `https://{{TODO:oauth-worker-host}}/callback`. Disable Device Flow on the OAuth App — this Worker uses the authorization-code flow only. |
| **Dedicated GitHub CMS account** | One account per project (`{{client}}-cms`), invited as a **Write** collaborator on the site repo. Editors sign in with this account; they never paste a token. |
| **GitHub OAuth App** | Owned by the **agency** GitHub account (not the CMS user). Client ID/secret go to the auth Worker only. |

`config.yml` points at the auth Worker via `backend.base_url`. Media defaults in the example config: `media_folder: public/uploads`, `public_folder: /uploads`.

## OAuth Worker secrets

Set on the **auth** Worker only — never in `config.yml`, never in the site Worker, never committed:

```bash
wrangler secret put GITHUB_CLIENT_ID
wrangler secret put GITHUB_CLIENT_SECRET
```

| Secret | Source |
| --- | --- |
| `GITHUB_CLIENT_ID` | GitHub OAuth App → Client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App → Client secret (encrypt / `wrangler secret put`) |

## `ALLOWED_DOMAINS`

Plain (non-secret) variable on the auth Worker: comma-separated hostnames allowed to complete OAuth.

Include:

- production domain(s), e.g. `www.example.com`
- the staging `*.workers.dev` URL for the **site** Worker

Example shape (placeholders only):

```text
{{TODO:production-domain}},{{TODO:staging-workers-dev-host}}
```

Wildcards like `*.example.com` are supported by sveltia-cms-auth when needed.

## Config gotcha

List widgets that must serialize as a flat string array: omit the `name` key on the nested `field`. See [docs/cursor_gotchas.md](../cursor_gotchas.md) (Sveltia CMS section) — do not restate the full rule here.

## Activation checklist

1. Copy `module/cms/admin/` into the project's `public/admin/`. Fill `config.example.yml` → `config.yml` with the project repo, OAuth Worker URL, locale, and real collection schema.
2. Create the dedicated GitHub CMS account (`{{client}}-cms`) on a mailbox controlled by the agency. Add it as a Write collaborator on the site repo.
3. Create the GitHub OAuth App (owned by the agency account): set the callback URL to the OAuth Worker's `/callback` endpoint; disable Device Flow.
4. Deploy the sveltia-cms-auth Worker as its own Cloudflare project (from the official Sveltia repo, unmodified). Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` via `wrangler secret put`.
5. Set `ALLOWED_DOMAINS` on the OAuth Worker: production domain(s) + the staging workers.dev URL, comma-separated.
6. Enable 2FA on the dedicated CMS account and record where the recovery codes are held (agency vs client — decide explicitly per project).
7. Rotate the OAuth client secret if it was ever exposed during setup; never commit any secret.
8. End-to-end test before handover: sign in at `/admin` via GitHub, edit one entry, confirm the commit lands in the repo with correct flat-YAML serialization and the site rebuilds.
