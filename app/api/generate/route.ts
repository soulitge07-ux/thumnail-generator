import { GoogleGenAI } from '@google/genai'
import { NextRequest } from 'next/server'
import { buildThumbnailPrompt } from '@/lib/buildThumbnailPrompt'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const BUCKET = 'thumnails'

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } }

async function toInlineData(dataUrl: string): Promise<{ mimeType: string; data: string } | null> {
  // data URL
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (match) return { mimeType: match[1], data: match[2] }

  // public URL — fetch and convert
  try {
    const res = await fetch(dataUrl)
    if (!res.ok) return null
    const mimeType = res.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
    const base64 = Buffer.from(await res.arrayBuffer()).toString('base64')
    return { mimeType, data: base64 }
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  let creditsBefore: number | null = null
  let userId: string | null = null

  try {
    const { prompt, imageDataUrls } = await request.json()

    console.log('[generate] prompt:', prompt?.slice(0, 80))
    console.log('[generate] images received:', Array.isArray(imageDataUrls) ? imageDataUrls.length : 0)

    if (!prompt?.trim()) {
      return Response.json({ error: 'prompt is required' }, { status: 400 })
    }

    // ── Auth ────────────────────────────────────────────────────
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    userId = user.id

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return Response.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })

    // ── Credit check & deduct ───────────────────────────────────
    const { data: userRecord } = await supabaseAdmin
      .from('users')
      .select('credits')
      .eq('id', user.id)
      .single()

    creditsBefore = userRecord?.credits ?? 0
    if (creditsBefore <= 0) {
      return Response.json({ error: 'credits_exhausted', message: '크레딧이 부족합니다.' }, { status: 402 })
    }

    await supabaseAdmin
      .from('users')
      .update({ credits: creditsBefore - 1 })
      .eq('id', user.id)

    // ── Insert pending record ───────────────────────────────────
    const { data: record, error: insertError } = await supabaseAdmin
      .from('thumnails')
      .insert({ user_id: user.id, prompt, status: 'generating' })
      .select('id')
      .single()

    if (insertError) {
      await supabaseAdmin.from('users').update({ credits: creditsBefore }).eq('id', user.id)
      return Response.json({ error: insertError.message }, { status: 500 })
    }

    const ai = new GoogleGenAI({ apiKey })

    // ── Step 1: Convert all reference images to inlineData ──────
    const validUrls: string[] = Array.isArray(imageDataUrls)
      ? (imageDataUrls as string[]).filter(u => typeof u === 'string' && u.length > 10)
      : []

    const inlineImages: { mimeType: string; data: string }[] = []
    for (const url of validUrls) {
      const inline = await toInlineData(url)
      if (inline) inlineImages.push(inline)
    }
    console.log('[generate] inline images prepared:', inlineImages.length)

    // ── Step 2: Analyse reference images → text description ─────
    let referenceDescription = ''
    if (inlineImages.length > 0) {
      try {
        const visionParts: GeminiPart[] = [
          {
            text: `You are an expert YouTube thumbnail art director.
The user has attached ${inlineImages.length} reference image(s).
Analyse EVERY image carefully and extract the following in detail:

1. COLOR PALETTE: Exact dominant colors (e.g. deep blue #1a2a6c, neon yellow #FFE500), contrast level, background tone
2. TYPOGRAPHY: Font weight (bold/black), font style (serif/sans), text size relative to image, text position, stroke/shadow effects, text color
3. COMPOSITION: Subject placement (left/center/right), rule of thirds usage, negative space, focal point
4. LIGHTING & MOOD: Dramatic, bright, dark, cinematic, neon, natural — describe the exact feel
5. SUBJECT: Person pose, expression, eye contact, clothing style if visible
6. GRAPHIC ELEMENTS: Icons, arrows, badges, overlays, gradients, borders
7. OVERALL STYLE: Which of these best describes it — cinematic, infographic, vlog, educational, dramatic, minimalist

Be extremely specific. This description will be used to recreate the same visual style.`,
          },
          ...inlineImages.map(img => ({ inlineData: img } as GeminiPart)),
        ]

        const visionRes = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [{ role: 'user', parts: visionParts }],
        })

        referenceDescription = visionRes.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text ?? '')
          .join('') ?? ''

        console.log('[generate] reference description length:', referenceDescription.length)
        if (referenceDescription.length > 0) {
          console.log('[generate] reference description preview:', referenceDescription.slice(0, 200))
        }
      } catch (visionErr) {
        console.error('[generate] vision analysis failed:', visionErr)
        // Continue without reference — don't fail the whole request
      }
    }

    // ── Step 3: Build final generation prompt ───────────────────
    let finalPrompt: string
    if (referenceDescription) {
      finalPrompt = `## REFERENCE STYLE DIRECTIVE (HIGHEST PRIORITY)
The user has provided reference thumbnail images. You MUST replicate their visual style as closely as possible.
Apply ALL of the following characteristics to the generated image:

${referenceDescription}

---

${buildThumbnailPrompt(prompt)}`
    } else {
      finalPrompt = buildThumbnailPrompt(prompt)
    }

    const requestParts: GeminiPart[] = [{ text: finalPrompt }]
    console.log('[generate] final prompt length:', finalPrompt.length)

    // ── Step 4: Generate image ──────────────────────────────────
    const geminiResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: [{ role: 'user', parts: requestParts }],
      config: {
        responseModalities: ['Image'],
        imageConfig: { aspectRatio: '16:9', imageSize: '2K' },
      },
    })

    const responseParts = geminiResponse.candidates?.[0]?.content?.parts ?? []
    let imageData: string | null = null
    let imageMimeType = 'image/png'

    for (const part of responseParts) {
      if (part.inlineData?.data) {
        imageData = part.inlineData.data
        imageMimeType = part.inlineData.mimeType ?? 'image/png'
      }
    }

    if (!imageData) {
      await supabaseAdmin.from('thumnails').update({ status: 'error' }).eq('id', record.id)
      await supabaseAdmin.from('users').update({ credits: creditsBefore }).eq('id', user.id)
      return Response.json({ error: 'No image returned from model' }, { status: 500 })
    }

    // ── Upload to Storage ───────────────────────────────────────
    const ext = imageMimeType.split('/')[1] ?? 'png'
    const storagePath = `${user.id}/${record.id}.${ext}`
    const buffer = Buffer.from(imageData, 'base64')

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, buffer, { contentType: imageMimeType, upsert: false })

    if (uploadError) {
      await supabaseAdmin.from('thumnails').update({ status: 'error' }).eq('id', record.id)
      await supabaseAdmin.from('users').update({ credits: creditsBefore }).eq('id', user.id)
      return Response.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(storagePath)

    await supabaseAdmin
      .from('thumnails')
      .update({ status: 'done', storage_path: storagePath, public_url: publicUrl })
      .eq('id', record.id)

    return Response.json({ imageData, mimeType: imageMimeType, publicUrl })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[generate] error:', message)
    // 크레딧 차감 후 예기치 못한 에러 → 복원
    if (creditsBefore !== null && userId) {
      await supabaseAdmin.from('users').update({ credits: creditsBefore }).eq('id', userId)
    }
    return Response.json({ error: message }, { status: 500 })
  }
}
