<template>
  <div class="bg-bg-card border border-border rounded-card p-6 relative overflow-hidden">
    <CountryBadge :country="city.country" :flag="city.flag" :label="countryLabel" />
    <h3 class="text-base font-bold mb-1">{{ getLocaleLabel(city.city) }}</h3>
    <div class="text-text-secondary text-sm mb-2">{{ getLocaleLabel(city.stadium) }}</div>
    <div class="text-text-muted text-xs flex items-center gap-1.5">
      👥 {{ t('city.capacity') }} {{ city.capacity }}
    </div>
    <span class="inline-block mt-2 px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-semibold">
      {{ getLocaleLabel(city.matches) }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { getLocaleLabel } from '../../composables/useLiveScores'
import CountryBadge from '../shared/CountryBadge.vue'

const { t } = useI18n()
const props = defineProps({
  city: { type: Object, required: true },
})

const countryLabel = computed(() => {
  const map = { USA: '美国', CAN: '加拿大', MEX: '墨西哥' }
  const enMap = { USA: 'USA', CAN: 'CAN', MEX: 'MEX' }
  const locale = localStorage.getItem('wc2026_locale') || 'zh'
  return locale === 'zh' ? map[props.city.country] : enMap[props.city.country]
})
</script>
