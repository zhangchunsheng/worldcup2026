import { ref, reactive } from 'vue'
import { generatePrediction } from '../utils/predictionEngine'

function loadSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

export function usePrediction() {
  const mode = ref(loadSetting('wc2026_pred_mode', 'simulated'))
  const predictions = reactive(loadPredictions())
  const isPredicting = ref(false)
  const predictionError = ref(null)

  function loadPredictions() {
    try {
      return JSON.parse(localStorage.getItem('wc2026_predictions') || '{}')
    } catch {
      return {}
    }
  }

  function savePredictions() {
    localStorage.setItem('wc2026_predictions', JSON.stringify(predictions))
  }

  function toggleMode() {
    mode.value = mode.value === 'simulated' ? 'ai' : 'simulated'
    localStorage.setItem('wc2026_pred_mode', mode.value)
  }

  async function predictMatch(matchId, matchData, oddsData) {
    isPredicting.value = true
    predictionError.value = null

    try {
      if (mode.value === 'simulated') {
        const result = generatePrediction(matchData, oddsData)
        predictions[matchId] = {
          homeScore: result.homeScore,
          awayScore: result.awayScore,
          confidence: result.confidence,
          timestamp: Date.now(),
          mode: 'simulated',
        }
      } else {
        // AI mode — try Claude API, fallback to simulated
        try {
          const apiKey = loadSetting('wc2026_claude_api_key', import.meta.env.VITE_CLAUDE_API_KEY || '')
          if (!apiKey) throw new Error('No API key configured')

          const model = loadSetting('wc2026_claude_model', import.meta.env.VITE_CLAUDE_MODEL || 'claude-sonnet-4-6')
          const baseUrl = loadSetting('wc2026_claude_base_url', import.meta.env.VITE_CLAUDE_BASE_URL || 'https://api.anthropic.com')

          const { Anthropic } = await import('@anthropic-ai/sdk')
          const anthropic = new Anthropic({
            apiKey,
            baseURL: baseUrl,
            dangerouslyAllowBrowser: true,
          })

          const response = await anthropic.messages.create({
            model,
            max_tokens: 256,
            system: 'You are a football match predictor. Output ONLY a JSON object with homeScore and awayScore fields (integers 0-9). No explanation.',
            messages: [
              {
                role: 'user',
                content: `Predict the score for: ${matchData.homeLabel} vs ${matchData.awayLabel}. Odds: home=${oddsData?.homeOdds || 'N/A'}, away=${oddsData?.awayOdds || 'N/A'}. Output JSON: {"homeScore": X, "awayScore": Y}`,
              },
            ],
          })

          const text = response.content[0].text
          const json = JSON.parse(text.replace(/```json\s*|\s*```/g, '').trim())
          predictions[matchId] = {
            homeScore: json.homeScore,
            awayScore: json.awayScore,
            confidence: 72,
            timestamp: Date.now(),
            mode: 'ai',
          }
        } catch (apiErr) {
          console.warn('AI prediction failed, falling back to simulated:', apiErr.message)
          const result = generatePrediction(matchData, oddsData)
          predictions[matchId] = {
            homeScore: result.homeScore,
            awayScore: result.awayScore,
            confidence: result.confidence,
            timestamp: Date.now(),
            mode: 'simulated (fallback)',
          }
        }
      }

      savePredictions()
    } catch (e) {
      predictionError.value = e.message
    } finally {
      isPredicting.value = false
    }
  }

  function getPrediction(matchId) {
    return predictions[matchId] || null
  }

  function clearPrediction(matchId) {
    if (matchId) {
      delete predictions[matchId]
    } else {
      Object.keys(predictions).forEach((k) => delete predictions[k])
    }
    savePredictions()
  }

  return {
    mode,
    predictions,
    isPredicting,
    predictionError,
    toggleMode,
    predictMatch,
    getPrediction,
    clearPrediction,
  }
}
