<template>
  <div>
    <div class="light-beam" :style="{ left: `${pos}%`, animationDelay: `${delay}s`, height: `${height}px` }" />
  </div>
</template>

<script setup>
defineProps({
  pos: { type: Number, required: true },
  delay: { type: Number, default: 0 },
  height: { type: Number, default: 300 },
})
</script>

<style scoped>
.light-beam {
  position: absolute;
  width: 2px;
  background: linear-gradient(to bottom, rgba(212, 168, 67, 0.4), transparent);
  filter: blur(1px);
  animation: beam-pulse 4s ease-in-out infinite;
}
</style>
