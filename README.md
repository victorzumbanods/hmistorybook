# HMI Storybook

React web components whose visuals come only from **Figma Variables**. Change a variable in Figma, and Storybook rebuilds and redeploys with the new values.

```
Figma variables ──► tokens/figma-variables.json ──► npm run tokens:build ──► src/tokens/tokens.css ──► components ──► Storybook (GitHub Pages)
       │                      ▲
       ├── Figma plugin ──────┘  (any plan: one click commits to GitHub)
       └── Webhook + REST API ───► GitHub Actions pulls the file (Enterprise: automatic on library publish)
```

## Run locally

```bash
npm install
npm run storybook          # http://localhost:6006 (or the next free port)
```

`tokens/figma-variables.json` is watched: when it changes (after a `git pull`, or `npm run tokens:pull`), the CSS regenerates and Storybook hot-reloads without a page refresh.

| Script | What it does |
| --- | --- |
| `npm run storybook` | Dev server, rebuilds tokens on change |
| `npm run build` | Tokens + static Storybook in `storybook-static/` |
| `npm run tokens:build` | `tokens/figma-variables.json` → `src/tokens/tokens.css`, `tokens.json`, `tokens.ts` |
| `npm run tokens:pull` | Downloads variables from Figma through the REST API (Enterprise) |
| `npm run tokens:sync` | `tokens:pull` and then `tokens:build` |
| `npm run webhook:create` | Registers the Figma `LIBRARY_PUBLISH` webhook |

## How variables become CSS

| Figma | CSS |
| --- | --- |
| `color/action/primary/default` | `--color-action-primary-default` |
| Alias to `color/brand/500` | `var(--color-brand-500)` (aliases stay aliases) |
| Collection with one mode | `:root { … }` |
| Collection **Theme**, modes Light / Dark | `:root, [data-theme="light"] { … }` and `[data-theme="dark"] { … }` |
| Collection **Density**, modes Touch / Compact | `[data-density="compact"] { … }` |
| FLOAT scoped to size, gap, radius, font size… | `px` |
| FLOAT scoped to font weight / opacity | unitless (opacity ÷ 100) |
| Code syntax → Web set in Figma | used as the CSS name |

Each multi-mode collection also becomes a Storybook toolbar switch, generated from the tokens. Add a "Brand" collection with three modes in Figma and the toolbar gets a Brand switch with no code change.

**Rule for components:** use only semantic variables (`--color-action-*`, `--size-control-*`, …), never hex values or primitives. Renaming a variable in Figma renames the CSS variable, so components referencing the old name lose that style. Rename in Figma and the component in the same change.

## Pipeline setup (one time)

### 1. GitHub repository

This project lives only in **[victorzumbanods/hmistorybook](https://github.com/victorzumbanods/hmistorybook)** and only the `victorzumbanods` GitHub account pushes to it.

- Git identity is set per repo (`git config user.name/user.email`) to `victorzumbanods` and its noreply e-mail.
- Pushes use a dedicated SSH key, `~/.ssh/id_ed25519_whirlpool_github`, through the `github-whirlpool` host alias, so other GitHub keys on the machine are never used here:
  ```bash
  git remote -v   # origin  git@github-whirlpool:victorzumbanods/hmistorybook.git
  ssh -T git@github-whirlpool   # Hi victorzumbanods!
  ```

In the repo on GitHub:

- **Settings → Pages → Source: GitHub Actions.**
- **Settings → Actions → General → Workflow permissions: Read and write.**

The workflow [.github/workflows/figma-tokens.yml](.github/workflows/figma-tokens.yml) runs on every push to `main`. It rebuilds tokens, commits the generated files, builds Storybook and deploys it to Pages.

### 2. Path A: Figma plugin (any Figma plan)

1. Figma desktop → main menu → **Plugins → Development → Import plugin from manifest…** → `figma-plugin/manifest.json`.
   Use **Plugins**, not **Widgets**. Importing through Widgets fails with `Manifest error: Expected "manifest.containsWidget" to have type true`. If that happened, remove the entry under **Widgets → Development → Manage widgets in development** first, then import again through Plugins.
2. Signed in as `victorzumbanods`, create a **fine-grained token** with access to `victorzumbanods/hmistorybook` only, and **Contents: Read and write**.
3. Open the HMI Foundations file, run **HMI Variables → GitHub** (the repository field is prefilled), paste the token, then click **Sync**.

The plugin exports every local variable (plus library variables they alias), shows which variables changed, and commits the JSON with those names in the commit message. The push triggers the workflow and Storybook is live in about 2 minutes.

### 3. Path B: fully automatic on library publish (Figma Enterprise)

The Variables REST API and webhooks need Figma Enterprise and a token with `file_variables:read` (and `webhooks:write` to register the webhook).

1. GitHub repo → **Settings → Secrets and variables → Actions**
   - Secret `FIGMA_TOKEN`: Figma personal access token
   - Variable `FIGMA_FILE_KEY`: the key in `figma.com/design/<KEY>/…`
   
   From then on, **Actions → Figma Variables → Storybook → Run workflow** pulls the latest variables on demand.
2. Deploy the relay (GitHub needs an auth header that Figma webhooks cannot send):
   ```bash
   cd relay
   npx wrangler secret put FIGMA_WEBHOOK_PASSCODE
   npx wrangler secret put GITHUB_TOKEN        # victorzumbanods fine-grained PAT, hmistorybook only, Contents: Read and write
   npx wrangler deploy
   ```
3. Register the webhook:
   ```bash
   FIGMA_TOKEN=… FIGMA_FILE_KEY=… RELAY_URL=https://figma-webhook-relay.<you>.workers.dev \
   FIGMA_WEBHOOK_PASSCODE=<same passcode> npm run webhook:create
   ```

Publishing the library in Figma now fires the webhook. The relay calls `repository_dispatch`, the workflow pulls variables through the REST API, commits them and deploys Storybook.

## Project layout

```
tokens/figma-variables.json   source of truth, written by the plugin or the REST pull (Figma REST shape)
scripts/build-tokens.mjs      JSON → CSS / JSON / TS
scripts/figma-pull.mjs        REST API pull
scripts/lib/normalize.mjs     canonical JSON format (mirrored in figma-plugin/code.js)
src/tokens/                   generated, do not edit
src/components/               Button, Toggle, CycleTile, Stepper, StatusPill
src/docs/                     Introduction, token gallery, control panel example
figma-plugin/                 HMI Variables → GitHub plugin
relay/                        Cloudflare Worker: Figma webhook → GitHub
```
