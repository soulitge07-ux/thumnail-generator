'use client'

import { useEffect, useRef } from 'react'

interface ConcentricRingsLoaderProps {
  size?: number
  color?: string
  text?: string
  showText?: boolean
  rings?: number
}

export default function ConcentricRingsLoader({
  size = 120,
  color = '#a78bfa',
  text = '썸네일 생성 중...',
  showText = true,
  rings = 4,
}: ConcentricRingsLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')!
    canvas.width = size
    canvas.height = size

    const centerX = size / 2
    const centerY = size / 2
    let time = 0

    const animate = () => {
      ctx.clearRect(0, 0, size, size)

      for (let i = 0; i < rings; i++) {
        const baseRadius = size * 0.1 + i * (size * 0.15)
        const pulse = Math.sin(time * 0.03 - i * 0.5) * (size * 0.05)
        const radius = Math.min(baseRadius + pulse, size / 2 - 2)
        const opacity = 0.2 + Math.sin(time * 0.03 - i * 0.5) * 0.3

        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
        ctx.lineWidth = 2
        ctx.stroke()

        const numDots = 8
        for (let j = 0; j < numDots; j++) {
          const angle = (j / numDots) * Math.PI * 2 + time * 0.02 * (i % 2 ? 1 : -1)
          const dotX = centerX + Math.cos(angle) * radius
          const dotY = centerY + Math.sin(angle) * radius

          ctx.beginPath()
          ctx.arc(dotX, dotY, 2, 0, Math.PI * 2)
          ctx.fillStyle = color
          ctx.fill()
        }
      }

      const centerPulse = Math.sin(time * 0.05) * 0.3 + 0.7
      ctx.beginPath()
      ctx.arc(centerX, centerY, 5 * centerPulse, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.fill()

      time++
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [size, color, rings])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <canvas ref={canvasRef} />
      {showText && (
        <p style={{
          fontFamily: 'var(--font-orbit)',
          fontSize: 13,
          color: 'rgba(237,237,237,0.5)',
          margin: 0,
          letterSpacing: '0.05em',
        }}>
          {text}
        </p>
      )}
    </div>
  )
}
