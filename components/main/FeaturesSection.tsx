'use client'

import Image from 'next/image'

const FEATURES = [
  { icon: '✦', label: '텍스트 한 줄로 즉시 생성' },
  { icon: '◈', label: '참조 이미지 스타일 복제' },
  { icon: '⬡', label: '2K 고해상도 16:9 출력' },
]

export default function FeaturesSection() {
  return (
    <section
      id="features"
      style={{
        width: '100%',
        padding: '120px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 64,
      }}
    >
      <style>{`
        @media (max-width: 767px) {
          .features-grid > div {
            grid-column: span 12 !important;
          }
          .features-section {
            padding: 80px 16px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{
          fontFamily: 'var(--font-orbit)',
          fontSize: 11,
          color: 'rgba(167,139,250,0.7)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: 0,
        }}>
          Features
        </p>
        <h2 style={{
          fontFamily: 'var(--font-gugi)',
          fontSize: 'clamp(24px, 4vw, 44px)',
          color: '#ededed',
          margin: 0,
          letterSpacing: '0.02em',
        }}>
          어떤 스타일도 만들어냅니다
        </h2>
        <p style={{
          fontFamily: 'var(--font-orbit)',
          fontSize: 14,
          color: 'rgba(237,237,237,0.4)',
          margin: 0,
          lineHeight: 1.7,
          maxWidth: 440,
          alignSelf: 'center',
        }}>
          대담한 드라마부터 감성 브이로그까지 —<br />
          AI가 채널 분위기에 맞는 썸네일을 즉시 생성합니다
        </p>
      </div>

      {/* Bento Grid */}
      <div
        className="features-grid"
        style={{
          width: '100%',
          maxWidth: 1080,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'auto',
          gap: 12,
        }}
      >

        {/* Card 1 — large left, img1 (bold/dramatic) */}
        <div style={{
          gridColumn: 'span 7',
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          aspectRatio: '16/9',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Image src="/main/1.jpg" alt="Bold YouTube thumbnail example" fill style={{ objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
          }} />
          <div style={{
            position: 'absolute', bottom: 16, left: 18,
            display: 'flex', flexDirection: 'column', gap: 6,
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.35)',
              fontFamily: 'var(--font-orbit)', fontSize: 10, color: '#a78bfa', letterSpacing: '0.08em',
            }}>
              ✦ 임팩트 스타일
            </span>
            <p style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.75)', margin: 0 }}>
              강렬한 색감과 굵은 타이포로 시선을 사로잡습니다
            </p>
          </div>
        </div>

        {/* Card 2 — top right, img3 (fashion/editorial) */}
        <div style={{
          gridColumn: 'span 5',
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          aspectRatio: '16/9',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Image src="/main/3.jpg" alt="Editorial YouTube thumbnail example" fill style={{ objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 55%)',
          }} />
          <div style={{ position: 'absolute', bottom: 16, left: 18 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(250,204,21,0.15)', border: '1px solid rgba(250,204,21,0.3)',
              fontFamily: 'var(--font-orbit)', fontSize: 10, color: '#facc15', letterSpacing: '0.08em',
            }}>
              ◈ 에디토리얼 스타일
            </span>
          </div>
        </div>

        {/* Card 3 — bottom left, img2 (travel/warm) */}
        <div style={{
          gridColumn: 'span 4',
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          aspectRatio: '16/9',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Image src="/main/2.jpg" alt="Travel YouTube thumbnail example" fill style={{ objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)',
          }} />
          <div style={{ position: 'absolute', bottom: 16, left: 18 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)',
              fontFamily: 'var(--font-orbit)', fontSize: 10, color: '#4ade80', letterSpacing: '0.08em',
            }}>
              ⬡ 감성 브이로그
            </span>
          </div>
        </div>

        {/* Card 4 — bottom center, img5 (dramatic/reaction) */}
        <div style={{
          gridColumn: 'span 4',
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          aspectRatio: '16/9',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Image src="/main/5.jpg" alt="Reaction YouTube thumbnail example" fill style={{ objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)',
          }} />
          <div style={{ position: 'absolute', bottom: 16, left: 18 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(251,113,133,0.15)', border: '1px solid rgba(251,113,133,0.3)',
              fontFamily: 'var(--font-orbit)', fontSize: 10, color: '#fb7185', letterSpacing: '0.08em',
            }}>
              ✦ 리액션 드라마
            </span>
          </div>
        </div>

        {/* Card 5 — bottom right, img4 (colorful/influencer) */}
        <div style={{
          gridColumn: 'span 4',
          position: 'relative',
          borderRadius: 20,
          overflow: 'hidden',
          aspectRatio: '16/9',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Image src="/main/4.jpg" alt="Influencer YouTube thumbnail example" fill style={{ objectFit: 'cover' }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)',
          }} />
          <div style={{ position: 'absolute', bottom: 16, left: 18 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 99,
              background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)',
              fontFamily: 'var(--font-orbit)', fontSize: 10, color: '#38bdf8', letterSpacing: '0.08em',
            }}>
              ◈ 인플루언서 스타일
            </span>
          </div>
        </div>

      </div>

      {/* Feature pills */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            borderRadius: 99,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.09)',
          }}>
            <span style={{ fontSize: 12, color: '#a78bfa' }}>{f.icon}</span>
            <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.6)' }}>
              {f.label}
            </span>
          </div>
        ))}
      </div>

    </section>
  )
}
