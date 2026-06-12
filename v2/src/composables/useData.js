import { ref } from 'vue'

const cache = new Map()

export function useData(resource) {
  const data = ref(null)
  const loading = ref(true)
  const error = ref(null)

  async function fetchData() {
    if (cache.has(resource)) {
      console.log('[useData] Cache hit:', resource)
      data.value = cache.get(resource)
      loading.value = false
      return
    }

    try {
      console.log('[useData] Fetching:', resource)
      loading.value = true
      error.value = null
      const res = await fetch(`/data/${resource}.json?t=${Date.now()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()
      console.log('[useData] Loaded:', resource, json)
      cache.set(resource, json)
      data.value = json
    } catch (e) {
      console.error('[useData] Error:', resource, e.message)
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function clearCache() {
    cache.delete(resource)
    data.value = null
  }

  fetchData()

  return { data, loading, error, refetch: fetchData, clearCache }
}
