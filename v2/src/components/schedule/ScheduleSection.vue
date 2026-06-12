<template>
  <div class="space-y-5">
    <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
    <template v-else-if="scheduleData?.phases">
      <SchedulePhase v-for="(phase, i) in scheduleData.phases" :key="phase.id"
        :phase="phase"
        :default-open="i < 2"
        :get-prediction="getPrediction"
        :get-live-data="getLiveData"
        @open-detail="openMatchDetail"
      />
    </template>

    <!-- Match Detail Modal -->
    <MatchDetail
      v-if="selectedMatch"
      :match="selectedMatch"
      :visible="showDetail"
      :prediction="getPrediction(selectedMatch.id)"
      :live-data="getLiveData(selectedMatch.id)"
      :pred-mode="predMode"
      :is-predicting="isPredicting"
      :prediction-error="predictionError"
      @close="showDetail = false"
      @submit-prediction="handleUserPrediction"
      @predict-ai="handleAIPrediction"
      @toggle-mode="toggleMode"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useData } from '../../composables/useData'
import { usePrediction } from '../../composables/usePrediction'
import { useLiveScores } from '../../composables/useLiveScores'
import SchedulePhase from './SchedulePhase.vue'
import MatchDetail from './MatchDetail.vue'

const { t } = useI18n()
const { data: scheduleData, loading } = useData('schedule')

const { mode: predMode, isPredicting, predictionError, toggleMode, predictMatch, getPrediction } = usePrediction()
const { getMatchStatus: getLiveData } = useLiveScores()

const selectedMatch = ref(null)
const showDetail = ref(false)

function openMatchDetail(match) {
  selectedMatch.value = match
  showDetail.value = true
}

function handleUserPrediction(matchId, home, away) {
  const predictions = JSON.parse(localStorage.getItem('wc2026_predictions') || '{}')
  predictions[matchId] = {
    homeScore: home,
    awayScore: away,
    confidence: 50,
    timestamp: Date.now(),
    mode: 'user',
  }
  localStorage.setItem('wc2026_predictions', JSON.stringify(predictions))
}

function handleAIPrediction(match) {
  predictMatch(match.id, {
    homeLabel: match.homeLabel?.zh || match.homeTeam,
    awayLabel: match.awayLabel?.zh || match.awayTeam,
  }, { homeOdds: 2.5, awayOdds: 3.0 })
}
</script>
