'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import Link from 'next/link'
import { CreditCard } from 'lucide-react'

export default function AccountPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setEmail(user.email ?? '')
      supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) setFullName(data.full_name ?? '')
        })
    })
  }, [])

  async function saveName(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), updated_at: new Date().toISOString() })
      .eq('id', user.id)
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Name updated')
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setChangingPassword(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setChangingPassword(false)
    if (error) toast.error(error.message)
    else {
      toast.success('Password updated')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Account</h1>
        <p className="text-slate-500 mt-1">Manage your profile and security settings.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
          <CardDescription>Update your display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveName} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} disabled className="bg-slate-50 text-slate-500" />
              <p className="text-xs text-slate-400">Email cannot be changed here. Contact support if needed.</p>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription>Choose a new password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={changePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="At least 8 characters"
                minLength={8}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Same as above"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={changingPassword || !newPassword}>
              {changingPassword ? 'Updating…' : 'Update password'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Billing shortcut */}
      <Card>
        <CardContent className="pt-5 flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-800 text-sm">Subscription & Billing</p>
            <p className="text-xs text-slate-500 mt-0.5">Manage your plan and payment details.</p>
          </div>
          <Link href="/account/billing">
            <Button variant="outline" size="sm" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Manage
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
