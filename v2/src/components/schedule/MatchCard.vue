<template>
  <div
    class="card cursor-pointer relative group"
    :class="{ 'border-gold/40 bg-gold/5': prediction && !isFinished }"
    @click="$emit('openDetail', match)"
  >
    <!-- Finished badge -->
    <div v-if="isFinished" class="absolute top-3 right-3">
      <span class="px-2 py-0.5 rounded-full bg-white/10 text-text-muted text-xs font-bold">
        {{ t('match.finished') }}
      </span>
    </div>
    <div v-if="isPlaying" class="absolute top-3 right-3">
      <span class="px-2 py-0.5 rounded-full bg-white/10 text-text-muted text-xs font-bold">
        {{ t('match.playing') }}
      </span>
    </div>
    <!-- Live badge -->
    <div v-else-if="liveData" class="absolute top-3 right-3">
      <span class="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse">
        {{ t('match.live') }} {{ liveData.minute }}'
      </span>
    </div>

    <!-- Teams -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <span class="text-xl flex-shrink-0">{{ homeFlag }}</span>
        <span class="font-bold text-sm truncate">{{ homeLabel }}</span>
      </div>

      <!-- Center: Score / VS / Prediction -->
      <div class="flex flex-col items-center gap-1 flex-shrink-0 mx-2">
        <!-- Actual score -->
        <div class="px-3 py-1 rounded text-xs font-bold" :class="scoreClass">
          <template v-if="displayHome !== null">
            {{ displayHome }} - {{ displayAway }}
          </template>
          <template v-else>
            {{ t('match.vs') }}
          </template>
        </div>
        <!-- Prediction result for finished matches -->
        <div v-if="isFinished && prediction" class="text-xs font-bold px-2 py-0.5 rounded-full"
             :class="predictionCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
          🤖 {{ prediction.homeScore }}-{{ prediction.awayScore }}
          <span class="ml-1">{{ predictionCorrect ? t('prediction.correct') : t('prediction.incorrect') }}</span>
        </div>
      </div>

      <div class="flex items-center gap-2 flex-1 justify-end min-w-0">
        <span class="font-bold text-sm truncate">{{ awayLabel }}</span>
        <span class="text-xl flex-shrink-0">{{ awayFlag }}</span>
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

    <!-- AI Prediction badge -->
    <div v-if="prediction && !isFinished" class="mt-2 flex items-center justify-between">
      <span class="text-xs text-gold/70">🤖 AI {{ prediction.confidence }}%</span>
      <button @click.stop="$emit('openDetail', match)"
              class="px-3 py-1 rounded-lg text-xs font-semibold border border-border text-gold hover:bg-gold/10 transition-all">
        🔮 {{ t('prediction.predict') }}
      </button>
    </div>

    <!-- Predict button for non-finished, non-predicted -->
    <div v-else-if="!isFinished" class="mt-3 flex justify-end">
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

const teamFlags = {
  MEX: '🇲🇽', RSA: '🇿🇦', KOR: '🇰🇷', CZE: '🇨🇿',
  CAN: '🇨🇦', BIH: '🇧🇦', USA: '🇺🇸', PAR: '🇵🇾',
  QAT: '🇶🇦', SUI: '🇨🇭', BRA: '🇧🇷', MAR: '🇲🇦',
  HAI: '🇭🇹', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', AUS: '🇦🇺', TUR: '🇹🇷',
  GER: '🇩🇪', CUW: '🇨🇼', NED: '🇳🇱', JPN: '🇯🇵',
  CIV: '🇨🇮', ECU: '🇪🇨', SWE: '🇸🇪', TUN: '🇹🇳',
  ESP: '🇪🇸', CPV: '🇨🇻', KSA: '🇸🇦', URU: '🇺🇾',
  BEL: '🇧🇪', EGY: '🇪🇬', NZL: '🇳🇿', IRN: '🇮🇷',
  FRA: '🇫🇷', SEN: '🇸🇳', IRQ: '🇮🇶', NOR: '🇳🇴',
  ARG: '🇦🇷', ALG: '🇩🇿', AUT: '🇦🇹', JOR: '🇯🇴',
  POR: '🇵🇹', COD: '🇨🇩', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', CRO: '🇭🇷',
  GHA: '🇬🇭', PAN: '🇵🇦', UZB: '🇺🇿', COL: '🇨🇴',
}

const homeFlag = computed(() => teamFlags[props.match.homeTeam] || '🏳️')
const awayFlag = computed(() => teamFlags[props.match.awayTeam] || '🏳️')
const homeLabel = computed(() => getLocaleLabel(props.match.homeLabel))
const awayLabel = computed(() => getLocaleLabel(props.match.awayLabel))

const isFinished = computed(() => props.match.score?.status === 'FT')
const isPlaying = computed(() => props.match.score?.status === 'Playing')
const actualScore = computed(() => props.match.score || null)

// Check if prediction matches actual result
const predictionCorrect = computed(() => {
  if (!isFinished.value || !actualScore.value || !props.prediction) return false
  return actualScore.value.home === props.prediction.homeScore && 
         actualScore.value.away === props.prediction.awayScore
})

// Display: live score > actual score > AI prediction > VS
const displayHome = computed(() => {
  if (props.liveData) return props.liveData.homeScore
  if (actualScore.value) return actualScore.value.home
  if (props.prediction) return props.prediction.homeScore
  return null
})

const displayAway = computed(() => {
  if (props.liveData) return props.liveData.awayScore
  if (actualScore.value) return actualScore.value.away
  if (props.prediction) return props.prediction.awayScore
  return null
})

const scoreClass = computed(() => {
  if (props.liveData) return 'bg-red-500/20 text-red-400'
  if (actualScore.value) return 'bg-white/10 text-text-primary'
  if (props.prediction) return 'bg-gold/15 text-gold'
  return 'bg-gold/10 text-gold'
})

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