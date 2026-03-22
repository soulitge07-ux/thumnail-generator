'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardNavbar() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

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
      {/* Logo — floating left */}
      <div style={{ ...floatStyle, pointerEvents: 'auto', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
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
            <img
              src={user.user_metadata.avatar_url}
              alt="avatar"
              style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
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
  )
}
