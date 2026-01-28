const { getSupabase } = require('./_lib/supabase')

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001'

const COLS = 'hero_text,description_text,why_us_photo_url,why_us_text,showreel_video_url,contact_email,contact_telegram'

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
      .from('site_settings')
      .select(COLS)
      .eq('id', SETTINGS_ID)
      .single()
    if (error) {
      res.status(500).json({ error: error.message })
      return
    }
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    res.status(200).json(data || {})
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' })
  }
}
