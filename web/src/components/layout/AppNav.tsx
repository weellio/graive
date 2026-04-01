'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Profile } from '@/types'
import { TIER_CONFIG } from '@/types'
import { BookOpen, LayoutDashboard, Settings, LogOut, Shield } from 'lucide-react'

interface AppNavProps {
  profile: Profile
  brandName: string
  logoUrl?: string
}

export function AppNav({ profile, brandName, logoUrl }: AppNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const tier = TIER_CONFIG[profile.age_tier]

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : profile.email[0].toUpperCase()

  return (
    <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
              {logoUrl ? (
                <img src={logoUrl} alt={brandName} className="h-8 w-auto" />
              ) : (
                <span style={{ color: 'var(--brand-primary)' }}>{brandName}</span>
              )}
            </Link>
            <div className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button
                  variant={pathname === '/dashboard' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href={`/learn/ai-literacy/${profile.age_tier}`}>
                <Button
                  variant={pathname.startsWith('/learn') ? 'secondary' : 'ghost'}
                  size="sm"
                  className="gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  My Course
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`hidden sm:inline-flex text-xs px-2 py-1 rounded-full font-medium ${tier.bgClass} ${tier.textClass}`}>
              {tier.label}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm">
                  <p className="font-medium">{profile.full_name || 'Learner'}</p>
                  <p className="text-slate-500 text-xs truncate">{profile.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" /> Account
                  </Link>
                </DropdownMenuItem>
                {profile.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="gap-2 cursor-pointer">
                      <Shield className="h-4 w-4" /> Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="gap-2 cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
