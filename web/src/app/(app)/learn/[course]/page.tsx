import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG, type AgeTier } from '@/types'

const TIER_SLUGS = Object.keys(TIER_CONFIG) as AgeTier[]

interface PageProps {
  params: Promise<{ course: string }>
}

/**
 * /learn/[course]
 * - Old URLs like /learn/explorer → redirect to /learn/ai-literacy/explorer
 * - New URLs like /learn/ai-literacy → redirect to user's tier within that course
 */
export default async function LearnCoursePage({ params }: PageProps) {
  const { course } = await params

  if (TIER_SLUGS.includes(course as AgeTier)) {
    redirect(`/learn/ai-literacy/${course}`)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const { data: profile } = await supabase.from('profiles').select('age_tier').eq('id', user.id).single()
  const userTier = (profile?.age_tier as AgeTier) || 'explorer'

  redirect(`/learn/${course}/${userTier}`)
}
