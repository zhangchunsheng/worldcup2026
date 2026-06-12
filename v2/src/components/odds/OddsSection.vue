<template>
  <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
  <div v-else-if="oddsData?.teams" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
    <FadeInWrapper v-for="team in oddsData.teams" :key="team.code">
      <OddCard :team="team" />
    </FadeInWrapper>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useData } from '../../composables/useData'
import OddCard from './OddCard.vue'
import FadeInWrapper from '../shared/FadeInWrapper.vue'

const { t } = useI18n()
const { data: oddsData, loading } = useData('odds')
</script>
