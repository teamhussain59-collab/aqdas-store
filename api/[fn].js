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
const H = { ai, currency, fonts, github, hash, imagine, ip, namaz, password, pknumber, qr, quran, shorturl, ssweb, translate, weather, wiki }
export default async function handler (req, res) {
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Origin', '*'); res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS'); return res.status(204).end() }
  const name = String(Array.isArray(req.query.fn) ? req.query.fn[0] : req.query.fn || '').toLowerCase()
  const h = H[name]; if (!h) return bad(res, 'API nahi mili. List: ' + Object.keys(H).join(', '), 404)
  return h(req, res)
}
