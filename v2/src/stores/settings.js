import { defineStore } from 'pinia'
import { ref } from 'vue'

function loadSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

export const useSettingsStore = defineStore('settings', () => {
  const baseUrl = ref(loadSetting('wc2026_claude_base_url', 'https://api.luomor.com'))
  const apiKey = ref(loadSetting('wc2026_claude_api_key', ''))
  const model = ref(loadSetting('wc2026_claude_model', 'qwen3.7-plus'))

  function save() {
    localStorage.setItem('wc2026_claude_base_url', baseUrl.value)
    localStorage.setItem('wc2026_claude_api_key', apiKey.value)
    localStorage.setItem('wc2026_claude_model', model.value)
  }

  function reset() {
    baseUrl.value = 'https://api.luomor.com'
    apiKey.value = ''
    model.value = 'qwen3.7-plus'
    save()
  }

  return { baseUrl, apiKey, model, save, reset }
})
