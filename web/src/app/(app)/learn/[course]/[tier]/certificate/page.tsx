import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TIER_CONFIG, type AgeTier } from '@/types'
import { getSiteSettings } from '@/lib/config/site'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { PrintButton } from './_components/PrintButton'

interface PageProps {
  params: Promise<{ course: string; tier: string }>
}

export default async function CertificatePage({ params }: PageProps) {
  const { course, tier } = await params
  const tierConfig = TIER_CONFIG[tier as AgeTier]
  if (!tierConfig) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const [{ data: profile }, { data: modules }, { data: progressRows }, settings] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('modules').select('id').eq('tier_slug', tier).eq('enabled', true),
    supabase.from('progress').select('module_id, completed_at').eq('user_id', user.id),
    getSiteSettings(),
  ])

  const completedIds = new Set((progressRows ?? []).map(p => p.module_id))
  const allComplete = (modules ?? []).every(m => completedIds.has(m.id))
  if (!allComplete) redirect(`/learn/${course}/${tier}`)

  const completionDates = (progressRows ?? [])
    .filter(p => (modules ?? []).some(m => m.id === p.module_id))
    .map(p => new Date(p.completed_at).getTime())
  const completedOn = completionDates.length
    ? new Date(Math.max(...completionDates))
    : new Date()

  const brandName = settings.brand_name || 'LearnAI'
  const firstName = profile?.full_name?.split(' ')[0] || 'Learner'
  const fullName = profile?.full_name || 'Learner'

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link href={`/learn/${course}/${tier}`}>
          <Button variant="ghost" className="gap-2 text-slate-600">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </Link>
        <PrintButton />
      </div>

      <div
        id="certificate"
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
        style={{ borderTop: `8px solid ${tierConfig.color}` }}
      >
        <div className="px-12 pt-10 pb-6 text-center" style={{ backgroundColor: tierConfig.color + '0f' }}>
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 mb-1">Certificate of Completion</p>
          <h1 className="text-3xl font-bold text-slate-800">{brandName}</h1>
        </div>

        <div className="px-12 py-8 text-center space-y-6">
          <p className="text-slate-500 text-base">This is to certify that</p>
          <div>
            <p className="text-4xl font-bold" style={{ color: tierConfig.color }}>
              {fullName}
            </p>
          </div>
          <p className="text-slate-600 text-base max-w-md mx-auto leading-relaxed">
            has successfully completed all modules in the
          </p>
          <div
            className="inline-block px-8 py-3 rounded-2xl"
            style={{ backgroundColor: tierConfig.color + '15', border: `2px solid ${tierConfig.color}` }}
          >
            <p className="text-xl font-bold" style={{ color: tierConfig.color }}>
              {tierConfig.label} Level
            </p>
            <p className="text-sm text-slate-500">{tierConfig.ageRange} · {tierConfig.theme}</p>
          </div>
          <div className="flex items-center justify-center gap-2 text-amber-500">
            {'⭐'.repeat(Math.min((modules ?? []).length, 6))}
          </div>
          <p className="text-sm text-slate-400">
            Completed on {completedOn.toLocaleDateString('en-GB', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>

        <div
          className="px-12 py-6 flex items-center justify-between border-t"
          style={{ borderColor: tierConfig.color + '30' }}
        >
          <div>
            <p className="text-xs text-slate-400">Issued by</p>
            <p className="text-sm font-semibold text-slate-700">{brandName}</p>
          </div>
          <div
            className="h-12 w-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
            style={{ backgroundColor: tierConfig.color }}
          >
            {firstName[0]}
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">XP Earned</p>
            <p className="text-sm font-semibold text-amber-600">
              {(modules ?? []).length * 100} XP ⭐
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-6 text-center print:hidden">
        <p className="text-sm text-slate-400">Take a screenshot to save or share your certificate!</p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
          <Link href={`/learn/${course}/${tier}`}>
            <Button variant="ghost">Review Modules</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
