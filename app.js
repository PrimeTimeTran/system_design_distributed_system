const express = require('express')
const Redis = require('ioredis')
const os = require('os')

const app = express()
// const redis = new Redis(process.env.REDIS_URL)
const instanceId = os.hostname()

let val = 0

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
  // const newValue = await redis.incr('counter')
  val += 1
  res.json(respond(val))
})
app.get('/decrement', async (req, res) => {
  // const newValue = await redis.decr('counter')
  val -= 1
  res.json(respond(val))
})
app.get('/value', async (req, res) => {
  // const val = await redis.get('counter')
  res.json(respond(val))
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Service running on port ${port} (instance ${instanceId})`)
})
