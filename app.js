const express = require('express')
const Redis = require('ioredis')
const os = require('os')

const app = express()
const redis = new Redis(process.env.REDIS_URL)
const instanceId = os.hostname()

const gitCommit = process.env.GIT_COMMIT || 'unknown'
const githubRunUrl = process.env.GITHUB_RUN_URL || 'not_available'

function respond(counter) {
  return {
    counter,
    instance: instanceId,
    gitCommit,
    githubRunUrl,
  }
}

app.get('/increment', async (req, res) => {
  const newValue = await redis.incr('counter')
  res.json(respond(newValue))
})
app.get('/decrement', async (req, res) => {
  const newValue = await redis.decr('counter')
  res.json(respond(newValue))
})
app.get('/value', async (req, res) => {
  const val = await redis.get('counter')
  res.json(respond(val))
})

app.listen(8080, () => {
  console.log(`Service running on instance ${instanceId}`)
  console.log(`Git commit: ${gitCommit}`)
  console.log(`GitHub Actions: ${githubRunUrl}`)
})
