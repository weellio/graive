import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ModuleEditor } from '../../_components/ModuleEditor'
import type { Module } from '@/types'

export default async function EditModulePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!module) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Edit Module</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          <span className="font-mono text-xs">{module.slug}</span> · {module.tier_slug}
        </p>
      </div>
      <ModuleEditor existing={module as Module} />
    </div>
  )
}
