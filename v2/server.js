import express from 'express'
import cors from 'cors'
import path from 'path'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// 模拟比分数据 - 已结束比赛的真实比分
const finishedMatches = {
  m001: { id: 'm001', homeScore: 2, awayScore: 0, status: 'FT', minute: 90 },
  m002: { id: 'm002', homeScore: 2, awayScore: 1, status: 'FT', minute: 90 },
  m003: { id: 'm003', homeScore: 1, awayScore: 1, status: 'FT', minute: 90 },
  m004: { id: 'm004', homeScore: 3, awayScore: 0, status: 'FT', minute: 90 },
  m005: { id: 'm005', homeScore: 0, awayScore: 2, status: 'FT', minute: 90 },
  m006: { id: 'm006', homeScore: 4, awayScore: 1, status: 'FT', minute: 90 },
  m007: { id: 'm007', homeScore: 1, awayScore: 1, status: 'FT', minute: 90 },
  m008: { id: 'm008', homeScore: 0, awayScore: 0, status: 'FT', minute: 90 },
  m009: { id: 'm009', homeScore: 3, awayScore: 0, status: 'FT', minute: 90 },
  m010: { id: 'm010', homeScore: 2, awayScore: 2, status: 'FT', minute: 90 },
  m011: { id: 'm011', homeScore: 1, awayScore: 0, status: 'FT', minute: 90 },
  m012: { id: 'm012', homeScore: 2, awayScore: 1, status: 'FT', minute: 90 },
  m013: { id: 'm013', homeScore: 3, awayScore: 2, status: 'FT', minute: 90 },
  m014: { id: 'm014', homeScore: 1, awayScore: 1, status: 'FT', minute: 90 },
  m015: { id: 'm015', homeScore: 2, awayScore: 3, status: 'FT', minute: 90 },
  m016: { id: 'm016', homeScore: 0, awayScore: 1, status: 'FT', minute: 90 },
}

// 获取所有已结束比赛的比分
app.get('/api/scores', (req, res) => {
  res.json({
    lastUpdated: new Date().toISOString(),
    matches: Object.values(finishedMatches)
  })
})

// 获取单个比赛比分
app.get('/api/scores/:matchId', (req, res) => {
  const { matchId } = req.params
  const score = finishedMatches[matchId]
  
  if (score) {
    res.json(score)
  } else {
    res.status(404).json({ error: 'Match not found' })
  }
})

// 静态文件服务
app.use(express.static(path.join(import.meta.dirname, 'dist')))

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})