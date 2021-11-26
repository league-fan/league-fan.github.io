<script setup>
import 'terminal.css';
</script>

<template>
  <div class="container mobile-size">
    <div class="terminal-nav">
      <div class="terminal-logo">
        <div class="logo terminal-prompt">
          <a href="/league-fan/" class="no-style">League Fan</a>
        </div>
      </div>
      <nav class="terminal-menu">
        <ul>
          <li>
            <router-link to="/league-fan/" class="menu-item" href="#">Summoner Icon</router-link>
          </li>
          <li>
            <router-link to="/league-fan/traits" class="menu-item" href="#">Traits</router-link>
          </li>
          <li>
            <router-link to="/league-fan/skins" class="menu-item" href="#">Skins</router-link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
  <div class="container">
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="footer">
      <hr />
      <footer>
        <header></header>
        Css theme by <a href="https://terminalcss.xyz/" target="_blank">Terminal CSS</a>
        <br/><a href="/league-fan/license">License</a>
      </footer>
    </div>
  </div>
</template>

<style>
.container {
    grid-template-rows: 1fr 1fr 1fr; /* or whatever you need */
}
</style>
