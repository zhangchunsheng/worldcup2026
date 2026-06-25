<template>
  <div class="flex flex-col items-center gap-4 mb-12">
    <!-- Before kickoff: classic countdown -->
    <div v-if="state === 'before'" class="flex gap-4 flex-wrap justify-center">
      <div v-for="item in countdownItems" :key="item.key"
           class="bg-bg-card border border-border rounded-card px-5 py-5 text-center min-w-[70px]">
        <div class="text-4xl md:text-5xl font-black bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent leading-none">
          {{ String(item.value).padStart(2, '0') }}
        </div>
        <div class="text-xs text-text-muted uppercase tracking-wider mt-1">{{ item.label }}</div>
      </div>
    </div>

    <!-- During tournament: days since kickoff -->
    <div v-else-if="state === 'ongoing'"
         class="bg-bg-card border border-border rounded-card px-10 py-6 text-center">
      <div class="text-5xl md:text-7xl font-black bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent leading-none">
        {{ daysSinceKickoff }}
      </div>
      <div class="text-sm text-text-muted mt-3">{{ t('countdown.daysSinceKickoff') }}</div>
    </div>

    <!-- Final day: show kickoff time -->
    <div v-else-if="state === 'final-day'"
         class="bg-bg-card border border-border rounded-card px-8 py-6 text-center">
      <div class="text-xl md:text-2xl font-bold text-gold mb-2">
        🏆 {{ t('countdown.finalToday') }}
      </div>
      <div class="text-4xl md:text-5xl font-black text-text-primary leading-none">
        {{ finalTimeLocal }}
      </div>
      <div class="text-sm text-text-muted mt-3">
        {{ t('countdown.beijingTime') }}: {{ finalTimeBeijing }}
      </div>
    </div>

    <!-- After final: live clock -->
    <div v-else
         class="bg-bg-card border border-border rounded-card px-8 py-6 text-center">
      <div class="text-5xl md:text-6xl font-black text-text-primary leading-none tabular-nums">
        {{ currentTime }}
      </div>
      <div class="text-sm text-text-muted mt-3">{{ currentDate }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

// June 11, 2026 12:00 PM Mexico City time (UTC-6)
const kickoff = new Date('2026-06-11T12:00:00-06:00')
// Final: July 19, 2026 3:00 PM ET (UTC-4, DST)
const finalKickoff = new Date('2026-07-19T15:00:00-04:00')

const now = ref(new Date())
let interval = null

onMounted(() => {
  interval = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate()
}

function isBeforeFinalDay() {
  const finalDay = new Date(finalKickoff.getFullYear(), finalKickoff.getMonth(), finalKickoff.getDate())
  return now.value < finalDay
}

const state = computed(() => {
  if (now.value < kickoff) return 'before'
  if (isSameDay(now.value, finalKickoff)) return 'final-day'
  if (isBeforeFinalDay()) return 'ongoing'
  return 'clock'
})

const diffToKickoff = computed(() => {
  return kickoff - now.value
})

const countdownItems = computed(() => {
  const diff = Math.max(0, diffToKickoff.value)
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const secs = Math.floor((diff % (1000 * 60)) / 1000)
  return [
    { key: 'days', value: days, label: t('countdown.days') },
    { key: 'hours', value: hours, label: t('countdown.hours') },
    { key: 'mins', value: mins, label: t('countdown.mins') },
    { key: 'secs', value: secs, label: t('countdown.secs') },
  ]
})

const daysSinceKickoff = computed(() => {
  const startDay = new Date(kickoff.getFullYear(), kickoff.getMonth(), kickoff.getDate())
  const nowDay = new Date(now.value.getFullYear(), now.value.getMonth(), now.value.getDate())
  const diff = Math.floor((nowDay - startDay) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
})

const finalTimeLocal = computed(() => {
  return finalKickoff.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
    timeZone: 'America/New_York',
  })
})

const finalTimeBeijing = computed(() => {
  return finalKickoff.toLocaleString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Shanghai',
  })
})

const currentTime = computed(() => {
  return now.value.toLocaleTimeString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
})

const currentDate = computed(() => {
  return now.value.toLocaleDateString(locale.value === 'zh' ? 'zh-CN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
</script>
