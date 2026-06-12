<template>
  <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
  <div v-else-if="citiesData?.cities" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <FadeInWrapper v-for="city in citiesData.cities" :key="city.city.zh">
      <CityCard :city="city" />
    </FadeInWrapper>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useData } from '../../composables/useData'
import CityCard from './CityCard.vue'
import FadeInWrapper from '../shared/FadeInWrapper.vue'

const { t } = useI18n()
const { data: citiesData, loading } = useData('cities')
</script>
