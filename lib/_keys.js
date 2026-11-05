// 🔑 MR AQDAS API keys: paid APIs need ?key=  (balance stored in Firestore apikeys/<key>, spend enforced by rules)
const P = 'aqdas-hacker'
const FS = `https://firestore.googleapis.com/v1/projects/${P}/databases/(default)/documents`
let cache = { t: 0, apis: [] }
const val = (f) => f == null ? null : ('integerValue' in f ? Number(f.integerValue) : 'doubleValue' in f ? f.doubleValue : 'booleanValue' in f ? f.booleanValue : 'stringValue' in f ? f.stringValue : 'timestampValue' in f ? f.timestampValue : null)
export async function siteApis () {
  if (Date.now() - cache.t < 30000) return cache.apis
  try {
    const r = await fetch(`${FS}/store/site`, { signal: AbortSignal.timeout(5000) })
    const j = await r.json(); const d = JSON.parse(j.fields?.json?.stringValue || '{}')
    cache = { t: Date.now(), apis: Array.isArray(d.apis) ? d.apis : [] }
  } catch (e) { cache.t = Date.now() - 20000 }
  return cache.apis
}
export async function isPaid (name) {
  const apis = await siteApis()
  return apis.some(a => a && a.paid === 'paid' && new RegExp('/api/' + name + '(\\?|$|/)', 'i').test(String(a.url || '')))
}
export async function readKey (key) {
  key = String(key || '').trim()
  if (!/^[A-Za-z0-9_-]{6,64}$/.test(key)) return null
  const r = await fetch(`${FS}/apikeys/${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(6000) })
  if (r.status === 404 || r.status === 403) return null
  const j = await r.json(); if (!j.fields) return null
  const k = {}; for (const [n, f] of Object.entries(j.fields)) k[n] = val(f)
  k.key = key
  return k
}
export function info (k) {
  const left = Math.max(0, (k.limit || 0) - (k.used || 0))
  const expired = !(k.expires > Date.now())
  const status = !k.active ? 'disabled' : expired ? 'expired' : left <= 0 ? 'no balance' : 'active'
  return { user: k.user || '', status, balance: left, used: k.used || 0, limit: k.limit || 0, expires: k.expires ? new Date(k.expires).toISOString() : null, days_left: k.expires ? Math.max(0, Math.ceil((k.expires - Date.now()) / 86400000)) : 0, apis: k.apis || 'all' }
}
export async function spend (key) {
  const r = await fetch(`${FS}:commit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(6000), body: JSON.stringify({ writes: [{ transform: { document: `projects/${P}/databases/(default)/documents/apikeys/${key}`, fieldTransforms: [{ fieldPath: 'used', increment: { integerValue: '1' } }, { fieldPath: 'last', setToServerValue: 'REQUEST_TIME' }] }, currentDocument: { exists: true } }] }) })
  return r.ok
}
