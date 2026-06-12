<template>
  <div class="bg-bg-card border border-border rounded-card p-6 flex items-center gap-4">
    <div class="text-3xl flex-shrink-0">🏆</div>
    <div class="flex-1">
      <div class="font-bold text-lg">{{ champion.flag }} {{ getLocaleLabel(champion.country) }}</div>
      <div class="text-text-secondary text-sm mt-1">{{ champion.years }}</div>
    </div>
    <div class="text-2xl font-extrabold text-gold">{{ champion.count }}</div>
  </div>
</template>

<script setup>
import { getLocaleLabel } from '../../composables/useLiveScores'

defineProps({
  champion: { type: Object, required: true },
})
</script>
