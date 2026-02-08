import Parser from 'rss-parser'
import { supabase, SOURCES } from '../config.js'

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded']
    ]
  }
})

function extractImageFromContent(content) {
  if (!content) return null
  const imgRegex = /<img[^>]+src="([^">]+)"/
  const match = content.match(imgRegex)
  return match ? match[1] : null
}

function cleanText(text) {
  if (!text) return ''
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500)
}

export async function fetchRSSFeeds() {
  console.log('🔍 Fetching RSS feeds...')
  let totalFetched = 0

  for (const source of SOURCES.RSS) {
    try {
      console.log(`  Fetching: ${source.name}`)
      const feed = await parser.parseURL(source.url)

      for (const item of feed.items) {
        const externalId = item.guid || item.link || item.title
        
        const {  existing } = await supabase
          .from('content_items')
          .select('id')
          .eq('external_id', externalId)
          .single()

        if (existing) continue

        const thumbnail = 
          item.enclosure?.url || 
          item.media?.$?.url ||
          extractImageFromContent(item.contentEncoded || item.content)

        const { error } = await supabase
          .from('content_items')
          .insert({
            external_id: externalId,
            title: item.title,
            url: item.link,
            summary: cleanText(item.contentSnippet || item.summary),
            content: item.contentEncoded || item.content,
            author: item.creator || item.author,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            media_type: 'article',
            thumbnail_url: thumbnail,
            quality_score: source.trust_score,
            source_name: source.name
          })

        if (!error) {
          totalFetched++
          console.log(`    ✅ ${item.title.slice(0, 60)}...`)
        } else {
          console.error(`    ❌ Error inserting: ${error.message}`)
        }
      }
    } catch (err) {
      console.error(`    ❌ Error fetching ${source.name}:`, err.message)
    }
  }

  console.log(`✅ RSS: Fetched ${totalFetched} new items`)
  return totalFetched
}
