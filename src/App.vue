<script setup>
import "terminal.css";
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="header-inner">
        <div class="terminal-logo">
          <div class="logo terminal-prompt">
            <router-link to="/" class="no-style">League Fan</router-link>
          </div>
        </div>
        <nav class="terminal-menu app-nav" aria-label="Categories">
          <ul class="nav-list">
            <li>
              <router-link to="/" class="menu-item">Icons</router-link>
            </li>
            <li>
              <router-link to="/summoner-emotes" class="menu-item"
                >Emotes</router-link
              >
            </li>
            <li>
              <router-link to="/ward-skins" class="menu-item">Wards</router-link>
            </li>
            <li>
              <router-link to="/loot" class="menu-item">Loot</router-link>
            </li>
            <li>
              <router-link to="/champions" class="menu-item"
                >Champions</router-link
              >
            </li>
            <li>
              <router-link to="/skins" class="menu-item">Skins</router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <router-view></router-view>
    </main>

    <footer class="app-footer">
      <p>
        Data via
        <a
          href="https://github.com/league-fan/league-fan-assets"
          target="_blank"
          rel="noopener"
          >@magicwenli/league-fan-assets</a
        >
        · CDN
        <a href="https://communitydragon.org" target="_blank" rel="noopener"
          >CommunityDragon</a
        >
        · Theme
        <a href="https://terminalcss.xyz/" target="_blank" rel="noopener"
          >Terminal CSS</a
        >
        ·
        <a
          href="https://github.com/league-fan/league-fan.github.io/"
          target="_blank"
          rel="noopener"
          >GitHub</a
        >
        ·
        <router-link to="/license">License</router-link>
      </p>
    </footer>

    <!-- Outside flex flow so it cannot steal layout height -->
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<style>
/* Full-viewport shell: override terminal.css narrow container */
:root {
  --page-width: 100%;
  --sidebar-width: 300px;
  --app-pad: 0.75rem;
}

html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

body {
  overflow: hidden;
}

/* Locked viewport: header + main + footer always visible */
.app-shell {
  height: 100%;
  height: 100dvh;
  max-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--background-color);
}

/* Sticky top bar (pinned by shell, not document scroll) */
.app-header {
  flex: 0 0 auto;
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--secondary-color);
  background: var(--background-color);
}

.header-inner {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.25rem;
  padding: 0.35rem var(--app-pad);
  max-width: 100%;
}

.header-inner .logo {
  margin: 0 !important;
  padding: 0.25rem 0 !important;
  font-size: 1.05rem;
  float: none !important;
}

.header-inner .logo:after {
  display: none !important;
}

.header-inner .terminal-logo {
  flex: 0 0 auto;
  float: none !important;
}

.app-nav {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  justify-content: flex-end;
}

.nav-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.15rem 0.35rem;
  list-style: none;
  padding: 0;
  margin: 0;
  align-items: center;
  float: none !important;
}

.nav-list li {
  float: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.nav-list li::after {
  content: none !important;
}

.nav-list .menu-item {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;
}

/* Middle area fills remaining height; browser page owns internal scroll */
.app-main {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
}

.app-main > * {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  max-height: 100%;
}

/* Sticky bottom bar */
.app-footer {
  flex: 0 0 auto;
  position: sticky;
  bottom: 0;
  z-index: 50;
  border-top: 1px solid var(--secondary-color);
  padding: 0.4rem var(--app-pad);
  font-size: 0.8rem;
  color: var(--secondary-color);
  background: var(--background-color);
}

.app-footer p {
  margin: 0;
  line-height: 1.45;
}

.app-footer a {
  color: var(--primary-color);
}

@media only screen and (max-width: 48em) {
  .header-inner {
    flex-wrap: wrap;
  }

  .app-nav {
    justify-content: flex-start;
    width: 100%;
  }

  .nav-list {
    justify-content: flex-start;
  }

  .app-footer {
    font-size: 0.75rem;
  }
}
</style>
