import { ok, bad, q, UA } from '../_u.js'
export default async function handler (req, res) {
  const text = q(req, 'q') || q(req, 'text'); if (!text) return bad(res, '?q= sawal do')
  if (text.length > 2000) return bad(res, 'sawal 2000 letters se chhota do')
  const system = q(req, 'system') || 'You are AQDAS AI, a helpful assistant made by MR AQDAS. Reply in the user\'s language.'
  try {
    const r = await fetch('https://text.pollinations.ai/' + encodeURIComponent(text) + '?system=' + encodeURIComponent(system), { headers: UA, signal: AbortSignal.timeout(25000) })
    if (!r.ok) throw new Error('upstream ' + r.status)
    return ok(res, { question: text, result: (await r.text()).trim() })
  } catch (e) { return bad(res, 'AI abhi busy hai, dobara try karo', 503) }
}
