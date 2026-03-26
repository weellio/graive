import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <Link href="/" className="text-sm text-slate-500 hover:text-slate-700 mb-8 block">← Back to home</Link>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Terms of Service</h1>
      <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

      <div className="prose prose-slate max-w-none space-y-6">
        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Acceptance</h2>
          <p className="text-slate-600 leading-relaxed">By creating an account on GRAIVE, you agree to these Terms of Service. If you are under 13, a parent or guardian must agree on your behalf. If you do not agree, do not use the platform.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">2. Accounts</h2>
          <ul className="text-slate-600 space-y-2 list-disc pl-5">
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for keeping your password secure.</li>
            <li>One account per person. Do not share your account.</li>
            <li>Accounts for users under 13 require parental awareness and consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Subscriptions & Payments</h2>
          <ul className="text-slate-600 space-y-2 list-disc pl-5">
            <li>The Explorer tier is free. Higher tiers require a paid subscription.</li>
            <li>Subscriptions are billed monthly or annually as selected.</li>
            <li>Payments are processed by Stripe. Cancellation takes effect at end of billing period.</li>
            <li>Refunds are handled at our discretion. Contact us within 7 days of charge if you have an issue.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">4. Acceptable Use</h2>
          <p className="text-slate-600 mb-3">You agree not to:</p>
          <ul className="text-slate-600 space-y-2 list-disc pl-5">
            <li>Attempt to circumvent the AI content safeguards.</li>
            <li>Use the AI chat to generate harmful, illegal, or inappropriate content.</li>
            <li>Share account credentials or resell access.</li>
            <li>Scrape or copy course content for redistribution.</li>
            <li>Reverse-engineer or attempt to access system prompts.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">5. Content</h2>
          <p className="text-slate-600 leading-relaxed">Course content is owned by GRAIVE. You may use it for your personal learning only. The AI-generated responses during lessons are for educational purposes. We make no guarantee of accuracy of AI responses and encourage critical evaluation.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">6. Termination</h2>
          <p className="text-slate-600 leading-relaxed">We may suspend or terminate accounts that violate these terms. You may delete your account at any time. Upon termination, your data will be deleted in accordance with our Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">7. Limitation of Liability</h2>
          <p className="text-slate-600 leading-relaxed">GRAIVE is provided "as is." We are not liable for any damages arising from use of the platform, inaccuracies in AI-generated content, or service interruptions. Our liability is limited to the amount you paid us in the last 3 months.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">8. Changes</h2>
          <p className="text-slate-600 leading-relaxed">We may update these terms. Material changes will be communicated by email. Continued use after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-800 mb-3">9. Contact</h2>
          <p className="text-slate-600">Questions? Email <a href="mailto:hello@graive.com" className="text-indigo-600 hover:underline">hello@graive.com</a></p>
        </section>
      </div>
    </div>
  )
}
