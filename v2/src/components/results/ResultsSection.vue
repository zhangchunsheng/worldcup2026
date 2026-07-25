<template>
  <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
  <div v-else-if="results" class="space-y-10">
    <!-- Podium -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
      <!-- Runner-up -->
      <FadeInWrapper>
        <div class="bg-bg-card border border-border rounded-card p-6 text-center">
          <div class="text-4xl mb-2">🥈</div>
          <div class="text-5xl mb-2">{{ teamOf(results.runnerUp)?.flag }}</div>
          <div class="text-xl font-bold">{{ getLocaleLabel(teamOf(results.runnerUp)?.name) }}</div>
          <div class="text-sm text-text-muted mt-1">{{ t('results.runnerUp') }}</div>
        </div>
      </FadeInWrapper>

      <!-- Champion -->
      <FadeInWrapper>
        <div class="bg-gradient-to-b from-gold/20 to-bg-card border-2 border-gold rounded-card p-8 text-center shadow-card md:-translate-y-4">
          <div class="text-5xl mb-2">🏆</div>
          <div class="text-6xl mb-2">{{ teamOf(results.champion)?.flag }}</div>
          <div class="text-2xl font-black bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
            {{ getLocaleLabel(teamOf(results.champion)?.name) }}
          </div>
          <div class="text-sm text-gold mt-1 font-bold">{{ t('results.champion') }}</div>
          <div class="text-xs text-text-muted mt-2">{{ t('results.finalScore') }}</div>
        </div>
      </FadeInWrapper>

      <!-- Third place -->
      <FadeInWrapper>
        <div class="bg-bg-card border border-border rounded-card p-6 text-center">
          <div class="text-4xl mb-2">🥉</div>
          <div class="text-5xl mb-2">{{ teamOf(results.third)?.flag }}</div>
          <div class="text-xl font-bold">{{ getLocaleLabel(teamOf(results.third)?.name) }}</div>
          <div class="text-sm text-text-muted mt-1">{{ t('results.thirdPlace') }}</div>
        </div>
      </FadeInWrapper>
    </div>

    <!-- Golden boot -->
    <FadeInWrapper>
      <div class="bg-bg-card border border-border rounded-card p-4 flex items-center justify-center gap-3">
        <span class="text-2xl">👟</span>
        <span class="text-sm">
          <span class="font-bold text-gold">{{ t('results.goldenBoot') }}</span>
          <span class="mx-2 text-text-muted">·</span>
          {{ getLocaleLabel(results.goldenBoot.player) }}
          <span class="mx-2 text-text-muted">·</span>
          <span class="font-bold">{{ results.goldenBoot.goals }} {{ t('results.goals') }}</span>
        </span>
      </div>
    </FadeInWrapper>

    <!-- Full rankings by tier -->
    <div class="space-y-6">
      <FadeInWrapper v-for="tier in tiers" :key="tier.key">
        <div class="bg-bg-card border border-border rounded-card p-5">
          <h4 class="text-base font-bold mb-4 flex items-center gap-2">
            <span>{{ tier.icon }}</span>
            {{ t('results.' + tier.key) }}
          </h4>
          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            <div v-for="team in tier.teams" :key="team.code"
                 class="flex items-center gap-2 p-2 rounded-lg bg-white/5">
              <span class="text-xs text-text-muted w-5">{{ team.rank }}</span>
              <span class="text-base">{{ team.flag }}</span>
              <span class="text-xs font-medium truncate">{{ getLocaleLabel(team.name) }}</span>
            </div>
          </div>
        </div>
      </FadeInWrapper>
    </div>

    <!-- Summary article -->
    <FadeInWrapper>
      <article class="bg-bg-card border border-border rounded-card p-6 md:p-8">
        <h3 class="text-xl font-bold mb-6 bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
          {{ t('results.articleTitle') }}
        </h3>
        <div class="space-y-4 text-text-secondary leading-relaxed text-sm md:text-base">
          <p v-for="(paragraph, i) in articleParagraphs" :key="i"
             :class="{ 'first-letter:text-3xl first-letter:font-black first-letter:text-gold first-letter:mr-1 first-letter:float-left': i === 0 }">
            {{ paragraph }}
          </p>
        </div>
      </article>
    </FadeInWrapper>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useData } from '../../composables/useData'
import { getLocaleLabel } from '../../composables/useLiveScores'
import FadeInWrapper from '../shared/FadeInWrapper.vue'

const { t, locale } = useI18n()
const { data: results, loading: resultsLoading } = useData('results')
const { data: groupsData, loading: groupsLoading } = useData('groups')

const loading = computed(() => resultsLoading.value || groupsLoading.value)

const teamByCode = computed(() => {
  const map = {}
  if (!groupsData.value?.groups) return map
  for (const g of groupsData.value.groups) {
    for (const team of g.teams) {
      map[team.code] = team
    }
  }
  return map
})

function teamOf(code) {
  return teamByCode.value[code] || null
}

const TIER_ORDER = [
  { key: 'fourth', icon: '4️⃣', tier: 'fourth' },
  { key: 'quarterFinal', icon: '⚔️', tier: 'quarterFinal' },
  { key: 'roundOf16', icon: '🔟', tier: 'roundOf16' },
  { key: 'roundOf32', icon: '🎯', tier: 'roundOf32' },
  { key: 'groupStage', icon: '📋', tier: 'groupStage' },
]

const tiers = computed(() => {
  if (!results.value?.rankings) return []
  return TIER_ORDER.map(t => ({
    ...t,
    teams: results.value.rankings
      .filter(r => r.tier === t.tier)
      .map(r => ({ ...r, ...teamByCode.value[r.code] })),
  })).filter(t => t.teams.length > 0)
})

const articleParagraphs = computed(() => {
  if (!results.value?.article) return []
  return results.value.article[locale.value] || results.value.article.zh || []
})
</script>
