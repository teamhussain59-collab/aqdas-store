import { ok, bad, q } from '../_u.js'
const NET = { '30': 'Jazz', '32': 'Jazz', '31': 'Zong', '33': 'Ufone', '34': 'Telenor', '35': 'SCO' }
export default function handler (req, res) {
  let n = q(req, 'number').replace(/\D/g, ''); if (!n) return bad(res, '?number=03XXXXXXXXX do')
  if (n.startsWith('0092')) n = n.slice(4); else if (n.startsWith('92')) n = n.slice(2); else if (n.startsWith('0')) n = n.slice(1)
  if (!/^3\d{9}$/.test(n)) return ok(res, { valid: false, number: q(req, 'number'), note: 'Pakistani mobile number nahi lagta (03XX XXXXXXX)' })
  const net = NET[n.slice(0, 2)] || 'Unknown'
  return ok(res, { valid: true, local: '0' + n, international: '+92' + n, prefix: '0' + n.slice(0, 3), network: net, note: 'Network prefix se bataya gaya hai — agar number port (MNP) hua ho to asal network alag ho sakta hai' })
}
