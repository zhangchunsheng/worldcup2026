<template>
  <div class="space-y-8">
    <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
    <template v-else-if="scheduleData?.matches">
      <!-- Grouped by date -->
      <div v-for="(dateMatches, date) in matchesByDate" :key="date" class="space-y-4">
        <h3 class="text-lg font-bold text-gold sticky top-16 bg-bg-primary/90 backdrop-blur py-2 z-10">
          {{ formatDate(date) }}
          <span class="text-sm text-text-muted font-normal ml-2">{{ dateMatches.length }} 场</span>
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MatchCard v-for="match in dateMatches" :key="match.id"
            :match="match"
            :group="groupByTeamCode[match.homeTeam] || groupByTeamCode[match.awayTeam]"
            :prediction="getPrediction(match.id)"
            :live-match-id="getLiveData(match.id)?.id"
            :live-data="getLiveData(match.id)"
            @open-detail="openMatchDetail"
          />
        </div>
      </div>
    </template>

    <!-- Match Detail Modal -->
    <MatchDetail
      :match="selectedMatch"
      :visible="showDetail"
      :prediction="selectedMatch ? getPrediction(selectedMatch.id) : null"
      :live-data="selectedMatch ? getLiveData(selectedMatch.id) : null"
      :pred-mode="predMode"
      :is-predicting="isPredicting"
      :prediction-error="predictionError"
      @close="showDetail = false"
      @predict-ai="handleAIPrediction"
      @toggle-mode="toggleMode"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useData } from '../../composables/useData'
import { usePrediction } from '../../composables/usePrediction'
import { useLiveScores } from '../../composables/useLiveScores'
import MatchCard from './MatchCard.vue'
import MatchDetail from './MatchDetail.vue'

const { t, locale } = useI18n()
const { data: scheduleData, loading } = useData('schedule')
const { data: groupsData } = useData('groups')

const groupByTeamCode = computed(() => {
  const map = {}
  if (!groupsData.value?.groups) return map
  for (const g of groupsData.value.groups) {
    for (const team of g.teams) {
      map[team.code] = g.letter
    }
  }
  return map
})

const { mode: predMode, isPredicting, predictionError, toggleMode, predictMatch, getPrediction } = usePrediction()
const { getMatchStatus: getLiveData } = useLiveScores()

const selectedMatch = ref(null)
const showDetail = ref(false)

// Group matches by Beijing date
const matchesByDate = computed(() => {
  if (!scheduleData.value?.matches) return {}
  const grouped = {}
  for (const m of scheduleData.value.matches) {
    const date = m.time ? m.time.substring(0, 10) : 'unknown'
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(m)
  }
  // Sort dates
  const sorted = {}
  Object.keys(grouped).sort().forEach(k => { sorted[k] = grouped[k] })
  return sorted
})

function openMatchDetail(match) {
  selectedMatch.value = match
  showDetail.value = true
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00+08:00')
  if (isNaN(d.getTime())) return dateStr
  const currentLocale = locale.value
  if (currentLocale === 'zh') {
    return `${d.getMonth() + 1}月${d.getDate()}日`
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function handleAIPrediction(match) {
  predictMatch(match.id, {
    homeLabel: match.homeLabel?.zh || match.homeTeam,
    awayLabel: match.awayLabel?.zh || match.awayTeam,
  }, { homeOdds: 2.5, awayOdds: 3.0 })
}
</script>
