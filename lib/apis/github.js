import { ok, bad, q, getJSON } from '../_u.js'
export default async function handler (req, res) {
  const u = q(req, 'user').replace(/[^a-zA-Z0-9-]/g, ''); if (!u) return bad(res, '?user= GitHub username do')
  try {
    const j = await getJSON('https://api.github.com/users/' + u)
    return ok(res, { result: { username: j.login, name: j.name, bio: j.bio, avatar: j.avatar_url, followers: j.followers, following: j.following, public_repos: j.public_repos, location: j.location, blog: j.blog, created: j.created_at, url: j.html_url } })
  } catch (e) { return bad(res, 'User nahi mila', 404) }
}
