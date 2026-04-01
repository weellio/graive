'use client'

import { useEffect, useRef } from 'react'

interface Blob {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  color: string
}

const BLOBS = [
  { color: 'rgba(224,64,251,0.22)', speed: 0.35 },
  { color: 'rgba(0,229,255,0.16)',  speed: 0.28 },
  { color: 'rgba(168,64,220,0.18)', speed: 0.40 },
  { color: 'rgba(0,180,255,0.12)',  speed: 0.22 },
  { color: 'rgba(224,64,180,0.14)', speed: 0.32 },
]

export function MeshGradient({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const blobs: Blob[] = BLOBS.map(b => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * b.speed,
      vy: (Math.random() - 0.5) * b.speed,
      r: 0.32 + Math.random() * 0.22,
      color: b.color,
    }))

    let raf: number

    function resize() {
      canvas!.width  = canvas!.offsetWidth  * window.devicePixelRatio
      canvas!.height = canvas!.offsetHeight * window.devicePixelRatio
    }
    resize()
    window.addEventListener('resize', resize)

    function draw() {
      const w = canvas!.width
      const h = canvas!.height
      ctx!.clearRect(0, 0, w, h)

      for (const b of blobs) {
        b.x += b.vx / w
        b.y += b.vy / h
        if (b.x < -0.2 || b.x > 1.2) b.vx *= -1
        if (b.y < -0.2 || b.y > 1.2) b.vy *= -1

        const grd = ctx!.createRadialGradient(
          b.x * w, b.y * h, 0,
          b.x * w, b.y * h, b.r * Math.max(w, h)
        )
        grd.addColorStop(0, b.color)
        grd.addColorStop(1, 'transparent')
        ctx!.globalCompositeOperation = 'lighter'
        ctx!.fillStyle = grd
        ctx!.fillRect(0, 0, w, h)
        ctx!.globalCompositeOperation = 'source-over'
      }

      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
