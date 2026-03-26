import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-8 block">← Back to home</Link>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy Policy</h1>
      <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

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
          <p className="text-slate-600 leading-relaxed">For learners under 13, we collect minimal data: name, email, and age group only. We do not send marketing emails to under-13 accounts. We encourage providing a parent or guardian email at registration so a trusted adult is informed. Parents may request deletion of their child's account and data at any time by contacting us.</p>
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

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Cookies</h2>
          <p className="text-slate-600 leading-relaxed">We use cookies only for authentication (session management via Supabase). We do not use tracking or advertising cookies.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Contact</h2>
          <p className="text-slate-600">For privacy questions or data requests, contact us at: <a href="mailto:privacy@graive.com" className="text-indigo-600 hover:underline">privacy@graive.com</a></p>
        </section>
      </div>
    </div>
  )
}
