import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan'
import { ok, bad, q } from '../_u.js'
async function geo (city) {
  const r = await fetch('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name=' + encodeURIComponent(city), { signal: AbortSignal.timeout(8000) })
  const j = await r.json(); return j?.results?.[0] || null
}
export default async function handler (req, res) {
  const city = q(req, 'city'); let lat = parseFloat(q(req, 'lat')), lon = parseFloat(q(req, 'lon')), tz = q(req, 'tz'), place = city
  if (!city && (isNaN(lat) || isNaN(lon))) return bad(res, '?city=Lahore do (ya lat & lon)')
  if (city) { const g = await geo(city).catch(() => null); if (!g) return bad(res, 'Shehar nahi mila: ' + city, 404); lat = g.latitude; lon = g.longitude; tz = tz || g.timezone; place = [g.name, g.admin1, g.country].filter(Boolean).join(', ') }
  tz = tz || 'Asia/Karachi'
  const m = (q(req, 'method') || 'karachi').toLowerCase()
  const methods = { karachi: CalculationMethod.Karachi(), mwl: CalculationMethod.MuslimWorldLeague(), makkah: CalculationMethod.UmmAlQura(), egypt: CalculationMethod.Egyptian(), isna: CalculationMethod.NorthAmerica(), dubai: CalculationMethod.Dubai() }
  const params = methods[m] || methods.karachi
  params.madhab = q(req, 'madhab').toLowerCase() === 'shafi' ? Madhab.Shafi : Madhab.Hanafi
  let date = new Date(); const ds = q(req, 'date'); if (ds) { const d = new Date(ds + 'T12:00:00Z'); if (!isNaN(d)) date = d }
  const pt = new PrayerTimes(new Coordinates(lat, lon), date, params)
  let fmt; try { fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }) } catch { return bad(res, 'tz galat hai') }
  const t = d => fmt.format(d)
  return ok(res, { place, lat, lon, timezone: tz, date: date.toISOString().slice(0, 10), method: m, madhab: params.madhab, result: { fajr: t(pt.fajr), sunrise: t(pt.sunrise), dhuhr: t(pt.dhuhr), asr: t(pt.asr), maghrib: t(pt.maghrib), isha: t(pt.isha) } })
}
