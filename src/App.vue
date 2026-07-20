<script setup>
import "terminal.css";
</script>

<template>
  <div class="container mobile-size">
    <div class="terminal-nav">
      <div class="terminal-logo">
        <div class="logo terminal-prompt">
          <router-link to="/" class="no-style">League Fan</router-link>
        </div>
      </div>
      <nav class="terminal-menu">
        <ul class="nav-list">
          <li>
            <router-link to="/" class="menu-item">Icons</router-link>
          </li>
          <li>
            <router-link to="/summoner-emotes" class="menu-item">Emotes</router-link>
          </li>
          <li>
            <router-link to="/ward-skins" class="menu-item">Wards</router-link>
          </li>
          <li>
            <router-link to="/loot" class="menu-item">Loot</router-link>
          </li>
          <li>
            <router-link to="/champions" class="menu-item">Champions</router-link>
          </li>
          <li>
            <router-link to="/skins" class="menu-item">Skins</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div class="container">
    <div class="main">
      <router-view></router-view>
      <vue-progress-bar></vue-progress-bar>
    </div>
    <div class="footer">
      <hr />
      <footer>
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
          <span class="footer-right">
            <a
              href="https://github.com/league-fan/league-fan.github.io/"
              target="_blank"
              rel="noopener"
              >league-fan</a
            >
          </span>
        </p>
        <router-link to="/license">License</router-link>
      </footer>
    </div>
  </div>
</template>

<style>
.nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-right {
  float: right;
}

@media only screen and (max-width: 48em) {
  .footer-right {
    float: none;
    display: block;
    margin-top: 0.5em;
  }
}
</style>
