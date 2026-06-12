<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="close">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <!-- Modal -->
      <div class="relative w-full max-w-lg bg-bg-card border border-border rounded-card shadow-card max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-bg-card/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h3 class="font-bold text-lg">{{ getLocaleLabel(match.homeLabel) }} vs {{ getLocaleLabel(match.awayLabel) }}</h3>
          <button @click="close" class="text-text-muted hover:text-text-primary text-xl transition-colors">✕</button>
        </div>

        <div class="p-6 space-y-6">
          <!-- Score display -->
          <div class="text-center">
            <div class="flex items-center justify-center gap-4 mb-2">
              <div class="text-center">
                <div class="text-3xl mb-1">{{ homeFlag }}</div>
                <div class="font-bold">{{ getLocaleLabel(match.homeLabel) }}</div>
              </div>
              <div class="text-4xl font-black text-gold">
                <template v-if="liveData">
                  {{ liveData.homeScore }} - {{ liveData.awayScore }}
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
                <div class="font-bold">{{ getLocaleLabel(match.awayLabel) }}</div>
              </div>
            </div>
            <div v-if="liveData" class="text-sm text-red-400 font-bold animate-pulse">
              {{ t('match.live') }} {{ liveData.minute }}'
            </div>
            <div v-else-if="match.time" class="text-sm text-text-muted">
              {{ formatTime(match.time) }}
            </div>
          </div>

          <!-- Venue -->
          <div class="bg-bg-secondary rounded-lg p-4 space-y-2">
            <div class="flex items-center gap-2 text-sm">
              <span>📍</span>
              <span>{{ getLocaleLabel(match.venue) }}</span>
            </div>
            <div v-if="match.time" class="flex items-center gap-2 text-sm">
              <span>⏰</span>
              <span>{{ formatTime(match.time) }}</span>
            </div>
          </div>

          <!-- Prediction section -->
          <div class="border-t border-border pt-4">
            <div class="flex items-center justify-between mb-4">
              <h4 class="font-bold text-sm">{{ t('prediction.title') }}</h4>
              <AISwitchToggle :mode="predMode" @toggle="$emit('toggleMode')" />
            </div>

            <!-- Existing prediction -->
            <div v-if="prediction" class="bg-bg-secondary rounded-lg p-4 mb-4">
              <div class="text-xs text-text-muted mb-2">{{ prediction.mode === 'ai' ? t('prediction.aiPrediction') : t('prediction.simulated') }}</div>
              <div class="text-2xl font-black text-gold text-center">{{ prediction.homeScore }} - {{ prediction.awayScore }}</div>
              <div v-if="prediction.confidence" class="text-xs text-text-muted text-center mt-1">
                {{ prediction.confidence }}%
              </div>
            </div>

            <!-- Score picker -->
            <div class="flex items-center justify-center gap-3 mb-4">
              <div class="flex flex-col items-center">
                <span class="text-xs text-text-muted mb-1">{{ t('prediction.homeScore') }}</span>
                <div class="flex gap-1">
                  <button v-for="n in 6" :key="n" @click="selHome = n - 1"
                          :class="selHome === n - 1 ? 'bg-gold text-bg-primary border-gold' : 'bg-white/5 text-text-primary border-border'"
                          class="w-8 h-8 rounded-lg text-sm font-bold border transition-all hover:bg-gold/20">
                    {{ n - 1 }}
                  </button>
                </div>
              </div>
              <span class="text-gold font-bold text-sm mt-5">{{ t('match.vs') }}</span>
              <div class="flex flex-col items-center">
                <span class="text-xs text-text-muted mb-1">{{ t('prediction.awayScore') }}</span>
                <div class="flex gap-1">
                  <button v-for="n in 6" :key="n" @click="selAway = n - 1"
                          :class="selAway === n - 1 ? 'bg-gold text-bg-primary border-gold' : 'bg-white/5 text-text-primary border-border'"
                          class="w-8 h-8 rounded-lg text-sm font-bold border transition-all hover:bg-gold/20">
                    {{ n - 1 }}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex gap-2 justify-center">
              <button @click="submitUserPrediction"
                      :disabled="selHome === null || selAway === null || isPredicting"
                      class="px-6 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-gold to-gold-light text-bg-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                {{ isPredicting ? t('common.loading') : t('prediction.submit') }}
              </button>
              <button @click="submitAIPrediction"
                      :disabled="isPredicting"
                      class="px-6 py-2 rounded-lg font-semibold text-sm border border-border text-gold hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                🤖 {{ t('prediction.predict') }}
              </button>
            </div>

            <p v-if="predictionError" class="text-red-400 text-xs text-center mt-2">{{ predictionError }}</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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

const emit = defineEmits(['close', 'submitPrediction', 'predictAI', 'toggleMode'])

const selHome = ref(null)
const selAway = ref(null)

// Reset score picker when match changes
watch(() => props.match, () => {
  selHome.value = null
  selAway.value = null
}, { immediate: true })

// Team flags
const teamFlags = {
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

const homeFlag = computed(() => teamFlags[props.match?.homeTeam] || '🏳️')
const awayFlag = computed(() => teamFlags[props.match?.awayTeam] || '🏳️')

function close() {
  emit('close')
}

function submitUserPrediction() {
  if (selHome.value === null || selAway.value === null) return
  emit('submitPrediction', props.match.id, selHome.value, selAway.value)
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
