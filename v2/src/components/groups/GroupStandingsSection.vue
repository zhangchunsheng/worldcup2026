<template>
  <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
  <div v-else-if="standings.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    <FadeInWrapper v-for="item in standings" :key="item.letter">
      <div class="bg-bg-card border border-border rounded-card p-4">
        <h3 class="text-base font-bold mb-3 flex items-center gap-2">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-gold to-gold-dark text-bg-primary font-extrabold text-xs">
            {{ item.letter }}
          </span>
          {{ t('group.badge', { group: item.letter }) }}
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="text-text-muted border-b border-white/5">
                <th class="text-left py-1.5 pr-2 font-medium">{{ t('group.team') }}</th>
                <th class="text-center py-1.5 px-1 font-medium">{{ t('group.played') }}</th>
                <th class="text-center py-1.5 px-1 font-medium">{{ t('group.won') }}</th>
                <th class="text-center py-1.5 px-1 font-medium">{{ t('group.drawn') }}</th>
                <th class="text-center py-1.5 px-1 font-medium">{{ t('group.lost') }}</th>
                <th class="text-center py-1.5 px-1 font-medium">{{ t('group.goalDifference') }}</th>
                <th class="text-center py-1.5 pl-1 font-medium text-gold">{{ t('group.points') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(team, i) in item.teams" :key="team.code"
                  class="border-b border-white/5 last:border-b-0"
                  :class="i < 2 ? 'text-text-primary' : 'text-text-secondary'">
                <td class="py-2 pr-2">
                  <div class="flex items-center gap-2">
                    <span class="text-base">{{ team.flag }}</span>
                    <span class="truncate max-w-[6rem] sm:max-w-[8rem]" :title="getLocaleLabel(team.name)">
                      {{ getLocaleLabel(team.name) }}
                    </span>
                  </div>
                </td>
                <td class="text-center py-2 px-1">{{ team.played }}</td>
                <td class="text-center py-2 px-1">{{ team.won }}</td>
                <td class="text-center py-2 px-1">{{ team.drawn }}</td>
                <td class="text-center py-2 px-1">{{ team.lost }}</td>
                <td class="text-center py-2 px-1" :class="team.goalDifference > 0 ? 'text-green-light' : team.goalDifference < 0 ? 'text-red-400' : ''">
                  {{ team.goalDifference > 0 ? '+' : '' }}{{ team.goalDifference }}
                </td>
                <td class="text-center py-2 pl-1 font-bold text-gold">{{ team.points }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </FadeInWrapper>
  </div>
  <div v-else class="text-center text-text-muted py-8">{{ t('common.tbd') }}</div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useData } from '../../composables/useData'
import { getLocaleLabel } from '../../composables/useLiveScores'
import FadeInWrapper from '../shared/FadeInWrapper.vue'

const { t } = useI18n()
const { data: groupsData, loading: groupsLoading } = useData('groups')
const { data: scheduleData, loading: scheduleLoading } = useData('schedule')

const loading = computed(() => groupsLoading.value || scheduleLoading.value)

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

const teamByCode = computed(() => {
  const map = {}
  if (!groupsData.value?.groups) return map
  for (const g of groupsData.value.groups) {
    for (const team of g.teams) {
      map[team.code] = { ...team, group: g.letter }
    }
  }
  return map
})

function sortTeams(a, b) {
  if (b.points !== a.points) return b.points - a.points
  if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor
  return a.code.localeCompare(b.code)
}

const standings = computed(() => {
  if (!groupsData.value?.groups || !scheduleData.value?.matches) return []

  const records = {}
  const initRecord = (code) => ({
    code,
    name: teamByCode.value[code]?.name || { zh: code, en: code },
    flag: teamByCode.value[code]?.flag || '🏳️',
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  })

  for (const match of scheduleData.value.matches) {
    const score = match.score
    if (!score || score.status !== 'FT') continue
    const home = match.homeTeam
    const away = match.awayTeam
    const homeGroup = groupByTeamCode.value[home]
    const awayGroup = groupByTeamCode.value[away]
    if (!homeGroup || homeGroup !== awayGroup) continue

    if (!records[home]) records[home] = initRecord(home)
    if (!records[away]) records[away] = initRecord(away)

    const homeScore = score.home ?? 0
    const awayScore = score.away ?? 0

    records[home].played++
    records[away].played++
    records[home].goalsFor += homeScore
    records[home].goalsAgainst += awayScore
    records[away].goalsFor += awayScore
    records[away].goalsAgainst += homeScore

    if (homeScore > awayScore) {
      records[home].won++
      records[home].points += 3
      records[away].lost++
    } else if (homeScore < awayScore) {
      records[away].won++
      records[away].points += 3
      records[home].lost++
    } else {
      records[home].drawn++
      records[away].drawn++
      records[home].points++
      records[away].points++
    }
  }

  for (const r of Object.values(records)) {
    r.goalDifference = r.goalsFor - r.goalsAgainst
  }

  const grouped = {}
  for (const [code, record] of Object.entries(records)) {
    const letter = groupByTeamCode.value[code]
    if (!letter) continue
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(record)
  }

  return groupsData.value.groups
    .map(g => ({
      letter: g.letter,
      teams: (grouped[g.letter] || []).sort(sortTeams),
    }))
    .filter(g => g.teams.length > 0)
})
</script>
