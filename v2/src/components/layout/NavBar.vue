<template>
  <nav id="navbar" :class="{ scrolled: isScrolled }" class="fixed top-0 left-0 right-0 z-50 bg-bg-primary/85 backdrop-blur-xl border-b border-border transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <router-link to="/" class="text-base font-bold bg-gradient-to-r from-gold to-gold-light bg-clip-text text-transparent">
        🏆 {{ t('site.title') }}
      </router-link>

      <!-- Desktop links -->
      <div :class="{ open: navOpen }" class="hidden md:flex items-center gap-2 flex-wrap">
        <a v-for="link in navLinks" :key="link.id"
           :href="`#${link.id}`"
           class="text-text-secondary text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-300 hover:text-gold hover:bg-gold/10">
          {{ t(link.label) }}
        </a>
        <!-- Language toggle -->
        <button @click="toggleLanguage"
                class="text-xs font-semibold px-3 py-1.5 rounded-md border border-border text-gold hover:bg-gold/10 transition-all duration-300">
          {{ currentLocale === 'zh' ? 'EN' : '中文' }}
        </button>
        <!-- Settings -->
        <button @click="$emit('openSettings')"
                class="text-sm px-2 py-1.5 rounded-md hover:bg-gold/10 transition-all duration-300"
                title="Settings">
          ⚙️
        </button>
      </div>

      <!-- Mobile toggle -->
      <button @click="toggleNav" class="md:hidden text-text-primary text-xl" aria-label="Menu">
        {{ navOpen ? '✕' : '☰' }}
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="navOpen" class="md:hidden bg-bg-primary/95 border-b border-border px-6 py-4 flex flex-col gap-2">
      <a v-for="link in navLinks" :key="link.id"
         :href="`#${link.id}`"
         @click="closeNav"
         class="text-text-secondary text-sm font-medium px-3 py-2 rounded-md hover:text-gold hover:bg-gold/10 transition-all">
        {{ t(link.label) }}
      </a>
      <button @click="toggleLanguage"
              class="text-xs font-semibold px-3 py-2 rounded-md border border-border text-gold hover:bg-gold/10 transition-all mt-2">
        {{ currentLocale === 'zh' ? 'Switch to English' : '切换到中文' }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const navOpen = ref(false)
const isScrolled = ref(false)

const currentLocale = ref(locale.value)

const navLinks = [
  { id: 'hero', label: 'nav.home' },
  { id: 'schedule', label: 'nav.schedule' },
  { id: 'group-standings', label: 'nav.groupStandings' },
  { id: 'groups', label: 'nav.groups' },
  { id: 'round-of-32', label: 'nav.roundOf32' },
  { id: 'odds', label: 'nav.odds' },
  { id: 'cities', label: 'nav.cities' },
  { id: 'players', label: 'nav.players' },
  { id: 'history', label: 'nav.history' },
  { id: 'broadcast', label: 'nav.broadcast' },
]

function toggleNav() {
  navOpen.value = !navOpen.value
}

function closeNav() {
  navOpen.value = false
}

function toggleLanguage() {
  const newLocale = locale.value === 'zh' ? 'en' : 'zh'
  locale.value = newLocale
  currentLocale.value = newLocale
  localStorage.setItem('wc2026_locale', newLocale)
  document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en'
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

defineEmits(['openSettings'])

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
