'use client'

const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const ThreadsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.471 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.822-2.047 1.674-1.617 1.631-3.612 1.03-4.784-.368-.7-.962-1.315-1.784-1.814-.391 2.98-1.67 4.849-3.934 5.57-1.538.483-3.3.376-4.79-.318-1.715-.789-2.672-2.164-2.672-3.889 0-3.113 2.488-4.93 6.778-4.93.718 0 1.39.047 2.01.137-.07-.742-.264-1.35-.581-1.81-.499-.721-1.3-1.086-2.382-1.086-1.004 0-1.944.27-2.75.803l-.011.007-1.016-1.742.013-.009c1.154-.742 2.5-1.119 3.998-1.119 3.636 0 5.51 1.944 5.51 5.617 0 .282-.016.557-.047.826 1.173.664 2.055 1.542 2.601 2.594.99 1.888 1.028 4.665-.855 6.487C17.638 23.116 15.337 23.98 12.186 24zm.007-8.598c-2.692 0-4.22.893-4.22 2.45 0 .896.493 1.586 1.424 2.014.82.378 1.902.443 2.87.163 1.537-.483 2.292-1.78 2.455-4.018a12.27 12.27 0 0 0-2.529-.609z" />
  </svg>
)

const YoutubeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const SOCIAL_LINKS = [
  { label: 'X', href: 'https://x.com', icon: <XIcon /> },
  { label: 'Threads', href: 'https://threads.net', icon: <ThreadsIcon /> },
  { label: 'YouTube', href: 'https://youtube.com', icon: <YoutubeIcon /> },
]

const NAV_LINKS = [
  { label: '기능', href: '#features' },
  { label: '요금제', href: '#pricing' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '이용약관', href: '/terms' },
]

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      padding: '28px 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap',
    }}>

      {/* Left — Logo + socials */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#ededed" fillOpacity="0.08" />
            <rect x="5" y="8" width="18" height="12" rx="1.5" stroke="#ededed" strokeWidth="1.2" fill="none" />
            <path d="M11.5 11.5L17 14L11.5 16.5V11.5Z" fill="#ededed" />
          </svg>
          <span style={{
            fontFamily: 'var(--font-gugi)',
            fontSize: 12,
            color: 'rgba(237,237,237,0.4)',
            letterSpacing: '0.12em',
          }}>
            NAILART AI
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.1)' }} />

        {/* Social icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {SOCIAL_LINKS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: 8,
                color: 'rgba(237,237,237,0.3)',
                textDecoration: 'none',
                transition: 'color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = 'rgba(237,237,237,0.85)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = 'rgba(237,237,237,0.3)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Right — Nav links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        {NAV_LINKS.map(link => (
          <a
            key={link.label}
            href={link.href}
            style={{
              fontFamily: 'var(--font-orbit)',
              fontSize: 12,
              color: 'rgba(237,237,237,0.3)',
              textDecoration: 'none',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(237,237,237,0.75)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(237,237,237,0.3)')}
          >
            {link.label}
          </a>
        ))}
      </nav>

    </footer>
  )
}
