import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FeedItem } from '@/components/feed/feed-item'
import { Card } from '@/components/ui/card'

export default async function SavedPage() {
  const supabase = await createClient()

  const {  { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const {  savedItems } = await supabase
    .from('saved_items')
    .select(`
      id,
      saved_at,
      content_items (*)
    `)
    .eq('user_id', user.id)
    .order('saved_at', { ascending: false })

  const items = savedItems?.map(item => item.content_items).filter(Boolean) || []

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Reading List</h1>

      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((item: any) => (
            <FeedItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No saved items yet. Start saving articles to read later!
          </p>
        </Card>
      )}
    </main>
  )
}
