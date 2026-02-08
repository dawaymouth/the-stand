import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/auth/user-menu'
import { Newspaper } from 'lucide-react'

export async function Navigation() {
  const supabase = await createClient()
  const {  { user } } = await supabase.auth.getUser()

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Newspaper className="h-6 w-6 text-red-600" />
            <span>Arsenal Superfan</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/saved">
                  <Button variant="ghost">Reading List</Button>
                </Link>
                <UserMenu user={user} />
              </>
            ) : (
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
