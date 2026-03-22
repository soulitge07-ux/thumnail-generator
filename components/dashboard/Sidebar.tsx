'use client'

import { useState } from 'react'
import Image from 'next/image'

export interface GalleryItem {
  id: string
  prompt: string
  public_url: string | null
  created_at: string
}

interface SidebarProps {
  items: GalleryItem[]
  onSelect: (item: GalleryItem) => void
}

export default function Sidebar({ items, onSelect }: SidebarProps) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <aside
      style={{
        position: 'fixed',
        left: 16,
        top: 80,
        bottom: 16,
        width: 200,
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 20,
        overflow: 'hidden',
        // Liquid glass
        background: 'rgba(22, 22, 26, 0.65)',
        backdropFilter: 'blur(32px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(32px) saturate(1.8)',
        border: '1px solid rgba(255, 255, 255, 0.09)',
        boxShadow:
          '0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06) inset',
        backgroundImage:
          'linear-gradient(160deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0) 50%)',
      }}
    >
      {/* Scrollable gallery */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 10,
          // Hide scrollbar visually
          scrollbarWidth: 'none',
        }}
      >
        {items.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 12,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(237,237,237,0.2)" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <p style={{
              fontFamily: 'var(--font-orbit)',
              fontSize: 10,
              color: 'rgba(237,237,237,0.2)',
              textAlign: 'center',
              margin: 0,
              lineHeight: 1.7,
            }}>
              생성된 이미지가<br />여기에 나타납니다
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'relative',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: hovered === item.id
                    ? '1px solid rgba(167,139,250,0.35)'
                    : '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer',
                  transition: 'border-color 0.18s ease',
                  aspectRatio: '16/9',
                }}
                onClick={() => onSelect(item)}
              >
                {/* Thumbnail image */}
                <Image
                  src={item.public_url ?? ''}
                  alt={item.prompt}
                  fill
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.25s ease',
                    transform: hovered === item.id ? 'scale(1.05)' : 'scale(1)',
                  }}
                />

                {/* Hover overlay: glass tint + download button */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: hovered === item.id
                      ? 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)'
                      : 'transparent',
                    transition: 'background 0.2s ease',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingBottom: 8,
                  }}
                >
                  {hovered === item.id && item.public_url && (
                    <a
                      href={item.public_url}
                      download="thumbnail.png"
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.12)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)',
                        color: 'rgba(237,237,237,0.9)',
                        fontFamily: 'var(--font-orbit)',
                        fontSize: 10,
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
