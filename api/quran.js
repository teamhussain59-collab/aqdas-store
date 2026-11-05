import { ok, bad, q, getJSON } from '../lib/_u.js'
export default async function handler (req, res) {
  let ayah = q(req, 'ayah') || (q(req, 'surah') && q(req, 'verse') ? q(req, 'surah') + ':' + q(req, 'verse') : '')
  if (q(req, 'random') === 'true' || !ayah) ayah = String(1 + Math.floor(Math.random() * 6236))
  if (!/^\d{1,3}(:\d{1,3})?$|^\d{1,4}$/.test(ayah)) return bad(res, '?ayah=2:255 do (surah:ayat) ya ?random=true')
  try {
    const j = await getJSON(`https://api.alquran.cloud/v1/ayah/${ayah}/editions/quran-uthmani,ur.jalandhry,en.sahih`)
    const [ar, ur, en] = j.data
    return ok(res, { result: { surah: ar.surah.englishName + ' (' + ar.surah.name + ')', surah_no: ar.surah.number, ayah_no: ar.numberInSurah, arabic: ar.text, urdu: ur.text, english: en.text } })
  } catch (e) { return bad(res, 'Ayat nahi mili', 404) }
}
