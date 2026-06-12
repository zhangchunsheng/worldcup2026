<template>
  <div class="absolute inset-0 overflow-hidden z-0">
    <div class="absolute inset-0 bg-gradient-radial-hero" />
    <StadiumLightBeams />
  </div>
</template>

<script setup>
import StadiumLightBeams from './StadiumLightBeams.vue'
</script>

<style scoped>
.bg-gradient-radial-hero {
  background:
    radial-gradient(ellipse at 50% 30%, rgba(212, 168, 67, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 80%, rgba(27, 140, 61, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(37, 99, 235, 0.08) 0%, transparent 50%);
}
</style>
