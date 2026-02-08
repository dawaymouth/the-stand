'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'transfers', label: 'Transfers' },
  { value: 'tactics', label: 'Tactics' },
  { value: 'business', label: 'Business' },
  { value: 'womens', label: "Women's Team" },
  { value: 'academy', label: 'Academy' },
]

export function FeedFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get('category') || 'all'

  const handleFilterChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <Button
          key={cat.value}
          variant={currentCategory === cat.value ? 'default' : 'outline'}
          onClick={() => handleFilterChange(cat.value)}
          size="sm"
        >
          {cat.label}
        </Button>
      ))}
    </div>
  )
}
