'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { BorderBeam } from '@/registry/magicui/border-beam'

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

// ── Radix Popover ──────────────────────────────────────────
const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'start', sideOffset = 8, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn('z-50 w-56 rounded-2xl bg-[#222] border border-white/10 p-1.5 shadow-xl outline-none animate-in fade-in-0 zoom-in-95', className)}
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
const Settings2Icon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M20 7h-9M14 17H5" /><circle cx="17" cy="17" r="3" /><circle cx="7" cy="7" r="3" />
  </svg>
)
const SendIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...p}>
    <path d="M12 5.25L12 18.75M18.75 12L12 5.25L5.25 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const XIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
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
const GlobeIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)
const PencilIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
  </svg>
)
const LightbulbIcon = (p: React.SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 7C9.24 7 7 9.24 7 12c0 1.36.54 2.6 1.43 3.5.34.35.63.77.72 1.25L9.68 19.39A2 2 0 0 0 11.64 21h.72a2 2 0 0 0 1.96-1.61l.53-2.64c.1-.48.38-.9.72-1.25A5 5 0 0 0 17 12c0-2.76-2.24-5-5-5z" />
    <path d="M12 4V3M18 6l1-1M20 12h1M4 12H3M5 5l1 1M10 17h4" />
  </svg>
)

const toolsList = [
  { id: 'createImage', name: '이미지 생성', shortName: 'Image', icon: GlobeIcon },
  { id: 'searchWeb',  name: '웹 검색',     shortName: 'Search', icon: GlobeIcon },
  { id: 'writeCode',  name: '글쓰기 / 코드', shortName: 'Write', icon: PencilIcon },
  { id: 'thinkLonger', name: '심층 분석',   shortName: 'Think', icon: LightbulbIcon },
]

// ── PromptArea ─────────────────────────────────────────────
export default function PromptArea() {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [value, setValue] = React.useState('')
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const [selectedTool, setSelectedTool] = React.useState<string | null>(null)
  const [popoverOpen, setPopoverOpen] = React.useState(false)

  React.useLayoutEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [value])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const hasValue = value.trim().length > 0 || !!imagePreview
  const activeTool = selectedTool ? toolsList.find(t => t.id === selectedTool) : null
  const ActiveIcon = activeTool?.icon

  const iconBtn: React.CSSProperties = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, borderRadius: '50%', background: 'transparent',
    border: 'none', cursor: 'pointer', color: 'rgba(237,237,237,0.7)',
    transition: 'background 0.15s',
  }

  return (
    <div style={{ width: '100%', maxWidth: 760 }}>
      {/* Label */}
      <p style={{ fontFamily: 'var(--font-gugi)', fontSize: 'clamp(18px,2.5vw,26px)', color: 'rgba(237,237,237,0.85)', marginBottom: 20, textAlign: 'center', letterSpacing: '0.02em' }}>
        어떤 썸네일을 만들까요?
      </p>

      {/* Box */}
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
        <BorderBeam
          duration={4}
          size={300}
          reverse
          colorFrom="transparent"
          colorTo="#a78bfa"
        />
        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" style={{ display: 'none' }} />

        {/* Image preview */}
        {imagePreview && (
          <div style={{ position: 'relative', width: 60, height: 60, marginBottom: 4, marginLeft: 8, marginTop: 4 }}>
            <img src={imagePreview} alt="preview" style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover' }} />
            <button onClick={() => setImagePreview(null)} style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#333', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <XIcon />
            </button>
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="유튜브 채널명, 주제, 스타일을 입력하세요..."
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault() } }}
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

            {/* Attach */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={() => fileInputRef.current?.click()} style={iconBtn}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <PlusIcon />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top"><p>이미지 첨부</p></TooltipContent>
            </Tooltip>

            {/* Tools popover */}
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <button type="button"
                      style={{ ...iconBtn, width: 'auto', padding: '0 10px', borderRadius: 999, gap: 6, fontSize: 12, fontFamily: 'var(--font-orbit)' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <Settings2Icon />
                      {!selectedTool && <span>Tools</span>}
                    </button>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top"><p>도구 선택</p></TooltipContent>
              </Tooltip>
              <PopoverContent side="top" align="start">
                {toolsList.map(tool => (
                  <button key={tool.id} onClick={() => { setSelectedTool(tool.id); setPopoverOpen(false) }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '8px 10px', background: 'transparent', border: 'none', borderRadius: 10, cursor: 'pointer', color: 'rgba(237,237,237,0.8)', fontFamily: 'var(--font-orbit)', fontSize: 12 }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <tool.icon /> {tool.name}
                  </button>
                ))}
              </PopoverContent>
            </Popover>

            {/* Active tool chip */}
            {activeTool && ActiveIcon && (
              <>
                <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.12)' }} />
                <button onClick={() => setSelectedTool(null)}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px', height: 34, borderRadius: 999, background: 'rgba(34,148,255,0.12)', border: '1px solid rgba(34,148,255,0.3)', cursor: 'pointer', color: '#60b4ff', fontFamily: 'var(--font-orbit)', fontSize: 12 }}>
                  <ActiveIcon /> {activeTool.shortName} <XIcon />
                </button>
              </>
            )}

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
                  <button type="submit" disabled={!hasValue}
                    style={{
                      width: 34, height: 34, borderRadius: '50%', border: 'none', cursor: hasValue ? 'pointer' : 'default',
                      background: hasValue ? '#ededed' : 'rgba(255,255,255,0.12)',
                      color: hasValue ? '#111' : 'rgba(255,255,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s',
                    }}>
                    <SendIcon />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top"><p>전송</p></TooltipContent>
              </Tooltip>
            </div>

          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
