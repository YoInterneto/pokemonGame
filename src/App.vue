<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <RouterLink to="/list">POKEMON LIST</RouterLink>
    <RouterLink to="/guess">WHO IS THAT POKEMON</RouterLink>
  </div>
  <RouterView />
</template>

<style lang='scss' scoped>

</style>
