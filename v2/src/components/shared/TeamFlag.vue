<template>
  <span class="text-2xl" :title="code">{{ flag }}</span>
</template>

<script setup>
defineProps({
  flag: { type: String, required: true },
  code: { type: String, default: '' },
})
</script>
