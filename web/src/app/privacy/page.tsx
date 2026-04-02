import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-8 block">← Back to home</Link>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-slate-500 mb-8">Last updated: 1 April 2026</p>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Who We Are</h2>
          <p className="text-slate-600 leading-relaxed">GRAIVE operates this educational platform for learners aged 10–18. We are committed to protecting the privacy of all users, with particular care for younger learners.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Information We Collect</h2>
          <ul className="text-slate-600 space-y-2 list-disc pl-5">
            <li><strong>Account data:</strong> name, email address, age group selected at sign-up.</li>
            <li><strong>Parent/guardian email</strong> (optional, for learners under 14).</li>
            <li><strong>Learning activity:</strong> which modules you've completed and progress tracking.</li>
            <li><strong>AI conversations:</strong> when history is enabled, messages you send to the AI tutor are stored per-module to provide context on your next visit.</li>
            <li><strong>Usage data:</strong> daily AI message count for rate-limiting on the free tier.</li>
            <li><strong>Payment data:</strong> handled entirely by Stripe. We never see or store full card numbers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">3. How We Use Your Data</h2>
          <ul className="text-slate-600 space-y-2 list-disc pl-5">
            <li>To provide and improve the learning experience.</li>
            <li>To power the age-appropriate AI tutor on each lesson.</li>
            <li>To track your progress and completion.</li>
            <li>To process subscription payments via Stripe.</li>
            <li>We do not sell your data to third parties.</li>
            <li>We do not use your data for advertising.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Children's Privacy (Under 13)</h2>
          <p className="text-slate-600 leading-relaxed mb-3">For learners selecting the Explorer (ages 10–11) or Builder (ages 12–13) tiers, we require a parent or guardian email address and explicit parental consent at the point of registration.</p>
          <ul className="text-slate-600 space-y-2 list-disc pl-5">
            <li>We collect minimal data for under-13 accounts: name, email, age group, and parent/guardian email only.</li>
            <li>We do not send marketing emails to under-13 accounts or their parents.</li>
            <li>When a child registers, we automatically send an informational email to the parent/guardian explaining what the platform is, what data is collected, and how to request deletion.</li>
            <li>Parents or guardians may request full deletion of their child's account and all associated data at any time by contacting <a href="mailto:privacy@graive.com" className="text-indigo-600 hover:underline">privacy@graive.com</a>. We will action this within 7 days.</li>
            <li>We do not knowingly collect data from children without verifiable parental consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Data Storage & Security</h2>
          <p className="text-slate-600 leading-relaxed">Data is stored in Supabase (PostgreSQL), with row-level security enforced — each user can only access their own data. All data is encrypted in transit (TLS). We use Supabase's built-in auth system for secure password handling (bcrypt hashing).</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">6. AI Conversations</h2>
          <p className="text-slate-600 leading-relaxed">Conversations with the AI tutor may be sent to our AI provider (Anthropic, OpenAI, or Google, depending on platform configuration) to generate responses. These providers have their own privacy policies. Conversation content is not used to train AI models under current agreements. You can disable conversation history from your account, or an admin can disable it platform-wide.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Your Rights</h2>
          <ul className="text-slate-600 space-y-2 list-disc pl-5">
            <li>Request a copy of your data.</li>
            <li>Request correction of inaccurate data.</li>
            <li>Request deletion of your account and all associated data.</li>
            <li>Withdraw consent at any time by deleting your account.</li>
          </ul>
          <p className="text-slate-600 mt-3">To exercise these rights, contact us at the email below.</p>
        </section>

        <section id="cookies">
          <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Cookies</h2>
          <p className="text-slate-600 leading-relaxed mb-3">We use the minimum cookies necessary to operate the platform. We do not use advertising cookies, tracking pixels, or third-party analytics cookies.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600 border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 pr-4 font-medium text-slate-700">Cookie</th>
                  <th className="text-left py-2 pr-4 font-medium text-slate-700">Purpose</th>
                  <th className="text-left py-2 font-medium text-slate-700">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">sb-*</td>
                  <td className="py-2 pr-4">Authentication session (Supabase). Keeps you signed in.</td>
                  <td className="py-2">Session / 1 hour</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-mono text-xs">graive_cookie_consent</td>
                  <td className="py-2 pr-4">Remembers that you have seen and responded to this cookie notice.</td>
                  <td className="py-2">Persistent (localStorage)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-slate-500 text-sm mt-3">The consent preference is stored in your browser's localStorage, not as a cookie, so it never leaves your device.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Contact</h2>
          <p className="text-slate-600">For privacy questions or data requests, contact us at: <a href="mailto:privacy@graive.com" className="text-indigo-600 hover:underline">privacy@graive.com</a></p>
        </section>
      </div>
    </div>
  )
}
