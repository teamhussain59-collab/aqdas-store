import { bad, q, sendImage } from '../lib/_u.js'
export default async function handler (req, res) {
  const u = q(req, 'url'); if (!/^https?:\/\/\S+\.\S+/i.test(u)) return bad(res, '?url=https://... do')
  const mobile = q(req, 'device') === 'mobile'
  try { await sendImage(res, `https://image.thum.io/get/width/${mobile ? 400 : 1200}/${mobile ? 'viewportWidth/400/' : ''}${u}`, 28000) } catch (e) { bad(res, 'Screenshot nahi bana', 503) }
}
