<template>
  <div class="bg-bg-card border rounded-lg p-2 cursor-pointer hover:border-gold/30 transition-all w-[150px]"
       :class="highlight ? 'border-gold' : 'border-border'"
       @click="$emit('openDetail', match)">
    <div class="flex items-center justify-between mb-1.5">
      <span class="text-[10px] font-bold text-gold uppercase">{{ t('match.' + match.phase) }}</span>
      <span v-if="match.time" class="text-[10px] text-text-muted">{{ formatTime(match.time) }}</span>
    </div>

    <div class="space-y-1">
      <!-- Home team -->
      <div class="flex items-center justify-between py-0.5 px-1.5 rounded"
           :class="winner === 'home' ? 'bg-gold/15' : ''">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="text-base">{{ homeTeam?.flag || '🏳️' }}</span>
          <span class="text-xs font-medium truncate">{{ homeTeam ? getLocaleLabel(homeTeam.name) : 'TBD' }}</span>
        </div>
        <span v-if="match.score" class="text-xs font-bold">{{ match.score.home }}</span>
      </div>

      <!-- Away team -->
      <div class="flex items-center justify-between py-0.5 px-1.5 rounded"
           :class="winner === 'away' ? 'bg-gold/15' : ''">
        <div class="flex items-center gap-1.5 min-w-0">
          <span class="text-base">{{ awayTeam?.flag || '🏳️' }}</span>
          <span class="text-xs font-medium truncate">{{ awayTeam ? getLocaleLabel(awayTeam.name) : 'TBD' }}</span>
        </div>
        <span v-if="match.score" class="text-xs font-bold">{{ match.score.away }}</span>
      </div>
    </div>

    <div v-if="match.venue" class="mt-1.5 text-[10px] text-text-muted truncate" :title="getLocaleLabel(match.venue)">
      📍 {{ getLocaleLabel(match.venue) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLocaleLabel } from '../../composables/useLiveScores'

const { t, locale } = useI18n()

const props = defineProps({
  match: { type: Object, required: true },
  resolveTeam: { type: Function, required: true },
  highlight: { type: Boolean, default: false },
})

defineEmits(['openDetail'])

const homeTeam = computed(() => props.resolveTeam(props.match, 'home'))
const awayTeam = computed(() => props.resolveTeam(props.match, 'away'))

const winner = computed(() => {
  if (!props.match.score || props.match.score.status !== 'FT') return null
  const home = props.match.score.home ?? 0
  const away = props.match.score.away ?? 0
  if (home > away) return 'home'
  if (away > home) return 'away'
  return null
})

function formatTime(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr.replace(' ', 'T') + ':00+08:00')
  if (isNaN(d.getTime())) return timeStr
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>
