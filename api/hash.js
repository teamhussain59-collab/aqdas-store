import crypto from 'node:crypto'
import { ok, bad, q } from '../lib/_u.js'
const ALG = ['md5', 'sha1', 'sha256', 'sha512']
export default function handler (req, res) {
  const text = q(req, 'text'); if (!text) return bad(res, '?text= do')
  const type = (q(req, 'type') || 'all').toLowerCase()
  if (type === 'base64') return ok(res, { result: Buffer.from(text).toString('base64') })
  if (type === 'unbase64') return ok(res, { result: Buffer.from(text, 'base64').toString('utf8') })
  if (type !== 'all' && !ALG.includes(type)) return bad(res, 'type: md5, sha1, sha256, sha512, base64, unbase64, all')
  const h = a => crypto.createHash(a).update(text).digest('hex')
  return ok(res, { result: type === 'all' ? Object.fromEntries(ALG.map(a => [a, h(a)])) : h(type) })
}
