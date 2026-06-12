<template>
  <div class="bg-bg-card border border-border rounded-card p-6 text-center">
    <div class="w-20 h-20 rounded-full bg-gradient-to-br from-bg-secondary to-bg-card border-2 border-border flex items-center justify-center text-3xl mx-auto mb-3">
      {{ player.emoji }}
    </div>
    <div class="font-bold text-base">{{ getLocaleLabel(player.name) }}</div>
    <div class="text-text-secondary text-sm mb-1">{{ player.flag }} {{ getLocaleLabel(player.country) }}</div>
    <span class="inline-block px-3 py-0.5 rounded-full bg-white/5 text-text-muted text-xs">
      {{ getLocaleLabel(player.position) }}
    </span>
  </div>
</template>

<script setup>
import { getLocaleLabel } from '../../composables/useLiveScores'

defineProps({
  player: { type: Object, required: true },
})
</script>
