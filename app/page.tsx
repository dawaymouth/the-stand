import { createClient } from '@/lib/supabase/server'
import { FeedItem } from '@/components/feed/feed-item'
import { FeedFilters } from '@/components/feed/feed-filters'

export const revalidate = 300 // Revalidate every 5 minutes

interface PageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('content_items')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(50)

  // Apply category filter
  if (params.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }

  const {  items, error } = await query

  if (error) {
    console.error('Error fetching content:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-600">Error loading content. Please try again.</p>
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Arsenal Feed</h1>
        <p className="text-muted-foreground">
          All Arsenal news, videos, and analysis in one place
        </p>
      </div>

      <div className="mb-6">
        <FeedFilters />
      </div>

      {items && items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No content yet. Check back soon!
          </p>
        </Card>
      )}
    </main>
  )
}
