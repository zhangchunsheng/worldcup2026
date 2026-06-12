<template>
  <div v-if="prediction" class="flex items-center justify-center gap-4 py-3">
    <div class="text-center">
      <div class="text-xs text-text-muted mb-1">{{ label }}</div>
      <div class="text-2xl font-black text-gold">{{ prediction.homeScore }} - {{ prediction.awayScore }}</div>
      <div v-if="prediction.confidence" class="text-xs text-text-muted mt-1">
        {{ prediction.confidence }}% {{ prediction.mode === 'ai' ? 'AI' : '' }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  prediction: { type: Object, default: null },
  label: { type: String, default: '' },
})
</script>
