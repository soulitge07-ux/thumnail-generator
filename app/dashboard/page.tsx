'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import DashboardNavbar from '@/components/dashboard/Navbar'
import PromptArea from '@/components/dashboard/PromptArea'
import Sidebar, { type GalleryItem } from '@/components/dashboard/Sidebar'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [selected, setSelected] = useState<GalleryItem | null>(null)
  const [creditVersion, setCreditVersion] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.replace('/auth')
  }, [user, loading, router])

  // Load gallery from Supabase
  useEffect(() => {
    if (!user) return
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => {
        if (data.items) setGallery(data.items)
      })
      .catch(() => {})
  }, [user])

  // Called by PromptArea when a new image is generated
  const handleGenerated = useCallback((item: GalleryItem) => {
    setGallery(prev => [item, ...prev])
  }, [])

  if (loading || !user) return null

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#181818',
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        position: 'relative',
      }}
    >
      <DashboardNavbar refreshKey={creditVersion} onSidebarToggle={() => setSidebarOpen(v => !v)} />
      <Sidebar items={gallery} onSelect={(item) => { setSelected(item); setSidebarOpen(false) }} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main
        className="dashboard-main"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 24px 48px',
          paddingLeft: 'calc(200px + 16px + 24px)',
        }}
      >
        <style>{`@media(max-width:767px){.dashboard-main{padding-left:24px!important}}`}</style>
        <PromptArea
          gallery={gallery}
          onGenerated={handleGenerated}
          onCreditChanged={() => setCreditVersion(v => v + 1)}
        />
      </main>

      {/* Mobile gallery FAB */}
      <button
        className="gallery-fab"
        onClick={() => setSidebarOpen(v => !v)}
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 24,
          right: 20,
          zIndex: 45,
          alignItems: 'center',
          gap: 8,
          padding: '11px 18px',
          borderRadius: 999,
          background: 'rgba(22,22,26,0.92)',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          color: '#ededed',
          fontFamily: 'var(--font-orbit)',
          fontSize: 12,
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        내 갤러리
        {gallery.length > 0 && (
          <span style={{
            background: '#a78bfa',
            color: '#fff',
            fontSize: 10,
            fontFamily: 'var(--font-orbit)',
            borderRadius: 99,
            padding: '1px 6px',
            minWidth: 18,
            textAlign: 'center',
          }}>
            {gallery.length}
          </span>
        )}
      </button>
      <style>{`@media(max-width:767px){.gallery-fab{display:flex!important}}`}</style>

      {/* Lightbox */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 32,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: 900, width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 64px rgba(0,0,0,0.7)' }}>
              <Image
                src={selected.public_url!}
                alt={selected.prompt}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <p style={{ fontFamily: 'var(--font-orbit)', fontSize: 12, color: 'rgba(237,237,237,0.5)', margin: 0, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selected.prompt}
              </p>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                <a
                  href={selected.public_url!}
                  download="thumbnail.png"
                  style={{ padding: '7px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, color: 'rgba(237,237,237,0.6)', fontFamily: 'var(--font-orbit)', fontSize: 12, textDecoration: 'none' }}
                >
                  다운로드
                </a>
                <button
                  onClick={() => setSelected(null)}
                  style={{ padding: '7px 18px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, cursor: 'pointer', color: 'rgba(237,237,237,0.6)', fontFamily: 'var(--font-orbit)', fontSize: 12 }}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
