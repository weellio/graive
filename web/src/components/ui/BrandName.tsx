import { cn } from '@/lib/utils'
import type { CSSProperties } from 'react'

interface BrandNameProps {
  name: string
  className?: string
  aiClassName?: string
  style?: CSSProperties
}

/**
 * Renders a brand name with the "AI" substring highlighted in the brand gradient.
 * e.g. "GRAIVE" → "GR<AI>VE" where AI gets the magenta→cyan treatment.
 * Falls back to plain text if "AI" is not present.
 */
export function BrandName({ name, className, aiClassName, style }: BrandNameProps) {
  const idx = name.toUpperCase().indexOf('AI')

  if (idx === -1) {
    return <span className={className} style={style}>{name}</span>
  }

  const before = name.slice(0, idx)
  const ai     = name.slice(idx, idx + 2)
  const after  = name.slice(idx + 2)

  return (
    <span className={className} style={style}>
      {before}
      <span
        className={cn('bg-clip-text text-transparent', aiClassName)}
        style={{ backgroundImage: 'linear-gradient(to right, #e040fb, #00e5ff)' }}
      >
        {ai}
      </span>
      {after}
    </span>
  )
}
