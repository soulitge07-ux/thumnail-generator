'use client'

import { CSSProperties } from 'react'

interface BorderBeamProps {
  size?: number
  duration?: number
  colorFrom?: string
  colorTo?: string
  reverse?: boolean
  className?: string
}

export function BorderBeam({
  duration = 4,
  colorFrom = 'transparent',
  colorTo = '#a78bfa',
  reverse = false,
}: BorderBeamProps) {
  return (
    <>
      <style>{`
        @keyframes border-beam-spin {
          to { transform: rotate(1turn); }
        }
      `}</style>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          padding: '1px',
          pointerEvents: 'none',
          /* border-box 전체에서 content-box(안쪽)를 빼면 1px 테두리 영역만 남음 */
          WebkitMaskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
          WebkitMaskClip: 'border-box, content-box',
          WebkitMaskComposite: 'xor',
          maskImage: 'linear-gradient(#fff 0 0), linear-gradient(#fff 0 0)',
          maskClip: 'border-box, content-box',
          maskComposite: 'exclude',
        } as CSSProperties}
      >
        {/* 회전하는 코닉 그라디언트 — inset: -100% 로 크게 만들어 코너까지 커버 */}
        <div
          style={{
            position: 'absolute',
            inset: '-100%',
            background: `conic-gradient(from 0deg, ${colorFrom} 0%, ${colorFrom} 75%, ${colorTo} 87.5%, ${colorFrom} 100%)`,
            animation: `border-beam-spin ${duration}s linear infinite ${reverse ? 'reverse' : 'normal'}`,
          }}
        />
      </div>
    </>
  )
}
