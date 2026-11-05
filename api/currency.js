import { ok, bad, q, getJSON } from '../lib/_u.js'
export default async function handler (req, res) {
  const from = (q(req, 'from') || 'USD').toUpperCase().replace(/[^A-Z]/g, ''), to = (q(req, 'to') || 'PKR').toUpperCase().replace(/[^A-Z]/g, ''), amount = parseFloat(q(req, 'amount') || '1')
  if (isNaN(amount)) return bad(res, 'amount number do')
  try {
    const j = await getJSON('https://open.er-api.com/v6/latest/' + from)
    const rate = j?.rates?.[to]; if (!rate) return bad(res, 'Currency code galat hai (USD, PKR, AED, SAR, EUR...)')
    return ok(res, { from, to, amount, rate, result: +(amount * rate).toFixed(2), updated: j.time_last_update_utc })
  } catch (e) { return bad(res, 'Rate abhi nahi mila', 503) }
}
