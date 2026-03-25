import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/config/site'
import { AppNav } from '@/components/layout/AppNav'
import type { Profile } from '@/types'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/signin')

  const [{ data: profile }, settings] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    getSiteSettings(),
  ])

  if (!profile) redirect('/auth/signin')

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <AppNav
        profile={profile as Profile}
        brandName={settings.brand_name}
        logoUrl={settings.brand_logo_url || undefined}
      />
      <main className="flex-1">{children}</main>
    </div>
  )
}
