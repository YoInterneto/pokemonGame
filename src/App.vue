<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <RouterLink to="/list">POKEMON LIST</RouterLink><br>
    <RouterLink to="/guess">WHO IS THAT POKEMON</RouterLink><br>
    <RouterLink to="/guessSprite">GUESS THE POKEMON</RouterLink><br>
    <RouterLink to="/data">GET DATA</RouterLink><br>
  </div>
  <RouterView />
</template>

<style lang='scss' scoped>

</style>
