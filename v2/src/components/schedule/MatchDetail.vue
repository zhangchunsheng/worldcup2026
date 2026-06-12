<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="close">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <!-- Modal -->
      <div class="relative w-full max-w-lg bg-bg-card border border-border rounded-card shadow-card max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-bg-card/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h3 class="font-bold text-lg">{{ homeLabel }} vs {{ awayLabel }}</h3>
          <button @click="close" class="text-text-muted hover:text-text-primary text-xl transition-colors">✕</button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Score display -->
          <div class="text-center">
            <div class="flex items-center justify-center gap-4 mb-2">
              <div class="text-center">
                <div class="text-3xl mb-1">{{ homeFlag }}</div>
                <div class="font-bold">{{ homeLabel }}</div>
              </div>
              <div class="text-4xl font-black" :class="scoreTextColor">
                <template v-if="liveData">
                  {{ liveData.homeScore }} - {{ liveData.awayScore }}
                </template>
                <template v-else-if="actualScore">
                  {{ actualScore.home }} - {{ actualScore.away }}
                </template>
                <template v-else-if="prediction">
                  {{ prediction.homeScore }} - {{ prediction.awayScore }}
                </template>
                <template v-else>
                  VS
                </template>
              </div>
              <div class="text-center">
                <div class="text-3xl mb-1">{{ awayFlag }}</div>
                <div class="font-bold">{{ awayLabel }}</div>
              </div>
            </div>

            <!-- Status badges -->
            <div class="flex items-center justify-center gap-2">
              <span v-if="liveData" class="text-sm text-red-400 font-bold animate-pulse">
                {{ t('match.live') }} {{ liveData.minute }}'
              </span>
              <span v-else-if="actualScore" class="px-2 py-0.5 rounded-full bg-white/10 text-text-muted text-xs font-bold">
                {{ t('match.finished') }}
              </span>
              <span v-else-if="match.time" class="text-sm text-text-muted">
                {{ formatTime(match.time) }}
              </span>
            </div>
          </div>

          <!-- Venue info -->
          <div class="bg-bg-secondary rounded-lg p-4 space-y-2">
            <div v-if="match.venue" class="flex items-center gap-2 text-sm">
              <span>📍</span>
              <span>{{ getLocaleLabel(match.venue) }}</span>
            </div>
            <div v-if="match.time" class="flex items-center gap-2 text-sm">
              <span>⏰</span>
              <span>{{ formatTime(match.time) }}</span>
            </div>
          </div>

          <!-- AI Prediction section (only for non-finished matches) -->
          <div v-if="!isFinished" class="border-t border-border pt-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-bold text-sm">🤖 {{ t('prediction.title') }}</h4>
              <AISwitchToggle :mode="predMode" @toggle="$emit('toggleMode')" />
            </div>

            <!-- Existing AI prediction -->
            <div v-if="prediction" class="bg-bg-secondary rounded-lg p-4 mb-4">
              <div class="text-xs text-text-muted mb-2">{{ predictionModeLabel }}</div>
              <div class="text-2xl font-black text-gold text-center">{{ prediction.homeScore }} - {{ prediction.awayScore }}</div>
              <div v-if="prediction.confidence" class="text-xs text-text-muted text-center mt-1">
                {{ t('prediction.aiPrediction') }} {{ prediction.confidence }}%
              </div>
            </div>

            <button @click="submitAIPrediction"
                    :disabled="isPredicting"
                    class="w-full px-6 py-3 rounded-lg font-semibold text-sm border border-border text-gold hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              🤖 {{ isPredicting ? t('common.loading') : t('prediction.predict') }}
            </button>

            <p v-if="predictionError" class="text-red-400 text-xs text-center mt-2">{{ predictionError }}</p>
          </div>
          <div v-else class="border-t border-border pt-4 text-center text-text-muted text-sm">
            {{ t('match.finished') }}
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLocaleLabel } from '../../composables/useLiveScores'
import AISwitchToggle from '../prediction/AISwitchToggle.vue'

const { t, locale } = useI18n()

const props = defineProps({
  match: { type: Object, default: null },
  visible: { type: Boolean, default: false },
  prediction: { type: Object, default: null },
  liveData: { type: Object, default: null },
  predMode: { type: String, default: 'simulated' },
  isPredicting: { type: Boolean, default: false },
  predictionError: { type: String, default: null },
})

const emit = defineEmits(['close', 'predictAI', 'toggleMode'])

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

const homeFlag = computed(() => teamFlags[props.match?.homeTeam] || '🏳️')
const awayFlag = computed(() => teamFlags[props.match?.awayTeam] || '🏳️')
const homeLabel = computed(() => getLocaleLabel(props.match?.homeLabel))
const awayLabel = computed(() => getLocaleLabel(props.match?.awayLabel))
const isFinished = computed(() => props.match?.score?.status === 'FT')
const actualScore = computed(() => props.match?.score || null)

const scoreTextColor = computed(() => {
  if (props.liveData) return 'text-red-400'
  if (actualScore.value) return 'text-text-primary'
  if (props.prediction) return 'text-gold'
  return 'text-gold'
})

const predictionModeLabel = computed(() => {
  if (!props.prediction) return ''
  const mode = props.prediction.mode || ''
  if (mode.includes('ai')) return t('prediction.aiPrediction')
  if (mode.includes('user')) return t('prediction.yourPrediction')
  return t('prediction.simulated')
})

function close() {
  emit('close')
}

function submitAIPrediction() {
  emit('predictAI', props.match)
}

function formatTime(timeStr) {
  if (!timeStr) return ''
  const d = new Date(timeStr.replace(' ', 'T') + ':00+08:00')
  if (isNaN(d.getTime())) return timeStr
  const currentLocale = locale.value
  if (currentLocale === 'zh') {
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} (北京时间)`
  }
  return `${d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} (Beijing Time)`
}
</script>
