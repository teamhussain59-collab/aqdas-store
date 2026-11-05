import { ok, bad, q, getJSON } from '../lib/_u.js'
export default async function handler (req, res) {
  const u = q(req, 'url'); if (!/^https?:\/\/\S+\.\S+/i.test(u)) return bad(res, '?url=https://... do')
  try { const j = await getJSON('https://is.gd/create.php?format=json&url=' + encodeURIComponent(u)); if (!j.shorturl) return bad(res, j.errormessage || 'Short nahi hua'); return ok(res, { original: u, result: j.shorturl }) } catch (e) { return bad(res, 'Short link abhi nahi bana', 503) }
}
