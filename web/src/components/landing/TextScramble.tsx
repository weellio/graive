'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*'

function scramble(target: string, progress: number): string {
  return target
    .split('')
    .map((char, i) => {
      if (char === ' ') return ' '
      const threshold = (i / target.length) * 0.7 + 0.15
      if (progress >= threshold) return char
      return CHARS[Math.floor(Math.random() * CHARS.length)]
    })
    .join('')
}

interface TextScrambleProps {
  text: string
  trigger?: 'load' | 'intersect'
  duration?: number
  className?: string
}

export function TextScramble({
  text,
  trigger = 'load',
  duration = 1400,
  className,
}: TextScrambleProps) {
  const [display, setDisplay] = useState(() =>
    text.split('').map(c => (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)])).join('')
  )
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  function runScramble() {
    if (started.current) return
    started.current = true
    const start = performance.now()

    function frame(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      setDisplay(scramble(text, progress))
      if (progress < 1) requestAnimationFrame(frame)
      else setDisplay(text)
    }
    requestAnimationFrame(frame)
  }

  useEffect(() => {
    if (trigger === 'load') {
      const t = setTimeout(runScramble, 120)
      return () => clearTimeout(t)
    }

    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) runScramble() },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <span ref={ref} className={className} aria-label={text}>
      {display}
    </span>
  )
}
