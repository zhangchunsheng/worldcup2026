<template>
  <div class="bg-bg-card border border-border rounded-card overflow-hidden" :class="{ open: isOpen }">
    <!-- Phase header (click to toggle) -->
    <div class="px-6 py-5 cursor-pointer flex items-center justify-between transition-colors hover:bg-bg-card-hover"
         @click="isOpen = !isOpen">
      <h3 class="text-base font-bold">{{ phase.icon }} {{ getLocaleLabel(phase.label) }}</h3>
      <span class="text-text-muted text-xl transition-transform duration-300" :class="{ 'rotate-180': isOpen }">▼</span>
    </div>

    <!-- Matches grid -->
    <div class="max-h-0 overflow-hidden transition-max-height duration-400 ease" :class="{ 'max-h-[20000px]': isOpen }">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6 pt-2">
        <MatchCard v-for="match in phase.matches" :key="match.id"
          :match="match"
          :prediction="getPrediction?.(match.id)"
          :live-match-id="getLiveData?.(match.id)?.id"
          :live-data="getLiveData?.(match.id)"
          @open-detail="$emit('openDetail', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getLocaleLabel } from '../../composables/useLiveScores'
import MatchCard from './MatchCard.vue'

defineProps({
  phase: { type: Object, required: true },
  getPrediction: { type: Function, default: () => null },
  getLiveData: { type: Function, default: () => null },
})

defineEmits(['openDetail'])

const isOpen = ref(false)
</script>
