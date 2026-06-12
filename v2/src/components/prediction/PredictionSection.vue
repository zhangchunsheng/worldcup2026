<template>
  <div class="bg-bg-card border border-border rounded-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-bold text-base flex items-center gap-2">
        🔮 {{ t('prediction.title') }}
      </h3>
      <AISwitchToggle :mode="mode" @toggle="$emit('toggleMode')" />
    </div>

    <div class="text-center mb-4">
      <span class="text-lg font-bold text-gold">{{ homeLabel }}</span>
      <span class="mx-3 text-sm text-text-muted">{{ t('match.vs') }}</span>
      <span class="text-lg font-bold text-gold">{{ awayLabel }}</span>
    </div>

    <!-- Existing prediction display -->
    <PredictionResult v-if="prediction" :prediction="prediction" :label="prediction.mode === 'ai' ? t('prediction.aiPrediction') : t('prediction.simulated')" />

    <!-- User prediction form -->
    <PredictionForm
      :selected-home="selectedHome"
      :selected-away="selectedAway"
      @select-home="selectedHome = $event"
      @select-away="selectedAway = $event"
      @submit="$emit('submit', selectedHome, selectedAway)"
    />

    <div class="mt-4 flex gap-2 justify-center">
      <button @click="$emit('submit', selectedHome, selectedAway)"
              :disabled="selectedHome === null || selectedAway === null || isPredicting"
              class="px-6 py-2 rounded-lg font-semibold text-sm bg-gradient-to-r from-gold to-gold-light text-bg-primary disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-gold/20 transition-all">
        {{ isPredicting ? t('common.loading') : t('prediction.submit') }}
      </button>
      <button @click="$emit('predictAI')"
              :disabled="isPredicting"
              class="px-6 py-2 rounded-lg font-semibold text-sm border border-border text-gold hover:bg-gold/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        🤖 {{ t('prediction.predict1') }}
      </button>
    </div>

    <p v-if="predictionError" class="text-red-400 text-xs text-center mt-2">{{ predictionError }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AISwitchToggle from './AISwitchToggle.vue'
import PredictionForm from './PredictionForm.vue'
import PredictionResult from './PredictionResult.vue'

const { t } = useI18n()

const props = defineProps({
  matchId: { type: String, required: true },
  homeLabel: { type: String, required: true },
  awayLabel: { type: String, required: true },
  mode: { type: String, default: 'simulated' },
  prediction: { type: Object, default: null },
  isPredicting: { type: Boolean, default: false },
  predictionError: { type: String, default: null },
})

const selectedHome = ref(null)
const selectedAway = ref(null)

defineEmits(['toggleMode', 'submit', 'predictAI'])
</script>
