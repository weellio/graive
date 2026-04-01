import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // No email configured — silently succeed (parent email is informational only)
    return NextResponse.json({ ok: true })
  }

  const { childName, childEmail, parentEmail, tier } = await req.json()

  if (!parentEmail || !childName) {
    return NextResponse.json({ ok: true })
  }

  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || 'GRAIVE'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://graive.com'
  const fromEmail = process.env.RESEND_FROM_EMAIL || `no-reply@${new URL(appUrl).hostname}`

  const resend = new Resend(apiKey)

  await resend.emails.send({
    from: `${brandName} <${fromEmail}>`,
    to: parentEmail,
    subject: `${childName} just created a ${brandName} learning account`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: sans-serif; color: #334155; max-width: 560px; margin: 0 auto; padding: 24px;">

  <h2 style="color: #1e293b; margin-bottom: 4px;">Hi there,</h2>
  <p style="color: #64748b; margin-top: 0;">You're receiving this because <strong>${childName}</strong> listed you as their parent or guardian when creating a ${brandName} account.</p>

  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 24px 0;">
    <p style="margin: 0 0 8px 0;"><strong>Account details:</strong></p>
    <p style="margin: 4px 0; color: #64748b;">Learner name: ${childName}</p>
    <p style="margin: 4px 0; color: #64748b;">Learner email: ${childEmail}</p>
    <p style="margin: 4px 0; color: #64748b;">Age group: ${tier} level</p>
  </div>

  <p><strong>What is ${brandName}?</strong><br>
  ${brandName} is an AI literacy course that teaches kids how AI works, how to use it safely, and how to think critically about technology. Lessons are self-paced and age-appropriate.</p>

  <p><strong>What does the AI chat do?</strong><br>
  Each lesson includes an AI tutor that is strictly limited to the lesson topic. It uses age-appropriate language and refuses off-topic requests. No conversation history is shared between users or accessible to us.</p>

  <p><strong>What data do we collect?</strong><br>
  Name, email, and age group only. We do not send marketing emails to under-13 accounts. Full details in our <a href="${appUrl}/privacy" style="color: #6366f1;">Privacy Policy</a>.</p>

  <p><strong>Want to remove the account?</strong><br>
  Contact us at <a href="mailto:privacy@${new URL(appUrl).hostname}" style="color: #6366f1;">privacy@${new URL(appUrl).hostname}</a> and we'll delete it along with all associated data.</p>

  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
  <p style="color: #94a3b8; font-size: 13px;">You received this email because ${childName} provided your address at sign-up. If this was a mistake, you can ignore this email — no action is needed.</p>

</body>
</html>
    `.trim(),
  })

  return NextResponse.json({ ok: true })
}
