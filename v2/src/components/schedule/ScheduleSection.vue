<template>
  <div class="space-y-5">
    <div v-if="loading" class="text-center text-text-muted py-8">{{ t('common.loading') }}</div>
    <template v-else-if="scheduleData?.phases">
      <SchedulePhase v-for="(phase, i) in scheduleData.phases" :key="phase.id"
        :phase="phase" :default-open="i < 2" />
    </template>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useData } from '../../composables/useData'
import SchedulePhase from './SchedulePhase.vue'

const { t } = useI18n()
const { data: scheduleData, loading } = useData('schedule')
</script>
