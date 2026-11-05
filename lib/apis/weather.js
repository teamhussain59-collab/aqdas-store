import { ok, bad, q, getJSON } from '../_u.js'
const W = { 0: 'Saaf aasmaan ☀️', 1: 'Zyada tar saaf 🌤️', 2: 'Kuch baadal ⛅', 3: 'Baadal ☁️', 45: 'Dhund 🌫️', 48: 'Dhund 🌫️', 51: 'Halki boonda baandi 🌦️', 53: 'Boonda baandi 🌦️', 55: 'Tez boonda baandi 🌧️', 61: 'Halki barish 🌧️', 63: 'Barish 🌧️', 65: 'Tez barish 🌧️', 71: 'Halki barf 🌨️', 73: 'Barf 🌨️', 75: 'Tez barf ❄️', 80: 'Barish ki bauchhar 🌦️', 81: 'Barish 🌧️', 82: 'Tez bauchhar ⛈️', 95: 'Toofan ⛈️', 96: 'Toofan + ole ⛈️', 99: 'Toofan + ole ⛈️' }
export default async function handler (req, res) {
  const city = q(req, 'city'); if (!city) return bad(res, '?city=Lahore do')
  try {
    const g = (await getJSON('https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&name=' + encodeURIComponent(city)))?.results?.[0]
    if (!g) return bad(res, 'Shehar nahi mila: ' + city, 404)
    const j = await getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${g.latitude}&longitude=${g.longitude}&timezone=auto&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=1`)
    const c = j.current
    return ok(res, { place: [g.name, g.admin1, g.country].filter(Boolean).join(', '), result: { condition: W[c.weather_code] || ('code ' + c.weather_code), temp_c: c.temperature_2m, feels_like_c: c.apparent_temperature, humidity: c.relative_humidity_2m + '%', wind_kmh: c.wind_speed_10m, today_max_c: j.daily?.temperature_2m_max?.[0], today_min_c: j.daily?.temperature_2m_min?.[0], time: c.time } })
  } catch (e) { return bad(res, 'Weather abhi nahi mila', 503) }
}
