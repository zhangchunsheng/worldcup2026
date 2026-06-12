<template>
  <div class="min-h-screen bg-bg-primary">
    <NavBar />
    <main>
      <!-- Hero -->
      <HeroSection />

      <!-- Schedule -->
      <section id="schedule" class="py-24 px-6 max-w-7xl mx-auto">
        <FadeInWrapper>
          <SectionHeader :description="t('sections.schedule.desc')">
            📅 <span class="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{{ t('sections.schedule.title') }}</span>
          </SectionHeader>
        </FadeInWrapper>
        <ScheduleSection />
      </section>

      <!-- Groups -->
      <section id="groups" class="py-24 px-6 max-w-7xl mx-auto">
        <FadeInWrapper>
          <SectionHeader :description="t('sections.groups.desc')">
            📋 <span class="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{{ t('sections.groups.title') }}</span>
          </SectionHeader>
        </FadeInWrapper>
        <GroupsSection />
      </section>

      <!-- Prediction -->
      <section id="prediction" class="py-24 px-6 max-w-7xl mx-auto">
        <FadeInWrapper>
          <SectionHeader :description="t('prediction.title')">
            🔮 <span class="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{{ t('prediction.title') }}</span>
          </SectionHeader>
        </FadeInWrapper>
        <div class="max-w-md mx-auto">
          <PredictionSection
            :match-id="demoMatchId"
            :home-label="demoMatch.homeLabel ? getLocaleLabel(demoMatch.homeLabel) : ''"
            :away-label="demoMatch.awayLabel ? getLocaleLabel(demoMatch.awayLabel) : ''"
            :mode="mode"
            :prediction="getPrediction(demoMatchId)"
            :is-predicting="isPredicting"
            :prediction-error="predictionError"
            @toggle-mode="toggleMode"
            @submit="handleUserPrediction"
            @predict-ai="handleAIPrediction"
          />
        </div>
      </section>

      <!-- Odds -->
      <section id="odds" class="py-24 px-6 max-w-7xl mx-auto">
        <FadeInWrapper>
          <SectionHeader :description="t('sections.odds.desc')">
            🏆 <span class="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{{ t('sections.odds.title') }}</span>
          </SectionHeader>
        </FadeInWrapper>
        <OddsSection />
      </section>

      <!-- Cities -->
      <section id="cities" class="py-24 px-6 max-w-7xl mx-auto">
        <FadeInWrapper>
          <SectionHeader :description="t('sections.cities.desc')">
            🌆 <span class="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{{ t('sections.cities.title') }}</span>
          </SectionHeader>
        </FadeInWrapper>
        <CitiesSection />
      </section>

      <!-- Players -->
      <section id="players" class="py-24 px-6 max-w-7xl mx-auto">
        <FadeInWrapper>
          <SectionHeader :description="t('sections.players.desc')">
            ⭐ <span class="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{{ t('sections.players.title') }}</span>
          </SectionHeader>
        </FadeInWrapper>
        <PlayersSection />
      </section>

      <!-- History -->
      <section id="history" class="py-24 px-6 max-w-7xl mx-auto">
        <FadeInWrapper>
          <SectionHeader :description="t('sections.history.desc')">
            📜 <span class="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{{ t('sections.history.title') }}</span>
          </SectionHeader>
        </FadeInWrapper>
        <HistorySection />
      </section>

      <!-- Broadcast -->
      <section id="broadcast" class="py-24 px-6 max-w-7xl mx-auto">
        <FadeInWrapper>
          <SectionHeader :description="t('sections.broadcast.desc')">
            📺 <span class="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{{ t('sections.broadcast.title') }}</span>
          </SectionHeader>
        </FadeInWrapper>
        <BroadcastSection />
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import NavBar from './components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
import HeroSection from './components/hero/HeroSection.vue'
import SectionHeader from './components/shared/SectionHeader.vue'
import FadeInWrapper from './components/shared/FadeInWrapper.vue'
import ScheduleSection from './components/schedule/ScheduleSection.vue'
import GroupsSection from './components/groups/GroupsSection.vue'
import OddsSection from './components/odds/OddsSection.vue'
import CitiesSection from './components/cities/CitiesSection.vue'
import PlayersSection from './components/players/PlayersSection.vue'
import HistorySection from './components/history/HistorySection.vue'
import BroadcastSection from './components/broadcast/BroadcastSection.vue'
import PredictionSection from './components/prediction/PredictionSection.vue'
import { usePrediction } from './composables/usePrediction'
import { useData } from './composables/useData'
import { getLocaleLabel } from './composables/useLiveScores'

const { t } = useI18n()
const { mode, isPredicting, predictionError, toggleMode, predictMatch, getPrediction } = usePrediction()

// Demo match for prediction widget — first opening match
const { data: scheduleData } = useData('schedule')
const demoMatchId = 'opening-1'
const demoMatch = computed(() => {
  if (!scheduleData.value?.phases) return { homeLabel: { zh: '墨西哥', en: 'Mexico' }, awayLabel: { zh: '待定', en: 'TBD' } }
  const opening = scheduleData.value.phases.find(p => p.id === 'opening')
  return opening?.matches?.[0] || { homeLabel: { zh: '墨西哥', en: 'Mexico' }, awayLabel: { zh: '待定', en: 'TBD' } }
})

function handleUserPrediction(home, away) {
  if (home === null || away === null) return
  const predictions = JSON.parse(localStorage.getItem('wc2026_predictions') || '{}')
  predictions[demoMatchId] = {
    homeScore: home,
    awayScore: away,
    confidence: 50,
    timestamp: Date.now(),
    mode: 'user',
  }
  localStorage.setItem('wc2026_predictions', JSON.stringify(predictions))
}

function handleAIPrediction() {
  predictMatch(demoMatchId, {
    homeLabel: getLocaleLabel(demoMatch.value.homeLabel),
    awayLabel: getLocaleLabel(demoMatch.value.awayLabel),
  }, { homeOdds: 2.5, awayOdds: 3.0 })
}
</script>
