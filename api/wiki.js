import { ok, bad, q, getJSON } from '../lib/_u.js'
export default async function handler (req, res) {
  const t = q(req, 'q'); if (!t) return bad(res, '?q= topic do'); const lang = (q(req, 'lang') || 'en').replace(/[^a-z]/g, '').slice(0, 3) || 'en'
  try {
    const s = await getJSON(`https://${lang}.wikipedia.org/w/api.php?action=opensearch&limit=1&format=json&search=${encodeURIComponent(t)}`)
    const title = s?.[1]?.[0]; if (!title) return bad(res, 'Kuch nahi mila', 404)
    const j = await getJSON(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
    return ok(res, { result: { title: j.title, summary: j.extract, image: j.thumbnail?.source || null, url: j.content_urls?.desktop?.page } })
  } catch (e) { return bad(res, 'Wiki abhi nahi mila', 503) }
}
