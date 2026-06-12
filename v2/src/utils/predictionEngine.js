/**
 * Simulated prediction engine using odds-based Poisson distribution.
 * Converts betting odds to implied probabilities, then samples realistic scores.
 */

export function generatePrediction(matchData, oddsData) {
  const homeOdds = parseFloat(oddsData?.homeOdds || 2.5)
  const awayOdds = parseFloat(oddsData?.awayOdds || 3.0)

  // Convert odds to implied probability (with vig removal approximation)
  const homeProb = 1 / homeOdds
  const awayProb = 1 / awayOdds
  const drawProb = 1 - homeProb - awayProb

  // Normalize
  const total = homeProb + awayProb + drawProb
  const normHome = homeProb / total
  const normAway = awayProb / total

  // Convert to expected goals using Poisson lambda approximation
  // Average WC match: ~2.7 goals total
  const avgGoals = 2.7
  const homeAdvantage = 1.15 // slight home bias

  let lambdaHome = avgGoals * normHome * homeAdvantage
  let lambdaAway = avgGoals * normAway

  // Clamp to reasonable range
  lambdaHome = Math.max(0.3, Math.min(4.0, lambdaHome))
  lambdaAway = Math.max(0.2, Math.min(3.5, lambdaAway))

  // Poisson sample (simple inversion method)
  const homeScore = poissonSample(lambdaHome)
  const awayScore = poissonSample(lambdaAway)

  // Confidence based on odds spread
  const oddsSpread = Math.abs(homeOdds - awayOdds)
  const confidence = Math.min(95, Math.round(40 + oddsSpread * 5))

  return {
    homeScore: Math.min(9, Math.max(0, homeScore)),
    awayScore: Math.min(9, Math.max(0, awayScore)),
    confidence,
  }
}

function poissonSample(lambda) {
  const L = Math.exp(-lambda)
  let k = 0
  let p = 1
  do {
    k++
    p *= Math.random()
  } while (p > L)
  return k - 1
}
