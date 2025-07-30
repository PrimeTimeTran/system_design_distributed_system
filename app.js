const express = require('express')
const Redis = require('ioredis')
const os = require('os')
const { randomUUID } = require('crypto')

const app = express()
const hostName = os.hostname()
const uid = Math.random().toString(36).slice(2, 10)
const revision =
  process.env.K_REVISION || Math.random().toString(36).slice(2, 10)

let val = 0

const gitCommit = process.env.GIT_COMMIT || 'unknown'
const githubRunUrl = process.env.GITHUB_RUN_URL || 'not_available'

let instanceId = 'unknown'

async function getInstanceId() {
  try {
    const res = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/id',
      {
        headers: { 'Metadata-Flavor': 'Google' },
      }
    )
    instanceId = await res.text()
    console.log(`[BOOT] Fetched Cloud Run instance ID: ${instanceId}`)
    return instanceId
  } catch (err) {
    console.error('Failed to get instance ID:', err)
  }
}

await getInstanceId()

async function respond(counter) {
  const gitCommitUrl = `https://github.com/PrimeTimeTran/system_design_distributed_system/commit/${gitCommit}`

  return {
    uid,
    counter,
    revision,
    hostName,
    gitCommit,
    gitCommitUrl,
    githubRunUrl,
    instanceId,
    gaeInstance: process.env.GAE_INSTANCE,
    K_CONFIGURATION: process.env.K_CONFIGURATION,
    K_SERVICE: process.env.K_SERVICE,
    K_REVISION: process.env.K_REVISION,
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
  console.log(`Service running on port ${port} (revision ${revision})`)
})
