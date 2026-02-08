import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ExternalLink } from 'lucide-react'

interface FeedItemProps {
  item: {
    id: string
    title: string
    summary: string | null
    url: string
    published_at: string
    category: string | null
    thumbnail_url: string | null
    media_type: string | null
    is_featured: boolean
    curator_note: string | null
    source_name: string
    quality_score: number
  }
}

export function FeedItem({ item }: FeedItemProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {item.thumbnail_url && (
          <div className="relative w-32 h-32 flex-shrink-0 rounded overflow-hidden">
            <Image
              src={item.thumbnail_url}
              alt={item.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {item.is_featured && (
              <Badge variant="default" className="bg-red-600">
                Featured
              </Badge>
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
            <span className="text-sm text-muted-foreground">
              {item.source_name}
            </span>
          </div>

          <Link
            href={`/content/${item.id}`}
            className="hover:underline group"
          >
            <h3 className="text-xl font-semibold mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
              {item.title}
            </h3>
          </Link>

          {item.curator_note && (
            <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded mb-2 border-l-4 border-blue-500">
              <p className="text-sm">
                <strong className="text-blue-700 dark:text-blue-300">
                  Editor's note:
                </strong>{' '}
                {item.curator_note}
              </p>
            </div>
          )}

          {item.summary && (
            <p className="text-muted-foreground mb-2 line-clamp-2">
              {item.summary}
            </p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(item.published_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-red-600 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Read source</span>
            </a>
          </div>
        </div>
      </div>
    </Card>
  )
}
