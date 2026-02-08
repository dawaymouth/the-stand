import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CurationQueue } from '@/components/admin/curation-queue'

export default async function AdminPage() {
  const supabase = await createClient()
  
  const {  { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const {  profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const {  items } = await supabase
    .from('content_items')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(50)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Curation Queue</h1>
      <CurationQueue items={items || []} />
    </main>
  )
}
