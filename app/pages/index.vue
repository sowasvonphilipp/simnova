<template>
  <NuxtLink to="/start" class="fullscreen-button" />
</template>

<style scoped>
.fullscreen-button {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0;
  cursor: pointer;
  z-index: 9999;
}
</style>
