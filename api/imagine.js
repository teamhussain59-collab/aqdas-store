import { bad, q, sendImage } from '../lib/_u.js'
export default async function handler (req, res) {
  const p = q(req, 'prompt'); if (!p) return bad(res, '?prompt= do')
  const w = Math.min(Math.max(parseInt(q(req, 'width') || '1024', 10) || 1024, 256), 1536), h = Math.min(Math.max(parseInt(q(req, 'height') || '1024', 10) || 1024, 256), 1536)
  try { await sendImage(res, `https://image.pollinations.ai/prompt/${encodeURIComponent(p)}?width=${w}&height=${h}&nologo=true&seed=${Math.floor(Math.random() * 1e9)}`, 28000) } catch (e) { bad(res, 'Image nahi bani, dobara try karo', 503) }
}
