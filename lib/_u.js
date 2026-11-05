export const cors = (res) => { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS'); res.setHeader('X-Powered-By', 'MR AQDAS API') }
export const ok = (res, data) => { cors(res); res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.status(200).end(JSON.stringify({ status: true, creator: 'MR AQDAS', ...data }, null, 2)) }
export const bad = (res, msg, code = 400) => { cors(res); res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.status(code).end(JSON.stringify({ status: false, creator: 'MR AQDAS', error: msg }, null, 2)) }
export const q = (req, k) => { const v = req.query?.[k]; return Array.isArray(v) ? v[0] : (v ?? '') }
