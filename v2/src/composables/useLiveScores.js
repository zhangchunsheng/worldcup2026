import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLiveScores(pollInterval = 30000) {
  const scores = ref({ lastUpdated: null, matches: [] })
  const loading = ref(false)
  const error = ref(null)

  async function fetchScores() {
    try {
      loading.value = true
      error.value = null
      const res = await fetch(`/data/live-scores.json?t=${Date.now()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      scores.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function getMatchStatus(matchId) {
    return scores.value.matches.find((m) => m.id === matchId) || null
  }

  fetchScores()
  const interval = setInterval(fetchScores, pollInterval)

  // Cleanup on page unload is handled by browser
  return { scores, loading, error, getMatchStatus, refetch: fetchScores }
}

export function getLocaleLabel(labelObj) {
  if (!labelObj) return ''
  const locale = localStorage.getItem('wc2026_locale') || 'zh'
  return labelObj[locale] || labelObj.zh || labelObj.en || ''
}
