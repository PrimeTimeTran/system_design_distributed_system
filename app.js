const express = require('express')

const app = express()
const uid = Math.random().toString(36).slice(2, 10)
const gitCommit = process.env.GIT_COMMIT || 'unknown'
const githubRunUrl = process.env.GITHUB_RUN_URL || 'not_available'
const revision = process.env.K_REVISION

let val = 0
let googleCloudRunInstanceId = 'unknown'

async function getInstanceId() {
  try {
    const res = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/id',
      {
        headers: { 'Metadata-Flavor': 'Google' },
      }
    )
    googleCloudRunInstanceId = await res.text()
    return googleCloudRunInstanceId
  } catch (err) {
    console.error('Failed to get instance ID:', err)
  }
}

function respond(counter) {
  const gitCommitUrl = `https://github.com/PrimeTimeTran/system_design_distributed_system/commit/${gitCommit}`

  return {
    uid,
    counter,
    gitCommit,
    gitCommitUrl,
    githubRunUrl,
    googleCloudRunRevision: revision,
    googleCloudRunInstanceId: googleCloudRunInstanceId,
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
  const delay = parseInt(req.query.delay) || 3000
  blockCpuFor(delay)
  await new Promise((resolve) => setTimeout(resolve, delay))
  val += 1
  res.json(respond(val))
})
app.get('/decrement', async (req, res) => {
  val -= 1
  res.json(respond(val))
})
app.get('/value', async (req, res) => {
  res.json(respond(val))
})

app.get('/debug', async (req, res) => {
  const { execSync } = require('child_process')
  const rawHost = execSync('cat /etc/hostname').toString().trim()
  res.json({
    etcHostname: rawHost,
    googleCloudRunRevision: revision,
    googleCloudRunInstanceId: instanceId,
  })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  getInstanceId()
  console.log(`Service running on port ${port} (revision ${revision})`)
})
