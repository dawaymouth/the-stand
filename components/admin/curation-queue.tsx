'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function CurationQueue({ items }: { items: any[] }) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [category, setCategory] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const supabase = createClient()
  const router = useRouter()
  
  const handleEdit = (item: any) => {
    setEditingId(item.id)
    setNote(item.curator_note || '')
    setCategory(item.category || 'news')
    setIsFeatured(item.is_featured || false)
  }
  
  const handleSave = async (itemId: string) => {
    await supabase
      .from('content_items')
      .update({
        curator_note: note || null,
        category,
        is_featured: isFeatured
      })
      .eq('id', itemId)
    
    setEditingId(null)
    setNote('')
    router.refresh()
  }
  
  return (
    <div className="space-y-4">
      {items.map(item => (
        <Card key={item.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold mb-1">{item.title}</h3>
              <div className="flex gap-2 items-center text-sm text-muted-foreground">
                <span>{item.source_name}</span>
                {item.category && (
                  <Badge variant="outline" className="capitalize">
                    {item.category}
                  </Badge>
                )}
                {item.is_featured && (
                  <Badge className="bg-red-600">Featured</Badge>
                )}
              </div>
              {item.curator_note && (
                <p className="mt-2 text-sm bg-blue-50 p-2 rounded">
                  <strong>Note:</strong> {item.curator_note}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(item)}
            >
              Edit
            </Button>
          </div>
          
          {editingId === item.id && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <div>
                <Label htmlFor={`category-${item.id}`}>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="transfers">Transfers</SelectItem>
                    <SelectItem value="tactics">Tactics</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="womens">Women's Team</SelectItem>
                    <SelectItem value="academy">Academy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor={`note-${item.id}`}>
                  Curator's Note (add context for readers)
                </Label>
                <Textarea
                  id={`note-${item.id}`}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add editorial context..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`featured-${item.id}`}
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <Label htmlFor={`featured-${item.id}`}>
                  Feature this story
                </Label>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => handleSave(item.id)}>
                  Save
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}
