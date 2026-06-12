<template>
  <div
    class="card cursor-pointer relative group"
    :class="{ 'border-gold/40 bg-gold/5': match.id === liveMatchId }"
    @click="$emit('openDetail', match)"
  >
    <!-- Live badge -->
    <div v-if="liveData" class="absolute top-3 right-3">
      <span class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse">
        {{ t('match.live') }} {{ liveData.minute }}'
      </span>
    </div>

    <!-- Teams -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2 flex-1">
        <span class="text-xl">{{ homeTeam.flag }}</span>
        <span class="font-bold text-sm truncate">{{ homeTeam.label }}</span>
      </div>
      <div class="px-3 py-1 rounded text-xs font-bold"
           :class="liveData ? 'bg-red-500/20 text-red-400' : 'bg-gold/10 text-gold'">
        <template v-if="liveData">
          {{ liveData.homeScore }} - {{ liveData.awayScore }}
        </template>
        <template v-else-if="prediction">
          {{ prediction.homeScore }} - {{ prediction.awayScore }}
        </template>
        <template v-else>
          {{ t('match.vs') }}
        </template>
      </div>
      <div class="flex items-center gap-2 flex-1 justify-end">
        <span class="font-bold text-sm truncate">{{ awayTeam.label }}</span>
        <span class="text-xl">{{ awayTeam.flag }}</span>
      </div>
    </div>

    <!-- Time & Venue -->
    <div class="text-xs text-text-muted space-y-1">
      <div v-if="match.time" class="flex items-center gap-1">
        ⏰ {{ formatTime(match.time) }}
      </div>
      <div class="flex items-center gap-1 truncate">
        📍 {{ getLocaleLabel(match.venue) }}
      </div>
    </div>

    <!-- Predict button -->
    <div class="mt-3 flex justify-end">
      <button @click.stop="$emit('openDetail', match)"
              class="px-3 py-1 rounded-lg text-xs font-semibold border border-border text-gold hover:bg-gold/10 transition-all">
        🔮 {{ t('prediction.predict') }}
      </button>
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
  prediction: { type: Object, default: null },
  liveMatchId: { type: String, default: null },
  liveData: { type: Object, default: null },
})

defineEmits(['openDetail'])

// Get team flag from groups data (fallback to emoji)
const teamFlags = computed(() => {
  const map = {
    MEX: '🇲🇽', GER: '🇩🇪', QAT: '🇶🇦', NZL: '🇳🇿',
    CAN: '🇨🇦', MAR: '🇲🇦', UZB: '🇺🇿', PLB: '❓',
    USA: '🇺🇸', TUN: '🇹🇳', PLA: '❓', PLCD: '❓',
    ARG: '🇦🇷', NGA: '🇳🇬', KOR: '🇰🇷',
    FRA: '🇫🇷', COL: '🇨🇴', PAR: '🇵🇾',
    ESP: '🇪🇸', CMR: '🇨🇲', KSA: '🇸🇦',
    BRA: '🇧🇷', CIV: '🇨🇮', JPN: '🇯🇵',
    ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ECU: '🇪🇨', SEN: '🇸🇳',
    POR: '🇵🇹', IRN: '🇮🇷', GHA: '🇬🇭',
    NED: '🇳🇱', URU: '🇺🇾', EGY: '🇪🇬',
    BEL: '🇧🇪', AUS: '🇦🇺', PER: '🇵🇪',
    ITA: '🇮🇹', CRO: '🇭🇷', ALG: '🇩🇿',
  }
  return map
})

const homeTeam = computed(() => ({
  label: getLocaleLabel(props.match.homeLabel),
  flag: teamFlags.value[props.match.homeTeam] || '🏳️',
}))

const awayTeam = computed(() => ({
  label: getLocaleLabel(props.match.awayLabel),
  flag: teamFlags.value[props.match.awayTeam] || '🏳️',
}))

function formatTime(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr.replace(' ', 'T') + ':00+08:00')
  if (isNaN(d.getTime())) return timeStr
  const currentLocale = locale.value
  if (currentLocale === 'zh') {
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} (北京时间)`
  }
  return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} (Beijing Time)`
}
</script>
