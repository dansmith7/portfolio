const { getSupabase } = require('./_lib/supabase')

/** Проект + медиа. Без JSON/blocks. Картинки — только public URL из таблицы. */
const COLS = 'id,slug,name,subtitle,cover_image_url,description_text,concept_text,requirements_text,output_text,first_horizontal_image_url,second_block_title,second_block_text,updated_at,project_media(id,project_id,type,image_url_1,image_url_2,sort_order)'

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }
  const slug = req.query?.slug
  if (!slug || typeof slug !== 'string') {
    res.status(400).json({ error: 'Missing query: slug' })
    return
  }
  const supabase = getSupabase()
  if (!supabase) {
    res.status(500).json({ error: 'Server: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required' })
    return
  }
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(COLS)
      .eq('slug', slug.trim())
      .single()
    if (error) {
      res.status(error.code === 'PGRST116' ? 404 : 500).json({ error: error.message })
      return
    }
    if (!data) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    const { project_media, ...project } = data
    const media = [...(project_media ?? [])].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    res.status(200).json({ ...project, media })
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' })
  }
}
