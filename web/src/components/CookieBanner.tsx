'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const COOKIE_KEY = 'graive_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Only show if they haven't already responded
    if (!localStorage.getItem(COOKIE_KEY)) {
      // Small delay so it doesn't flash on every page load before hydration settles
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(COOKIE_KEY, 'essential')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-2xl shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground mb-0.5">We use cookies</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We use essential cookies to keep you signed in. We do not use advertising or tracking cookies.{' '}
            <Link href="/privacy#cookies" className="underline hover:text-foreground">
              Learn more
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={decline}
            className="text-xs"
          >
            Essential only
          </Button>
          <Button
            size="sm"
            onClick={accept}
            className="text-xs"
          >
            Accept all
          </Button>
          <button
            onClick={decline}
            className="p-1 text-muted-foreground hover:text-muted-foreground rounded"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
