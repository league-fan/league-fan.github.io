# League Fan

[https://league-fan.github.io/](https://league-fan.github.io/)

Browse League of Legends client cosmetics and champion skins, powered by
[`@magicwenli/league-fan-assets`](https://www.npmjs.com/package/@magicwenli/league-fan-assets).

## Features

- Live data from CommunityDragon via typed asset loaders
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

## Stack

- Vue 3 + Vue Router + Vuex + Vite
- [Terminal CSS](https://terminalcss.xyz/)
- [`@magicwenli/league-fan-assets`](https://github.com/league-fan/league-fan-assets) `^2.0.0`

## Credits

- [CommunityDragon](https://communitydragon.org) CDN
- Riot Games (assets copyright)
- Vue 3

Not endorsed by Riot Games.
