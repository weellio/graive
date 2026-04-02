import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/config/site'
import { ModulePage } from '@/components/curriculum/ModulePage'
import { TIER_CONFIG, type AgeTier, type Module, type Conversation, type Profile } from '@/types'
import path from 'path'
import fs from 'fs/promises'

interface PageProps {
  params: Promise<{ course: string; tier: string; module: string }>
}

export default async function LearnModulePage({ params }: PageProps) {
  const { course, tier, module: moduleSlug } = await params

  const tierConfig = TIER_CONFIG[tier as AgeTier]
  if (!tierConfig) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const today = new Date().toISOString().slice(0, 10)

  const [{ data: profile }, { data: moduleData }, { data: subscription }, settings] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('modules')
        .select('*')
        .eq('tier_slug', tier)
        .eq('slug', moduleSlug)
        .eq('enabled', true)
        .or(`publish_date.is.null,publish_date.lte.${today}`)
        .single(),
      supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
      getSiteSettings(),
    ])

  if (!moduleData) notFound()

  const isSubscribed = ['active','trialing','past_due','beta'].includes(subscription?.status ?? '')

  // Free gating: first module (lowest order_index) per tier is always accessible
  const { data: firstModule } = await supabase
    .from('modules')
    .select('id')
    .eq('tier_slug', tier)
    .eq('enabled', true)
    .order('order_index')
    .limit(1)
    .single()

  const isFirstModule = firstModule?.id === moduleData.id
  if (!isSubscribed && !isFirstModule) {
    redirect('/account/billing?reason=module-locked')
  }

  // Load markdown content
  let content = ''
  if ((moduleData as unknown as { content?: string }).content) {
    content = (moduleData as unknown as { content: string }).content
  } else {
    try {
      const filePath = path.join(process.cwd(), '..', 'curriculum', moduleData.content_path)
      content = await fs.readFile(filePath, 'utf-8')
    } catch {
      content = `# ${moduleData.title}\n\n${moduleData.description || ''}\n\n*Content coming soon.*`
    }
  }

  // Load conversation history if enabled
  let history: Conversation[] = []
  if (settings.conversation_history_enabled === 'true') {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', user.id)
      .eq('module_id', moduleData.id)
      .order('created_at', { ascending: true })
      .limit(50)
    history = (data || []) as Conversation[]
  }

  const { data: progressRow } = await supabase
    .from('progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('module_id', moduleData.id)
    .single()

  const { data: allModules } = await supabase
    .from('modules')
    .select('id, slug, title, order_index')
    .eq('tier_slug', tier)
    .eq('enabled', true)
    .order('order_index')

  const currentIdx = (allModules || []).findIndex(m => m.slug === moduleSlug)
  const prevModule = currentIdx > 0 ? allModules![currentIdx - 1] : null
  const nextModule = currentIdx < (allModules?.length ?? 0) - 1 ? allModules![currentIdx + 1] : null

  return (
    <ModulePage
      module={moduleData as Module}
      profile={profile as Profile}
      content={content}
      history={history}
      isCompleted={!!progressRow}
      tier={tier as AgeTier}
      courseSlug={course}
      prevModule={prevModule}
      nextModule={nextModule}
      historyEnabled={settings.conversation_history_enabled === 'true'}
    />
  )
}
