/**
 * Prove that booking Option B degrades to Option A on every failure path.
 *
 * This is the test behind the promise "if it goes sideways, it falls back."
 * It stands up a fake Guesty on localhost, points lib/guesty.ts at it via the
 * GUESTY_TOKEN_URL / GUESTY_API_BASE overrides, and asserts that each way the
 * real API can fail produces `null` — which the UI renders as Option A — while
 * a healthy response produces parsed availability.
 *
 * No network, no credentials, no build. Run it in seconds:
 *
 *   node --experimental-strip-types tools/test-guesty-fallback.mjs
 *
 * Exits non-zero on any failure, so CI can gate on it.
 */
import { createServer } from 'node:http'
import assert from 'node:assert/strict'

const PORT = 4599
process.env.GUESTY_TOKEN_URL = `http://127.0.0.1:${PORT}/oauth2/token`
process.env.GUESTY_API_BASE = `http://127.0.0.1:${PORT}/v1`
process.env.GUESTY_CLIENT_ID = 'test-id'
process.env.GUESTY_CLIENT_SECRET = 'test-secret'

/** Set per-scenario; the server reads it to decide how to misbehave. */
let mode = 'ok'

const GOOD_DAYS = [
  { date: '2026-08-01', status: 'available', price: 725, minNights: 3 },
  { date: '2026-08-02', status: 'available', price: 725, minNights: 3 },
  { date: '2026-08-03', status: 'booked', price: 725, minNights: 3 },
  { date: '2026-08-04', status: 'available', price: 890, minNights: 3 },
]

const server = createServer((req, res) => {
  const json = (code, body) => {
    res.writeHead(code, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(body))
  }

  if (req.url.startsWith('/oauth2/token')) {
    if (mode === 'bad-credentials') return json(401, { error: 'invalid_client' })
    if (mode === 'token-garbage') return json(200, { nope: true })
    return json(200, { access_token: 'tok', expires_in: 3600 })
  }

  if (mode === 'rate-limited') return json(429, { error: 'too many requests' })
  if (mode === 'server-error') return json(503, { error: 'unavailable' })
  if (mode === 'unknown-shape') return json(200, { results: 'surprise' })
  if (mode === 'empty-days') return json(200, { data: { days: [] } })
  if (mode === 'hang') return // never respond — exercises the timeout
  if (mode === 'bare-array') return json(200, GOOD_DAYS)
  return json(200, { currency: 'USD', data: { days: GOOD_DAYS } })
})

await new Promise((r) => server.listen(PORT, '127.0.0.1', r))

// Imported after the env is set, so the module reads the overrides.
const { getAvailability, getFreshAvailability, isConfigured } = await import(
  '../lib/guesty.ts'
)

let failures = 0
const check = (name, fn) => {
  try {
    fn()
    console.log(`  ok    ${name}`)
  } catch (e) {
    failures += 1
    console.error(`  FAIL  ${name}\n        ${e.message}`)
  }
}

const call = async (m) => {
  mode = m
  // Shift the client id per scenario. The token cache is keyed by client id, so
  // this forces a real re-authentication instead of replaying a token cached by
  // an earlier scenario — which is exactly the hole that hid the bad-credential
  // path on the first run of this suite.
  process.env.GUESTY_CLIENT_ID = `test-id-${m}`
  return getAvailability('LISTING1', '2026-08-01', '2026-08-04')
}

console.log('\nHealthy responses parse:')
const ok = await call('ok')
check('nested {data:{days}} parses', () => assert.ok(ok))
check('four nights returned', () => assert.equal(ok.nights.length, 4))
check('availability read from status', () => {
  assert.deepEqual(
    ok.nights.map((n) => n.available),
    [true, true, false, true],
  )
})
check('price parsed', () => assert.equal(ok.nights[0].price, 725))
check('currency parsed', () => assert.equal(ok.currency, 'USD'))
check('fetchedAt stamped', () => assert.ok(ok.fetchedAt > 0))

const bare = await call('bare-array')
check('bare array shape also parses', () => assert.equal(bare?.nights.length, 4))

console.log('\nEvery failure path returns null (→ Option A):')
for (const [name, m] of [
  ['bad credentials', 'bad-credentials'],
  ['token response missing access_token', 'token-garbage'],
  ['rate limited (429)', 'rate-limited'],
  ['server error (503)', 'server-error'],
  ['unrecognised response shape', 'unknown-shape'],
  ['zero usable nights', 'empty-days'],
]) {
  const r = await call(m)
  check(name, () => assert.equal(r, null))
}

console.log('\nTimeout does not hang the render:')
mode = 'hang'
process.env.GUESTY_CLIENT_ID = 'test-id-hang'
const started = Date.now()
const hung = await call('hang')
const elapsed = Date.now() - started
check('returns null', () => assert.equal(hung, null))
check(`bounded by the 8s timeout (took ${elapsed}ms)`, () =>
  assert.ok(elapsed < 12_000, `took ${elapsed}ms`),
)

console.log('\nFreshness gate:')
mode = 'ok'
process.env.GUESTY_CLIENT_ID = 'test-id-fresh'
const fresh = await getFreshAvailability('LISTING1', 60, 6 * 3600_000)
check('fresh data passes', () => assert.ok(fresh))
const stale = await getFreshAvailability('LISTING1', 60, -1)
check('data older than maxAge is rejected', () => assert.equal(stale, null))

console.log('\nConfiguration gate:')
delete process.env.GUESTY_CLIENT_SECRET
check('unconfigured → isConfigured() false', () =>
  assert.equal(isConfigured(), false),
)
const unconf = await getAvailability('LISTING1', '2026-08-01', '2026-08-04')
check('unconfigured → null without any request', () =>
  assert.equal(unconf, null),
)

server.close()
console.log(
  failures === 0
    ? '\nAll fallback paths verified — Option B cannot break booking.\n'
    : `\n${failures} check(s) failed.\n`,
)
process.exit(failures === 0 ? 0 : 1)
