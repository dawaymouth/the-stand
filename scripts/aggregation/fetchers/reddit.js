import axios from 'axios'
import { supabase, SOURCES } from '../config.js'

export async function fetchReddit() {
  console.log('🔍 Fetching Reddit...')
  let totalFetched = 0

  try {
    const { subreddit, limit, trust_score } = SOURCES.REDDIT
    const url = `https://www.reddit.com/r/${subreddit}/hot.json?limit=${limit}`

    const response = await axios.get(url, {
      headers: { 'User-Agent': 'SuperfanApp/1.0' }
    })

    // Reddit returns an array: data.data.children, each { kind, data }
    const children = response.data?.data?.children || []

    for (const child of children) {
      const post = child.data
      if (!post) continue

      // Skip stickied posts
      if (post.stickied) continue

      // Check if exists
      const {  existing } = await supabase
        .from('content_items')
        .select('id')
        .eq('external_id', `reddit_${post.id}`)
        .maybeSingle()

      if (existing) continue

      // Determine thumbnail
      let thumbnail = null
      if (post.thumbnail && !['self', 'default', 'nsfw', 'image'].includes(post.thumbnail)) {
        thumbnail = post.thumbnail
      } else if (post.preview?.images?.[0]?.source?.url) {
        thumbnail = post.preview.images[0].source.url.replace(/&amp;/g, '&')
      }

      const summary = post.selftext
        ? post.selftext.slice(0, 500)
        : ''

      const { error } = await supabase
        .from('content_items')
        .insert({
          external_id: `reddit_${post.id}`,
          title: post.title,
          url: post.is_self ? `https://reddit.com${post.permalink}` : post.url,
          summary,
          author: post.author,
          published_at: new Date(post.created_utc * 1000).toISOString(),
          media_type: post.is_video ? 'video' : 'article',
          thumbnail_url: thumbnail,
          quality_score: Math.min(100, Math.floor(post.score / 10) + trust_score),
          source_name: `r/${subreddit}`
        })

      if (!error) {
        totalFetched++
        console.log(`  ✅ ${post.title.slice(0, 60)}...`)
      } else {
        console.error('  ❌ Supabase insert error:', error.message)
      }
    }
  } catch (err) {
    console.error('  ❌ Reddit error:', err.message)
  }

  console.log(`✅ Reddit: Fetched ${totalFetched} new items`)
  return totalFetched
}
