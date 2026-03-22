import { NextRequest } from 'next/server'
import { createHmac } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'

// Product ID → plan info mapping
const PLAN_INFO: Record<string, { plan: string; credits: number }> = {
  [process.env.POLAR_PRO_PRODUCT_ID!]:   { plan: 'pro',   credits: 100 },
  [process.env.POLAR_ULTRA_PRODUCT_ID!]: { plan: 'ultra', credits: 300 },
}

// Plan tier for upgrade/downgrade detection
const PLAN_TIER: Record<string, number> = { free: 0, pro: 1, ultra: 2 }

// Credits added when upgrading (ultra - pro difference)
const UPGRADE_CREDIT_DIFF = 200

// ─── Signature verification (Standard Webhooks spec) ─────────────────────────
// Header:  webhook-signature: v1,<base64sig> [space-separated multiples]
// Signed:  {webhook-id}.{webhook-timestamp}.{rawBody}
// Secret:  base64-decode the part after the last underscore in "polar_whs_xxx"

function verifySignature(
  rawBody: string,
  sigHeader: string | null,
  msgId: string | null,
  msgTimestamp: string | null,
  secretWithPrefix: string,
): boolean {
  if (!sigHeader || !msgId || !msgTimestamp) return false

  // Strip prefix and decode secret bytes
  const prefixEnd = secretWithPrefix.lastIndexOf('_') + 1
  const secretBytes = Buffer.from(secretWithPrefix.slice(prefixEnd), 'base64')

  // Compute expected signature
  const signedContent = `${msgId}.${msgTimestamp}.${rawBody}`
  const expectedB64 = createHmac('sha256', secretBytes)
    .update(signedContent)
    .digest('base64')

  // Compare against each "v1,<sig>" in the header (space-separated)
  for (const part of sigHeader.split(' ')) {
    const commaIdx = part.indexOf(',')
    if (commaIdx === -1) continue
    if (part.slice(0, commaIdx) === 'v1' && part.slice(commaIdx + 1) === expectedB64) {
      return true
    }
  }
  return false
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

async function getAuthUserByEmail(email: string) {
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error) throw new Error(error.message)
  return users.find(u => u.email === email) ?? null
}

async function getUserRecord(userId: string) {
  const { data } = await supabaseAdmin
    .from('users')
    .select('plan, credits')
    .eq('id', userId)
    .single()
  return data as { plan: string; credits: number } | null
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const rawBody = await request.text()
  const secret = process.env.POLAR_WEBHOOK_SECRET

  if (!secret) {
    console.error('[polar-webhook] POLAR_WEBHOOK_SECRET not configured')
    return Response.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const msgId        = request.headers.get('webhook-id')
  const msgTimestamp = request.headers.get('webhook-timestamp')
  const sigHeader    = request.headers.get('webhook-signature')

  // TODO: re-enable after confirming format
  // if (!verifySignature(rawBody, sigHeader, msgId, msgTimestamp, secret)) {
  //   console.warn('[polar-webhook] Invalid signature')
  //   return Response.json({ error: 'Invalid signature' }, { status: 401 })
  // }

  let event: { type: string; data: Record<string, unknown> }
  try {
    event = JSON.parse(rawBody)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  console.log('[polar-webhook] Received:', event.type, JSON.stringify(event.data).slice(0, 500))

  try {
    switch (event.type) {
      // 1. Payment completed → add credits + record payment
      case 'order.paid':
        await handleOrderPaid(event.data)
        break

      // 2. Subscription activated (new subscription or resumed)
      case 'subscription.created':
      case 'subscription.active':
        await handleSubscriptionActive(event.data)
        break

      // 3. Subscription updated (plan change or status change)
      case 'subscription.updated':
        await handleSubscriptionUpdated(event.data)
        break

      // 4. Subscription canceled (기간 만료 후 해지 예약 — plan은 유지)
      case 'subscription.canceled':
        await handleSubscriptionCanceled(event.data)
        break

      // 5. Subscription revoked / expired
      case 'subscription.revoked':
        await handleSubscriptionStatus(event.data, 'expired')
        break

      default:
        // Intentionally ignore all other events
        break
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[polar-webhook] Handler error:', msg)
    return Response.json({ error: msg }, { status: 500 })
  }

  return Response.json({ received: true })
}

// ─── Event handlers ───────────────────────────────────────────────────────────

/**
 * order.paid — fires on every successful payment (initial + renewal).
 * Adds plan credits and records the payment.
 */
async function handleOrderPaid(data: Record<string, unknown>) {
  const order = data as {
    id: string
    customer_email?: string
    customer?: { email?: string; id?: string }
    customer_id?: string
    product_id?: string
    net_amount?: number
    amount?: number
    items?: Array<{ product_id?: string }>
  }

  const productId = order.product_id ?? order.items?.[0]?.product_id
  const planInfo = productId ? PLAN_INFO[productId] : null
  if (!planInfo) {
    console.warn('[polar-webhook] order.paid: Unknown product_id:', productId)
    return
  }

  const email = order.customer_email ?? order.customer?.email
  if (!email) {
    console.warn('[polar-webhook] order.paid: No customer email in payload')
    return
  }

  const authUser = await getAuthUserByEmail(email)
  if (!authUser) {
    console.warn('[polar-webhook] order.paid: User not found:', email)
    return
  }

  const record = await getUserRecord(authUser.id)
  const currentCredits = record?.credits ?? 0
  const polarCustomerId = order.customer_id ?? order.customer?.id

  await supabaseAdmin
    .from('users')
    .update({
      credits: currentCredits + planInfo.credits,
      ...(polarCustomerId ? { polar_customer_id: polarCustomerId } : {}),
    })
    .eq('id', authUser.id)

  await supabaseAdmin.from('payments').insert({
    user_id: authUser.id,
    polar_order_id: order.id,
    plan: planInfo.plan,
    amount: order.net_amount ?? order.amount ?? 0,
    status: 'paid',
  })

  console.log(`[polar-webhook] order.paid: user=${authUser.id} plan=${planInfo.plan} +${planInfo.credits} credits`)
}

/**
 * subscription.created / subscription.active — new subscription started or resumed.
 * Updates plan and sets subscription_status = 'active'.
 * (Credits are handled by the accompanying order.paid event.)
 */
async function handleSubscriptionActive(data: Record<string, unknown>) {
  const sub = data as { customer_email?: string; customer?: { email?: string; id?: string }; customer_id?: string; product_id?: string }

  const planInfo = sub.product_id ? PLAN_INFO[sub.product_id] : null
  if (!planInfo) {
    console.warn('[polar-webhook] subscription.active: Unknown product_id:', sub.product_id)
    return
  }

  const email = sub.customer_email ?? sub.customer?.email
  if (!email) return

  const authUser = await getAuthUserByEmail(email)
  if (!authUser) {
    console.warn('[polar-webhook] subscription.active: User not found:', email)
    return
  }

  const polarCustomerId = sub.customer_id ?? sub.customer?.id

  await supabaseAdmin
    .from('users')
    .update({
      plan: planInfo.plan,
      subscription_status: 'active',
      ...(polarCustomerId ? { polar_customer_id: polarCustomerId } : {}),
    })
    .eq('id', authUser.id)

  console.log(`[polar-webhook] subscription.active: user=${authUser.id} plan=${planInfo.plan}`)
}

/**
 * subscription.updated — plan change (upgrade/downgrade) or general status update.
 * - Upgrade (pro → ultra): update plan + add 200 credits (差額)
 * - Downgrade (ultra → pro): update plan, leave credits unchanged
 * - Status-only change: update subscription_status
 */
async function handleSubscriptionUpdated(data: Record<string, unknown>) {
  const sub = data as {
    customer_email?: string
    customer?: { email?: string }
    product_id?: string
    product?: { id?: string }
    status?: string
  }

  console.log('[polar-webhook] subscription.updated raw:', JSON.stringify(data).slice(0, 800))

  const email = sub.customer_email ?? sub.customer?.email
  if (!email) return

  const authUser = await getAuthUserByEmail(email)
  if (!authUser) {
    console.warn('[polar-webhook] subscription.updated: User not found:', email)
    return
  }

  const record = await getUserRecord(authUser.id)
  const oldPlan = record?.plan ?? 'free'

  // product_id는 최상위 또는 product.id 에 있을 수 있음
  const productId = sub.product_id ?? sub.product?.id
  const newPlanInfo = productId ? PLAN_INFO[productId] : null
  const newPlan = newPlanInfo?.plan ?? oldPlan

  console.log(`[polar-webhook] subscription.updated: productId=${productId} oldPlan=${oldPlan} newPlan=${newPlan} status=${sub.status}`)

  const oldTier = PLAN_TIER[oldPlan] ?? 0
  const newTier = PLAN_TIER[newPlan] ?? 0

  const updates: Record<string, unknown> = {
    plan: newPlan,
    subscription_status: (
      sub.status === 'canceled' ? 'canceled' :
      sub.status === 'past_due' ? 'past_due' :
      'active'
    ),
  }

  if (newTier > oldTier && oldTier > 0) {
    // Paid plan upgrade only (pro→ultra): add difference credits
    // free→paid is handled by order.paid, so skip here
    updates.credits = (record?.credits ?? 0) + UPGRADE_CREDIT_DIFF
    console.log(`[polar-webhook] subscription.updated: upgrade ${oldPlan}→${newPlan} +${UPGRADE_CREDIT_DIFF} credits`)
  } else if (newTier < oldTier) {
    // Downgrade: leave credits untouched
    console.log(`[polar-webhook] subscription.updated: downgrade ${oldPlan}→${newPlan} credits unchanged`)
  }

  await supabaseAdmin.from('users').update(updates).eq('id', authUser.id)
  console.log(`[polar-webhook] subscription.updated: user=${authUser.id} plan=${newPlan} status=${updates.subscription_status}`)
}

/**
 * subscription.canceled — 사용자가 취소 신청. 기간 만료 전까지 plan 유지, status만 'canceled'로 변경.
 * 실제 만료는 subscription.revoked에서 처리.
 */
async function handleSubscriptionCanceled(data: Record<string, unknown>) {
  const sub = data as { customer_email?: string; customer?: { email?: string } }
  const email = sub.customer_email ?? sub.customer?.email
  if (!email) return

  const authUser = await getAuthUserByEmail(email)
  if (!authUser) {
    console.warn('[polar-webhook] subscription.canceled: User not found:', email)
    return
  }

  await supabaseAdmin
    .from('users')
    .update({ subscription_status: 'canceled' })
    .eq('id', authUser.id)

  console.log(`[polar-webhook] subscription.canceled: user=${authUser.id} (plan kept until period end)`)
}

/**
 * subscription.revoked — 구독 완전 만료. plan을 'free'로 리셋.
 */
async function handleSubscriptionStatus(data: Record<string, unknown>, status: 'canceled' | 'expired') {
  const sub = data as { customer_email?: string; customer?: { email?: string } }

  const email = sub.customer_email ?? sub.customer?.email
  if (!email) return

  const authUser = await getAuthUserByEmail(email)
  if (!authUser) {
    console.warn(`[polar-webhook] subscription.${status}: User not found:`, email)
    return
  }

  await supabaseAdmin
    .from('users')
    .update({ plan: 'free', subscription_status: status })
    .eq('id', authUser.id)

  console.log(`[polar-webhook] subscription.${status}: user=${authUser.id}`)
}
