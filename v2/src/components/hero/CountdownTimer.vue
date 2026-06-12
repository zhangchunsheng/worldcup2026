<template>
  <div class="flex gap-4 mb-12 flex-wrap justify-center">
    <div v-for="item in countdownItems" :key="item.key"
         class="bg-bg-card border border-border rounded-card px-5 py-5 text-center min-w-[70px]">
      <div class="text-4xl md:text-5xl font-black bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent leading-none">
        {{ String(item.value).padStart(2, '0') }}
      </div>
      <div class="text-xs text-text-muted uppercase tracking-wider mt-1">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCountdown } from '../../composables/useCountdown'

const { t } = useI18n()
// June 11, 2026 12:00 PM Mexico City time (UTC-6)
const kickoff = new Date('2026-06-11T12:00:00-06:00')
const { days, hours, mins, secs } = useCountdown(kickoff)

const countdownItems = computed(() => [
  { key: 'days', value: days.value, label: t('countdown.days') },
  { key: 'hours', value: hours.value, label: t('countdown.hours') },
  { key: 'mins', value: mins.value, label: t('countdown.mins') },
  { key: 'secs', value: secs.value, label: t('countdown.secs') },
])
</script>
