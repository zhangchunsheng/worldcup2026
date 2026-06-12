<template>
  <div
    class="grid gap-5 bg-bg-card border border-border rounded-card overflow-hidden"
    :class="{ open: isOpen }"
    @click="isOpen = !isOpen"
  >
    <div class="px-6 py-5 cursor-pointer flex items-center justify-between transition-colors hover:bg-bg-card-hover">
      <h3 class="text-base font-bold">{{ phase.icon }} {{ getLocaleLabel(phase.label) }}</h3>
      <span class="text-text-muted text-xl transition-transform duration-300" :class="{ 'rotate-180': isOpen }">▼</span>
    </div>
    <div class="max-h-0 overflow-hidden transition-max-height duration-400 ease" :class="{ 'max-h-[2000px]': isOpen }">
      <div v-for="(match, i) in phase.matches" :key="i"
           class="grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 py-3.5 text-sm border-t border-white/5"
           :class="{ 'bg-gold/5 border-border-hover': phase.highlight }">
        <div class="text-center">{{ getLocaleLabel(match.homeLabel) }}</div>
        <div class="text-gold font-bold text-xs px-3 py-1 rounded bg-gold/10">{{ t('match.vs') }}</div>
        <div class="text-center">{{ getLocaleLabel(match.awayLabel) }}</div>
      </div>
      <div class="text-center text-text-muted text-xs py-2 px-6 border-t border-white/5">
        📍 {{ getLocaleLabel(phase.venue) }} · {{ getLocaleLabel(phase.dateRange) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLocaleLabel } from '../../composables/useLiveScores'

const { t } = useI18n()
const props = defineProps({
  phase: { type: Object, required: true },
})

const isOpen = ref(false)
</script>
