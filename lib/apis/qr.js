import QRCode from 'qrcode'
import { cors, bad, q } from '../_u.js'
export default async function handler (req, res) {
  const text = q(req, 'text'); if (!text) return bad(res, '?text= do')
  if (text.length > 1500) return bad(res, 'text bahut lamba hai')
  const size = Math.min(Math.max(parseInt(q(req, 'size') || '512', 10) || 512, 128), 1500)
  const dark = '#' + (q(req, 'color') || '000000').replace(/[^0-9a-f]/gi, '').slice(0, 6).padEnd(6, '0')
  const light = '#' + (q(req, 'bg') || 'ffffff').replace(/[^0-9a-f]/gi, '').slice(0, 6).padEnd(6, 'f')
  try {
    const png = await QRCode.toBuffer(text, { width: size, margin: 2, color: { dark, light }, errorCorrectionLevel: 'M' })
    cors(res); res.setHeader('Content-Type', 'image/png'); res.setHeader('Cache-Control', 'public, max-age=86400'); res.status(200).end(png)
  } catch (e) { bad(res, 'QR nahi bana: ' + e.message, 500) }
}
