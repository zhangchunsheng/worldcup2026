<template>
  <div class="bg-bg-card border border-border rounded-card p-6 cursor-default">
    <h3 class="text-base font-bold mb-4 flex items-center gap-2">
      <span class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-gold-dark text-bg-primary font-extrabold text-sm">
        {{ group.letter }}
      </span>
      {{ t('group.group') }}
    </h3>
    <div v-for="(team, i) in group.teams" :key="i"
         class="flex items-center gap-3 py-2 border-b border-white/5 last:border-b-0">
      <span class="w-8 h-6 rounded bg-bg-secondary flex items-center justify-center text-base flex-shrink-0">
        {{ team.flag }}
      </span>
      <span class="text-sm">{{ getLocaleLabel(team.name) }}</span>
      <span class="ml-auto text-xs text-text-muted px-2 py-0.5 rounded bg-white/5">{{ team.conf }}</span>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { getLocaleLabel } from '../../composables/useLiveScores'

const { t } = useI18n()
defineProps({
  group: { type: Object, required: true },
})
</script>
