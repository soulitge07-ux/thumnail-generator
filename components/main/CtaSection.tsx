'use client'

import dynamic from 'next/dynamic'

const ColorBends = dynamic(() => import('./ColorBends'), { ssr: false })

export default function CtaSection() {
  return (
    <section
      style={{
        width: '100%',
        padding: '80px 24px 120px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 480,
          borderRadius: 28,
          overflow: 'hidden',
          border: '1px solid rgba(167,139,250,0.3)',
          height: 360,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ColorBends background */}
        <ColorBends
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
          colors={['#a855f7', '#c084fc', '#e879f9', '#818cf8', '#f0abfc', '#7c3aed']}
          speed={0.2}
          rotation={30}
          autoRotate={2}
          scale={0.8}
          frequency={1.0}
          warpStrength={1.5}
          mouseInfluence={0.8}
          parallax={0.2}
          noise={0.02}
          transparent={false}
        />

        {/* Dark overlay for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background: 'rgba(5,3,15,0.15)',
        }} />

        {/* Content */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          padding: '64px 32px',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-orbit)',
            fontSize: 11,
            color: 'rgba(255,255,255,0.7)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            margin: 0,
          }}>
            지금 바로 시작
          </p>

          <h2 style={{
            fontFamily: 'var(--font-gugi)',
            fontSize: 'clamp(22px, 3vw, 36px)',
            color: '#ffffff',
            margin: 0,
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            textShadow: '0 2px 24px rgba(0,0,0,0.4)',
          }}>
            첫 썸네일을<br />무료로 만들어보세요
          </h2>

          <p style={{
            fontFamily: 'var(--font-orbit)',
            fontSize: 12,
            color: 'rgba(255,255,255,0.55)',
            margin: 0,
            lineHeight: 1.8,
          }}>
            카드 등록 없이 무료로 시작.<br />
            구글 계정으로 3초 안에 로그인됩니다.
          </p>

          <a
            href="/auth"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '13px 32px',
              borderRadius: 999,
              background: '#ededed',
              color: '#111',
              fontFamily: 'var(--font-orbit)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#ffffff'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#ededed'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            무료로 시작하기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
