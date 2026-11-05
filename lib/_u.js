export const cors = (res) => { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS'); res.setHeader('X-Powered-By', 'MR AQDAS API') }
export const ok = (res, data) => { cors(res); res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.status(200).end(JSON.stringify({ status: true, creator: 'MR AQDAS', ...data }, null, 2)) }
export const bad = (res, msg, code = 400) => { cors(res); res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.status(code).end(JSON.stringify({ status: false, creator: 'MR AQDAS', error: msg }, null, 2)) }
export const q = (req, k) => { const v = req.query?.[k]; return Array.isArray(v) ? v[0] : (v ?? '') }

export const UA = { 'User-Agent': 'Mozilla/5.0 MR-AQDAS-API' }
export async function getJSON (url, ms = 9000) { const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(ms) }); if (!r.ok) throw new Error('upstream ' + r.status); return r.json() }
export async function sendImage (res, url, ms = 25000) { const { cors } = await import('./_u.js'); const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(ms) }); if (!r.ok) throw new Error('upstream ' + r.status); const b = Buffer.from(await r.arrayBuffer()); cors(res); res.setHeader('Content-Type', r.headers.get('content-type') || 'image/jpeg'); res.setHeader('Cache-Control', 'public, max-age=3600'); res.status(200).end(b) }
