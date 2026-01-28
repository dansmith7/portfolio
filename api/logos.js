const { getSupabase } = require('./_lib/supabase')

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
  try {
    const { data, error } = await supabase
      .from('marquee_logos')
      .select('id,url,alt,sort_order')
      .order('sort_order')
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
