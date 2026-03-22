import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PRODUCT_IDS: Record<string, string> = {
  pro: process.env.POLAR_PRO_PRODUCT_ID!,
  ultra: process.env.POLAR_ULTRA_PRODUCT_ID!,
}

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    const productId = PRODUCT_IDS[plan?.toLowerCase()]
    if (!productId) {
      return Response.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin

    const polarBase = process.env.POLAR_SANDBOX === 'true'
      ? 'https://sandbox-api.polar.sh'
      : 'https://api.polar.sh'

    const res = await fetch(`${polarBase}/v1/checkouts/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        customer_email: user.email,
        success_url: `${baseUrl}/dashboard?checkout=success`,
      }),
    })

    const data = await res.json()
    console.log('[checkout] Polar response:', JSON.stringify(data).slice(0, 300))

    if (!res.ok) {
      console.error('[checkout] Polar error status:', res.status, data)
      return Response.json({ error: data?.detail ?? data?.message ?? JSON.stringify(data) }, { status: 500 })
    }

    // Polar returns `url` for hosted checkout
    const checkoutUrl = data.url ?? data.checkout_url ?? data.redirect_url
    if (!checkoutUrl) {
      console.error('[checkout] No URL in response:', data)
      return Response.json({ error: 'No checkout URL returned', detail: data }, { status: 500 })
    }

    return Response.json({ url: checkoutUrl })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.error('[checkout] error:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
