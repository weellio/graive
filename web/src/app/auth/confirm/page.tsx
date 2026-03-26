import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Mail } from 'lucide-react'

export default function ConfirmPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-3">
            <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
              <Mail className="h-7 w-7 text-indigo-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
          <CardDescription>
            We sent you a confirmation link. Click it to activate your account, then come back and sign in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-slate-500">
            Didn't get it? Check your spam folder, or try signing up again with the same email.
          </p>
          <Link href="/auth/signin">
            <Button className="w-full">Go to sign in</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" className="w-full">Back to sign up</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
