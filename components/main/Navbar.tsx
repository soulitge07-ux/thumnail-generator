'use client'

import { useState } from 'react'

const navLinks = [
  { label: '기능', href: '#features' },
  { label: '요금제', href: '#pricing' },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-8 h-16"
        style={{
          background: 'linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, transparent 100%)',
          backdropFilter: 'blur(0px)',
        }}
      >
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 shrink-0" style={{ textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="6" fill="#ededed" fillOpacity="0.1" />
            <rect x="5" y="8" width="18" height="12" rx="1.5" stroke="#ededed" strokeWidth="1.2" fill="none" />
            <path d="M11.5 11.5L17 14L11.5 16.5V11.5Z" fill="#ededed" />
            <path d="M20 6.5L20.5 7.5L21.5 8L20.5 8.5L20 9.5L19.5 8.5L18.5 8L19.5 7.5Z" fill="#ededed" fillOpacity="0.5" />
          </svg>
          <span
            className="text-[#ededed] text-xs md:text-sm tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-gugi)', letterSpacing: '0.15em' }}
          >
            Nailart AI
          </span>
        </a>

        {/* Nav — center (desktop only) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[#ededed]/50 hover:text-[#ededed] transition-colors text-sm"
              style={{ fontFamily: 'var(--font-orbit)', textDecoration: 'none' }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <a
            href="/auth"
            className="hidden md:inline-flex shrink-0 text-xs px-4 py-2 rounded-full border border-white/15 text-[#ededed]/60 hover:text-[#ededed] hover:border-white/30 transition-all"
            style={{ fontFamily: 'var(--font-orbit)', textDecoration: 'none' }}
          >
            무료로 시작
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center gap-1.5 w-8 h-8"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="메뉴"
          >
            <span className="block w-5 h-px bg-[#ededed]/70 transition-all duration-200"
              style={{ transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none' }} />
            <span className="block w-5 h-px bg-[#ededed]/70 transition-all duration-200"
              style={{ opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-5 h-px bg-[#ededed]/70 transition-all duration-200"
              style={{ transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="fixed top-16 left-0 right-0 z-40 md:hidden"
          style={{
            background: 'rgba(10,10,10,0.97)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <nav className="flex flex-col px-6 py-4 gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-[#ededed]/60 hover:text-[#ededed] transition-colors py-3 text-sm border-b border-white/5 last:border-0"
                style={{ fontFamily: 'var(--font-orbit)', textDecoration: 'none' }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/auth"
              onClick={() => setMenuOpen(false)}
              className="mt-3 text-center text-xs px-4 py-2.5 rounded-full border border-white/15 text-[#ededed]/60 hover:text-[#ededed] hover:border-white/30 transition-all"
              style={{ fontFamily: 'var(--font-orbit)', textDecoration: 'none' }}
            >
              무료로 시작
            </a>
          </nav>
        </div>
      )}
    </>
  )
}

export default Navbar
