<template>
  <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
  <div v-else class="space-y-8">
    <!-- All 32 qualified teams overview -->
    <FadeInWrapper>
      <div class="bg-bg-card border border-border rounded-card p-5">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          🏆 {{ t('knockout.qualifiedTeams') }}
          <span class="text-xs font-normal text-text-muted ml-2">{{ qualifiedTeams.all.length }} / 32</span>
        </h3>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Group winners -->
          <div>
            <h4 class="text-sm font-semibold text-gold mb-3">{{ t('knockout.groupWinners') }}</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              <div v-for="team in groupWinners" :key="team.code"
                   class="flex flex-col gap-1 p-2 rounded-lg bg-white/5">
                <div class="flex items-center gap-2">
                  <span class="text-base">{{ team.flag }}</span>
                  <span class="text-xs font-medium truncate">{{ getLocaleLabel(team.name) }}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-text-muted">
                  <span>{{ team.group }}</span>
                  <span class="text-gold">{{ team.points }}pts · GD {{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Group runners-up -->
          <div>
            <h4 class="text-sm font-semibold text-gold mb-3">{{ t('knockout.groupRunnersUp') }}</h4>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              <div v-for="team in groupRunnersUp" :key="team.code"
                   class="flex flex-col gap-1 p-2 rounded-lg bg-white/5">
                <div class="flex items-center gap-2">
                  <span class="text-base">{{ team.flag }}</span>
                  <span class="text-xs font-medium truncate">{{ getLocaleLabel(team.name) }}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-text-muted">
                  <span>{{ team.group }}</span>
                  <span class="text-gold">{{ team.points }}pts · GD {{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Best third-placed teams -->
          <div>
            <h4 class="text-sm font-semibold text-gold mb-3">{{ t('knockout.bestThird') }}</h4>
            <div v-if="qualifiedTeams.bestThirds.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
              <div v-for="team in qualifiedTeams.bestThirds" :key="team.code"
                   class="flex flex-col gap-1 p-2 rounded-lg bg-white/5">
                <div class="flex items-center gap-2">
                  <span class="text-base">{{ team.flag }}</span>
                  <span class="text-xs font-medium truncate">{{ getLocaleLabel(team.name) }}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-text-muted">
                  <span>{{ team.group }}</span>
                  <span class="text-gold">{{ team.points }}pts · GD {{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}</span>
                </div>
              </div>
            </div>
            <div v-else class="text-xs text-text-muted py-2">{{ t('common.tbd') }}</div>
          </div>
        </div>
      </div>
    </FadeInWrapper>

    <!-- Auto-qualified: top 2 from each group -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <FadeInWrapper v-for="g in groupStandings" :key="g.letter">
        <div class="bg-bg-card border border-border rounded-card p-4">
          <h3 class="text-base font-bold mb-3 flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-gold-dark text-bg-primary font-extrabold text-xs">
              {{ g.letter }}
            </span>
            {{ t('group.badge', { group: g.letter }) }}
          </h3>
          <div class="space-y-2">
            <div v-for="(team, i) in g.teams.slice(0, 2)" :key="team.code"
                 class="flex items-center justify-between p-2 rounded-lg bg-white/5">
              <div class="flex items-center gap-3">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold">
                  {{ i + 1 }}
                </span>
                <span class="text-xl">{{ team.flag }}</span>
                <span class="text-sm font-medium truncate">{{ getLocaleLabel(team.name) }}</span>
              </div>
              <span class="text-xs text-gold">{{ team.points }}pts · GD {{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}</span>
            </div>
            <!-- Show placeholder if group has not enough finished matches -->
            <div v-if="g.teams.length < 2" class="text-xs text-text-muted p-2">
              {{ t('knockout.pending') }}
            </div>
          </div>
        </div>
      </FadeInWrapper>
    </div>
    <!-- Knockout bracket -->
    <FadeInWrapper>
      <KnockoutBracket @open-detail="openMatchDetail" />
    </FadeInWrapper>

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
import { useStandings } from '../../composables/useStandings'
import { useData } from '../../composables/useData'
import { usePrediction } from '../../composables/usePrediction'
import { useLiveScores } from '../../composables/useLiveScores'
import { getLocaleLabel } from '../../composables/useLiveScores'
import FadeInWrapper from '../shared/FadeInWrapper.vue'
import MatchCard from '../schedule/MatchCard.vue'
import MatchDetail from '../schedule/MatchDetail.vue'
import KnockoutBracket from './KnockoutBracket.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { loading: standingsLoading, groupStandings, qualifiedTeams } = useStandings()
const { loading: knockoutLoading, data: knockoutData } = useData('knockout')
const { mode: predMode, isPredicting, predictionError, toggleMode, predictMatch, getPrediction } = usePrediction()
const { getMatchStatus: getLiveData } = useLiveScores()

const loading = computed(() => standingsLoading.value || knockoutLoading.value)

const selectedMatch = ref(null)
const showDetail = ref(false)

function openMatchDetail(match) {
  selectedMatch.value = enrichMatch(match)
  showDetail.value = true
}

function handleAIPrediction(match) {
  const enriched = enrichMatch(match)
  predictMatch(enriched.id, {
    homeLabel: enriched.homeLabel?.zh || enriched.homeTeam,
    awayLabel: enriched.awayLabel?.zh || enriched.awayTeam,
  }, { homeOdds: 2.5, awayOdds: 3.0 })
}

const allKnockoutMatches = computed(() => {
  if (!knockoutData.value) return {}
  const map = {}
  const rounds = ['roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals']
  for (const key of rounds) {
    for (const m of knockoutData.value[key] || []) map[m.id] = m
  }
  if (knockoutData.value.thirdPlace) map[knockoutData.value.thirdPlace.id] = knockoutData.value.thirdPlace
  if (knockoutData.value.final) map[knockoutData.value.final.id] = knockoutData.value.final
  return map
})

const teamFlagMap = {
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

function slotTeam(match, slot) {
  const code = slot === 'home' ? match.homeTeam : match.awayTeam
  const label = slot === 'home' ? match.homeLabel : match.awayLabel
  if (!code) return null
  return { code, name: label || { zh: code, en: code }, flag: teamFlagMap[code] || '🏳️' }
}

function winnerOf(match) {
  if (!match?.score || match.score.status !== 'FT') return null
  const home = match.score.home ?? 0
  const away = match.score.away ?? 0
  if (home > away) return slotTeam(match, 'home')
  if (away > home) return slotTeam(match, 'away')
  return null
}

function loserOf(match) {
  if (!match?.score || match.score.status !== 'FT') return null
  const home = match.score.home ?? 0
  const away = match.score.away ?? 0
  if (home > away) return slotTeam(match, 'away')
  if (away > home) return slotTeam(match, 'home')
  return null
}

function resolveSource(match, slot) {
  const source = slot === 'home' ? match.homeFrom : match.awayFrom
  if (!source) return null
  if (typeof source === 'string') return { id: source, result: 'winner' }
  return source
}

function resolveTeam(match, slot) {
  const fixed = slotTeam(match, slot)
  if (fixed) return fixed
  const source = resolveSource(match, slot)
  if (!source) return null
  const prev = allKnockoutMatches.value[source.id]
  if (!prev) return null
  return source.result === 'loser' ? loserOf(prev) : winnerOf(prev)
}

function enrichMatch(match) {
  if (!match) return null
  const home = resolveTeam(match, 'home')
  const away = resolveTeam(match, 'away')
  return {
    ...match,
    homeTeam: home?.code || match.homeTeam,
    homeLabel: home?.name || match.homeLabel,
    awayTeam: away?.code || match.awayTeam,
    awayLabel: away?.name || match.awayLabel,
  }
}

const groupWinners = computed(() =>
  qualifiedTeams.value.auto.filter(t => t.position === 1).sort((a, b) => a.group.localeCompare(b.group))
)

const groupRunnersUp = computed(() =>
  qualifiedTeams.value.auto.filter(t => t.position === 2).sort((a, b) => a.group.localeCompare(b.group))
)
</script>
