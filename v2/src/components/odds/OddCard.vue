<template>
  <div class="bg-bg-card border border-border rounded-card p-6 text-center">
    <div class="text-xs text-text-muted mb-2">#{{ team.rank }}</div>
    <div class="text-4xl mb-2">{{ team.flag }}</div>
    <div class="font-bold text-base mb-1">{{ getLocaleLabel(team.name) }}</div>
    <div class="inline-block px-4 py-1 rounded-full bg-gold/15 text-gold font-bold text-sm">
      1赔{{ team.odds }}
    </div>
  </div>
</template>

<script setup>
import { getLocaleLabel } from '../../composables/useLiveScores'

defineProps({
  team: { type: Object, required: true },
})
</script>
