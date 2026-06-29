<template>
  <div class="overflow-x-auto pb-2">
    <div class="flex items-center justify-center gap-2 min-w-[900px] p-2">
      <!-- Left half: leaves on the left, root (SF1) on the right -->
      <BracketTree :node="leftHalf" :resolve-team="resolveTeam" reverse @open-detail="$emit('openDetail', $event)" />

      <!-- Center: Final + Third Place -->
      <div class="flex flex-col justify-center gap-6 mx-1">
        <div class="relative">
          <div class="absolute top-1/2 right-full w-4 h-px bg-gold/30"></div>
          <div class="absolute top-1/2 left-full w-4 h-px bg-gold/30"></div>
          <BracketMatch :match="rounds.final"
            :resolve-team="resolveTeam"
            highlight
            @open-detail="$emit('openDetail', rounds.final)"
          />
        </div>

        <div class="relative">
          <div class="absolute top-1/2 right-full w-4 h-px bg-gold/30"></div>
          <div class="absolute top-1/2 left-full w-4 h-px bg-gold/30"></div>
          <BracketMatch :match="rounds.thirdPlace"
            :resolve-team="resolveTeam"
            @open-detail="$emit('openDetail', rounds.thirdPlace)"
          />
        </div>
      </div>

      <!-- Right half: root (SF2) on the left, leaves on the right -->
      <BracketTree :node="rightHalf" :resolve-team="resolveTeam" @open-detail="$emit('openDetail', $event)" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from '../../composables/useData'
import { getLocaleLabel } from '../../composables/useLiveScores'
import BracketTree from './BracketTree.vue'
import BracketMatch from './BracketMatch.vue'

const { data: knockoutData } = useData('knockout')

const emit = defineEmits(['openDetail'])

const allMatches = computed(() => {
  if (!knockoutData.value) return {}
  const map = {}
  const rounds = ['roundOf32', 'roundOf16', 'quarterFinals', 'semiFinals']
  for (const key of rounds) {
    for (const m of knockoutData.value[key] || []) {
      map[m.id] = m
    }
  }
  if (knockoutData.value.thirdPlace) map[knockoutData.value.thirdPlace.id] = knockoutData.value.thirdPlace
  if (knockoutData.value.final) map[knockoutData.value.final.id] = knockoutData.value.final
  return map
})

const rounds = computed(() => ({
  roundOf32: knockoutData.value?.roundOf32 || [],
  roundOf16: knockoutData.value?.roundOf16 || [],
  quarterFinals: knockoutData.value?.quarterFinals || [],
  semiFinals: knockoutData.value?.semiFinals || [],
  thirdPlace: knockoutData.value?.thirdPlace || null,
  final: knockoutData.value?.final || null,
}))

function byId(id) {
  return allMatches.value[id]
}

function toNode(match) {
  return { match, children: [] }
}

const leftHalf = computed(() => ({
  match: byId('sf-01'),
  children: [
    {
      match: byId('qf-01'),
      children: [
        { match: byId('r16-01'), children: [toNode(byId('r32-01')), toNode(byId('r32-04'))] },
        { match: byId('r16-02'), children: [toNode(byId('r32-03')), toNode(byId('r32-06'))] },
      ],
    },
    {
      match: byId('qf-03'),
      children: [
        { match: byId('r16-03'), children: [toNode(byId('r32-02')), toNode(byId('r32-05'))] },
        { match: byId('r16-04'), children: [toNode(byId('r32-07')), toNode(byId('r32-08'))] },
      ],
    },
  ],
}))

const rightHalf = computed(() => ({
  match: byId('sf-02'),
  children: [
    {
      match: byId('qf-02'),
      children: [
        { match: byId('r16-05'), children: [toNode(byId('r32-11')), toNode(byId('r32-12'))] },
        { match: byId('r16-06'), children: [toNode(byId('r32-09')), toNode(byId('r32-10'))] },
      ],
    },
    {
      match: byId('qf-04'),
      children: [
        { match: byId('r16-07'), children: [toNode(byId('r32-14')), toNode(byId('r32-15'))] },
        { match: byId('r16-08'), children: [toNode(byId('r32-13')), toNode(byId('r32-16'))] },
      ],
    },
  ],
}))

function getTeamInfo(code) {
  const flagMap = {
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
  return { code, flag: flagMap[code] || '🏳️' }
}

function getWinner(match) {
  if (!match || !match.score || match.score.status !== 'FT') return null
  const home = match.score.home ?? 0
  const away = match.score.away ?? 0
  if (home > away) return getSlotTeam(match, 'home')
  if (away > home) return getSlotTeam(match, 'away')
  return null
}

function getLoser(match) {
  if (!match || !match.score || match.score.status !== 'FT') return null
  const home = match.score.home ?? 0
  const away = match.score.away ?? 0
  if (home > away) return getSlotTeam(match, 'away')
  if (away > home) return getSlotTeam(match, 'home')
  return null
}

function getSlotTeam(match, slot) {
  const teamCode = slot === 'home' ? match.homeTeam : match.awayTeam
  const label = slot === 'home' ? match.homeLabel : match.awayLabel
  if (teamCode) {
    return { ...getTeamInfo(teamCode), name: label || { zh: teamCode, en: teamCode } }
  }
  return null
}

function resolveSource(match, slot) {
  const source = slot === 'home' ? match.homeFrom : match.awayFrom
  if (!source) return null
  if (typeof source === 'string') return { id: source, result: 'winner' }
  return source
}

function resolveTeam(match, slot) {
  const fixed = getSlotTeam(match, slot)
  if (fixed) return fixed
  const source = resolveSource(match, slot)
  if (!source) return null
  const prev = allMatches.value[source.id]
  if (!prev) return null
  return source.result === 'loser' ? getLoser(prev) : getWinner(prev)
}
</script>
