import { ok, bad, q } from '../_u.js'
import { readKey, info } from '../_keys.js'
export default async function (req, res) {
  const key = q(req, 'key'); if (!key) return bad(res, 'key do: /api/balance?key=YOUR-KEY')
  const k = await readKey(key); if (!k) return bad(res, 'Key galat hai ya mojood nahi', 404)
  return ok(res, { key: info(k) })
}
