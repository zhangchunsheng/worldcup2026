<template>
  <div class="flex items-center gap-3">
    <span class="text-xs text-text-muted">{{ mode === 'simulated' ? t('prediction.simulated') : t('prediction.ai') }}</span>
    <button @click="$emit('toggle')"
            :class="mode === 'ai' ? 'bg-gold text-bg-primary' : 'bg-white/10 text-text-muted'"
            class="relative w-12 h-6 rounded-full transition-all duration-300">
      <span :class="mode === 'ai' ? 'translate-x-6' : 'translate-x-1'"
            class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 shadow" />
    </button>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineProps({
  mode: { type: String, default: 'simulated' },
})

defineEmits(['toggle'])
</script>
