'use client'

import { useEffect, useRef, useState } from 'react'

type SparkState = 'idle' | 'thinking' | 'responding'

interface Props {
  state: SparkState
  color?: string
}

const CORNERS = [
  { bottom: '12px', right: '12px', left: 'auto', top: 'auto' },
  { bottom: '12px', left: '12px',  right: 'auto', top: 'auto' },
  { top: '12px',   right: '12px', left: 'auto', bottom: 'auto' },
  { top: '12px',   left: '12px',  right: 'auto', bottom: 'auto' },
]

export function SparkCompanion({ state, color = '#6366f1' }: Props) {
  const [corner, setCorner]   = useState(0)
  const [straight, setStraight] = useState(false)
  const [visible, setVisible]  = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Wander to a new random corner periodically
  useEffect(() => {
    function wander() {
      // straighten, pause, pick new corner, un-straighten
      setStraight(true)
      timerRef.current = setTimeout(() => {
        setVisible(false)
        timerRef.current = setTimeout(() => {
          setCorner(prev => {
            let next = prev
            while (next === prev) next = Math.floor(Math.random() * CORNERS.length)
            return next
          })
          setVisible(true)
          setStraight(false)
          timerRef.current = setTimeout(wander, 4000 + Math.random() * 6000)
        }, 200)
      }, 600)
    }

    timerRef.current = setTimeout(wander, 3000 + Math.random() * 3000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  // Animate when thinking starts
  useEffect(() => {
    if (state === 'thinking') setStraight(true)
    if (state === 'responding') {
      setStraight(false)
    }
  }, [state])

  const pos = CORNERS[corner]

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        ...pos,
        width: 36,
        height: 36,
        transition: 'opacity 0.2s ease',
        opacity: visible ? 1 : 0,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <svg
        viewBox="0 0 36 50"
        width="36"
        height="50"
        style={{
          transition: 'transform 0.5s cubic-bezier(.34,1.56,.64,1), filter 0.3s ease',
          transform: straight
            ? 'rotate(0deg) scaleY(0.7)'
            : state === 'thinking'
            ? 'rotate(-5deg) scaleY(1)'
            : 'rotate(-12deg) scaleY(1)',
          filter: state === 'thinking'
            ? `drop-shadow(0 0 6px ${color})`
            : `drop-shadow(0 2px 4px ${color}88)`,
        }}
      >
        {/* Lightning bolt body */}
        <polygon
          points="22,2 8,22 18,22 14,48 28,26 18,26"
          fill={color}
          style={{
            transition: 'points 0.5s ease',
          }}
        />
        {/* Left eye */}
        <circle
          cx={straight ? 16 : 14}
          cy={straight ? 18 : 16}
          r="2.5"
          fill="white"
          style={{ transition: 'all 0.4s ease' }}
        />
        {/* Right eye */}
        <circle
          cx={straight ? 22 : 20}
          cy={straight ? 18 : 15}
          r="2.5"
          fill="white"
          style={{ transition: 'all 0.4s ease' }}
        />
        {/* Pupils — look up when thinking */}
        <circle
          cx={straight ? 16 : 14}
          cy={straight ? 17.5 : (state === 'thinking' ? 14.5 : 15.5)}
          r="1.2"
          fill={color}
          style={{ transition: 'all 0.3s ease' }}
        />
        <circle
          cx={straight ? 22 : 20}
          cy={straight ? 17.5 : (state === 'thinking' ? 13.5 : 14.5)}
          r="1.2"
          fill={color}
          style={{ transition: 'all 0.3s ease' }}
        />
      </svg>

      {/* Thinking dots */}
      {state === 'thinking' && (
        <div style={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 3,
        }}>
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: color,
              display: 'inline-block',
              animation: `spark-dot 1s ${i * 0.2}s ease-in-out infinite`,
            }} />
          ))}
        </div>
      )}
    </div>
  )
}
