import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data } = await supabaseAdmin
    .from('users')
    .select('plan, credits, subscription_status')
    .eq('id', user.id)
    .single()

  return Response.json({
    plan: data?.plan ?? 'free',
    credits: data?.credits ?? 0,
    subscription_status: data?.subscription_status ?? 'inactive',
  })
}
