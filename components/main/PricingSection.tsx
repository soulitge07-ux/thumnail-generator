'use client'

import { useState } from 'react'
import { BorderBeam } from '@/registry/magicui/border-beam'

const PLANS = [
  {
    key: 'pro',
    name: 'Pro',
    price: 20,
    credits: 100,
    desc: '꾸준히 콘텐츠를 올리는 크리에이터에게 딱 맞는 플랜',
    features: ['100 크레딧 / 월', '2K 고해상도 (16:9)', '참조 이미지 스타일 복제', '갤러리 무제한 저장'],
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.08)',
    accentBorder: 'rgba(167,139,250,0.2)',
    featured: false,
  },
  {
    key: 'ultra',
    name: 'Ultra',
    price: 45,
    credits: 300,
    desc: '여러 채널을 운영하거나 대량으로 썸네일이 필요한 분께',
    features: ['300 크레딧 / 월', '2K 고해상도 (16:9)', '참조 이미지 스타일 복제', '갤러리 무제한 저장', 'Pro 대비 크레딧 2배 이상'],
    accent: '#facc15',
    accentBg: 'rgba(250,204,21,0.07)',
    accentBorder: 'rgba(250,204,21,0.2)',
    featured: true,
  },
]

export default function PricingSection() {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <section
      id="pricing"
      style={{
        width: '100%',
        padding: '120px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 56,
      }}
    >
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
          Pricing
        </p>
        <h2 style={{
          fontFamily: 'var(--font-gugi)',
          fontSize: 'clamp(26px, 4vw, 44px)',
          color: '#ededed',
          margin: 0,
          letterSpacing: '0.02em',
        }}>
          필요한 만큼만 사용하세요
        </h2>
        <p style={{
          fontFamily: 'var(--font-orbit)',
          fontSize: 14,
          color: 'rgba(237,237,237,0.4)',
          margin: 0,
          maxWidth: 420,
          lineHeight: 1.7,
          alignSelf: 'center',
        }}>
          구독 후 자동 추가 결제 없음 · 언제든 취소 가능
        </p>
      </div>

      {/* Free tier note */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 20px',
        borderRadius: 99,
        background: 'rgba(74,222,128,0.08)',
        border: '1px solid rgba(74,222,128,0.2)',
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <circle cx="4" cy="4" r="4" fill="#4ade80" />
        </svg>
        <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(74,222,128,0.9)' }}>
          회원가입만 해도 무료 크레딧이 지급됩니다 — 카드 불필요
        </span>
      </div>

      {/* Cards */}
      <div style={{
        display: 'flex',
        gap: 20,
        width: '100%',
        maxWidth: 720,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {PLANS.map(plan => (
          <div
            key={plan.key}
            onMouseEnter={() => setHoveredPlan(plan.key)}
            onMouseLeave={() => setHoveredPlan(null)}
            style={{
              flex: '1 1 280px',
              maxWidth: 340,
              position: 'relative',
              borderRadius: 20,
              background: plan.featured ? plan.accentBg : 'rgba(255,255,255,0.03)',
              border: `1px solid ${hoveredPlan === plan.key || plan.featured ? plan.accentBorder : 'rgba(255,255,255,0.08)'}`,
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
          >
            {plan.featured && <BorderBeam duration={5} size={280} colorFrom="transparent" colorTo={plan.accent} />}

            {plan.featured && (
              <div style={{
                position: 'absolute',
                top: 16, right: 16,
                padding: '3px 10px',
                borderRadius: 99,
                background: 'rgba(250,204,21,0.15)',
                border: '1px solid rgba(250,204,21,0.3)',
                fontFamily: 'var(--font-orbit)',
                fontSize: 9,
                color: '#facc15',
                letterSpacing: '0.1em',
              }}>
                BEST VALUE
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{
                fontFamily: 'var(--font-orbit)',
                fontSize: 12,
                color: plan.accent,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}>
                {plan.name}
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--font-gugi)', fontSize: 48, color: '#ededed', lineHeight: 1 }}>
                  ${plan.price}
                </span>
                <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.3)' }}>
                  / 월
                </span>
              </div>
              <p style={{
                fontFamily: 'var(--font-orbit)',
                fontSize: 12,
                color: 'rgba(237,237,237,0.4)',
                margin: 0,
                lineHeight: 1.6,
              }}>
                {plan.desc}
              </p>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {plan.features.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: plan.accent, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.6)' }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a
              href="/auth"
              style={{
                marginTop: 'auto',
                display: 'block',
                width: '100%',
                padding: '12px 0',
                borderRadius: 999,
                background: plan.featured ? plan.accent : 'rgba(255,255,255,0.9)',
                color: '#111',
                fontFamily: 'var(--font-orbit)',
                fontSize: 13,
                fontWeight: 600,
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              지금 시작하기
            </a>
          </div>
        ))}
      </div>

      <p style={{
        fontFamily: 'var(--font-orbit)',
        fontSize: 11,
        color: 'rgba(237,237,237,0.2)',
        margin: 0,
        textAlign: 'center',
        lineHeight: 1.8,
      }}>
        언제든지 취소 가능 · 취소 후 남은 기간 서비스 계속 이용 · 결제는 Polar로 안전하게 처리됩니다
      </p>
    </section>
  )
}
