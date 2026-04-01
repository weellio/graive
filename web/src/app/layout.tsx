import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { getSiteSettings, buildCssVars } from '@/lib/config/site'
import CookieBanner from '@/components/CookieBanner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    title: settings.brand_name,
    description: `Learn AI and build skills for the modern world with ${settings.brand_name}`,
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings()
  const cssVars = buildCssVars(settings)

  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <style dangerouslySetInnerHTML={{ __html: cssVars }} />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {children}
        <Toaster richColors />
        <CookieBanner />
      </body>
    </html>
  )
}
