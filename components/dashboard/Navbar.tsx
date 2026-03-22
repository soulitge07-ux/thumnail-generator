'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import PricingModal from './PricingModal'

interface DashboardNavbarProps {
  refreshKey?: number
  onSidebarToggle?: () => void
}

export default function DashboardNavbar({ refreshKey = 0, onSidebarToggle }: DashboardNavbarProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [pricingOpen, setPricingOpen] = useState(false)
  const [plan, setPlan] = useState<string>('free')
  const [credits, setCredits] = useState<number>(0)
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('inactive')
  const [portalLoading, setPortalLoading] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) return
    fetch('/api/user-plan')
      .then(r => r.json())
      .then(d => {
        if (d.plan) setPlan(d.plan)
        if (typeof d.credits === 'number') setCredits(d.credits)
        if (d.subscription_status) setSubscriptionStatus(d.subscription_status)
      })
      .catch(() => {})
  }, [user, refreshKey])

  const handleManageSubscription = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/customer-portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.open(data.url, '_blank')
    } finally {
      setPortalLoading(false)
    }
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    router.replace('/')
  }

  const floatStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(12px)',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
  }

  return (
    <>
    <header
      style={{
        position: 'fixed',
        top: 16,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        pointerEvents: 'none',
      }}
    >
      {/* Logo + sidebar toggle — floating left */}
      <div style={{ ...floatStyle, pointerEvents: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Hamburger (mobile only) */}
        <button
          onClick={onSidebarToggle}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px 2px 0',
            flexDirection: 'column',
            gap: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="sidebar-toggle-btn"
          aria-label="갤러리 열기"
        >
          <span style={{ display: 'block', width: 16, height: 1.5, background: 'rgba(237,237,237,0.6)', borderRadius: 1 }} />
          <span style={{ display: 'block', width: 16, height: 1.5, background: 'rgba(237,237,237,0.6)', borderRadius: 1 }} />
          <span style={{ display: 'block', width: 16, height: 1.5, background: 'rgba(237,237,237,0.6)', borderRadius: 1 }} />
        </button>
        <style>{`@media(max-width:767px){.sidebar-toggle-btn{display:flex!important}}`}</style>
        <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="6" fill="#ededed" fillOpacity="0.1" />
          <rect x="5" y="8" width="18" height="12" rx="1.5" stroke="#ededed" strokeWidth="1.2" fill="none" />
          <path d="M11.5 11.5L17 14L11.5 16.5V11.5Z" fill="#ededed" />
        </svg>
        <span style={{ fontFamily: 'var(--font-gugi)', fontSize: 13, color: '#ededed', letterSpacing: '0.1em' }}>
          NAILART AI
        </span>
      </div>

      {/* Profile popover — floating right */}
      <div ref={popoverRef} style={{ position: 'relative', pointerEvents: 'auto' }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            ...floatStyle,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px 6px 6px',
            cursor: 'pointer',
            border: open ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {user?.user_metadata?.avatar_url ? (
            <Image
              src={user.user_metadata.avatar_url}
              alt="avatar"
              width={28}
              height={28}
              style={{ borderRadius: '50%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#ededed', fontSize: 12 }}>
                {user?.user_metadata?.full_name?.[0] ?? user?.email?.[0] ?? '?'}
              </span>
            </div>
          )}
          <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.6)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.user_metadata?.full_name ?? user?.email}
          </span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <path d="M2 4L6 8L10 4" stroke="rgba(237,237,237,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              minWidth: 200,
              background: 'rgba(28,28,32,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              backdropFilter: 'blur(16px)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              padding: '6px',
            }}
          >
            {/* 플랜 & 크레딧 */}
            {(() => {
              const statusBadge = (() => {
                if (plan === 'free') return null
                if (subscriptionStatus === 'active') return { label: '구독 중', color: '#4ade80', bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)' }
                if (subscriptionStatus === 'canceled') return { label: '만료 예정', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)' }
                if (subscriptionStatus === 'past_due') return { label: '결제 실패', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)' }
                return null
              })()

              return (
                <div style={{
                  padding: '10px 14px',
                  background: plan !== 'free' ? 'rgba(167,139,250,0.08)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${plan !== 'free' ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.08)'}`,
                  borderRadius: 10,
                  marginBottom: 4,
                }}>
                  {/* 플랜명 + 상태 뱃지 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 11, color: plan !== 'free' ? '#a78bfa' : 'rgba(237,237,237,0.35)', letterSpacing: '0.08em' }}>
                      {plan.toUpperCase()} 플랜
                    </span>
                    {statusBadge && (
                      <span style={{
                        fontFamily: 'var(--font-orbit)',
                        fontSize: 9,
                        color: statusBadge.color,
                        background: statusBadge.bg,
                        border: `1px solid ${statusBadge.border}`,
                        borderRadius: 99,
                        padding: '2px 7px',
                        letterSpacing: '0.04em',
                      }}>
                        {statusBadge.label}
                      </span>
                    )}
                  </div>
                  {/* 크레딧 */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      {/* 노란 원 아이콘 */}
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#facc15', flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-orbit)', fontSize: 10, color: 'rgba(237,237,237,0.3)' }}>크레딧</span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-orbit)',
                      fontSize: 18,
                      fontWeight: 700,
                      color: credits > 10 ? '#ededed' : credits > 0 ? '#f59e0b' : '#ef4444',
                      letterSpacing: '-0.02em',
                    }}>
                      {credits}
                    </span>
                  </div>
                </div>
              )
            })()}

            {/* 구독관리 버튼 — 유료 플랜 사용자만 */}
            {(plan !== 'free' || subscriptionStatus === 'canceled') && (
              <button
                onClick={() => { setOpen(false); handleManageSubscription() }}
                disabled={portalLoading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '9px 14px',
                  background: 'transparent',
                  border: '1px solid rgba(167,139,250,0.2)',
                  borderRadius: 10,
                  cursor: portalLoading ? 'default' : 'pointer',
                  fontFamily: 'var(--font-orbit)',
                  fontSize: 12,
                  color: 'rgba(167,139,250,0.8)',
                  textAlign: 'left',
                  marginBottom: 4,
                }}
                onMouseEnter={e => { if (!portalLoading) e.currentTarget.style.background = 'rgba(167,139,250,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                {portalLoading ? '연결 중...' : '구독관리'}
              </button>
            )}

            {/* 요금제 업그레이드 버튼 — free 또는 pro 활성 플랜만 */}
            {plan !== 'ultra' && subscriptionStatus !== 'canceled' && (
              <button
                onClick={() => {
                  setOpen(false)
                  // pro 사용자는 기존 구독 변경(포털)으로, free 사용자는 요금제 모달로
                  if (plan === 'pro') {
                    handleManageSubscription()
                  } else {
                    setPricingOpen(true)
                  }
                }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 14px',
                  background: 'rgba(255,255,255,0.8)',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-orbit)',
                  fontSize: 13,
                  color: '#111',
                  textAlign: 'left',
                  marginBottom: 4,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.92)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.8)')}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                {plan === 'free' ? '요금제' : '요금제 업그레이드'}
              </button>
            )}

            {/* 이메일 표시 */}
            <div style={{ padding: '8px 12px 6px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 4 }}>
              <p style={{ fontFamily: 'var(--font-orbit)', fontSize: 10, color: 'rgba(237,237,237,0.35)', margin: 0, marginBottom: 2 }}>로그인 계정</p>
              <p style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.7)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontFamily: 'var(--font-orbit)',
                fontSize: 12,
                color: 'rgba(237,237,237,0.6)',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.color = '#ededed'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'rgba(237,237,237,0.6)'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              로그아웃 하기
            </button>
          </div>
        )}
      </div>
    </header>

    {pricingOpen && <PricingModal onClose={() => setPricingOpen(false)} />}
    </>
  )
}
