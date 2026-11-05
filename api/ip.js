import { ok, bad, q, getJSON } from '../lib/_u.js'
export default async function handler (req, res) {
  const ip = q(req, 'ip').replace(/[^0-9a-fA-F:.]/g, ''); if (!ip) return bad(res, '?ip=8.8.8.8 do')
  try {
    const j = await getJSON('https://ipwho.is/' + ip)
    if (!j.success) return bad(res, 'IP galat hai', 404)
    return ok(res, { result: { ip: j.ip, type: j.type, country: j.country, flag: j.flag?.emoji, region: j.region, city: j.city, isp: j.connection?.isp, org: j.connection?.org, timezone: j.timezone?.id } })
  } catch (e) { return bad(res, 'IP info abhi nahi mili', 503) }
}
