'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { type GalleryItem } from './Sidebar'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { BorderBeam } from '@/registry/magicui/border-beam'
import GenerationArea from './GenerationArea'

// ── Utilities ──────────────────────────────────────────────
function cn(...inputs: (string | boolean | null | undefined)[]) {
  return inputs.filter(Boolean).join(' ')
}

// ── Radix Tooltip ──────────────────────────────────────────
const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn('z-50 rounded-md bg-[#222] text-white px-2 py-1 text-xs shadow-md animate-in fade-in-0 zoom-in-95', className)}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = 'TooltipContent'

// ── Radix Popover (References) ─────────────────────────────
const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ sideOffset = 10, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      style={{
        zIndex: 200,
        width: 320,
        maxHeight: 320,
        overflowY: 'auto',
        borderRadius: 16,
        background: 'rgba(20,20,24,0.92)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 12px 48px rgba(0,0,0,0.6)',
        padding: 10,
        outline: 'none',
        scrollbarWidth: 'none',
      }}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = 'PopoverContent'

// ── Icons ──────────────────────────────────────────────────
const PlusIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)
const SendIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M12 5.25L12 18.75M18.75 12L12 5.25L5.25 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)
const MicIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
  </svg>
)
const ImagesIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
)

// ── Spinner ────────────────────────────────────────────────
const Spinner = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
      <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" />
    </path>
  </svg>
)

const MAX_FILES = 10
const MAX_SIZE_MB = 5

// ── PromptArea ─────────────────────────────────────────────
interface PromptAreaProps {
  gallery?: GalleryItem[]
  onGenerated?: (item: GalleryItem) => void
}

export default function PromptArea({ gallery = [], onGenerated }: PromptAreaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const [value, setValue] = React.useState('')
  const [imagePreviews, setImagePreviews] = React.useState<string[]>([])
  const [refOpen, setRefOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [sizeError, setSizeError] = React.useState<string | null>(null)

  React.useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  const addPreviews = (dataUrls: string[]) => {
    setImagePreviews(prev => {
      const combined = [...prev, ...dataUrls]
      return combined.slice(0, MAX_FILES)
    })
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    e.target.value = ''
    if (!files.length) return

    const available = MAX_FILES - imagePreviews.length
    if (available <= 0) {
      setSizeError(`최대 ${MAX_FILES}개까지 첨부할 수 있습니다.`)
      return
    }

    const toProcess = files.slice(0, available)
    const oversized = toProcess.filter(f => f.size > MAX_SIZE_MB * 1024 * 1024)
    if (oversized.length) {
      setSizeError(`파일당 최대 ${MAX_SIZE_MB}MB까지 허용됩니다.`)
      return
    }

    setSizeError(null)
    const readers = toProcess
      .filter(f => f.type.startsWith('image/'))
      .map(file => new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.onloadend = () => {
          const img = new window.Image()
          img.onload = () => {
            const MAX_PX = 512
            const scale = Math.min(1, MAX_PX / Math.max(img.width, img.height))
            const w = Math.round(img.width * scale)
            const h = Math.round(img.height * scale)
            const canvas = document.createElement('canvas')
            canvas.width = w
            canvas.height = h
            canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
            resolve(canvas.toDataURL('image/jpeg', 0.7))
          }
          img.src = reader.result as string
        }
        reader.readAsDataURL(file)
      }))

    Promise.all(readers).then(addPreviews)
  }

  // Add gallery thumbnail as reference
  const handleAddReference = (item: GalleryItem) => {
    if (!item.public_url) return
    if (imagePreviews.length >= MAX_FILES) return
    // Avoid duplicates
    if (imagePreviews.includes(item.public_url)) return
    addPreviews([item.public_url])
    setRefOpen(false)
  }

  const openRef = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setRefOpen(true)
  }
  const closeRef = () => {
    closeTimerRef.current = setTimeout(() => setRefOpen(false), 120)
  }

  const handleSubmit = async () => {
    if (!value.trim() || loading) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: value, imageDataUrls: imagePreviews.length ? imagePreviews : undefined }),
      })
      const data = await res.json()
      if (data.imageData) {
        const url = `data:${data.mimeType ?? 'image/png'};base64,${data.imageData}`
        setResult(url)
        if (data.publicUrl) {
          onGenerated?.({
            id: Date.now().toString(),
            prompt: value,
            public_url: data.publicUrl,
            created_at: new Date().toISOString(),
          })
        }
      } else {
        setError(data.error ?? '이미지 생성에 실패했습니다.')
      }
    } catch (e) {
      setError(`요청 중 오류가 발생했습니다: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const hasActivity = loading || !!result || !!error
  const hasValue = value.trim().length > 0 || imagePreviews.length > 0

  const iconBtn: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, borderRadius: '50%', background: 'transparent',
    border: 'none', cursor: 'pointer', color: 'rgba(237,237,237,0.7)',
    transition: 'background 0.15s',
  }

  return (
    <div style={{ width: '100%', maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* ── Top content area ── */}
      <GenerationArea
        loading={loading}
        result={result}
        error={error}
        onRetry={() => setError(null)}
        onReset={() => setResult(null)}
      />

      {/* ── Label ── */}
      <AnimatePresence>
        {!hasActivity && (
          <motion.p
            key="label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            style={{
              fontFamily: 'var(--font-gugi)', fontSize: 'clamp(18px,2.5vw,26px)',
              color: 'rgba(237,237,237,0.85)', margin: 0,
              textAlign: 'center', letterSpacing: '0.02em',
            }}
          >
            어떤 썸네일을 만들까요?
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Prompt Box ── */}
      <motion.div layout transition={{ type: 'spring', stiffness: 280, damping: 28 }}>
        <div
          style={{
            position: 'relative',
            background: 'rgba(30,30,34,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 24,
            backdropFilter: 'blur(16px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <BorderBeam duration={4} size={300} reverse colorFrom="transparent" colorTo="#a78bfa" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFile}
            accept="image/*"
            multiple
            style={{ display: 'none' }}
          />

          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 8px 4px' }}>
              {imagePreviews.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', position: 'relative' }}>
                    <Image
                      src={src}
                      alt={`참조 이미지 ${i + 1}`}
                      fill
                      unoptimized={src.startsWith('data:')}
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <button
                    onClick={() => setImagePreviews(prev => prev.filter((_, idx) => idx !== i))}
                    style={{
                      position: 'absolute', top: -5, right: -5,
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#333', border: '1px solid rgba(255,255,255,0.2)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#fff', padding: 0,
                    }}
                  >
                    <XIcon width={8} height={8} />
                  </button>
                </div>
              ))}
              {imagePreviews.length < MAX_FILES && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    width: 56, height: 56, borderRadius: 10, flexShrink: 0,
                    background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'rgba(237,237,237,0.3)',
                  }}
                >
                  <PlusIcon width={16} height={16} />
                </button>
              )}
            </div>
          )}

          {/* Size error / hint */}
          {sizeError ? (
            <p style={{
              fontFamily: 'var(--font-orbit)', fontSize: 11,
              color: 'rgba(255,110,110,0.8)', margin: '0 14px 4px', padding: 0,
            }}>
              {sizeError}
            </p>
          ) : (
            <p style={{
              fontFamily: 'var(--font-orbit)', fontSize: 10,
              color: 'rgba(237,237,237,0.2)', margin: '0 14px 4px', padding: 0,
            }}>
              이미지 첨부: 최대 {MAX_FILES}개 · 파일당 {MAX_SIZE_MB}MB 이하
            </p>
          )}

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="유튜브 채널명, 주제, 스타일을 입력하세요..."
            style={{
              width: '100%', resize: 'none', border: 'none', background: 'transparent',
              color: '#ededed', fontFamily: 'var(--font-orbit)', fontSize: 15,
              lineHeight: 1.6, padding: '12px 14px', outline: 'none', minHeight: 52,
              caretColor: '#ededed',
            }}
          />

          {/* Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px' }}>
            <TooltipProvider delayDuration={300}>

              {/* Attach file */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={iconBtn}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <PlusIcon />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>이미지 첨부 (최대 {MAX_FILES}개, {MAX_SIZE_MB}MB)</p></TooltipContent>
              </Tooltip>

              {/* References button — hover popover */}
              <Popover open={refOpen} onOpenChange={setRefOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        onMouseEnter={openRef}
                        onMouseLeave={closeRef}
                        style={{
                          ...iconBtn, width: 'auto', padding: '0 10px',
                          borderRadius: 999, gap: 5, fontSize: 12,
                          fontFamily: 'var(--font-orbit)',
                        }}
                        onMouseEnterCapture={openRef}
                        onMouseLeaveCapture={closeRef}
                      >
                        <ImagesIcon />
                        <span>참조</span>
                      </button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top"><p>내 썸네일 참조</p></TooltipContent>
                </Tooltip>

                <PopoverContent
                  side="top"
                  align="start"
                  onMouseEnter={openRef}
                  onMouseLeave={closeRef}
                >
                  {gallery.length === 0 ? (
                    <p style={{
                      fontFamily: 'var(--font-orbit)', fontSize: 11,
                      color: 'rgba(237,237,237,0.3)', textAlign: 'center',
                      margin: '16px 0', lineHeight: 1.6,
                    }}>
                      생성된 썸네일이 없습니다
                    </p>
                  ) : (
                    <>
                      <p style={{
                        fontFamily: 'var(--font-orbit)', fontSize: 10,
                        color: 'rgba(237,237,237,0.3)', margin: '0 0 8px 2px',
                        letterSpacing: '0.06em',
                      }}>
                        클릭하여 참조 이미지로 추가
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                        {gallery.filter(g => g.public_url).map(item => (
                          <button
                            key={item.id}
                            onClick={() => handleAddReference(item)}
                            disabled={imagePreviews.includes(item.public_url!) || imagePreviews.length >= MAX_FILES}
                            style={{
                              all: 'unset',
                              cursor: imagePreviews.includes(item.public_url!) || imagePreviews.length >= MAX_FILES
                                ? 'not-allowed' : 'pointer',
                              borderRadius: 8,
                              overflow: 'hidden',
                              aspectRatio: '16/9',
                              position: 'relative',
                              display: 'block',
                              opacity: imagePreviews.includes(item.public_url!) ? 0.4 : 1,
                              border: '1px solid rgba(255,255,255,0.08)',
                              transition: 'opacity 0.15s, border-color 0.15s',
                            }}
                            onMouseEnter={e => { if (!imagePreviews.includes(item.public_url!)) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(167,139,250,0.5)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
                          >
                            <Image
                              src={item.public_url!}
                              alt={item.prompt}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </PopoverContent>
              </Popover>

              {/* Right side */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" style={iconBtn}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <MicIcon />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top"><p>음성 입력</p></TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!hasValue || loading}
                      style={{
                        width: 34, height: 34, borderRadius: '50%', border: 'none',
                        cursor: hasValue && !loading ? 'pointer' : 'default',
                        background: hasValue && !loading ? '#ededed' : 'rgba(255,255,255,0.12)',
                        color: hasValue && !loading ? '#111' : 'rgba(255,255,255,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s',
                      }}
                    >
                      {loading ? <Spinner /> : <SendIcon />}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top"><p>전송</p></TooltipContent>
                </Tooltip>
              </div>

            </TooltipProvider>
          </div>
        </div>
      </motion.div>

    </div>
  )
}
