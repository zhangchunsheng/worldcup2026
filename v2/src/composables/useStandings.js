import { computed } from 'vue'
import { useData } from './useData'

export function useStandings() {
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

  const recordsByCode = computed(() => {
    if (!groupsData.value?.groups || !scheduleData.value?.matches) return {}

    const records = {}
    const initRecord = (code) => ({
      code,
      name: teamByCode.value[code]?.name || { zh: code, en: code },
      flag: teamByCode.value[code]?.flag || '🏳️',
      group: groupByTeamCode.value[code] || null,
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
      if (!score || score.home == null || score.away == null) continue

      const home = match.homeTeam
      const away = match.awayTeam
      const homeGroup = groupByTeamCode.value[home]
      const awayGroup = groupByTeamCode.value[away]
      if (!homeGroup && !awayGroup) continue

      const homeScore = score.home ?? 0
      const awayScore = score.away ?? 0

      if (homeGroup) {
        if (!records[home]) records[home] = initRecord(home)
        records[home].played++
        records[home].goalsFor += homeScore
        records[home].goalsAgainst += awayScore
        if (homeScore > awayScore) {
          records[home].won++
          records[home].points += 3
        } else if (homeScore < awayScore) {
          records[home].lost++
        } else {
          records[home].drawn++
          records[home].points++
        }
      }

      if (awayGroup) {
        if (!records[away]) records[away] = initRecord(away)
        records[away].played++
        records[away].goalsFor += awayScore
        records[away].goalsAgainst += homeScore
        if (awayScore > homeScore) {
          records[away].won++
          records[away].points += 3
        } else if (awayScore < homeScore) {
          records[away].lost++
        } else {
          records[away].drawn++
          records[away].points++
        }
      }
    }

    for (const r of Object.values(records)) {
      r.goalDifference = r.goalsFor - r.goalsAgainst
    }

    return records
  })

  const groupStandings = computed(() => {
    if (!groupsData.value?.groups) return []

    const grouped = {}
    for (const record of Object.values(recordsByCode.value)) {
      const letter = record.group
      if (!letter) continue
      if (!grouped[letter]) grouped[letter] = []
      grouped[letter].push(record)
    }

    return groupsData.value.groups
      .map(g => ({
        letter: g.letter,
        teams: (grouped[g.letter] || []).sort(sortTeams),
      }))
  })

  const qualifiedTeams = computed(() => {
    const auto = []
    const thirds = []

    for (const g of groupStandings.value) {
      const sorted = g.teams
      if (sorted[0]) auto.push({ ...sorted[0], position: 1, group: g.letter })
      if (sorted[1]) auto.push({ ...sorted[1], position: 2, group: g.letter })
      if (sorted[2]) thirds.push({ ...sorted[2], position: 3, group: g.letter })
    }

    const bestThirds = thirds.sort(sortTeams).slice(0, 8).map((t, i) => ({ ...t, thirdRank: i + 1 }))

    return {
      auto,
      bestThirds,
      all: [...auto, ...bestThirds].sort((a, b) => {
        if (a.position !== b.position) return a.position - b.position
        return a.group.localeCompare(b.group)
      }),
    }
  })

  return {
    loading,
    groupByTeamCode,
    teamByCode,
    recordsByCode,
    groupStandings,
    qualifiedTeams,
  }
}
