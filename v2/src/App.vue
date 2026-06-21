<template>
  <div class="min-h-screen bg-bg-primary">
    <NavBar @open-settings="showSettings = true" />
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

      <!-- Group Standings -->
      <section id="group-standings" class="py-24 px-6 max-w-7xl mx-auto">
        <FadeInWrapper>
          <SectionHeader :description="t('sections.groupStandings.desc')">
            📊 <span class="bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">{{ t('sections.groupStandings.title') }}</span>
          </SectionHeader>
        </FadeInWrapper>
        <GroupStandingsSection />
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

    <!-- Settings Modal -->
    <SettingsModal
      :visible="showSettings"
      :base-url="settingsStore.baseUrl"
      :api-key="settingsStore.apiKey"
      :model="settingsStore.model"
      @close="showSettings = false"
      @save="handleSaveSettings"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from './stores/settings'
import NavBar from './components/layout/NavBar.vue'
import Footer from './components/layout/Footer.vue'
import SettingsModal from './components/layout/SettingsModal.vue'
import HeroSection from './components/hero/HeroSection.vue'
import SectionHeader from './components/shared/SectionHeader.vue'
import FadeInWrapper from './components/shared/FadeInWrapper.vue'
import ScheduleSection from './components/schedule/ScheduleSection.vue'
import GroupStandingsSection from './components/groups/GroupStandingsSection.vue'
import OddsSection from './components/odds/OddsSection.vue'
import CitiesSection from './components/cities/CitiesSection.vue'
import PlayersSection from './components/players/PlayersSection.vue'
import HistorySection from './components/history/HistorySection.vue'
import BroadcastSection from './components/broadcast/BroadcastSection.vue'

const { t } = useI18n()
const settingsStore = useSettingsStore()
const showSettings = ref(false)

function handleSaveSettings(data) {
  settingsStore.baseUrl = data.baseUrl
  settingsStore.apiKey = data.apiKey
  settingsStore.model = data.model
  settingsStore.save()
}
</script>
