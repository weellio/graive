import { ModuleEditor } from '../_components/ModuleEditor'

export default function NewModulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">New Module</h1>
        <p className="text-sm text-slate-500 mt-0.5">Build a module step-by-step and publish it directly.</p>
      </div>
      <ModuleEditor />
    </div>
  )
}
