<template>
  <div class="flex items-center gap-2">
    <span class="text-xs text-text-muted">{{ mode === 'simulated' ? t('prediction.simulated') : t('prediction.ai') }}</span>
    <button @click="$emit('toggle')"
            class="relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-300"
            :class="mode === 'ai' ? 'bg-gold' : 'bg-white/20'"
            type="button"
            role="switch"
            :aria-checked="mode === 'ai'">
      <span class="inline-block w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300"
            :class="mode === 'ai' ? 'translate-x-6' : 'translate-x-1'" />
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
