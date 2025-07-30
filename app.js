const express = require('express')
const Redis = require('ioredis')
const os = require('os')

const app = express()
const instance =
  process.env.K_REVISION || Math.random().toString(36).slice(2, 10)

let val = 0

const gitCommit = process.env.GIT_COMMIT || 'unknown'
const githubRunUrl = process.env.GITHUB_RUN_URL || 'not_available'

function respond(counter) {
  const gitCommitUrl = `https://github.com/PrimeTimeTran/system_design_distributed_system/commit/${gitCommit}`

  return {
    foo: 'bar',
    counter,
    instance,
    gitCommit,
    gitCommitUrl,
    githubRunUrl,
  }
}
function blockCpuFor(ms) {
  const end = Date.now() + ms
  while (Date.now() < end) {}
}

app.get('/increment', async (req, res) => {
  blockCpuFor(3000)
  await new Promise((resolve) => setTimeout(resolve, 3000))

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

app.get('/debug', async (req, res) => {
  const { execSync } = require('child_process')
  const rawHost = execSync('cat /etc/hostname').toString().trim()
  res.json({
    osHostname: os.hostname(),
    etcHostname: rawHost,
  })
})

console.log('⚙️  Cloud Run hostname:', os.hostname())

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Service running on port ${port} (instance ${instance})`)
})
