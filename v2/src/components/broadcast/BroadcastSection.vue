<template>
  <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
  <div v-else-if="broadcastData?.broadcasters" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <FadeInWrapper v-for="(broadcaster, i) in broadcastData.broadcasters" :key="i">
      <BroadcastCard :broadcaster="broadcaster" />
    </FadeInWrapper>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useData } from '../../composables/useData'
import BroadcastCard from './BroadcastCard.vue'
import FadeInWrapper from '../shared/FadeInWrapper.vue'

const { t } = useI18n()
const { data: broadcastData, loading } = useData('broadcast')
</script>
