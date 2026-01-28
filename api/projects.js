const { getSupabase } = require('./_lib/supabase')

/** Только поля списка — без JSON/blocks, без description/concept/output */
const LIST_COLS = 'id,slug,name,subtitle,cover_image_url,show_on_home,created_at,updated_at'

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const supabase = getSupabase()
  if (!supabase) {
    res.status(500).json({ error: 'Server: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required' })
    return
  }
  const onlyShowOnHome = req.query?.onlyShowOnHome === '1' || req.query?.onlyShowOnHome === 'true'
  try {
    let q = supabase
      .from('projects')
      .select(LIST_COLS)
      .order('created_at', { ascending: false })
    if (onlyShowOnHome) q = q.eq('show_on_home', true)
    const { data, error } = await q
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    res.status(200).json(data ?? [])
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' })
  }
}
