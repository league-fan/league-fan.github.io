# League Fan

Browse League of Legends client cosmetics and champion skins.

- **Production (Cloudflare Pages):** [https://league-fan-github-io.pages.dev/](https://league-fan-github-io.pages.dev/)
- **Legacy GitHub Pages:** [https://league-fan.github.io/](https://league-fan.github.io/) (may lag behind)

Powered by [`@magicwenli/league-fan-assets`](https://www.npmjs.com/package/@magicwenli/league-fan-assets).

## Features

- Prebuilt data from Cloudflare R2/CDN (daily sync) with CDragon image URLs
- Full-viewport responsive layout: left filters / details, right gallery
- Chinese / English UI language
- Search by name, id, champion, series, and more
- Skins: group by **Hero** or **Series**, filter by rarity / legacy / chromas
- Detail panel shows original attributes (rarity, description, release notes, chromas, asset links, …)
- Categories: **Icons · Emotes · Wards · Loot · Champions · Skins**

## Develop

```bash
npm install --legacy-peer-deps
npm run dev
npm run build
```

Requires Node 18+.

### Env

Copy `.env.example` → `.env` if needed:

| Variable | Default | Notes |
|----------|---------|--------|
| `VITE_ASSETS_BASE` | Cloudflare CDN `/latest` | Set `cdragon` to load live CommunityDragon JSON instead |
| `VITE_SITE_TITLE` | League Fan | Document title helper |

## Deploy

### Why not “GitHub Pages on Cloudflare”?

`*.github.io` DNS is owned by **GitHub**. You cannot point `league-fan.github.io` at Cloudflare’s edge the way you would a custom domain.

What actually works:

| Layer | Role |
|-------|------|
| **GitHub repo** | Source of truth |
| **Cloudflare Pages** | Real host (build + CDN) |
| **league-fan.github.io** | Optional **redirect** entry URL → Pages |

```
push main ──┬──► Cloudflare Pages Git integration  ──► https://league-fan-github-io.pages.dev
            ├──► (optional) GHA wrangler pages deploy ──► same project
            └──► GHA “GitHub Pages redirect” ──► https://league-fan.github.io → CF
```

### Cloudflare Pages (primary)

Project name: **`league-fan-github-io`**

- **Dashboard Git integration:** connect repo → production branch `main` → build `npm ci --legacy-peer-deps` / `npm run build` / output `dist`  
  (already connected; push to `main` deploys)
- **GitHub Action** (optional explicit deploy): `.github/workflows/deploy-cloudflare.yml`  
  Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`  
  Prefer **either** Git integration **or** this Action to avoid double deploys.
- **CLI:**

```bash
npm run deploy
# or: npx wrangler pages deploy dist --project-name=league-fan-github-io
```

SPA fallback: `public/_redirects` → `/* /index.html 200`  
Cache headers: `public/_headers`

### GitHub Pages URL (redirect only)

Workflow: `.github/workflows/github-pages-redirect.yml`  
Publishes a tiny site so `https://league-fan.github.io/` jumps to Cloudflare Pages (deep links via `404.html`).

Repo → Settings → Pages → Source: **GitHub Actions**.

### Data pipeline

Metadata JSON is **not** baked into this repo. Daily job in
[`league-fan-assets`](https://github.com/league-fan/league-fan-assets):

1. Build snapshots from CommunityDragon  
2. Publish GitHub Release `data-v{gameVersion}`  
3. Sync to R2 → served at `https://league-fan-data.yxra3603.workers.dev/latest/`

## Stack

- Vue 3 + Vue Router + Vuex + Vite
- [Terminal CSS](https://terminalcss.xyz/)
- [`@magicwenli/league-fan-assets`](https://github.com/league-fan/league-fan-assets) `^2.0.0`
- Cloudflare Pages + R2 data CDN

## Credits

- [CommunityDragon](https://communitydragon.org) CDN (images)
- Riot Games (assets copyright)
- Vue 3

Not endorsed by Riot Games.
