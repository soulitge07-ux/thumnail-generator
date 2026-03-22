'use client'

import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import ConcentricRingsLoader from './ConcentricRingsLoader'

interface GenerationAreaProps {
  loading: boolean
  result: string | null
  error: string | null
  onRetry: () => void
  onReset: () => void
}

export default function GenerationArea({ loading, result, error, onRetry, onReset }: GenerationAreaProps) {
  return (
    <AnimatePresence mode="wait">

      {loading && (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}
        >
          <ConcentricRingsLoader size={180} color="#a78bfa" />
        </motion.div>
      )}

      {error && !loading && (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.25 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 320, gap: 20 }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="rgba(255,80,80,0.2)" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="28" stroke="rgba(255,80,80,0.15)" strokeWidth="1" />
            <path d="M28 28L52 52M52 28L28 52" stroke="rgba(255,90,90,0.85)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <p style={{
            fontFamily: 'var(--font-orbit)', fontSize: 13,
            color: 'rgba(255,110,110,0.85)', textAlign: 'center',
            maxWidth: 460, lineHeight: 1.7, margin: 0,
          }}>
            {error}
          </p>
          <button
            onClick={onRetry}
            style={{
              padding: '8px 20px', background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999,
              cursor: 'pointer', color: 'rgba(237,237,237,0.5)',
              fontFamily: 'var(--font-orbit)', fontSize: 12,
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
          >
            다시 시도
          </button>
        </motion.div>
      )}

      {result && !loading && (
        <motion.div
          key="result"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 48px rgba(0,0,0,0.6)' }}>
            <Image
              src={result}
              alt="generated thumbnail"
              fill
              unoptimized={result.startsWith('data:')}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={result}
              download="thumbnail.png"
              style={{
                padding: '8px 20px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999,
                color: 'rgba(237,237,237,0.6)', fontFamily: 'var(--font-orbit)',
                fontSize: 12, textDecoration: 'none',
              }}
            >
              다운로드
            </a>
            <button
              onClick={onReset}
              style={{
                padding: '8px 20px', background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999,
                cursor: 'pointer', color: 'rgba(237,237,237,0.6)',
                fontFamily: 'var(--font-orbit)', fontSize: 12,
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
            >
              다시 만들기
            </button>
          </div>
        </motion.div>
      )}

    </AnimatePresence>
  )
}
