/**
 * Custom Claude API client.
 * POST to https://about.luomor.com/ai/claude with signed request.
 */
// Use a small MD5 library in browser builds. Install with `npm install js-md5`.
import md5 from 'js-md5';

const API_BASE_URL = 'https://about.luomor.com/ai/claude'
const API_KEY = 'luomor2026' // Key for sign generation

export async function callClaudeApi(messages, options = {}) {
  const model = options.model || 'claude-sonnet-4-6'
  const maxTokens = options.maxTokens || 4096
  const systemPrompt = options.systemPrompt || ''

  const timestamp = Math.floor(Date.now() / 1000)
  // compute MD5 signature (browser-safe)
  const sign = md5(API_KEY + timestamp)

  const body = {
    timestamp,
    sign,
    messages: [
      ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
      ...messages
    ],
    model,
    options: { max_tokens: maxTokens },
  }

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`API error: ${response.status} ${response.statusText} ${errorText}`)
  }

  const data = await response.json()
  return data
}
