'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Bookmark } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SaveButton({ contentId, userId }: { contentId: string; userId?: string }) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (userId) {
      checkIfSaved()
    }
  }, [userId, contentId])

  const checkIfSaved = async () => {
    if (!userId) return
    const { data } = await supabase
      .from('saved_items')
      .select('id')
      .eq('user_id', userId)
      .eq('content_id', contentId)
      .single()

    setIsSaved(!!data)
  }

  const handleSave = async () => {
    if (!userId) {
      router.push('/login')
      return
    }

    setIsLoading(true)

    if (isSaved) {
      await supabase
        .from('saved_items')
        .delete()
        .eq('user_id', userId)
        .eq('content_id', contentId)
      setIsSaved(false)
    } else {
      await supabase
        .from('saved_items')
        .insert({ user_id: userId, content_id: contentId })
      setIsSaved(true)
    }

    setIsLoading(false)
  }

  return (
    <Button variant="outline" onClick={handleSave} disabled={isLoading}>
      <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
      {isSaved ? 'Saved' : 'Save for Later'}
    </Button>
  )
}
