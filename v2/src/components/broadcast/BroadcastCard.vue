<template>
  <div class="bg-bg-card border border-border rounded-card p-6 flex items-center gap-4">
    <div class="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-2xl flex-shrink-0">
      {{ broadcaster.icon }}
    </div>
    <div>
      <h3 class="font-bold text-base">{{ getLocaleLabel(broadcaster.name) }}</h3>
      <p class="text-text-secondary text-sm">{{ getLocaleLabel(broadcaster.desc) }}</p>
    </div>
  </div>
</template>

<script setup>
import { getLocaleLabel } from '../../composables/useLiveScores'

defineProps({
  broadcaster: { type: Object, required: true },
})
</script>
