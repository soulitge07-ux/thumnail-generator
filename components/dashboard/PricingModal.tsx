'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { BorderBeam } from '@/registry/magicui/border-beam'

interface PricingModalProps {
  onClose: () => void
}

const PLANS = [
  { key: 'pro', name: 'Pro', price: 20, credits: 100 },
  { key: 'ultra', name: 'Ultra', price: 45, credits: 300 },
]

export default function PricingModal({ onClose }: PricingModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const handleCheckout = async (planKey: string) => {
    setLoadingPlan(planKey)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error ?? '결제 오류가 발생했습니다.')
        setLoadingPlan(null)
      }
    } catch {
      alert('결제 요청에 실패했습니다.')
      setLoadingPlan(null)
    }
  }

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      {/* Modal box */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          borderRadius: 24,
          background: 'rgba(20,20,24,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          padding: '40px 36px',
          width: '100%',
          maxWidth: 520,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 28,
          overflow: 'hidden',
        }}
      >
        <BorderBeam duration={5} colorFrom="transparent" colorTo="#a78bfa" />

        {/* Title */}
        <p style={{
          fontFamily: 'var(--font-gugi)',
          fontSize: 22,
          color: '#ededed',
          margin: 0,
          letterSpacing: '0.04em',
        }}>
          요금제 업그레이드
        </p>

        {/* Cards */}
        <div style={{ display: 'flex', gap: 16, width: '100%' }}>
          {PLANS.map(plan => (
            <div
              key={plan.name}
              style={{
                flex: 1,
                borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
                padding: '28px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <span style={{
                fontFamily: 'var(--font-orbit)',
                fontSize: 13,
                color: 'rgba(237,237,237,0.5)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                {plan.name}
              </span>
              <span style={{
                fontFamily: 'var(--font-gugi)',
                fontSize: 36,
                color: '#ededed',
                lineHeight: 1,
              }}>
                ${plan.price}
              </span>
              <span style={{
                fontFamily: 'var(--font-orbit)',
                fontSize: 12,
                color: 'rgba(167,139,250,0.8)',
              }}>
                {plan.credits} 크레딧
              </span>
              <button
                onClick={() => handleCheckout(plan.key)}
                disabled={loadingPlan !== null}
                style={{
                  marginTop: 8,
                  width: '100%',
                  padding: '9px 0',
                  borderRadius: 999,
                  border: 'none',
                  background: loadingPlan === plan.key ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.9)',
                  color: '#111',
                  fontFamily: 'var(--font-orbit)',
                  fontSize: 12,
                  cursor: loadingPlan !== null ? 'default' : 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => { if (!loadingPlan) e.currentTarget.style.background = '#fff' }}
                onMouseLeave={e => { if (!loadingPlan) e.currentTarget.style.background = 'rgba(255,255,255,0.9)' }}
              >
                {loadingPlan === plan.key ? '연결 중...' : '구매하기'}
              </button>
            </div>
          ))}
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            fontFamily: 'var(--font-orbit)',
            fontSize: 11,
            color: 'rgba(237,237,237,0.3)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          닫기
        </button>
      </div>
    </div>,
    document.body,
  )
}
