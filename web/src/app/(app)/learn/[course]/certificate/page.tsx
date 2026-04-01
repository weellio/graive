import { redirect } from 'next/navigation'
import { TIER_CONFIG, type AgeTier } from '@/types'

const TIER_SLUGS = Object.keys(TIER_CONFIG) as AgeTier[]

interface PageProps {
  params: Promise<{ course: string }>
}

/**
 * /learn/[course]/certificate
 * Legacy redirect: /learn/explorer/certificate → /learn/ai-literacy/explorer/certificate
 */
export default async function LegacyCertificatePage({ params }: PageProps) {
  const { course } = await params

  if (TIER_SLUGS.includes(course as AgeTier)) {
    redirect(`/learn/ai-literacy/${course}/certificate`)
  }

  // /learn/ai-literacy/certificate doesn't make sense — go to dashboard
  redirect('/dashboard')
}
