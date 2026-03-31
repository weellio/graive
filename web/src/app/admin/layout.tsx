import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { LayoutDashboard, BookOpen, Palette, Bot, Users, Package, ArrowLeft, Video, Newspaper } from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/modules', label: 'Modules', icon: BookOpen },
  { href: '/admin/current-events', label: 'Current Events', icon: Newspaper },
  { href: '/admin/video-scripts', label: 'Video Scripts', icon: Video },
  { href: '/admin/curriculum', label: 'Curriculum', icon: Package },
  { href: '/admin/theme', label: 'Theme', icon: Palette },
  { href: '/admin/ai', label: 'AI Config', icon: Bot },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
                Admin Panel
              </p>
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors mb-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
              <div className="border-t border-slate-100 my-2" />
              <nav className="space-y-0.5">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
