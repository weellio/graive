import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TIER_CONFIG } from '@/types'
import { getSiteSettings } from '@/lib/config/site'
import { MeshGradient } from '@/components/landing/MeshGradient'
import { TextScramble } from '@/components/landing/TextScramble'
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  Newspaper,
  Brain,
  Shield,
  Bot,
  Layers,
} from 'lucide-react'

export default async function LandingPage() {
  const settings = await getSiteSettings()
  const brandName = settings.brand_name || 'GRAIVE'
  const logoSrc = settings.brand_logo_url || '/logo.svg'

  const tiers = [
    { key: 'explorer' as const, headline: 'Talking to Computers', free: true },
    { key: 'builder' as const, headline: 'Understanding the Machine', free: false },
    { key: 'thinker' as const, headline: 'Critical AI Citizenship', free: false },
    { key: 'innovator' as const, headline: 'Build with AI', free: false },
    { key: 'creator' as const, headline: 'Ship Real Things with AI', free: false },
  ]

  const features = [
    {
      icon: Brain,
      title: 'AI Literacy from the Ground Up',
      description:
        'Not just "use AI" — understand how it thinks, where it fails, and how to direct it. Skills that compound for life.',
    },
    {
      icon: Bot,
      title: 'Built-In AI Tutor on Every Lesson',
      description:
        'Each module has an embedded AI assistant scoped to that lesson. Kids ask questions, get unstuck, go deeper.',
    },
    {
      icon: Shield,
      title: 'Age-Appropriate Safeguards',
      description:
        'Explorer tier is locked to lesson topics only. Older tiers progressively open. No surprises for parents.',
    },
    {
      icon: Layers,
      title: 'Prompt Engineering as a Core Skill',
      description:
        'From "what do I want?" to full prompt chains and automations — a structured progression across all four tiers.',
    },
    {
      icon: Newspaper,
      title: 'Connected to the Live AI Conversation',
      description:
        `${brandName}'s daily AI news feed keeps learners current. The world moves fast — so does the curriculum.`,
    },
    {
      icon: Zap,
      title: 'Do, Not Just Read',
      description:
        'Every module ends with a real challenge. Kids compete, build, and create — not just consume.',
    },
  ]

  const proFeatures = [
    'All 4 learning tiers (Builder → Innovator)',
    'Unlimited AI chat sessions',
    'Full conversation history',
    'Progress tracking across all modules',
    'New modules added regularly',
  ]

  return (
    <div className="min-h-screen bg-[#08080f] text-white">

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08080f]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Image
              src={logoSrc}
              alt={brandName}
              width={32}
              height={32}
              className="object-contain"
            />
            <span
              className="font-bold tracking-widest text-lg uppercase"
              style={{ color: '#e040fb' }}
            >
              {brandName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://reddit.com/r/graive" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white text-xs">
                r/graive
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white text-xs">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="sm"
                className="text-white text-xs"
                style={{ backgroundColor: '#e040fb' }}
              >
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <MeshGradient className="absolute inset-0 w-full h-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 flex flex-col lg:flex-row items-center gap-12">
          {/* Text */}
          <div className="flex-1 text-center lg:text-left">
            <Badge
              className="mb-5 border text-xs tracking-widest uppercase font-mono"
              style={{
                backgroundColor: 'rgba(224,64,251,0.1)',
                borderColor: 'rgba(224,64,251,0.3)',
                color: '#e040fb',
              }}
            >
              <TextScramble text="Generative Robotic AI in Virtual Environments" trigger="load" duration={1800} />
            </Badge>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
              Where imagination
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to right, #e040fb, #00e5ff)',
                }}
              >
                meets intelligence
              </span>
            </h1>
            <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-xl">
              Prepare to be amazed by the convergence of AI and human potential.
              A world where the boundaries of what&apos;s possible are continually redefined —
              and your kids are the ones redefining them.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 lg:justify-start justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="text-white text-base px-8 h-12"
                  style={{ backgroundColor: '#e040fb' }}
                >
                  Start Free — Explorer Level
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link href="https://reddit.com/r/graive" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-12 border-white/20 text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  Daily AI News → r/graive
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Explorer Level is free · No credit card required
            </p>
          </div>

          {/* Logo large */}
          <div className="shrink-0 flex items-center justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 rounded-full blur-[60px] opacity-30"
                style={{ backgroundColor: '#e040fb' }}
              />
              <Image
                src={logoSrc}
                alt={brandName}
                width={340}
                height={340}
                className="relative object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tier strip */}
      <section className="border-y border-white/10 bg-white/2">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-xs text-slate-500 uppercase tracking-widest text-center mb-6">
            5 Levels · Ages 10+
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {tiers.map(({ key, headline, free }) => {
              const cfg = TIER_CONFIG[key]
              return (
                <div
                  key={key}
                  className="rounded-xl border border-white/10 bg-white/3 p-4 hover:bg-white/6 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: cfg.color }}
                    />
                    {free ? (
                      <span className="text-xs font-medium" style={{ color: '#00e5ff' }}>Free</span>
                    ) : (
                      <span className="text-xs text-slate-500">Pro</span>
                    )}
                  </div>
                  <p className="font-semibold text-white text-sm">{cfg.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{cfg.ageRange}</p>
                  <p className="text-xs text-slate-400 mt-2 leading-snug">{headline}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Not another coding course
        </h2>
        <p className="text-slate-400 text-center mb-12">
          AI literacy is the new foundational skill. {brandName} teaches it properly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(f => (
            <div
              key={f.title}
              className="rounded-xl border border-white/10 bg-white/3 p-5 hover:border-[#e040fb]/30 hover:bg-white/6 transition-colors group"
            >
              <div
                className="h-9 w-9 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: 'rgba(224,64,251,0.15)' }}
              >
                <f.icon className="h-5 w-5" style={{ color: '#e040fb' }} />
              </div>
              <p className="font-semibold text-white text-sm mb-1.5">{f.title}</p>
              <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prompt progression */}
      <section className="border-y border-white/10 bg-white/2">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">
            The Prompt Engineering Progression
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-left">
            {[
              { age: '10–11', tier: 'Explorer', skill: 'Intention', q: '"What do I want?"' },
              { age: '12–13', tier: 'Builder', skill: 'Clarity', q: '"How do I explain this?"' },
              { age: '14–15', tier: 'Thinker', skill: 'Structure', q: '"How do I guide reasoning?"' },
              { age: '16–18', tier: 'Innovator', skill: 'Systems', q: '"How do I chain prompts?"' },
              { age: '18+', tier: 'Creator', skill: 'Mastery', q: '"How do I build and ship?"' },
            ].map(item => (
              <div
                key={item.tier}
                className="rounded-lg border border-white/10 bg-white/3 p-4"
              >
                <p className="text-xs text-slate-500 mb-1">{item.age}</p>
                <p className="font-bold text-sm" style={{ color: '#e040fb' }}>{item.skill}</p>
                <p className="text-slate-400 text-xs mt-1 italic">{item.q}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-2xl font-bold text-white text-center mb-2">Simple pricing</h2>
        <p className="text-slate-400 text-center mb-10">Start free. Upgrade when you're ready.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Free */}
          <div className="rounded-xl border border-white/10 bg-white/3 p-7">
            <p className="font-semibold text-white text-lg mb-1">Free</p>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-slate-500">forever</span>
            </div>
            <ul className="space-y-2.5 mb-6">
              {['Explorer Level (Ages 10–11)', '10 AI messages / day', 'Progress tracking'].map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#00e5ff' }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup">
              <Button
                variant="outline"
                className="w-full border-white/20 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                Start for Free
              </Button>
            </Link>
          </div>

          {/* Pro */}
          <div
            className="rounded-xl p-7 relative"
            style={{
              border: '2px solid rgba(224,64,251,0.5)',
              background: 'rgba(224,64,251,0.06)',
            }}
          >
            <div className="absolute -top-3 left-6">
              <Badge
                className="text-white border-0 flex items-center gap-1 px-3"
                style={{ backgroundColor: '#e040fb' }}
              >
                <Star className="h-3 w-3" /> Most Popular
              </Badge>
            </div>
            <p className="font-semibold text-white text-lg mb-1">Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$9.99</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-xs mb-5" style={{ color: '#e040fb' }}>Or $79.99/year — 2 months free</p>
            <ul className="space-y-2.5 mb-6">
              {proFeatures.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: '#00e5ff' }} />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/signup">
              <Button
                className="w-full text-white"
                style={{ backgroundColor: '#e040fb' }}
              >
                <Zap className="h-4 w-4 mr-2" /> Get Pro Access
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Subreddit CTA */}
      <section className="border-t border-white/10 bg-white/2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Stay Current</p>
          <h3 className="text-xl font-bold text-white mb-2">
            100 AI sources. One daily digest.
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            The {brandName} subreddit compiles the most important AI news every single day.
            Follow along while your kids learn the skills to understand it.
          </p>
          <Link href="https://reddit.com/r/graive" target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              className="border-white/20 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Visit r/graive <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Image src={logoSrc} alt={brandName} width={24} height={24} className="object-contain" />
            <span className="font-bold tracking-widest uppercase text-xs" style={{ color: '#e040fb' }}>
              {brandName}
            </span>
          </div>
          <p>© {new Date().getFullYear()} {brandName} · Generative Robotic AI in Virtual Environments</p>
          <div className="flex gap-4">
            <Link href="/auth/signin" className="hover:text-slate-300">Sign In</Link>
            <Link href="/auth/signup" className="hover:text-slate-300">Sign Up</Link>
            <Link href="/privacy" className="hover:text-slate-300">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300">Terms</Link>
            <Link
              href="https://reddit.com/r/graive"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-300"
            >
              Reddit
            </Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
