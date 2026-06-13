import { ref, reactive } from 'vue'
import { generatePrediction } from '../utils/predictionEngine'
import { callClaudeApi } from '../utils/claudeApi'

function loadSetting(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

export function usePrediction() {
  const mode = ref(loadSetting('wc2026_pred_mode', 'ai'))
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
          timestamp: parseInt(Date.now() / 1000),
          mode: 'simulated',
        }
      } else {
        // AI mode — call custom API, fallback to simulated
        try {
          const model = loadSetting('wc2026_claude_model', 'claude-sonnet-4-6')

          const result = await callClaudeApi(
            [{
              role: 'system',
              content: 'You are a football match predictor. Output ONLY a JSON object with homeScore and awayScore fields (integers 0-9). No explanation.',
            },{
              role: 'user',
              content: `Predict the score for: ${matchData.homeLabel} vs ${matchData.awayLabel}. Odds: home=${oddsData?.homeOdds || 'N/A'}, away=${oddsData?.awayOdds || 'N/A'}. Output JSON: {"homeScore": X, "awayScore": Y}`,
            }],
            {
              model,
              maxTokens: 4096,
              systemPrompt: 'You are a football match predictor. Output ONLY a JSON object with homeScore and awayScore fields (integers 0-9). No explanation.',
            }
          )

          // Parse response - handle different response formats
          let homeScore, awayScore
          if (result.content) {
            // Claude-like response format
            const text = typeof result.content === 'string' ? result.content : result.content[0]?.text || ''
            const json = JSON.parse(text.replace(/```json\s*|\s*```/g, '').trim())
            homeScore = json.homeScore
            awayScore = json.awayScore
          } else if (result.homeScore !== undefined) {
            // Direct JSON response
            homeScore = result.homeScore
            awayScore = result.awayScore
          } else {
            throw new Error('Unexpected API response format')
          }

          predictions[matchId] = {
            homeScore,
            awayScore,
            confidence: 72,
            timestamp: parseInt(Date.now() / 1000),
            mode: 'ai',
          }
        } catch (apiErr) {
          console.warn('AI prediction failed, falling back to simulated:', apiErr.message)
          const result = generatePrediction(matchData, oddsData)
          predictions[matchId] = {
            homeScore: result.homeScore,
            awayScore: result.awayScore,
            confidence: result.confidence,
            timestamp: parseInt(Date.now() / 1000),
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
