<template>
  <section id="hero" class="min-h-screen flex flex-col items-center justify-center text-center relative pt-16">
    <HeroBackground />
    <div class="relative z-10">
      <div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold/10 border border-border text-gold text-sm mb-6">
        🏟️ {{ t('site.subtitle') }}
      </div>
      <h1 class="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-4">
        <span class="bg-gradient-to-r from-gold via-gold-light to-gold bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
          2026 FIFA
        </span>
        <br />
        <span class="text-text-primary">{{ t('site.title').replace('2026 FIFA ', '') }}</span>
      </h1>
      <p class="text-lg md:text-xl text-text-secondary mb-12 max-w-lg mx-auto">
        {{ t('site.tagline') }}
      </p>
      <CountdownTimer />
      <HeroStats />
    </div>
  </section>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import HeroBackground from './HeroBackground.vue'
import CountdownTimer from './CountdownTimer.vue'
import HeroStats from './HeroStats.vue'

const { t } = useI18n()
</script>
