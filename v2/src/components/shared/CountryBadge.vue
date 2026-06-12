<template>
  <span :class="`country-badge ${countryClass}`" class="absolute top-3 right-3 px-3 py-0.5 rounded-full text-xs font-semibold">
    {{ flag }} {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  country: { type: String, required: true },
  flag: { type: String, required: true },
  label: { type: String, required: true },
})

const countryClass = computed(() => {
  const map = { USA: 'usa', CAN: 'can', MEX: 'mex' }
  return map[props.country] || ''
})
</script>

<style scoped>
.country-badge.usa { background: rgba(37, 99, 235, 0.2); color: #60a5fa; }
.country-badge.can { background: rgba(239, 68, 68, 0.2); color: #f87171; }
.country-badge.mex { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
</style>
