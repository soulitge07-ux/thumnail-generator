import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const polarBase = process.env.POLAR_SANDBOX === 'true'
    ? 'https://sandbox-api.polar.sh'
    : 'https://api.polar.sh'

  const headers = {
    'Authorization': `Bearer ${process.env.POLAR_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  }

  // 1. DB에서 polar_customer_id 조회
  const { data: record } = await supabaseAdmin
    .from('users')
    .select('polar_customer_id')
    .eq('id', user.id)
    .single()

  let polarCustomerId = record?.polar_customer_id

  // 2. 없으면 Polar API에서 이메일로 고객 조회
  if (!polarCustomerId) {
    const lookupRes = await fetch(
      `${polarBase}/v1/customers/?email=${encodeURIComponent(user.email!)}&limit=1`,
      { headers },
    )
    if (lookupRes.ok) {
      const lookupData = await lookupRes.json()
      const customer = lookupData.items?.[0] ?? lookupData.result?.items?.[0]
      if (customer?.id) {
        polarCustomerId = customer.id
        // 다음 요청을 위해 DB에 저장
        await supabaseAdmin
          .from('users')
          .update({ polar_customer_id: polarCustomerId })
          .eq('id', user.id)
      }
    }
  }

  if (!polarCustomerId) {
    return Response.json({ error: 'No Polar customer found for this account' }, { status: 404 })
  }

  // 3. 고객 세션 생성
  const res = await fetch(`${polarBase}/v1/customer-sessions/`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ customer_id: polarCustomerId }),
  })

  const data = await res.json()
  console.log('[customer-portal] Polar response:', JSON.stringify(data).slice(0, 300))

  if (!res.ok) {
    return Response.json({ error: data?.detail ?? data?.message ?? 'Failed' }, { status: 500 })
  }

  const url = data.customer_portal_url
  if (!url) {
    return Response.json({ error: 'No portal URL in response' }, { status: 500 })
  }

  return Response.json({ url })
}
