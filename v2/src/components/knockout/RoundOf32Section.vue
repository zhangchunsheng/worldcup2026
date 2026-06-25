<template>
  <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
  <div v-else class="space-y-8">
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
                 class="flex items-center gap-3 p-2 rounded-lg bg-white/5">
              <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold">
                {{ i + 1 }}
              </span>
              <span class="text-xl">{{ team.flag }}</span>
              <span class="text-sm font-medium truncate">{{ getLocaleLabel(team.name) }}</span>
            </div>
            <!-- Show placeholder if group has not enough finished matches -->
            <div v-if="g.teams.length < 2" class="text-xs text-text-muted p-2">
              {{ t('knockout.pending') }}
            </div>
          </div>
        </div>
      </FadeInWrapper>
    </div>

    <!-- Best third-placed teams -->
    <FadeInWrapper>
      <div class="bg-bg-card border border-border rounded-card p-4">
        <h3 class="text-base font-bold mb-3 flex items-center gap-2">
          🥉 {{ t('knockout.bestThird') }}
          <span class="text-xs font-normal text-text-muted ml-2">{{ t('knockout.bestThirdDesc') }}</span>
        </h3>
        <div v-if="qualifiedTeams.bestThirds.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div v-for="team in qualifiedTeams.bestThirds" :key="team.code"
               class="flex items-center gap-3 p-2 rounded-lg bg-white/5">
            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold/20 text-gold text-xs font-bold">
              {{ team.thirdRank }}
            </span>
            <span class="text-xl">{{ team.flag }}</span>
            <div class="min-w-0">
              <div class="text-sm font-medium truncate">{{ getLocaleLabel(team.name) }}</div>
              <div class="text-xs text-text-muted">{{ t('group.badge', { group: team.group }) }} · {{ t('group.points') }} {{ team.points }}</div>
            </div>
          </div>
        </div>
        <div v-else class="text-xs text-text-muted py-2">{{ t('common.tbd') }}</div>
      </div>
    </FadeInWrapper>
  </div>
</template>

<script setup>
import { useStandings } from '../../composables/useStandings'
import { getLocaleLabel } from '../../composables/useLiveScores'
import FadeInWrapper from '../shared/FadeInWrapper.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { loading, groupStandings, qualifiedTeams } = useStandings()
</script>
