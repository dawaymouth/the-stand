import { supabase } from './config.js'

const CATEGORY_KEYWORDS = {
  transfers: ['transfer', 'sign', 'signing', 'deal', 'bid', 'target', 'linked', 'rumor', 'window'],
  tactics: ['tactical', 'formation', 'analysis', 'system', 'pressing', 'possession'],
  business: ['owner', 'ownership', 'finance', 'sponsor', 'commercial', 'revenue'],
  womens: ['women', 'wsl', 'female', 'ladies'],
  academy: ['academy', 'youth', 'u23', 'u21', 'u18', 'hale end'],
  injury: ['injury', 'injured', 'fitness', 'out', 'sidelined'],
  match_report: ['match report', 'post-match', 'player ratings', 'highlights']
}

export async function categorizeContent() {
  console.log('🏷️  Categorizing content...')

  const {  items } = await supabase
    .from('content_items')
    .select('id, title, summary')
    .is('category', null)
    .gte('fetched_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  if (!items || items.length === 0) {
    console.log('  No items to categorize')
    return
  }

  let categorized = 0

  for (const item of items) {
    const text = `${item.title} ${item.summary || ''}`.toLowerCase()

    let category = 'news'
    let maxScore = 0

    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const score = keywords.filter(kw => text.includes(kw)).length
      if (score > maxScore) {
        maxScore = score
        category = cat
      }
    }

    const { error } = await supabase
      .from('content_items')
      .update({ category })
      .eq('id', item.id)

    if (!error) categorized++
  }

  console.log(`✅ Categorized ${categorized} items`)
}
