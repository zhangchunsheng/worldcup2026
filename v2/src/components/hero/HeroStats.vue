<template>
  <div class="flex gap-4 mb-12 flex-wrap justify-center">
    <div v-for="(item, key) in items" :key="key"
         class="bg-bg-card border border-border rounded-card px-5 py-5 text-center min-w-[80px]">
      <div class="text-4xl md:text-5xl font-black bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent leading-none">
        {{ item.value }}
      </div>
      <div class="text-xs text-text-muted uppercase tracking-wider mt-1">{{ item.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const items = computed(() => [
  { value: 48, label: t('hero.teams') },
  { value: 104, label: t('hero.matches') },
  { value: 39, label: t('hero.days') },
  { value: 16, label: t('hero.hostCities') },
])
</script>
