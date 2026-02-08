import { fetchRSSFeeds } from './fetchers/rss.js'
import { fetchReddit } from './fetchers/reddit.js'
import { categorizeContent } from './categorizer.js'

async function main() {
  console.log('🚀 Starting content aggregation...')
  console.log(`⏰ ${new Date().toISOString()}\n`)

  try {
    const rssCount = await fetchRSSFeeds()
    const redditCount = await fetchReddit()

    console.log('\n')
    await categorizeContent()

    const total = rssCount + redditCount
    console.log(`\n✨ Total: ${total} new items fetched`)
    console.log('✅ Aggregation complete\n')
  } catch (err) {
    console.error('❌ Aggregation failed:', err)
    process.exit(1)
  }
}

main()
