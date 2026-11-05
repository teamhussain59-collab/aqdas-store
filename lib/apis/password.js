import crypto from 'node:crypto'
import { ok, bad, q } from '../_u.js'
export default function handler (req, res) {
  let len = parseInt(q(req, 'length') || '16', 10); if (!(len >= 4 && len <= 128)) return bad(res, 'length 4-128 ke beech do')
  const count = Math.min(Math.max(parseInt(q(req, 'count') || '1', 10) || 1, 1), 20)
  const sym = q(req, 'symbols') !== 'false'
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789' + (sym ? '!@#$%^&*-_=+?' : '')
  const gen = () => Array.from(crypto.randomBytes(len), b => chars[b % chars.length]).join('')
  const list = Array.from({ length: count }, gen)
  return ok(res, { result: count === 1 ? list[0] : list, length: len })
}
