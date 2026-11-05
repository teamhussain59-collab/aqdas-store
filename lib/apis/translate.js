import { ok, bad, q, getJSON } from '../_u.js'
export default async function handler (req, res) {
  const text = q(req, 'text'); if (!text) return bad(res, '?text= do'); if (text.length > 450) return bad(res, 'text 450 letters se chhota do')
  const to = (q(req, 'to') || 'ur').toLowerCase(), from = (q(req, 'from') || 'auto').toLowerCase()
  try {
    const j = await getJSON(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from === 'auto' ? 'autodetect' : from}|${to}`)
    return ok(res, { from, to, text, result: j?.responseData?.translatedText || '' })
  } catch (e) { return bad(res, 'Translate abhi nahi hua', 503) }
}
