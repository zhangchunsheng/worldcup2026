<template>
  <div class="flex items-center justify-center gap-3">
    <div class="flex flex-col items-center">
      <span class="text-xs text-text-muted mb-1">{{ t('prediction.homeScore') }}</span>
      <div class="flex gap-1">
        <button v-for="n in 6" :key="n" @click="$emit('selectHome', n - 1)"
                :class="selectedHome === n - 1 ? 'bg-gold text-bg-primary border-gold' : 'bg-white/5 text-text-primary border-border'"
                class="w-8 h-8 rounded-lg text-sm font-bold border transition-all hover:bg-gold/20">
          {{ n - 1 }}
        </button>
      </div>
    </div>
    <span class="text-gold font-bold text-sm mt-5">{{ t('match.vs') }}</span>
    <div class="flex flex-col items-center">
      <span class="text-xs text-text-muted mb-1">{{ t('prediction.awayScore') }}</span>
      <div class="flex gap-1">
        <button v-for="n in 6" :key="n" @click="$emit('selectAway', n - 1)"
                :class="selectedAway === n - 1 ? 'bg-gold text-bg-primary border-gold' : 'bg-white/5 text-text-primary border-border'"
                class="w-8 h-8 rounded-lg text-sm font-bold border transition-all hover:bg-gold/20">
          {{ n - 1 }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
defineProps({
  selectedHome: { type: Number, default: null },
  selectedAway: { type: Number, default: null },
})

defineEmits(['selectHome', 'selectAway', 'submit'])
</script>
