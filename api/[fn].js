import balance from '../lib/apis/balance.js'
import ai from '../lib/apis/ai.js'
import currency from '../lib/apis/currency.js'
import fonts from '../lib/apis/fonts.js'
import github from '../lib/apis/github.js'
import hash from '../lib/apis/hash.js'
import imagine from '../lib/apis/imagine.js'
import ip from '../lib/apis/ip.js'
import namaz from '../lib/apis/namaz.js'
import password from '../lib/apis/password.js'
import pknumber from '../lib/apis/pknumber.js'
import qr from '../lib/apis/qr.js'
import quran from '../lib/apis/quran.js'
import shorturl from '../lib/apis/shorturl.js'
import ssweb from '../lib/apis/ssweb.js'
import translate from '../lib/apis/translate.js'
import weather from '../lib/apis/weather.js'
import wiki from '../lib/apis/wiki.js'
import { bad } from '../lib/_u.js'
import { isPaid, readKey, info, spend } from '../lib/_keys.js'
const H = { balance, ai, currency, fonts, github, hash, imagine, ip, namaz, password, pknumber, qr, quran, shorturl, ssweb, translate, weather, wiki }
export default async function handler (req, res) {
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS'); return res.status(204).end() }
  const name = String(Array.isArray(req.query.fn) ? req.query.fn[0] : req.query.fn || '').toLowerCase()
  const h = H[name]; if (!h) return bad(res, 'API nahi mili. List: ' + Object.keys(H).join(', '), 404)
  if (name !== 'balance' && await isPaid(name)) {
    const kq = req.query.key || req.query.apikey; const key = String(Array.isArray(kq) ? kq[0] : kq || '')
    if (!key) return bad(res, 'Ye PAID API hai 🔑 Key chahiye: ?key=YOUR-KEY  (key ke liye MR AQDAS se rabta karein)', 401)
    const k = await readKey(key); if (!k) return bad(res, 'Key galat hai ya mojood nahi', 401)
    const i = info(k)
    if (i.status !== 'active') return bad(res, ({ expired: 'Key expire ho gayi ⌛', disabled: 'Key band hai ⛔', 'no balance': 'Key ka balance khatam 🪫' })[i.status] + ' (balance: ' + i.balance + ', expiry: ' + (i.expires || '-') + ')', 402)
    if (i.apis !== 'all' && !String(i.apis).split(',').map(s => s.trim().toLowerCase()).includes(name)) return bad(res, 'Ye key is API ke liye nahi hai', 403)
    if (!(await spend(key))) return bad(res, 'Key ka balance khatam ya expire', 402)
    res.__key = { ...i, balance: i.balance - 1, used: i.used + 1 }
    res.setHeader('X-Key-Balance', String(i.balance - 1))
  }
  return h(req, res)
}
