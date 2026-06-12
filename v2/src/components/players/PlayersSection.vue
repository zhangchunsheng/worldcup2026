<template>
  <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
  <div v-else-if="playersData?.players" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    <FadeInWrapper v-for="(player, i) in playersData.players" :key="i">
      <PlayerCard :player="player" />
    </FadeInWrapper>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useData } from '../../composables/useData'
import PlayerCard from './PlayerCard.vue'
import FadeInWrapper from '../shared/FadeInWrapper.vue'

const { t } = useI18n()
const { data: playersData, loading } = useData('players')
</script>
