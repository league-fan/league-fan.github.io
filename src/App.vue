<script setup>
import 'terminal.css';
</script>

<template>
      <div class="container">
        <div class="terminal-nav">
            <div class="terminal-logo">
                <div class="logo terminal-prompt">
                    <a href="#" class="no-style">Logo</a>
                </div>
            </div>
            <nav class="terminal-menu">
                <ul>
                    <li>
                        <router-link to="/" class="menu-item" href="#">Summoner Icon</router-link>
                    </li>
                    <li>
                        <router-link to="/about" class="menu-item" href="#">战利品</router-link>
                    </li>
                    <li>
                        <router-link to="/1234" class="menu-item" href="#">商店</router-link>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    <div class="container">
      <hr>
        <router-view></router-view>
        <hr>
        <footer>
          <header>
          </header>
          <p>footer</p>
        </footer>
    </div>
    
</template>

<style>
</style>
