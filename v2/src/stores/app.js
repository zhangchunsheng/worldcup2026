import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const navOpen = ref(false)
  const activeSection = ref('hero')

  function toggleNav() {
    navOpen.value = !navOpen.value
  }

  function closeNav() {
    navOpen.value = false
  }

  function setActiveSection(section) {
    activeSection.value = section
  }

  return { navOpen, activeSection, toggleNav, closeNav, setActiveSection }
})
