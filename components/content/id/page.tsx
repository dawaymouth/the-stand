import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import { SaveButton } from '@/components/content/save-button'
import Image from 'next/image'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ContentPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {  item, error } = await supabase
    .from('content_items')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !item) {
    notFound()
  }

  // Get current user
  const {  { user } } = await supabase.auth.getUser()

  // Increment view count
  await supabase.rpc('increment_view_count', { content_id: id })

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {item.is_featured && (
          <Badge className="bg-red-600">Featured</Badge>
        )}
        {item.category && (
          <Badge variant="outline" className="capitalize">
            {item.category}
          </Badge>
        )}
        {item.media_type && (
          <Badge variant="secondary" className="capitalize">
            {item.media_type}
          </Badge>
        )}
        <span className="text-muted-foreground">{item.source_name}</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">
          {format(new Date(item.published_at), 'MMM d, yyyy')}
        </span>
      </div>

      <h1 className="text-4xl font-bold mb-6">{item.title}</h1>

      {item.curator_note && (
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded mb-6 border-l-4 border-blue-500">
          <p className="font-semibold mb-1 text-blue-700 dark:text-blue-300">
            Editor's Context
          </p>
          <p>{item.curator_note}</p>
        </div>
      )}

      {item.thumbnail_url && (
        <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden">
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {item.summary && (
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {item.summary}
        </p>
      )}

      {item.content && (
        <div
          className="prose dark:prose-invert max-w-none mb-8 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.content }}
        />
      )}

      <div className="flex gap-4 items-center border-t pt-6">
        <Button asChild>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Read Full Article
          </a>
        </Button>

        <SaveButton contentId={item.id} userId={user?.id} />
      </div>
    </article>
  )
}
