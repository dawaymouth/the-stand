import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '../../.env.local' })

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const SOURCES = {
  RSS: [
    {
      name: 'Arsenal.com',
      url: 'https://www.arsenal.com/rss.xml',
      trust_score: 95
    },
    {
      name: 'BBC Sport - Arsenal',
      url: 'https://feeds.bbci.co.uk/sport/football/rss.xml',
      trust_score: 90
    },
    {
      name: 'The Guardian - Arsenal',
      url: 'https://www.theguardian.com/football/arsenal/rss',
      trust_score: 85
    }
  ],
  REDDIT: {
    subreddit: 'Gunners',
    limit: 25,
    trust_score: 70
  }
}
